const QUESTIONS = [
  {
    id: "ecosysteme",
    question: "Floraly, c’est avant tout…",
    choices: [
      "Un robot d’arrosage autonome sans application",
      "Une boutique en ligne de plantes, sans suivi de données",
      "Un écosystème (capteurs IoT + appli mobile + interface web)",
      "Un simple calendrier d’arrosage, sans capteur",
    ],
    answerIndex: 2,
    explanation:
      "Le rapport présente Floraly comme un écosystème de suivi et d’accompagnement des plantes, basé sur des objets connectés, une application mobile et une interface web.",
  },
  {
    id: "domaines",
    question: "Sur quels grands domaines Floraly se positionne-t-il ?",
    choices: [
      "La mobilité urbaine, la santé et le tourisme",
      "La crypto, la finance et les jeux vidéo",
      "La livraison de repas, le sport et la musique",
      "Plantes, domotique/IoT, éducatif & interactif",
    ],
    answerIndex: 3,
    explanation:
      "Floraly met en avant trois domaines : bien-être des plantes, domotique/IoT, et une dimension éducative et interactive.",
  },
  {
    id: "innovation",
    question: "Quelle est l’innovation principale mise en avant ?",
    choices: [
      "Remplacer la terre par un gel nutritif",
      "Une solution globale : mesures en temps réel, analyse et conseils ludiques",
      "Vendre des plantes génétiquement modifiées (OGM) adaptées au salon",
      "N’utiliser aucun serveur : tout se fait hors ligne, sans synchronisation",
    ],
    answerIndex: 1,
    explanation:
      "Le projet insiste sur l’approche globale : collecte en temps réel, interprétation des données et restitution pédagogique/ludique, contrairement aux conseils génériques.",
  },
  {
    id: "capteurs",
    question: "Quels paramètres sont mesurés par les capteurs (exemples cités) ?",
    choices: [
      "Pression atmosphérique, vitesse du vent, pluviométrie",
      "Niveau sonore, qualité du Wi‑Fi, nombre de notifications",
      "Humidité du sol, température, lumière",
      "Taux de CO₂ uniquement",
    ],
    answerIndex: 2,
    explanation:
      "Le rapport cite notamment l’humidité du sol, la température et la lumière comme données mesurées et envoyées pour analyse.",
  },
  {
    id: "fonctionnement",
    question: "Dans quel ordre se déroule le fonctionnement global ?",
    choices: [
      "Le serveur invente des données → les capteurs les affichent",
      "L’utilisateur arrose → l’application mesure → le capteur confirme",
      "La boutique envoie des notifications → les capteurs démarrent",
      "Capteurs → serveur → analyse → alertes/conseils",
    ],
    answerIndex: 3,
    explanation:
      "Le flux décrit est : mesure par capteurs IoT, envoi au serveur, analyse, puis alertes et informations en temps réel.",
  },
  {
    id: "arrosage",
    question: "Quelle solution d’arrosage est retenue et quelle option est proposée en cas d’absence ?",
    choices: [
      "Arrosage automatique par capillarité, sans option",
      "Arrosage uniquement par brumisation, + chauffage intégré",
      "Aucun arrosage, les plantes sont artificielles",
      "Arrosage classique + option kit goutte-à-goutte en cas d’absence",
    ],
    answerIndex: 2,
    explanation:
      "Le rapport mentionne un arrosage classique au quotidien, et la possibilité d’ajouter un kit goutte-à-goutte lors des absences (vacances).",
  },
  {
    id: "conformite",
    question:
      "Quelles contraintes/points de conformité sont cités pour une solution connectée en Europe ?",
    choices: [
      "Aucune contrainte si le produit est vendu en ligne",
      "Uniquement une licence musicale pour l’application",
      "Seulement une assurance habitation",
      "CE + cybersécurité + RGPD",
    ],
    answerIndex: 3,
    explanation:
      "Le rapport évoque le marquage CE (sécurité, conformité électrique/EMC), des exigences liées à la cybersécurité, et le RGPD pour la collecte/traitement de données.",
  },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function scoreLabel(score, total) {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio === 1) return "Parfait. Tu connais Floraly sur le bout des feuilles.";
  if (ratio >= 0.75) return "Très bon score. Floraly n’a (presque) plus de secret pour toi.";
  if (ratio >= 0.5) return "Bon début. Encore un petit tour et ce sera parfait.";
  return "Pas grave. Passe au stand, on t’explique tout en 2 minutes.";
}

