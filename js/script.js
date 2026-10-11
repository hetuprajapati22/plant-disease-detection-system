/* =========================================================
   TomatoGuard AI - script.js
   Sections:
   1. Settings
   2. Page load par functions chalana
   3. Mobile menu
   4. Symptom Checker
   5. Score nikalne ka logic (matches)
   6. Result page
   7. Disease Information page
   8. History (localStorage) + toast
   9. History page
   ========================================================= */


/* ================= 1. SETTINGS ================= */
const MIN_SYMPTOMS = 2;       // Kam se kam kitne symptoms select karne hain
const TOP_RESULTS = 3;        // Kitni top diseases dikhani hain
const GOOD_MATCH_LEVEL = 0.3; // Isse upar probability = "yeh symptom is disease mein common hai"


/* ================= 2. PAGE LOAD ================= */
// Jab page poora load ho jaye, tab yeh functions chalenge
document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();
  setupSymptomChecker();
  setupResultPage();
  setupDiseasesPage();
  setupHistoryPage();
});


/* ================= 3. MOBILE MENU ================= */
function setupMobileMenu() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  // Agar page par menu nahi hai to kuch mat karo
  if (!navToggle || !navMenu) return;

  // ☰ button dabane par menu khule/band ho
  navToggle.addEventListener("click", function () {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.textContent = isOpen ? "✕" : "☰";
  });

  // Kisi link par click karne par menu band ho jaye
  navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("open");
      navToggle.textContent = "☰";
    });
  });
}


