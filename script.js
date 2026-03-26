const QUESTIONS = [
  {
    id: "proposition_valeur",
    question: "Quelle est la principale différenciation de Floraly face aux applications de diagnostic classiques ?",
    choices: [
      "L'application est totalement gratuite et sans publicité",
      "Elle remplace totalement l'utilisateur pour l'entretien",
      "L'alliance d'un diagnostic continu par capteurs IoT et d'une dimension sociale gamifiée",
      "Elle ne fonctionne que pour les plantes potagères alimentaires"
    ],
    answerIndex: 2,
    explanation:
      "Contrairement aux applications qui offrent un diagnostic ponctuel par photo, Floraly propose un suivi hybride : des données matérielles en temps réel couplées à une communauté d'entraide et d'apprentissage[cite: 1971, 2048, 2257]."
  },
  {
    id: "cible_strategique",
    question: "Qui est le 'Persona' cœur de cible identifié par l'étude marketing PACA ?",
    choices: [
      "Les agriculteurs professionnels en zone rurale",
      "Les jeunes actifs urbains (20-35 ans) vivant en appartement",
      "Les retraités passionnés de jardinage extérieur",
      "Les entreprises de paysagisme pour les parcs publics"
    ],
    answerIndex: 1,
    explanation:
      "L'étude cible les 'plant-parents' urbains de 20 à 35 ans (66% des sondés), vivant souvent dans de petits espaces sans jardin et rencontrant des difficultés d'entretien par manque de temps ou de connaissances[cite: 1903, 1950, 2088]."
  },
  {
    id: "innovation_pedagogique",
    question: "Comment Floraly encourage-t-il l'engagement des utilisateurs sur le long terme ?",
    choices: [
      "Par l'envoi quotidien de SMS de rappel obligatoires",
      "Via un système de récompenses (points/badges) convertibles en graines gratuites",
      "En bloquant l'accès à l'application si la plante meurt",
      "En vendant uniquement des plantes artificielles sans entretien"
    ],
    answerIndex: 1,
    explanation:
      "Le projet mise sur l'andragogie ludique : les utilisateurs gagnent des points en aidant la communauté ou en relevant des défis, qu'ils peuvent échanger contre des sachets de graines ou des réductions[cite: 2103, 2274, 2277]."
  },
  {
    id: "viabilite_economique",
    question: "Sur quel mix de revenus repose le modèle économique de Floraly ?",
    choices: [
      "Uniquement sur la vente unique du pot en magasin",
      "Sur la revente des données personnelles des utilisateurs",
      "Vente du hardware, abonnements premium et recharges (graines/substrat)",
      "Uniquement sur les subventions publiques et le crowdfunding"
    ],
    answerIndex: 2,
    explanation:
      "Le business plan prévoit un modèle récurrent solide combinant la vente de biens (packs standard/premium), des services (abonnements appli) et des ventes additionnelles de consommables[cite: 2814, 2884, 3137]."
  },
  {
    id: "eco_conception",
    question: "Quel est l'objectif majeur de la démarche d'éco-conception de Floraly ?",
    choices: [
      "Utiliser des composants électroniques jetables après usage",
      "Privilégier une structure modulaire pour faciliter la réparation et le recyclage",
      "Produire le maximum de pièces en plastique non recyclable",
      "Supprimer totalement l'usage de l'eau pour les plantes"
    ],
    answerIndex: 1,
    explanation:
      "Floraly intègre l'éco-conception via une structure modulaire permettant de remplacer les éléments, l'utilisation de matériaux recyclables et une sensibilisation à la gestion raisonnée de l'eau[cite: 2301, 2414, 2415]."
  },
  {
    id: "architecture_technique",
    question: "Pourquoi l'équipe a-t-elle choisi une architecture 'monorepo' avec TypeScript ?",
    choices: [
      "Pour mélanger volontairement le code client et le code serveur",
      "Pour garantir une continuité logique et faciliter l'évolution du système IoT",
      "Parce que c'est le seul langage compatible avec les capteurs",
      "Pour limiter la sécurité des fichiers envoyés par les utilisateurs"
    ],
    answerIndex: 1,
    explanation:
      "Le choix du TypeScript de bout en bout et d'une séparation stricte front/back permet de gérer efficacement les flux de données IoT tout en assurant une maintenance simplifiée[cite: 2692, 2696, 2707]."
  },
  {
    id: "prix_psychologique",
    question: "Comment le prix de vente a-t-il été ajusté par rapport à l'étude de marché ?",
    choices: [
      "Il a été fixé à 300 € pour viser un marché de luxe",
      "Il est aligné sur le prix psychologique (30-70 €) grâce à une variante sans écran",
      "Le produit est donné gratuitement contre un abonnement de 50 €/mois",
      "Le prix est identique pour tous les canaux, sans marge commerciale"
    ],
    answerIndex: 1,
    explanation:
      "L'étude a révélé que 90% des sondés voulaient un kit entre 30 et 70 €. Floraly a donc optimisé son coût de revient avec une version 'standard' sans écran pour répondre à cette attente[cite: 1911, 2146, 2206]."
  }
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
