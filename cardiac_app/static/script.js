function sendSymptomsToAI() {
    const symptoms = symptomsText.value;

    if (symptoms.trim() === "") {
        alert("Please record your symptoms or enter them manually.");
        return;
    }

    // Send symptoms data to the backend for AI analysis
    fetch('/analyze_symptoms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: symptoms })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.solution);  // Display AI response (suggestions)
    })
    .catch(error => {
        console.error("Error sending symptoms to AI:", error);
    });
}