function getState() {
  const raw = localStorage.getItem("floraly_quiz_state");
  if (!raw)
    return {
      step: 0,
      answers: Array(QUESTIONS.length).fill(null),
      revealed: Array(QUESTIONS.length).fill(false),
    };
  try {
    const parsed = JSON.parse(raw);
    const answers = Array.isArray(parsed.answers) ? parsed.answers : [];
    const revealed = Array.isArray(parsed.revealed) ? parsed.revealed : [];
    return {
      step: clamp(Number(parsed.step) || 0, 0, QUESTIONS.length + 1),
      answers: QUESTIONS.map((_, i) => (i < answers.length ? answers[i] : null)),
      revealed: QUESTIONS.map((_, i) => (i < revealed.length ? Boolean(revealed[i]) : false)),
    };
  } catch {
    return {
      step: 0,
      answers: Array(QUESTIONS.length).fill(null),
      revealed: Array(QUESTIONS.length).fill(false),
    };
  }
}

function setState(state) {
  localStorage.setItem("floraly_quiz_state", JSON.stringify(state));
}

function resetState() {
  localStorage.removeItem("floraly_quiz_state");
}

function computeScore(answers) {
  let score = 0;
  for (let i = 0; i < QUESTIONS.length; i += 1) {
    if (answers[i] === QUESTIONS[i].answerIndex) score += 1;
  }
  return score;
}

function renderStart(cardEl) {
  cardEl.innerHTML = `
    <div class="row">
      <span class="pill">7 questions</span>
      <span class="pill">~ 2 minutes</span>
    </div>
    <h2 class="question">Prêt(e) à tester tes connaissances sur Floraly ?</h2>
    <p class="subtitle" style="margin: 0; max-width: 65ch;">
      Le quiz se termine par un score et un récapitulatif avec les bonnes réponses.
    </p>
    <div class="actions">
      <button class="btn btn-primary" id="startBtn" type="button">Démarrer</button>
    </div>
  `;

  cardEl.querySelector("#startBtn").addEventListener("click", () => {
    const state = getState();
    state.step = 1;
    setState(state);
    render();
  });
}

