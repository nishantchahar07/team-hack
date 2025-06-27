from flask import Flask, request, jsonify
import pandas as pd
import pickle

app = Flask(__name__)

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

            prediction = int(model.predict(df)[0])

            return jsonify({
                "message": "Prediction successful",
                "prediction": prediction
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

if __name__ == "__main__":
    app.run(debug=True)
