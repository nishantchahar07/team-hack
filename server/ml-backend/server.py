from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import numpy as np
import os
import pdfplumber
import uuid
import io
import re
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.duckduckgo import DuckDuckGo
import asyncio
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

nurse_map = {
    1: "3f8a5c12-8f3e-44a1-bfdc-347c0d0c102d",
    2: "8cf4b84d-9c01-4dd0-85e6-0d55cb1d9aa1",
    3: "961c2a30-cc50-4a15-b92f-2b15f5c8b248",
    4: "1e5c9c78-4d0c-4644-9220-2b49bc26c1d6",
    5: "a77f9f5c-02b1-4c94-b248-4c0582741087",
    6: "7c8353a4-7ed3-4bc1-b0c0-779ea2a0e539",
    7: "f6796d30-7f01-405c-b928-0c7c601f9ed5",
    8: "a9e0c671-dab7-4a6f-9c8b-6c88a69aa96c",
    9: "4f2e0f01-f7d3-44b3-9d57-b9a7d0f2682a",
    10: "2ac905b4-5a17-4a8e-87ce-68800417b74d",
    11: "64d76ab3-19c0-40f8-a0b5-11234260ac27",
    12: "b9efbd39-4a59-419a-816c-b68e66c4f3c7",
    13: "23f64a9f-cfe6-40e3-8574-fd5a4ea3e40e",
    14: "f344f4c6-91d6-4b40-8d68-3016714b9a8e",
    15: "e7c0b1f1-19e5-468e-8f1e-bfcfe90d79a3",
    16: "d265cafd-9141-441a-8794-2f5bdbb0e6ab",
    17: "045b02c4-5dc7-4e13-9d07-96f08c3a80ed",
    18: "5a6c6c0b-68d5-439b-81fd-fb918eb4f38f",
    19: "1c1d27b5-3d0c-4eb5-a0b5-0b998b7cbf3e",
    20: "0cfb3122-6dc2-46a6-8b1a-2be57a823cb5"
}

questions = [
    "1. What is your diagnosed disease or medical condition?",
    "2. How many months have you been experiencing this condition?",
    "3. What symptoms are you currently experiencing?",
    "4. On a scale from 1 to 10, how would you rate your current pain level?",
    "5. Have you been previously diagnosed with this condition? (Yes/No)",
    "6. Do you have any other comorbidities or existing medical conditions?",
    "7. What is your preferred language for communication? (English/Hindi)"
]

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

columns = [
    'duration_months', 'pain_level', 'Arthritis', 'Asthma',
    'Diabetes', 'Hypertension', 'swelling', 'nausea', 'frequent urination',
    'coughing', 'fatigue', 'light sensitivity', 'joint pain', 'stiffness',
    'shortness of breath', 'prior_diagnosis_Yes',
    'comorbidity_Kidney Issues', 'comorbidity_Liver Disease',
    'comorbidity_Lung Disease', 'comorbidity_Thyroid',
    'preferred_language_Hindi'
]

def get_top_n_nurses(probabilities, n=3):
    sorted_indices = np.argsort(probabilities)[::-1][:n]
    return [(int(i+1), float(probabilities[i])) for i in sorted_indices]

@app.route("/predict", methods=['POST'])
def func():
    if request.is_json:
        data = request.get_json()
        try:
            df = pd.DataFrame([data])
            for col in columns:
                if col not in df.columns:
                    df[col] = 0
            df = df[columns]

            prob_array = model.predict_proba(df)[0] 

            top_n = get_top_n_nurses(prob_array, n=3)

            result = [
                {
                    "nurse_id": nurse_map[nurse_num],
                    "probability": round(prob, 4)
                }
                for nurse_num, prob in top_n
            ]

            print(f"Top nurses: {result}")

            return jsonify({
                "message": "Prediction successful",
                "top_nurses": result
            })
        except Exception as e:
            return jsonify({
                "message": "Error during prediction",
                "error": str(e)
            }), 500
    else:
        return jsonify({
            "message": "Invalid request. JSON expected."
        }), 400

@app.route("/chat", methods=['POST'])
def chat():
    try:
        data = request.get_json()
        id = data.get("id")
        return {
            "status": 201,
            "data": questions[id]
        }
    except:
        return {
            "status": 500,
            "message": "Error Occurred"
        }


app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

ALLOWED_EXTENSIONS = {'pdf'}
SESSION_TIMEOUT_MINUTES = 30

