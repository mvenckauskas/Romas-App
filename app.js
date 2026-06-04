const userTypes = ["Dalyvis", "VIP dalyvis", "Studentas", "Spauda"];

const talks = [
  {
    id: "ai-ateitis",
    time: "09:30",
    room: "Didžioji salė",
    title: "Dirbtinis intelektas verslo procesuose",
    speaker: "Austėja Petrauskaitė",
    description:
      "Praktinis pranešimas apie tai, kaip organizacijos įsidiegia DI įrankius ir matuoja realią naudą.",
  },
  {
    id: "saugumas",
    time: "11:00",
    room: "B salė",
    title: "Kibernetinio saugumo pamokos augančioms komandoms",
    speaker: "Mantas Jankauskas",
    description:
      "Kaip pasiruošti incidentams, apsaugoti klientų duomenis ir įtraukti saugumą į kasdienius procesus.",
  },
  {
    id: "produktai",
    time: "14:00",
    room: "Inovacijų scena",
    title: "Produkto strategija nuo idėjos iki rinkos",
    speaker: "Rūta Šimkutė",
    description:
      "Apie prioritetų valdymą, vartotojų tyrimus ir sprendimus, kurie padeda greičiau pasiekti rinką.",
  },
];

const partners = [
  {
    id: "cloudhub",
    name: "CloudHub Lietuva",
    stand: "Stendas A4",
    hasStand: true,
    description: "Debesijos infrastruktūros konsultacijos ir migracijos planavimas.",
  },
  {
    id: "fintech-lab",
    name: "FinTech Lab",
    stand: "Stendas B2",
    hasStand: true,
    description: "Mokėjimų, atitikties ir duomenų analizės sprendimai finansų sektoriui.",
  },
  {
    id: "green-office",
    name: "Green Office",
    stand: "Virtualus partneris",
    hasStand: false,
    description: "Tvarių biuro procesų auditas ir darbuotojų įsitraukimo programos.",
  },
];

const slotTimes = ["10:00", "10:10", "10:20", "10:30", "12:00", "12:10", "15:00", "15:10", "15:20"];
const storageKey = "conferenceStateV2";
const pageRole = document.body.dataset.role;

const defaultState = {
  currentUserType: userTypes[0],
  speakerQuestions: [
    {
      talkId: "ai-ateitis",
      askerType: "Dalyvis",
      question: "Kokį pirmą procesą rekomenduotumėte automatizuoti vidutinėje įmonėje?",
      answer: "Pradėkite nuo pasikartojančių užklausų klasifikavimo ir aiškaus sėkmės rodiklio.",
    },
  ],
  partnerQuestions: [
    {
      partnerId: "cloudhub",
      askerType: "VIP dalyvis",
      question: "Ar konsultuojate dėl hibridinės debesijos architektūros?",
      answer: "Taip, prie stendo turėsime architektą, kuris galės aptarti pradinį planą.",
    },
  ],
  reservations: [
    {
      partnerId: "fintech-lab",
      userType: "Studentas",
      start: "12:00",
      duration: 20,
      status: "Patvirtinta",
    },
  ],
};

function loadState() {
  const savedState = localStorage.getItem(storageKey);

  if (!savedState) {
    return structuredClone(defaultState);
  }

  return JSON.parse(savedState);
}

const state = loadState();

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function findTalk(talkId) {
  return talks.find((talk) => talk.id === talkId);
}

function findPartner(partnerId) {
  return partners.find((partner) => partner.id === partnerId);
}

function createActivityItem({ title, meta, body, answer, actions }) {
  const article = document.createElement("article");
  article.className = "activity-item";

  const heading = document.createElement("h3");
  heading.textContent = title;
  article.append(heading);

  const metaRow = document.createElement("div");
  metaRow.className = "activity-meta";
  meta.forEach((item) => {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = item;
    metaRow.append(badge);
  });
  article.append(metaRow);

  const text = document.createElement("p");
  text.textContent = body;
  article.append(text);

  if (answer) {
    const answerText = document.createElement("p");
    answerText.className = "answer";
    answerText.textContent = `Atsakymas: ${answer}`;
    article.append(answerText);
  }

  if (actions) {
    article.append(actions);
  }

  return article;
}

function createEmptyState(message) {
  const empty = document.createElement("p");
  empty.className = "empty-state";
  empty.textContent = message;
  return empty;
}

