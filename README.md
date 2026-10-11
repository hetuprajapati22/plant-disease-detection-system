# 🍅 TomatoGuard AI

Symptom-based tomato plant disease detection system (college project).

The user selects the symptoms seen on a tomato plant, and the website shows the most likely disease or pest, a match score, care suggestions, a printable report and a detection history.

**Current status:** the frontend is complete (HTML, CSS, vanilla JavaScript). The scoring in the frontend is only a **demo logic**. The real AI model and the database will be added by the team using this guide.

---

## 1. Project structure

```
TomatoGuard-AI/
├── index.html
├── README.md
├── pages/
│   ├── symptoms.html      (Detect Disease page)
│   ├── result.html        (Detection report)
│   ├── diseases.html      (Disease information)
│   ├── history.html       (Detection history)
│   └── about.html
├── css/
│   └── style.css
├── js/
│   ├── data.js            (symptoms, demo probabilities, disease information)
│   └── script.js          (all frontend logic)
├── dataset/
│   ├── symptom_schema.csv
│   ├── symptom_knowledge_table.csv
│   └── tomato_symptom_dataset_v2.csv
└── assets/
    ├── images/
    └── icons/
```

**How to run the frontend:** open the folder in VS Code, right-click `index.html` and choose **Open with Live Server**. No installation is needed.

**Please do not rename files, folders or HTML ids.** The JavaScript finds elements by their ids.

---

## 2. How the frontend works (data flow)

```
symptoms.html
   user ticks symptoms  ->  selectedIds = ["concentric_rings", "yellow_halo", ...]
        |
        v
calculateMatches(selectedIds)        <- script.js, section 5  (REPLACE THIS WITH THE REAL MODEL)
        |
        v
matches = [ { name, percent, matchedCount }, ... ]
        |
        +--> showResults(...)        shows the top 3 on the same page
        +--> saveLastResult(...)     localStorage "tomatoguard_last_result"  -> result.html reads it
        +--> addToHistory(...)       localStorage "tomatoguard_history"      -> history.html reads it
```

---

## 3. Where to plug in the AI model

### 3.1 Input

A list of the selected symptom ids. The 31 ids and their order are in `dataset/symptom_schema.csv` (the same order as `SYMPTOMS` in `js/data.js`).

```json
{ "symptoms": ["lower_leaves_affected", "concentric_rings", "yellow_halo"] }
```

For a model trained on the CSV, convert it into a vector of 31 values (1 if selected, otherwise 0), in the same column order as the dataset.

### 3.2 Output (this exact format is required)

A list for **all 10 classes**, sorted from the highest to the lowest `percent`.

```json
{
  "matches": [
    { "name": "Early Blight", "percent": 59.5 },
    { "name": "Target Spot", "percent": 36.5 },
    { "name": "Septoria Leaf Spot", "percent": 2.8 }
  ]
}
```

Rules:

- `percent` is a number from 0 to 100 (not 0 to 1).
- `name` must match **exactly** one of these 10 names, because they are the keys of `DISEASE_INFO` in `js/data.js`:

  Early Blight, Late Blight, Septoria Leaf Spot, Bacterial Spot, Leaf Mold, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy

  If the labels in the dataset or model are different, map them to these names in the backend.
- The result page, history and cards all depend on these names.

### 3.3 Flask example (backend side)

```python
from flask import Flask, request, jsonify
from flask_cors import CORS   # pip install flask-cors

app = Flask(__name__)
CORS(app)  # needed because the frontend runs on another port (Live Server, 5500)

# SYMPTOM_IDS = list of the 31 ids in the same order as symptom_schema.csv
# model = your trained model (loaded once at startup)

@app.route("/api/predict", methods=["POST"])
def predict():
    selected = request.get_json().get("symptoms", [])
    vector = [1 if s in selected else 0 for s in SYMPTOM_IDS]

    probabilities = model.predict_proba([vector])[0]
    matches = [
        {"name": name, "percent": round(float(p) * 100, 1)}
        for name, p in zip(model.classes_, probabilities)
    ]
    matches.sort(key=lambda m: m["percent"], reverse=True)

    return jsonify({"matches": matches})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
```

### 3.4 Frontend change (js/script.js)

Right now `checkSymptoms()` (inside `setupSymptomChecker`) calls `calculateMatches(selectedIds)` directly. A real API call is asynchronous, so make these two changes.