session_data = {}

assistant_agent = Agent(
    model=Gemini(id="gemini-1.5-flash"),
    tools=[DuckDuckGo()],
    description="Medical assistant for lab report analysis",
    instructions=[
        "Explain lab results in simple language",
        "Mention normal ranges for lab values",
        "Be educational and reassuring",
        "Always recommend consulting healthcare professionals",
        "Never provide specific diagnoses or treatments",
        "Use bullet points for clarity"
    ],
    markdown=True
)

general_agent = Agent(
    model=Gemini(id="gemini-1.5-flash"),
    tools=[DuckDuckGo()],
    description="Medical assistant for general health questions",
    instructions=[
        "Provide educational health information",
        "Explain medical concepts clearly",
        "Be reassuring and informative",
        "Always recommend professional consultation",
        "Stay within educational bounds",
        "Use clear formatting"
    ],
    markdown=True
)

# symptoms_agent = Agent(
#     model=Gemini(id="gemini-1.5-flash"),
#     tools=[DuckDuckGo()],
#     description="Medical assistant for symptom analysis",
#     instructions=[
#         "Analyze symptoms educationally",
#         "Suggest possible causes without diagnosing",
#         "Recommend when to seek immediate care",
#         "Provide general self-care tips",
#         "Always emphasize professional evaluation",
#         "Include medical disclaimers"
#     ],
#     markdown=True
# )

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf_bytes(pdf_bytes):
    """Extract text from PDF bytes using pdfplumber"""
    try:
        text = ""
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")

def cleanup_expired_sessions():
    """Remove expired sessions from memory"""
    current_time = datetime.now()
    expired_sessions = []
    
    for session_id, data in session_data.items():
        if current_time - data['timestamp'] > timedelta(minutes=SESSION_TIMEOUT_MINUTES):
            expired_sessions.append(session_id)
    
    for session_id in expired_sessions:
        del session_data[session_id]
    
    if expired_sessions:
        print(f"Cleaned up {len(expired_sessions)} expired sessions")

def detect_query_type(query):
    """Detect what type of query this is based on content"""
    query_lower = query.lower()
    
    upload_keywords = ['upload', 'pdf', 'report', 'lab report', 'test results', 'file']
    if any(keyword in query_lower for keyword in upload_keywords):
        return 'upload_request'
    
    # symptom_count = sum(1 for keyword in SYMPTOM_KEYWORDS if keyword in query_lower)
    
    # symptom_patterns = [
    #     r'i have|i am having|i feel|i am feeling|experiencing',
    #     r'my \w+ (hurt|pain|ache|sore)',
    #     r'(pain|ache|hurt) in my',
    #     r'i have been (sick|unwell|feeling)',
    #     r'symptoms include|symptoms are',
    #     r'for \d+ days?|for \d+ weeks?|since yesterday|since last week'
    # ]
    
    # pattern_matches = sum(1 for pattern in symptom_patterns if re.search(pattern, query_lower))
    
    # if symptom_count >= 2 or pattern_matches >= 1:
    #     return 'symptoms'
    
    return 'general'

# def analyze_symptoms_for_specialization(symptoms_text):
#     """Analyze symptoms to determine appropriate medical specialization"""
#     symptoms_lower = symptoms_text.lower()
    
#     specialization_scores = {}
    
#     for symptom, specialization in SYMPTOM_SPECIALIZATION_MAP.items():
#         if symptom in symptoms_lower:
#             if specialization not in specialization_scores:
#                 specialization_scores[specialization] = 0
#             specialization_scores[specialization] += 1
#     if specialization_scores:
#         return max(specialization_scores, key=specialization_scores.get)
#     else:
#         return 'general'

# def get_doctors_by_specialization(specialization):
#     data = asyncio.run(fetch_doctors_with_user())
#     ans = []


#     for doc in data:
#         specializations = doc.get('Specialization', [])
#         specializations_lower = [spec.lower() for spec in specializations]

#         if specialization.lower() in specializations_lower:
#             ans.append({
#                 "Doctor ID": doc["id"],
#                 "Doctor Name": doc["name"],
#                 "Rating": doc["rating"]
#             })

#     return ans