/* ================= 4. SYMPTOM CHECKER ================= */
function setupSymptomChecker() {
  // HTML ke elements ko ids se pakadte hain
  const groupsBox = document.getElementById("symptomGroups");
  const selectedCount = document.getElementById("selectedCount");
  const errorBox = document.getElementById("symptomError");
  const checkBtn = document.getElementById("checkBtn");
  const resetBtn = document.getElementById("resetBtn");
  const resultsEmpty = document.getElementById("resultsEmpty");
  const resultsContent = document.getElementById("resultsContent");
  const resultList = document.getElementById("resultList");

  // Agar yeh Symptom Checker page nahi hai, to yahin ruk jao
  if (!groupsBox) return;

  // data.js load hui ya nahi, check karo
  if (typeof SYMPTOMS === "undefined" || typeof DISEASE_PROFILES === "undefined") {
    groupsBox.innerHTML =
      '<p class="symptom-groups__loading">Could not load symptom data. Please check that data.js is linked before script.js.</p>';
    return;
  }

  // ---------- Pehle checkboxes banao ----------
  buildSymptomCheckboxes();

  // ---------- Events ----------
  checkBtn.addEventListener("click", checkSymptoms);
  resetBtn.addEventListener("click", resetChecker);


  // ---------- Functions ----------

  // 31 symptoms ko group ke hisaab se HTML mein banana
  function buildSymptomCheckboxes() {
    groupsBox.innerHTML = ""; // "Loading symptoms..." hatao

    // Pehle symptoms ko group ke hisaab se alag-alag list mein rakho
    const groups = {};
    SYMPTOMS.forEach(function (symptom) {
      if (!groups[symptom.group]) {
        groups[symptom.group] = [];
      }
      groups[symptom.group].push(symptom);
    });

    // Har group ke liye ek section banao
    Object.keys(groups).forEach(function (groupName) {
      const groupDiv = document.createElement("div");
      groupDiv.className = "symptom-group";

      const title = document.createElement("h3");
      title.className = "symptom-group__title";
      title.textContent = groupName;
      groupDiv.appendChild(title);

      const optionsDiv = document.createElement("div");
      optionsDiv.className = "symptom-group__options";

      groups[groupName].forEach(function (symptom) {
        // <label> ke andar <input checkbox> aur <span> text
        const label = document.createElement("label");
        label.className = "symptom-option";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = symptom.id;

        const text = document.createElement("span");
        text.textContent = symptom.label;

        // Tick/untick hone par option ka color aur counter badlo
        checkbox.addEventListener("change", function () {
          label.classList.toggle("selected", checkbox.checked);
          updateCount();
          hideError();
        });

        label.appendChild(checkbox);
        label.appendChild(text);
        optionsDiv.appendChild(label);
      });

      groupDiv.appendChild(optionsDiv);
      groupsBox.appendChild(groupDiv);
    });
  }

  // Jo checkboxes tick hain, unke ids ki list return karta hai
  function getSelectedIds() {
    const checked = groupsBox.querySelectorAll("input[type='checkbox']:checked");
    return Array.from(checked).map(function (box) {
      return box.value;
    });
  }

  function updateCount() {
    selectedCount.textContent = getSelectedIds().length;
  }

  // Check Symptoms button dabane par
  function checkSymptoms() {
    const selectedIds = getSelectedIds();

    // Validation: kam se kam MIN_SYMPTOMS chahiye
    if (selectedIds.length < MIN_SYMPTOMS) {
      showError("Please select at least " + MIN_SYMPTOMS + " symptoms to get a result.");
      return;
    }

    hideError();

    // Score nikalo (Section 5 ka function)
    const matches = calculateMatches(selectedIds);

    // Result dikhao, last result save karo, aur history mein jodo
    showResults(matches, selectedIds.length);
    saveLastResult(selectedIds, matches);
    addToHistory(selectedIds, matches);
  }

  // Top matches ko right side mein dikhana
  function showResults(matches, selectedTotal) {
    resultList.innerHTML = "";

    matches.slice(0, TOP_RESULTS).forEach(function (match, index) {
      const card = document.createElement("div");
      card.className = "match-card" + (index === 0 ? " match-card--top" : "");

      // Upar wali line: rank, disease ka naam, percentage
      const top = document.createElement("div");
      top.className = "match-card__top";

      const rank = document.createElement("span");
      rank.className = "match-card__rank";
      rank.textContent = index === 0 ? "Top Match" : "#" + (index + 1);

      const name = document.createElement("h3");
      name.className = "match-card__name";
      name.textContent = match.name;

      const percent = document.createElement("span");
      percent.className = "match-card__percent";
      percent.textContent = match.percent.toFixed(1) + "%";

      top.appendChild(rank);
      top.appendChild(name);
      top.appendChild(percent);

      // Percentage bar
      const progress = document.createElement("div");
      progress.className = "progress";
      const bar = document.createElement("div");
      bar.className = "progress__bar";
      bar.style.width = match.percent + "%";
      progress.appendChild(bar);

      // Chhota note: kitne symptoms match hue
      const note = document.createElement("p");
      note.className = "match-card__note";
      note.textContent =
        match.matchedCount + " of your " + selectedTotal + " selected symptoms are common in " + match.name + ".";

      card.appendChild(top);
      card.appendChild(progress);
      card.appendChild(note);
      resultList.appendChild(card);
    });

    // "View Full Report" button: result.html par le jata hai
    const reportLink = document.createElement("a");
    reportLink.href = "result.html";
    reportLink.className = "btn btn--primary btn--full";
    reportLink.style.marginTop = "6px";
    reportLink.textContent = "View Full Report";
    resultList.appendChild(reportLink);

    resultsEmpty.hidden = true;
    resultsContent.hidden = false;

    // Mobile par result neeche aata hai, isliye wahan tak scroll karo
    if (window.innerWidth <= 992) {
      resultsContent.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Reset button: sab kuch pehle jaisa
  function resetChecker() {
    groupsBox.querySelectorAll("input[type='checkbox']").forEach(function (box) {
      box.checked = false;
      box.parentElement.classList.remove("selected");
    });

    updateCount();
    hideError();
    resultList.innerHTML = "";
    resultsContent.hidden = true;
    resultsEmpty.hidden = false;
  }

  function showError(text) {
    errorBox.textContent = text;
    errorBox.hidden = false;
  }

  function hideError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
  }

  // Aakhri result browser mein save karna (Result page isse padhta hai)
  function saveLastResult(selectedIds, matches) {
    const data = {
      date: new Date().toISOString(),
      selectedSymptoms: selectedIds,
      matches: matches.slice(0, TOP_RESULTS)
    };
    try {
      localStorage.setItem("tomatoguard_last_result", JSON.stringify(data));
    } catch (error) {
      console.log("Could not save result:", error);
    }
  }
}


/* ================= 5. SCORE NIKALNE KA LOGIC =================
   Input : selected symptoms ke ids ki list
   Output: diseases ki list, sabse zyada match upar

   Baad mein jab Flask ka real model aayega, to bas yeh function
   replace hoga (ya API call se result aayega). Baaki code waisa hi rahega. */
function calculateMatches(selectedIds) {
  // Step 1: har disease ka score (log probability ka sum)
  const scored = DISEASE_PROFILES.map(function (disease) {
    let logScore = 0;
    let matchedCount = 0;

    selectedIds.forEach(function (id) {
      const probability = disease.p[id];
      logScore += Math.log(probability);
      if (probability >= GOOD_MATCH_LEVEL) {
        matchedCount++;
      }
    });

    return { name: disease.name, logScore: logScore, matchedCount: matchedCount };
  });

  // Step 2: scores ko percentage (total 100%) mein badlo
  const maxLog = Math.max.apply(null, scored.map(function (item) { return item.logScore; }));
  let total = 0;
  scored.forEach(function (item) {
    item.weight = Math.exp(item.logScore - maxLog);
    total += item.weight;
  });
  scored.forEach(function (item) {
    item.percent = (item.weight / total) * 100;
  });

  // Step 3: sabse zyada percentage upar
  scored.sort(function (a, b) {
    return b.percent - a.percent;
  });

  return scored;
}


/* ================= 6. RESULT PAGE =================
   Symptom Checker ka save kiya hua result padhke result.html par dikhata hai.
   Dosto ka real model result isi format mein de to yeh code waise hi chalega:
   { date, selectedSymptoms: [ids], matches: [{ name, percent, matchedCount }] } */
function setupResultPage() {
  const resultCard = document.getElementById("resultCard");
  const noResult = document.getElementById("noResult");

  // Agar yeh Result page nahi hai, to yahin ruk jao
  if (!resultCard || !noResult) return;

  const saved = getLastResult();

  // Koi result nahi mila (ya data.js load nahi hui)
  if (!saved || typeof DISEASE_INFO === "undefined" || typeof SYMPTOMS === "undefined") {
    resultCard.hidden = true;
    noResult.hidden = false;
    return;
  }

  showResultOnPage(saved);

  // Print Report button
  const printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }
}