function createAnswerForm({ label, value, submitText, onSubmit }) {
  const form = document.createElement("form");
  form.className = "inline-action";

  const field = document.createElement("label");
  field.textContent = label;

  const textarea = document.createElement("textarea");
  textarea.name = "answer";
  textarea.rows = 2;
  textarea.required = true;
  textarea.value = value.startsWith("Laukia") ? "" : value;
  textarea.placeholder = "Įrašykite atsakymą";
  field.append(textarea);

  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = submitText;

  form.append(field, button);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    onSubmit(data.get("answer").trim());
  });

  return form;
}

function createReservationActions(reservation) {
  const wrapper = document.createElement("div");
  wrapper.className = "reservation-actions";

  const approveButton = document.createElement("button");
  approveButton.type = "button";
  approveButton.textContent = "Patvirtinti laiką";
  approveButton.addEventListener("click", () => {
    reservation.status = "Patvirtinta partnerio";
    saveState();
    renderPartnerRequests();
  });

  const suggestButton = document.createElement("button");
  suggestButton.type = "button";
  suggestButton.className = "secondary-button";
  suggestButton.textContent = "Pasiūlyti kitą laiką";
  suggestButton.addEventListener("click", () => {
    reservation.status = "Partneris pasiūlė kitą laiką";
    saveState();
    renderPartnerRequests();
  });

  wrapper.append(approveButton, suggestButton);
  return wrapper;
}

function renderTalks() {
  const talksList = document.querySelector("#talksList");
  const talkTemplate = document.querySelector("#talkCardTemplate");

  if (!talksList || !talkTemplate) {
    return;
  }

  talksList.replaceChildren();

  talks.forEach((talk) => {
    const card = talkTemplate.content.cloneNode(true);
    card.querySelector(".time").textContent = talk.time;
    card.querySelector(".room").textContent = talk.room;
    card.querySelector("h3").textContent = talk.title;
    card.querySelector(".speaker").textContent = `Pranešėjas: ${talk.speaker}`;
    card.querySelector(".description").textContent = talk.description;

    const form = card.querySelector(".question-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      state.speakerQuestions.unshift({
        talkId: talk.id,
        askerType: state.currentUserType,
        question: data.get("question").trim(),
        answer: "Laukia pranešėjo atsakymo.",
      });
      saveState();
      form.reset();
    });

    talksList.append(card);
  });
}

function renderPartners() {
  const partnersList = document.querySelector("#partnersList");
  const partnerTemplate = document.querySelector("#partnerCardTemplate");

  if (!partnersList || !partnerTemplate) {
    return;
  }

  partnersList.replaceChildren();

  partners.forEach((partner) => {
    const card = partnerTemplate.content.cloneNode(true);
    card.querySelector(".stand").textContent = partner.stand;
    card.querySelector(".status").textContent = partner.hasStand ? "Turi stendą" : "Be fizinio stendo";
    card.querySelector("h3").textContent = partner.name;
    card.querySelector(".description").textContent = partner.description;

    const slotSelect = card.querySelector('select[name="start"]');
    slotTimes.forEach((time) => {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      slotSelect.append(option);
    });

    const reservationForm = card.querySelector(".reservation-form");
    reservationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(reservationForm);
      state.reservations.unshift({
        partnerId: partner.id,
        userType: state.currentUserType,
        start: data.get("start"),
        duration: Number(data.get("duration")),
        status: "Laukia partnerio atsakymo",
      });
      saveState();
    });

    const questionForm = card.querySelector(".question-form");
    questionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(questionForm);
      state.partnerQuestions.unshift({
        partnerId: partner.id,
        askerType: state.currentUserType,
        question: data.get("question").trim(),
        answer: "Laukia partnerio atsakymo.",
      });
      saveState();
      questionForm.reset();
    });

    partnersList.append(card);
  });
}

function renderSpeakerQuestions() {
  const speakerQuestions = document.querySelector("#speakerQuestions");

  if (!speakerQuestions) {
    return;
  }

  if (state.speakerQuestions.length === 0) {
    speakerQuestions.replaceChildren(createEmptyState("Pranešėjui klausimų dar nėra."));
    return;
  }

  const items = state.speakerQuestions.map((item) => {
    const talk = findTalk(item.talkId);
    return createActivityItem({
      title: item.question,
      meta: ["Klausia: " + item.askerType, talk.title, talk.speaker, talk.time],
      body: "Šį klausimą uždavė naudotojas. Atsakyti gali tik pranešėjas šiame puslapyje.",
      answer: item.answer,
      actions: createAnswerForm({
        label: "Pranešėjo atsakymas",
        value: item.answer,
        submitText: "Išsaugoti atsakymą",
        onSubmit: (answer) => {
          item.answer = answer;
          saveState();
          renderSpeakerQuestions();
        },
      }),
    });
  });

  speakerQuestions.replaceChildren(...items);
}