@app.route('/upload', methods=['POST'])
def upload_pdf():
    """Handle PDF upload"""
    try:
        cleanup_expired_sessions()
        
        if 'pdf' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['pdf']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Only PDF files are allowed"}), 400
        
        try:
            file_content = file.read()
            if not file_content:
                return jsonify({"error": "File is empty"}), 400
        except Exception as e:
            return jsonify({"error": f"Failed to read file: {str(e)}"}), 400
        
        try:
            text = extract_text_from_pdf_bytes(file_content)
        except Exception as e:
            return jsonify({"error": f"Failed to process PDF: {str(e)}"}), 400
        
        if not text:
            return jsonify({"error": "No text could be extracted from the PDF"}), 400
        
        session_id = str(uuid.uuid4())
        
        session_data[session_id] = {
            'text': text,
            'filename': secure_filename(file.filename),
            'timestamp': datetime.now()
        }
        
        return jsonify({
            "message": "PDF uploaded and processed successfully",
            "session_id": session_id,
            "filename": secure_filename(file.filename),
            "text_length": len(text)
        })
    
    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500

@app.route('/smart_query', methods=['POST'])
def smart_query():
    """Handle smart query that determines the type automatically"""
    try:
        cleanup_expired_sessions()
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        query = data.get("query", "").strip()
        session_id = data.get("session_id", "").strip()
        
        if not query:
            return jsonify({"error": "No question provided"}), 400
        
        # Detect query type
        query_type = detect_query_type(query)
        
        # Handle upload request
        if query_type == 'upload_request':
            return jsonify({
                "response": "To upload a lab report, please use the upload button above or drag and drop a PDF file. I'll be able to analyze your lab results once you upload the file.",
                "query_type": "upload_request",
                "action_needed": "upload_file"
            })
        
        # Handle lab report questions if session exists
        if session_id and session_id in session_data:
            session_info = session_data[session_id]
            session_info['timestamp'] = datetime.now()
            
            context = session_info['text']
            full_prompt = f"""Here is a medical lab report:

{context}

User's question: {query}

Please analyze this lab report and answer the user's question. Remember to:
- Explain medical terms in simple language
- Mention normal ranges when discussing lab values
- Be reassuring and educational
- Always recommend consulting with a healthcare provider
- Never provide specific medical diagnoses or treatment recommendations"""
            
            try:
                response = ""
                for chunk in assistant_agent.run(full_prompt, stream=True):
                    response += chunk.content
                
                if not response.strip():
                    response = "I apologize, but I couldn't generate a response. Please try rephrasing your question."
            
            except Exception as e:
                print(f"Agent error: {e}")
                response = "I'm sorry, but I encountered an error while processing your question. Please try again."
            
            return jsonify({
                "response": response,
                "query_type": "lab_report",
                "filename": session_info['filename']
            })
        else:
            full_prompt = f"""User's general medical question: {query}

Please provide helpful, educational information about this health topic. Remember to:
- Explain medical terms and concepts in simple language
- Provide accurate, general health information
- Be reassuring and educational
- Always emphasize the importance of consulting healthcare professionals
- Never provide specific diagnoses, prescriptions, or critical medical decisions
- Stay within the bounds of general health education
- Use bullet points and clear formatting for better readability"""
            
            try:
                response = ""
                for chunk in general_agent.run(full_prompt, stream=True):
                    response += chunk.content
                
                if not response.strip():
                    response = "I apologize, but I couldn't generate a response. Please try rephrasing your question."
            
            except Exception as e:
                print(f"General agent error: {e}")
                response = "I'm sorry, but I encountered an error while processing your question. Please try again."
            
            return jsonify({
                "response": response,
                "query_type": "general"
            })
    
    except Exception as e:
        return jsonify({"error": f"Failed to process question: {str(e)}"}), 500

@app.route('/ask', methods=['POST'])
def ask_question():
    """Handle question about uploaded report"""
    try:
        cleanup_expired_sessions()
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        query = data.get("query", "").strip()
        session_id = data.get("session_id", "").strip()
        
        if not query:
            return jsonify({"error": "No question provided"}), 400
        
        if not session_id:
            return jsonify({"error": "No session ID provided"}), 400
        
        if session_id not in session_data:
            return jsonify({"error": "Session not found or expired. Please upload your PDF again."}), 400
        
        session_info = session_data[session_id]
        session_info['timestamp'] = datetime.now()
        
        context = session_info['text']
        full_prompt = f"""Here is a medical lab report:

{context}

User's question: {query}

Please analyze this lab report and answer the user's question. Remember to:
- Explain medical terms in simple language
- Mention normal ranges when discussing lab values
- Be reassuring and educational
- Always recommend consulting with a healthcare provider
- Never provide specific medical diagnoses or treatment recommendations"""
        
        try:
            response = ""
            for chunk in assistant_agent.run(full_prompt, stream=True):
                response += chunk.content
            
            if not response.strip():
                response = "I apologize, but I couldn't generate a response. Please try rephrasing your question."
        
        except Exception as e:
            print(f"Agent error: {e}")
            response = "I'm sorry, but I encountered an error while processing your question. Please try again."
        
        return jsonify({
            "response": response,
            "filename": session_info['filename']
        })
    
    except Exception as e:
        return jsonify({"error": f"Failed to process question: {str(e)}"}), 500