// localStorage se aakhri result padhna. Galat ya khaali ho to null return karta hai
function getLastResult() {
  try {
    const raw = localStorage.getItem("tomatoguard_last_result");
    if (!raw) return null;

    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.matches) || data.matches.length === 0) {
      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
}

// Result ko page ke elements mein bharna
function showResultOnPage(result) {
  const top = result.matches[0];
  const info = DISEASE_INFO[top.name];

  // Agar is disease ki info nahi mili to safe default
  const safeInfo = info || {
    status: "disease",
    statusLabel: "Result",
    description: "No extra information is available for this result yet.",
    symptoms: [],
    causes: [],
    prevention: [],
    care: []
  };

  const isHealthy = safeInfo.status === "healthy";

  // Disease ka naam, badge, percentage, bar
  document.getElementById("diseaseName").textContent = top.name;

  const badge = document.getElementById("statusBadge");
  badge.textContent = safeInfo.statusLabel;
  badge.classList.toggle("status-badge--healthy", isHealthy);
  badge.classList.toggle("status-badge--pest", safeInfo.status === "pest");

  document.getElementById("confidenceValue").textContent = top.percent.toFixed(1) + "%";
  document.getElementById("confidenceBar").style.width = top.percent + "%";

  document.getElementById("diseaseDescription").textContent = safeInfo.description;

  // Date
  const dateText = new Date(result.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  document.getElementById("analysisDate").textContent = dateText;

  // Selected symptoms (ids ko labels mein badalke)
  const selectedLabels = (result.selectedSymptoms || []).map(function (id) {
    const found = SYMPTOMS.find(function (symptom) {
      return symptom.id === id;
    });
    return found ? found.label : id;
  });
  fillList("selectedSymptoms", selectedLabels);

  // Baaki possible matches
  fillOtherMatches(result.matches.slice(1));

  // Symptoms, causes, prevention, care
  fillList("symptomsList", safeInfo.symptoms);
  fillList("causesList", safeInfo.causes);
  fillList("preventionList", safeInfo.prevention);
  fillList("careList", safeInfo.care);
}

// Kisi bhi <ul> ko list ke items se bharna
function fillList(elementId, items) {
  const list = document.getElementById(elementId);
  list.innerHTML = "";

  items.forEach(function (text) {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });
}

// "Other Possible Matches" bharna
function fillOtherMatches(matches) {
  const box = document.getElementById("otherMatches");
  box.innerHTML = "";

  matches.forEach(function (match) {
    const row = document.createElement("div");
    row.className = "other-match";

    const name = document.createElement("span");
    name.className = "other-match__name";
    name.textContent = match.name;

    const percent = document.createElement("span");
    percent.className = "other-match__percent";
    percent.textContent = match.percent.toFixed(1) + "%";

    row.appendChild(name);
    row.appendChild(percent);
    box.appendChild(row);
  });
}


/* ================= 7. DISEASE INFORMATION PAGE =================
   DISEASE_INFO (data.js) se cards banata hai, filter chalata hai,
   aur card par click karne par popup (modal) kholta hai. */
function setupDiseasesPage() {
  const grid = document.getElementById("diseaseGrid");
  const filterBar = document.getElementById("filterBar");
  const modal = document.getElementById("diseaseModal");

  // Agar yeh Disease Information page nahi hai, to yahin ruk jao
  if (!grid || !filterBar || !modal) return;

  // data.js load hui ya nahi, check karo
  if (typeof DISEASE_INFO === "undefined") {
    grid.innerHTML =
      '<p class="disease-grid__loading">Could not load disease data. Please check that data.js is linked before script.js.</p>';
    return;
  }

  // Popup ke elements
  const modalBox = modal.querySelector(".modal__box");
  const closeBtn = document.getElementById("modalClose");
  const overlay = document.getElementById("modalOverlay");

  // Type ke hisaab se icon aur tag ka naam
  const ICONS = { disease: "🍂", pest: "🕷️", healthy: "🌿" };
  const TAG_NAMES = { disease: "Disease", pest: "Pest", healthy: "Healthy" };

  // Popup band hone par focus isi card par wapas aayega
  let lastClickedCard = null;

  // Pehle saare cards dikhao
  renderCards("all");

  // ---------- Events ----------

  // Filter buttons
  filterBar.addEventListener("click", function (event) {
    const button = event.target.closest(".filter-btn");
    if (!button) return;

    filterBar.querySelectorAll(".filter-btn").forEach(function (item) {
      item.classList.remove("active");
    });
    button.classList.add("active");

    renderCards(button.dataset.filter);
  });

  // Popup band karne ke 3 tareeke
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });


  // ---------- Functions ----------

  // Filter ke hisaab se cards banana
  function renderCards(filter) {
    grid.innerHTML = "";

    const names = Object.keys(DISEASE_INFO).filter(function (name) {
      return filter === "all" || DISEASE_INFO[name].status === filter;
    });

    if (names.length === 0) {
      grid.innerHTML = '<p class="disease-grid__empty">No items found.</p>';
      return;
    }

    names.forEach(function (name) {
      const info = DISEASE_INFO[name];

      // Poora card ek button hai (keyboard se bhi khul sakta hai)
      const card = document.createElement("button");
      card.type = "button";
      card.className = "disease-card";

      const icon = document.createElement("div");
      icon.className = "disease-card__icon";
      icon.textContent = ICONS[info.status] || "🍅";

      const tag = document.createElement("span");
      tag.className = "tag tag--" + info.status;
      tag.textContent = TAG_NAMES[info.status] || "Info";

      const title = document.createElement("h3");
      title.className = "disease-card__name";
      title.textContent = name;

      const desc = document.createElement("p");
      desc.className = "disease-card__desc";
      desc.textContent = info.description;

      const link = document.createElement("span");
      link.className = "disease-card__link";
      link.textContent = "View Details →";

      card.appendChild(icon);
      card.appendChild(tag);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(link);

      card.addEventListener("click", function () {
        openModal(name, card);
      });

      grid.appendChild(card);
    });
  }

  // Popup kholna aur usme data bharna
  function openModal(name, card) {
    const info = DISEASE_INFO[name];
    lastClickedCard = card;

    document.getElementById("modalTitle").textContent = name;
    document.getElementById("modalDescription").textContent = info.description;

    // Status badge: disease (red), pest (peela), healthy (green)
    const status = document.getElementById("modalStatus");
    status.textContent = info.statusLabel;
    status.classList.toggle("status-badge--healthy", info.status === "healthy");
    status.classList.toggle("status-badge--pest", info.status === "pest");

    // Result page ka fillList() function yahan bhi kaam aa raha hai
    fillList("modalSymptoms", info.symptoms);
    fillList("modalCauses", info.causes);
    fillList("modalPrevention", info.prevention);
    fillList("modalCare", info.care);

    modal.hidden = false;
    document.body.classList.add("modal-open");
    modalBox.scrollTop = 0;
    closeBtn.focus();
  }

  // Popup band karna
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");

    if (lastClickedCard) {
      lastClickedCard.focus();
    }
  }
}


