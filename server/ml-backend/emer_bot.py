import streamlit as st
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage
from pydub import AudioSegment

load_dotenv()

patient = {
    "name": "Rahul Verma",
    "age": 45,
    "gender": "Male",
    "height_cm": 172,
    "weight_kg": 82,
    "blood_group": "B+",
    "medical_history": ["Type 2 Diabetes", "Hypertension", "Mild Asthma"],
    "allergies": ["Penicillin", "Dust mites"],
    "medications": ["Metformin", "Amlodipine", "Salbutamol inhaler"],
    "last_visit": "2024-06-01",
    "lifestyle": "Sedentary job, occasional morning walks"
}

st.set_page_config(page_title="Emergency Assistant")
st.title("Emergency AI Assistant")

with st.sidebar:
    st.header("🧾 Patient Summary")
    st.markdown(f"""
    **Name:** {patient['name']}  
    **Age:** {patient['age']}  
    **Gender:** {patient['gender']}  
    **Height:** {patient['height_cm']} cm  
    **Weight:** {patient['weight_kg']} kg  
    **Blood Group:** {patient['blood_group']}  
    **Medical History:** {', '.join(patient['medical_history'])}  
    **Allergies:** {', '.join(patient['allergies'])}  
    **Medications:** {', '.join(patient['medications'])}  
    **Last Visit:** {patient['last_visit']}  
    **Lifestyle:** {patient['lifestyle']}  
    """)

    language_pref = st.radio(" Response Mode", ["Same as input", "Translate to Hindi", " Voice to Voice (Speech)"])

base_instruction = f"""
You are an emergency AI assistant for a known patient. Respond quickly and only based on facts from the patient profile.
If the user describes symptoms (e.g., chest pain, unconsciousness), give emergency steps or first aid guidance immediately.
NEVER recommend medications that conflict with patient allergies.
Respond in simple markdown.

Patient Profile:
- Name: {patient['name']}
- Age: {patient['age']}
- Gender: {patient['gender']}
- Height: {patient['height_cm']} cm
- Weight: {patient['weight_kg']} kg
- Blood Group: {patient['blood_group']}
- Medical History: {', '.join(patient['medical_history'])}
- Allergies: {', '.join(patient['allergies'])}
- Current Medications: {', '.join(patient['medications'])}
- Last Visit: {patient['last_visit']}
- Lifestyle: {patient['lifestyle']}
"""

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

for msg in st.session_state.chat_history:
    role = "user" if isinstance(msg, HumanMessage) else "assistant"
    st.chat_message(role).markdown(msg.content)

model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", streaming=True)

# Voice-to-voice mode
if language_pref == " Voice to Voice (Speech)":
    from streamlit_mic_recorder import mic_recorder
    import tempfile
    from gtts import gTTS
    import os
    import speech_recognition as sr
    from pydub import AudioSegment  

    audio = mic_recorder(start_prompt=" Speak now", stop_prompt="Stop", key="voice_input")

    if audio:
        raw_audio_path = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
        raw_audio_path.write(audio["bytes"])
        raw_audio_path.close()
        wav_audio_path = raw_audio_path.name.replace(".webm", ".wav")
        try:
            sound = AudioSegment.from_file(raw_audio_path.name)
            sound.export(wav_audio_path, format="wav")
        except Exception as e:
            st.error("Audio conversion failed. Try again.")
            st.stop()
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_audio_path) as source:
            audio_data = recognizer.record(source)
            try:
                query = recognizer.recognize_google(audio_data, language="en-IN")
                st.chat_message("user").markdown(f" {query}")
                st.session_state.chat_history.append(HumanMessage(content=query))
            except sr.UnknownValueError:
                st.error("Could not understand audio")
            except sr.RequestError:
                st.error(" Speech recognition service error")

        if "query" in locals():
            messages = [HumanMessage(content=base_instruction+"Answer should be in that language in which the audio is ")] + st.session_state.chat_history
            with st.chat_message("assistant"):
                def stream_response():
                    for chunk in model.stream(messages):
                        yield chunk.content if chunk.content else ""

                response_text = st.write_stream(stream_response)
                st.session_state.chat_history.append(AIMessage(content=response_text))

                tts = gTTS(response_text, lang='en')
                tts_path = "output.mp3"
                tts.save(tts_path)
                st.audio(tts_path, format="audio/mp3")

else:
    if language_pref == "Same as input":
        instruction_text = base_instruction + "\nAlways reply in the same language as the user’s input."
    elif language_pref == "Translate to Hindi":
        instruction_text = base_instruction + "\nAlways translate your answer to Hindi regardless of input language."
    else:
        instruction_text = base_instruction

    query = st.chat_input("Describe the emergency or ask a question...")
    if query:
        st.chat_message("user").markdown(query)
        st.session_state.chat_history.append(HumanMessage(content=query))

        messages = [HumanMessage(content=instruction_text)] + st.session_state.chat_history

        with st.chat_message("assistant"):
            def stream_response():
                for chunk in model.stream(messages):
                    yield chunk.content if chunk.content else ""

            response_text = st.write_stream(stream_response)
            st.session_state.chat_history.append(AIMessage(content=response_text))
