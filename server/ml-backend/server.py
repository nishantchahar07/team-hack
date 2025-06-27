from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import numpy as np

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

if __name__ == "__main__":
    app.run(debug=True)