/* ================= 8. HISTORY (localStorage) =================
   Baad mein Flask + MySQL aaye to sirf getHistory() aur saveHistory()
   ko API calls se replace karna hoga. Baaki code waisa hi rahega.
   Ek record: { id, date, result, percent, symptomCount, status } */
const HISTORY_KEY = "tomatoguard_history";
const MAX_HISTORY = 50; // Zyada se zyada kitne records rakhne hain

// Saari history padhna. Kuch galat ho to khaali list return karta hai
function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];

    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    return [];
  }
}

// History ko save karna (sirf naye MAX_HISTORY records rakhta hai)
function saveHistory(list) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)));
  } catch (error) {
    console.log("Could not save history:", error);
  }
}

// Symptom Checker ka result history mein jodna (sabse naya sabse upar)
function addToHistory(selectedIds, matches) {
  const top = matches[0];
  const info = typeof DISEASE_INFO !== "undefined" ? DISEASE_INFO[top.name] : null;

  const list = getHistory();
  list.unshift({
    id: Date.now(),
    date: new Date().toISOString(),
    result: top.name,
    percent: top.percent,
    symptomCount: selectedIds.length,
    status: info ? info.status : "disease"
  });
  saveHistory(list);
}

// Chhota notification (toast) dikhana
function showToast(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}


