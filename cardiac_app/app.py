import openai
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import os
import json

app = Flask(__name__)
#app.secret_key = 'this_is_a_app'
#openai.api_key = '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'
# Default users
users = {
    "admin": "password123"  # Default username and password
}

# Sample blood pressure data
bp_data = [
    {"day": "Monday", "systolic": 120, "diastolic": 80},
    {"day": "Tuesday", "systolic": 130, "diastolic": 85},
    {"day": "Wednesday", "systolic": 125, "diastolic": 82},
    {"day": "Thursday", "systolic": 135, "diastolic": 88},
    {"day": "Friday", "systolic": 140, "diastolic": 90},
    {"day": "Saturday", "systolic": 138, "diastolic": 89},
    {"day": "Sunday", "systolic": 132, "diastolic": 86}
]

# Route: Login/Signup
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        if "login" in request.form:
            # Login logic
            if username in users and users[username] == password:
                session["user"] = username
                return redirect(url_for("dashboard"))
            return "Invalid credentials, please try again."
        elif "signup" in request.form:
            # Signup logic
            if username in users:
                return "User already exists!"
            users[username] = password
            return "Signup successful! Please log in."
    return render_template("index.html")

# Route: Dashboard
@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("index"))
    return render_template("dashboard.html")


# Route: Blood Pressure Graph
@app.route("/graph")
def graph():
    if "user" not in session:
        return redirect(url_for("index"))
    return render_template("graph.html", bp_data=bp_data)


# Route: SOS Page
@app.route("/sos", methods=["GET", "POST"])
def sos():
    if "user" not in session:
        return redirect(url_for("index"))
    return render_template("sos.html")


@app.route('/analyze_symptoms', methods=['POST'])
def analyze_symptoms():
    symptoms = request.json['symptoms']

    # Make a request to the OpenAI API (e.g., GPT-4) to analyze the symptoms
    try:
        response = openai.Completion.create(
            model="gpt-4",  # You can choose a different model if needed
            prompt=f"Analyze the following symptoms and provide possible solutions: {symptoms}",
            max_tokens=150,
            temperature=0.7
        )

        # Extract the solution from OpenAI's response
        solution = response.choices[0].text.strip()

        # Return the solution as a response
        return jsonify({'solution': solution})

    except Exception as e:
        return jsonify({'solution': f"Error occurred while analyzing symptoms: {str(e)}"})


if __name__ == "__main__":
    app.run(debug=True)