function renderQuestion(cardEl, index) {
  const state = getState();
  const q = QUESTIONS[index];
  const selected = state.answers[index];

  const optionsHtml = q.choices
    .map((label, i) => {
      const checked = selected === i ? "checked" : "";
      return `
        <label class="choice">
          <input type="radio" name="choice" value="${i}" ${checked} />
          <span class="label">${escapeHtml(label)}</span>
        </label>
      `;
    })
    .join("");

  cardEl.innerHTML = `
    <div class="row">
      <span class="pill">Question ${index + 1} / ${QUESTIONS.length}</span>
      <span class="pill">Projet Floraly</span>
    </div>
    <h2 class="question">${escapeHtml(q.question)}</h2>
    <div class="choices" role="radiogroup" aria-label="Choix de réponse">
      ${optionsHtml}
    </div>
    <div class="actions">
      <button class="btn" id="prevBtn" type="button" ${index === 0 ? "disabled" : ""}>Retour</button>
      <button class="btn btn-primary" id="nextBtn" type="button" ${
        selected === null ? "disabled" : ""
      }>${index === QUESTIONS.length - 1 ? "Voir le résultat" : "Suivant"}</button>
    </div>
    <div id="feedback"></div>
  `;

  const nextBtn = cardEl.querySelector("#nextBtn");
  const prevBtn = cardEl.querySelector("#prevBtn");
  const feedbackEl = cardEl.querySelector("#feedback");

  function applyFeedback(selectedIndex) {
    const isCorrect = selectedIndex === q.answerIndex;

    cardEl.querySelectorAll(".choice").forEach((choiceEl, i) => {
      choiceEl.classList.toggle("correct", i === q.answerIndex);
      choiceEl.classList.toggle("wrong", i === selectedIndex && !isCorrect);
    });

    feedbackEl.innerHTML = `
      <div class="explain ${isCorrect ? "good" : "bad"}">
        <p class="explain-title">${isCorrect ? "Bonne réponse" : "Mauvaise réponse"}</p>
        <p class="explain-text">${escapeHtml(q.explanation)}</p>
      </div>
    `;
  }

  cardEl.querySelectorAll('input[name="choice"]').forEach((input) => {
    input.addEventListener("change", (e) => {
      const value = Number(e.target.value);
      const updated = getState();
      updated.answers[index] = value;
      updated.revealed[index] = true;
      setState(updated);
      nextBtn.disabled = false;
      applyFeedback(value);
    });
  });

  if (selected !== null && state.revealed[index]) {
    applyFeedback(selected);
  }

  prevBtn.addEventListener("click", () => {
    const updated = getState();
    updated.step = clamp(updated.step - 1, 0, QUESTIONS.length);
    setState(updated);
    render();
  });

  nextBtn.addEventListener("click", () => {
    const updated = getState();
    if (index === QUESTIONS.length - 1) {
      updated.step = QUESTIONS.length + 1;
    } else {
      updated.step = clamp(updated.step + 1, 0, QUESTIONS.length + 1);
    }
    setState(updated);
    render();
  });
}

function renderResult(cardEl) {
  const state = getState();
  const score = computeScore(state.answers);

  const summaryHtml = QUESTIONS.map((q, i) => {
    const user = state.answers[i];
    const ok = user === q.answerIndex;
    const userLabel =
      user === null ? "Aucune réponse" : `Ta réponse : ${q.choices[user]}`;
    const correctLabel = `Bonne réponse : ${q.choices[q.answerIndex]}`;
    return `
      <div class="summary-item">
        <p class="summary-q">${escapeHtml(q.question)}</p>
        <p class="summary-a" style="margin-bottom: 6px; color: ${
          ok ? "var(--accent)" : "var(--danger)"
        };">${escapeHtml(userLabel)}</p>
        <p class="summary-a">${escapeHtml(correctLabel)}</p>
        <p class="summary-a" style="margin-top: 8px;">${escapeHtml(q.explanation)}</p>
      </div>
    `;
  }).join("");

  cardEl.innerHTML = `
    <div class="result">
      <div class="row">
        <span class="pill">Résultat</span>
        <span class="pill">${score} / ${QUESTIONS.length}</span>
      </div>
      <p class="score">${score} / ${QUESTIONS.length}</p>
      <p class="score-sub">${escapeHtml(scoreLabel(score, QUESTIONS.length))}</p>
      <div class="actions">
        <button class="btn btn-primary" id="restartBtn" type="button">Recommencer</button>
      </div>
      <div class="summary" aria-label="Récapitulatif des réponses">
        ${summaryHtml}
      </div>
    </div>
  `;

  cardEl.querySelector("#restartBtn").addEventListener("click", () => {
    resetState();
    render();
  });
}

function render() {
  const cardEl = document.getElementById("card");
  const restartLink = document.getElementById("restartLink");
  restartLink.onclick = (e) => {
    e.preventDefault();
    resetState();
    render();
  };

  const state = getState();
  if (state.step === 0) {
    renderStart(cardEl);
    return;
  }
  if (state.step >= QUESTIONS.length + 1) {
    renderResult(cardEl);
    return;
  }

  const questionIndex = clamp(state.step - 1, 0, QUESTIONS.length - 1);
  renderQuestion(cardEl, questionIndex);
}

render();