/* ================= 9. HISTORY PAGE ================= */
function setupHistoryPage() {
  const body = document.getElementById("historyBody");
  const content = document.getElementById("historyContent");
  const emptyBox = document.getElementById("historyEmpty");
  const clearBtn = document.getElementById("clearHistoryBtn");
  const demoBtn = document.getElementById("addDemoBtn");

  // Agar yeh History page nahi hai, to yahin ruk jao
  if (!body || !content || !emptyBox) return;

  // Status ke hisaab se text aur pill ka rang
  const STATUS_TEXT = { disease: "Detected", pest: "Pest", healthy: "Healthy" };

  renderHistory();

  // ---------- Events ----------
  clearBtn.addEventListener("click", function () {
    if (getHistory().length === 0) {
      showToast("History is already empty.");
      return;
    }

    // Pehle confirm karo, taaki galti se delete na ho
    if (confirm("Are you sure you want to clear all history?")) {
      saveHistory([]);
      renderHistory();
      showToast("History cleared.");
    }
  });

  demoBtn.addEventListener("click", function () {
    const list = getHistory();

    // Demo records dobara dobara add na ho
    const alreadyAdded = list.some(function (item) {
      return item.demo === true;
    });
    if (alreadyAdded) {
      showToast("Demo records are already added.");
      return;
    }

    saveHistory(list.concat(createDemoRecords()));
    renderHistory();
    showToast("Demo records added.");
  });


  // ---------- Functions ----------

  // Table, stats aur empty state sab update karna
  function renderHistory() {
    // Naya record upar dikhane ke liye date ke hisaab se sort karo
    const list = getHistory().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    updateStats(list);

    if (list.length === 0) {
      content.hidden = true;
      emptyBox.hidden = false;
      return;
    }

    content.hidden = false;
    emptyBox.hidden = true;
    body.innerHTML = "";

    list.forEach(function (item, index) {
      body.appendChild(createRow(item, index + 1));
    });
  }

  // Table ki ek row banana
  function createRow(item, number) {
    const row = document.createElement("tr");

    row.appendChild(createCell(number));
    row.appendChild(createCell(formatDate(item.date)));

    const nameCell = createCell(item.result);
    nameCell.className = "history-table__name";
    row.appendChild(nameCell);

    const percentCell = createCell(Number(item.percent).toFixed(1) + "%");
    percentCell.className = "history-table__percent";
    row.appendChild(percentCell);

    row.appendChild(createCell(item.symptomCount));

    // Status pill (laal / peela / green)
    const statusCell = document.createElement("td");
    const pill = document.createElement("span");
    pill.className = "status-pill status-pill--" + (item.status === "disease" ? "detected" : item.status);
    pill.textContent = STATUS_TEXT[item.status] || "Detected";
    statusCell.appendChild(pill);
    row.appendChild(statusCell);

    return row;
  }

  function createCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
  }

  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  // 3 stats cards ke numbers
  function updateStats(list) {
    const healthyCount = list.filter(function (item) {
      return item.status === "healthy";
    }).length;

    document.getElementById("statTotal").textContent = list.length;
    document.getElementById("statHealthy").textContent = healthyCount;
    document.getElementById("statDiseases").textContent = list.length - healthyCount;
  }

  // Presentation ke liye 5 sample records (pichle kuch dinon ki dates ke saath)
  function createDemoRecords() {
    const samples = [
      { result: "Early Blight",    percent: 96.8, symptomCount: 4, status: "disease", daysAgo: 2 },
      { result: "Healthy",         percent: 98.2, symptomCount: 2, status: "healthy", daysAgo: 3 },
      { result: "Late Blight",     percent: 91.4, symptomCount: 5, status: "disease", daysAgo: 5 },
      { result: "Spider Mites",    percent: 99.1, symptomCount: 3, status: "pest",    daysAgo: 7 },
      { result: "Bacterial Spot",  percent: 84.6, symptomCount: 4, status: "disease", daysAgo: 9 }
    ];

    return samples.map(function (sample, index) {
      const date = new Date();
      date.setDate(date.getDate() - sample.daysAgo);

      return {
        id: Date.now() + index,
        date: date.toISOString(),
        result: sample.result,
        percent: sample.percent,
        symptomCount: sample.symptomCount,
        status: sample.status,
        demo: true
      };
    });
  }
}