@app.route('/ask_general', methods=['POST'])
def ask_general_question():
    """Handle general medical questions"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        query = data.get("query", "").strip()
        
        if not query:
            return jsonify({"error": "No question provided"}), 400
        
        full_prompt = f"""User's general medical question: {query}

Please provide helpful, educational information about this health topic. Remember to:
- Explain medical terms and concepts in simple language
- Provide accurate, general health information
- Be reassuring and educational
- Always emphasize the importance of consulting healthcare professionals
- Never provide specific diagnoses, prescriptions, or critical medical decisions
- Stay within the bounds of general health education
- Use bullet points and clear formatting for better readability"""
        
        try:
            response = ""
            for chunk in general_agent.run(full_prompt, stream=True):
                response += chunk.content
            
            if not response.strip():
                response = "I apologize, but I couldn't generate a response. Please try rephrasing your question."
        
        except Exception as e:
            print(f"General agent error: {e}")
            response = "I'm sorry, but I encountered an error while processing your question. Please try again."
        
        return jsonify({
            "response": response
        })
    
    except Exception as e:
        return jsonify({"error": f"Failed to process question: {str(e)}"}), 500

# @app.route('/symptoms', methods=['POST'])
# def analyze_symptoms():
#     """Handle symptoms analysis and doctor recommendations"""
#     try:
#         data = request.get_json()
#         if not data:
#             return jsonify({"error": "No JSON data provided"}), 400
        
#         symptoms = data.get("symptoms", "").strip()
        
#         if not symptoms:
#             return jsonify({"error": "No symptoms provided"}), 400
        
#         # Analyze symptoms to determine specialization
#         specialization = analyze_symptoms_for_specialization(symptoms)
        
#         # Get doctors for the specialization
#         recommended_doctors = get_doctors_by_specialization(specialization)
        
#         # Prepare prompt for symptoms analysis
#         full_prompt = f"""User is experiencing these symptoms: {symptoms}

# Please provide educational information about these symptoms. Remember to:
# - Explain what these symptoms might indicate in general terms
# - Mention possible common causes (without diagnosing)
# - Suggest when to seek immediate medical attention (red flags)
# - Provide general self-care tips where appropriate
# - Always emphasize that symptoms require professional medical evaluation
# - Never provide specific diagnoses or treatment recommendations
# - Be reassuring while being informative
# - Use bullet points and clear formatting for better readability
# - Include disclaimer about not replacing professional medical advice"""

#         try:
#             response = ""
#             for chunk in symptoms_agent.run(full_prompt, stream=True):
#                 response += chunk.content
            
#             if not response.strip():
#                 response = "I apologize, but I couldn't generate a response. Please try describing your symptoms differently."
        
#         except Exception as e:
#             print(f"Symptoms agent error: {e}")
#             response = "I'm sorry, but I encountered an error while analyzing your symptoms. Please try again."
        
#         return jsonify({
#             "response": response,
#             "symptoms": symptoms,
#             "specialization": specialization,
#             "recommended_doctors": recommended_doctors[:1]  # Return top 3 doctors
#         })
    
#     except Exception as e:
#         return jsonify({"error": f"Failed to analyze symptoms: {str(e)}"}), 500

@app.route('/session/<session_id>')
def get_session_info(session_id):
    """Get session information"""
    cleanup_expired_sessions()
    
    if session_id not in session_data:
        return jsonify({"error": "Session not found"}), 404
    
    session_info = session_data[session_id]
    return jsonify({
        "filename": session_info['filename'],
        "text_length": len(session_info['text']),
        "upload_time": session_info['timestamp'].isoformat()
    })


@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large. Maximum size is 16MB."}), 413

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
