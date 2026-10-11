# 🍅 TomatoGuard AI

**AI-Based Tomato Plant Disease Detection and Prediction System**

TomatoGuard AI is a college project focused on tomato plant disease detection using symptom-based prediction. Users select visible symptoms on a tomato plant, and the website displays possible diseases or pests, a match score, care suggestions, a printable report, and detection history.

**Current status:** The frontend is built using HTML, CSS, and vanilla JavaScript. The current prediction scoring is demo logic, not a trained AI model. The team will integrate the real machine learning model and database later.

---

## 1. Project Structure

```text
TomatoGuard-AI/
├── index.html
├── README.md
├── pages/
│   ├── symptoms.html
│   ├── result.html
│   ├── diseases.html
│   ├── history.html
│   └── about.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   └── script.js
├── dataset/
│   ├── symptom_schema.csv
│   ├── symptom_knowledge_table.csv
│   └── tomato_symptom_dataset_v2.csv
└── assets/
    ├── images/
    └── icons/
```

**Important:** Do not rename existing files, folders, or HTML element IDs without coordinating with the team, because the JavaScript depends on them.

### How to Run the Frontend

1. Open the project folder in VS Code.
2. Install the Live Server extension if it is not already installed.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

The frontend can run without Flask or MySQL. These are needed later for backend integration.

---

## 2. Frontend Data Flow

The symptom checker currently uses demo logic.

1. The user opens `pages/symptoms.html`.
2. The user selects visible symptoms.
3. `js/script.js` collects the selected symptom IDs.
4. `calculateMatches(selectedIds)` calculates demo matches.
5. `showResults()` displays the top results.
6. `saveLastResult()` saves the latest result in browser `localStorage`.
7. `addToHistory()` saves a history record in browser `localStorage`.

The result page reads the saved result, and the history page reads the saved detection records.

**Future integration:** Replace the demo prediction function with a request to the Flask API.

---

## 3. AI Model Integration Plan

### 3.1 Input

The frontend will send selected symptom IDs to the backend.

Example request:

```json
{
  "symptoms": [
    "lower_leaves_affected",
    "concentric_rings",
    "yellow_halo"
  ]
}
```

The symptom schema contains 31 symptom IDs. A model trained on the CSV dataset must receive a 31-value vector in the exact feature order used during training. Each value represents whether a symptom is selected: `1` for selected and `0` for not selected.

### 3.2 Required API Response

The backend should return a JSON object containing the predicted matches, sorted from highest to lowest score.

```json
{
  "matches": [
    {
      "name": "Early Blight",
      "percent": 59.5
    },
    {
      "name": "Target Spot",
      "percent": 36.5
    },
    {
      "name": "Septoria Leaf Spot",
      "percent": 2.8
    }
  ]
}
```

The names must exactly match the disease keys used by `DISEASE_INFO` in `js/data.js`.

Supported names:

- Early Blight
- Late Blight
- Septoria Leaf Spot
- Bacterial Spot
- Leaf Mold
- Spider Mites
- Target Spot
- Yellow Leaf Curl Virus
- Mosaic Virus
- Healthy

The `percent` field must be a number between 0 and 100. If the model returns probabilities between 0 and 1, convert them to percentages before sending the response.

**Important:** A model's predicted probability or match score is not a guarantee of diagnostic accuracy.

### 3.3 Planned Flask API

The prediction endpoint will be:

`POST /api/predict`

Example backend outline:

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load the trained model and symptom IDs here.
# SYMPTOM_IDS must use the exact feature order from training.

@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    selected = data.get("symptoms", [])

    if not isinstance(selected, list):
        return jsonify({"error": "symptoms must be a list"}), 400

    if not all(isinstance(item, str) for item in selected):
        return jsonify({"error": "Invalid symptom IDs"}), 400

    vector = [
        1 if symptom in selected else 0
        for symptom in SYMPTOM_IDS
    ]

    probabilities = model.predict_proba([vector])[0]

    matches = [
        {
            "name": CLASS_NAME_MAP[class_name],
            "percent": round(float(probability) * 100, 1)
        }
        for class_name, probability
        in zip(model.classes_, probabilities)
    ]

    matches.sort(
        key=lambda item: item["percent"],
        reverse=True
    )

    return jsonify({"matches": matches})