**Step 1:** add this function near `calculateMatches`:

```js
const API_URL = "http://127.0.0.1:5000/api/predict";

async function getMatches(selectedIds) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms: selectedIds })
  });
  if (!response.ok) throw new Error("Server error");

  const data = await response.json();

  // matchedCount is used by the small note under each result card.
  // It is calculated here from DISEASE_PROFILES, so keep DISEASE_PROFILES in data.js.
  return data.matches.map(function (match) {
    const profile = DISEASE_PROFILES.find(function (item) {
      return item.name === match.name;
    });
    let matchedCount = 0;
    if (profile) {
      selectedIds.forEach(function (id) {
        if (profile.p[id] >= GOOD_MATCH_LEVEL) matchedCount++;
      });
    }
    return { name: match.name, percent: match.percent, matchedCount: matchedCount };
  });
}
```

**Step 2:** change `checkSymptoms` to `async` and call the API:

```js
  async function checkSymptoms() {
    const selectedIds = getSelectedIds();

    if (selectedIds.length < MIN_SYMPTOMS) {
      showError("Please select at least " + MIN_SYMPTOMS + " symptoms to get a result.");
      return;
    }

    hideError();

    try {
      const matches = await getMatches(selectedIds);   // was: calculateMatches(selectedIds)
      showResults(matches, selectedIds.length);
      saveLastResult(selectedIds, matches);
      addToHistory(selectedIds, matches);
    } catch (error) {
      showError("Could not reach the server. Please try again.");
    }
  }
```

Optional: show a loading state on the Check button while waiting for the server.

---

## 4. Where to plug in the database (MySQL)

All history data goes through only these functions in `js/script.js` (section 8):

| Function | What it does now | Replace with |
|---|---|---|
| `getHistory()` | reads from localStorage | `GET /api/history` |
| `addToHistory(selectedIds, matches)` | adds a record to localStorage | `POST /api/history` |
| `saveHistory([])` (used by Clear History) | overwrites localStorage | `DELETE /api/history` |

One history record looks like this:

```json
{
  "id": 1730000000000,
  "date": "2026-10-10T10:30:00.000Z",
  "result": "Early Blight",
  "percent": 59.5,
  "symptomCount": 3,
  "status": "disease"
}
```

- `status` is one of `"disease"`, `"pest"` or `"healthy"`.
- `date` should be an ISO date string.
- The `demo` field only exists for the frontend "Add Demo Records" button. It can be removed later.

Suggested MySQL table:

```sql
CREATE TABLE detection_history (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  created_at    DATETIME NOT NULL,
  result        VARCHAR(50) NOT NULL,
  percent       DECIMAL(5,2) NOT NULL,
  symptom_count INT NOT NULL,
  status        ENUM('disease','pest','healthy') NOT NULL
);
```

**Note:** `getHistory()` and `saveHistory()` are synchronous now. With an API they become `async`, so `setupHistoryPage()` and its `renderHistory()` must use `await`. The result page reads `tomatoguard_last_result` from localStorage. This can stay as it is, or be replaced later by an API.

---

## 5. What stays and what can be removed after the model is added

| File / code | After integration |
|---|---|
| `SYMPTOMS` in `data.js` | **Keep** (builds the checkboxes) |
| `DISEASE_INFO` in `data.js` | **Keep** (description, causes, prevention, care) |
| `DISEASE_PROFILES` in `data.js` | Keep if you use `matchedCount` as shown above. Otherwise it can be removed together with `calculateMatches()` |
| `calculateMatches()` in `script.js` | Replaced by the real model |
| Everything else | No change needed |

---

## 6. About the dataset

- `symptom_schema.csv`: 31 symptoms, grouped by plant part
- `symptom_knowledge_table.csv`: probability of each symptom for each of the 10 classes (used for the demo scoring)
- `tomato_symptom_dataset_v2.csv`: 3000 records (300 per class), one column per symptom (0 or 1) plus the disease label

This looks like a **generated sample dataset**, not real field data. A model trained on it will probably show very high accuracy. Please mention this honestly in the project report.

---

## 7. Disclaimer

TomatoGuard AI is a college project. Its results are AI-assisted guidance only and should not replace advice from a qualified agricultural expert.