function renderPartnerRequests() {
  const partnerRequests = document.querySelector("#partnerRequests");

  if (!partnerRequests) {
    return;
  }

  const items = [];

  state.reservations.forEach((reservation) => {
    const partner = findPartner(reservation.partnerId);
    items.push(
      createActivityItem({
        title: `${partner.name}: rezervacija ${reservation.start}`,
        meta: ["Rezervavo: " + reservation.userType, partner.stand, `${reservation.duration} min.`, reservation.status],
        body: "Šią rezervaciją sukūrė naudotojas. Patvirtinti ar siūlyti kitą laiką gali tik partneris šiame puslapyje.",
        actions: createReservationActions(reservation),
      }),
    );
  });

  state.partnerQuestions.forEach((question) => {
    const partner = findPartner(question.partnerId);
    items.push(
      createActivityItem({
        title: question.question,
        meta: ["Klausia: " + question.askerType, partner.name, partner.stand],
        body: "Šį klausimą uždavė naudotojas. Atsakyti gali tik partneris šiame puslapyje.",
        answer: question.answer,
        actions: createAnswerForm({
          label: "Partnerio atsakymas",
          value: question.answer,
          submitText: "Išsaugoti atsakymą",
          onSubmit: (answer) => {
            question.answer = answer;
            saveState();
            renderPartnerRequests();
          },
        }),
      }),
    );
  });

  if (items.length === 0) {
    partnerRequests.replaceChildren(createEmptyState("Partneriui klausimų ar rezervacijų dar nėra."));
    return;
  }

  partnerRequests.replaceChildren(...items);
}

function renderModeratorFeed() {
  const moderatorFeed = document.querySelector("#moderatorFeed");

  if (!moderatorFeed) {
    return;
  }

  const speakerItems = state.speakerQuestions.map((item) => {
    const talk = findTalk(item.talkId);
    return createActivityItem({
      title: item.question,
      meta: ["Pranešėjui", "Klausia: " + item.askerType, talk.speaker, talk.title],
      body: "Moderatorius mato naudotojo klausimą pranešėjui ir pranešėjo atsakymą, bet čia negali atsakyti.",
      answer: item.answer,
    });
  });

  const partnerQuestionItems = state.partnerQuestions.map((item) => {
    const partner = findPartner(item.partnerId);
    return createActivityItem({
      title: item.question,
      meta: ["Partneriui", "Klausia: " + item.askerType, partner.name],
      body: "Moderatorius mato naudotojo klausimą partneriui ir partnerio atsakymą, bet čia negali atsakyti.",
      answer: item.answer,
    });
  });

  const reservationItems = state.reservations.map((reservation) => {
    const partner = findPartner(reservation.partnerId);
    return createActivityItem({
      title: `${partner.name}: rezervacija ${reservation.start}`,
      meta: ["Rezervacija", "Rezervavo: " + reservation.userType, `${reservation.duration} min.`, reservation.status],
      body: "Moderatorius mato naudotojo rezervaciją ir partnerio sprendimą, bet čia negali keisti rezervacijos.",
    });
  });

  const items = [...speakerItems, ...partnerQuestionItems, ...reservationItems];

  if (items.length === 0) {
    moderatorFeed.replaceChildren(createEmptyState("Moderatoriui dar nėra ką peržiūrėti."));
    return;
  }

  moderatorFeed.replaceChildren(...items);
}

function setupUserTypeSelect() {
  const userTypeSelect = document.querySelector("#userTypeSelect");

  if (!userTypeSelect) {
    return;
  }

  userTypeSelect.value = state.currentUserType;
  userTypeSelect.addEventListener("change", (event) => {
    state.currentUserType = event.target.value;
    saveState();
  });
}

if (pageRole === "naudotojas") {
  setupUserTypeSelect();
  renderTalks();
  renderPartners();
}

if (pageRole === "pranesejas") {
  renderSpeakerQuestions();
}

if (pageRole === "partneris") {
  renderPartnerRequests();
}

if (pageRole === "moderatorius") {
  renderModeratorFeed();
}