if __name__ == "__main__":
    app.run(port=5000, debug=True)
```

This is an integration outline, not a complete runnable backend. The model, `SYMPTOM_IDS`, and `CLASS_NAME_MAP` must be defined and loaded before the endpoint can work.

### 3.4 Planned Frontend API Connection

The frontend API URL for local development will be:

```javascript
const API_URL = "http://127.0.0.1:5000/api/predict";
```

The function that checks symptoms will eventually call the API asynchronously:

```javascript
const response = await fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    symptoms: selectedIds
  })
});

if (!response.ok) {
  throw new Error("Prediction request failed");
}

const data = await response.json();
```

The complete integration must preserve the response format expected by the result cards, result page, and history functions. If the frontend runs on a different port, configure Flask CORS appropriately.

---

## 4. MySQL Database Integration Plan

The frontend currently stores detection history in browser `localStorage`. The backend team can later replace this with MySQL-backed API endpoints.

| Current frontend function | Planned backend endpoint |
|---|---|
| `getHistory()` | `GET /api/history` |
| `addToHistory(selectedIds, matches)` | `POST /api/history` |
| Clear History | `DELETE /api/history` |

Example history record:

```json
{
  "id": 1,
  "date": "2026-10-10T10:30:00.000Z",
  "result": "Early Blight",
  "percent": 59.5,
  "symptomCount": 3,
  "status": "disease"
}
```

The `status` value should be one of `disease`, `pest`, or `healthy`.

Suggested MySQL table:

```sql
CREATE TABLE detection_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL,
    result VARCHAR(50) NOT NULL,
    percent DECIMAL(5,2) NOT NULL,
    symptom_count INT NOT NULL,
    status ENUM('disease', 'pest', 'healthy') NOT NULL
);
```

When history is moved to an API, the frontend history functions will need asynchronous handling using `async` and `await`.

---

## 5. Files to Keep During AI Integration

| File or function | Purpose |
|---|---|
| `SYMPTOMS` in `data.js` | Builds the symptom selection interface |
| `DISEASE_INFO` in `data.js` | Stores disease descriptions and care information |
| `DISEASE_PROFILES` in `data.js` | Supports the current demo scoring and match-count display |
| `calculateMatches()` in `script.js` | Current demo prediction logic; replace when the real model is integrated |
| `showResults()` | Displays prediction results |
| `saveLastResult()` | Saves the latest result for the result page |
| `addToHistory()` | Adds detection history records |

Avoid removing existing functions until the integrated backend has been tested with every frontend page that depends on them.

---

## 6. Dataset Information

The project currently contains three CSV files:

- `symptom_schema.csv` — the symptom IDs and their grouping.
- `symptom_knowledge_table.csv` — symptom probabilities used for demo scoring.
- `tomato_symptom_dataset_v2.csv` — a sample dataset described as containing 3,000 records across 10 classes.

The dataset appears to be generated sample data rather than verified real-world field observations. Its contents and labels should be checked before training a model.

A model trained and tested on generated data may achieve a high score without performing well on real tomato plants. Evaluate it on a separate test set and, when possible, independently collected and verified images or symptom records.

**Do not claim 99–100% real-world accuracy unless rigorous testing on representative, independent data supports that claim.**

---

## 7. Recommended Team Workflow

1. Keep the existing frontend file names and element IDs stable.
2. Develop the Flask API separately from the frontend.
3. Verify the dataset's labels, feature order, and quality before training.
4. Test prediction responses against the required JSON format.
5. Integrate MySQL after the prediction API works.
6. Test the complete website before merging team members' changes into the main branch.

Use Git branches and pull requests where practical, and avoid overwriting another team member's work.

---

## 8. Disclaimer

TomatoGuard AI is a college project intended for educational purposes. Its predictions and care suggestions are AI-assisted guidance only and should not replace advice from a qualified agricultural expert.
