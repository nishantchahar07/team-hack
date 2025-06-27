from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
import json
import requests
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

questions = [
    "1. What is your diagnosed disease or medical condition?",
    "2. How many months have you been experiencing this condition?",
    "3. What symptoms are you currently experiencing?",
    "4. On a scale from 1 to 10, how would you rate your current pain level?",
    "5. Have you been previously diagnosed with this condition? (Yes/No)",
    "6. Do you have any other comorbidities or existing medical conditions?",
    "7. What is your preferred language for communication? (English/Hindi)"
]

messages = [
    SystemMessage(
        content="""
You are an intelligent and polite medical assistant. Your job is to collect exactly 7 important medical details from the user. These 7 questions must be asked one by one, and only after getting a clear answer for each should you proceed to the next.

Once all 7 answers are collected, summarize them in a JSON format.
        """
    )
]

answers = []

print("Welcome to the Medical Assistant CLI\n")

for i, question in enumerate(questions):
    answered = False
    while not answered:
        print(question)
        user_input = input(">> ")

        messages.append(HumanMessage(content=user_input))

        response = llm.invoke(messages)
        print(f"{response.content.strip()}")

        answers.append(user_input)
        answered = True

summary_prompt = "Please summarize the following responses as a structured JSON object with keys:\ndisease, duration_months, symptoms, pain_level, prior_diagnosis, comorbidity, preferred_language.\nResponses:\n"
for i, answer in enumerate(answers):
    summary_prompt += f"\n{questions[i]}\n{answer}"

summary_response = llm.invoke([HumanMessage(content=summary_prompt)])

print("Summary of your responses:")
try:
    parsed = json.loads(summary_response.content)
    body=json.dumps(parsed, indent=2)
    response=requests.post("/predict",body)
    print(response)
except:
    print(summary_response.content)