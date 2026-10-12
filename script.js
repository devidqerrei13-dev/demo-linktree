const sliderTrack = document.querySelector(".plans-track");
const sliderCards = Array.from(document.querySelectorAll(".plans-slider .plan-card"));
const sliderDots = Array.from(document.querySelectorAll(".slider-dots button"));

function setActiveSlide(index) {
  sliderDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === index;
    dot.classList.toggle("active", isActive);
    dot.toggleAttribute("aria-current", isActive);
  });

}

function getSlideScrollLeft(card) {
  const trackBounds = sliderTrack.getBoundingClientRect();
  const cardBounds = card.getBoundingClientRect();
  const centeredLeft = sliderTrack.scrollLeft + cardBounds.left - trackBounds.left
    + cardBounds.width / 2 - sliderTrack.clientWidth / 2;
  return Math.max(0, Math.min(centeredLeft, sliderTrack.scrollWidth - sliderTrack.clientWidth));
}

function scrollToSlide(index, immediate = false) {
  const card = sliderCards[index];

  if (!card || !sliderTrack) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  sliderTrack.scrollTo({
    left: getSlideScrollLeft(card),
    behavior: immediate || prefersReducedMotion ? "instant" : "smooth",
  });
}

if (sliderTrack && sliderCards.length) {
  let scrollFrame = 0;

  sliderTrack.addEventListener("scroll", () => {
    cancelAnimationFrame(scrollFrame);

    scrollFrame = requestAnimationFrame(() => {
      const activeIndex = sliderCards.reduce(
        (closest, card, index) => {
          const distance = Math.abs(sliderTrack.scrollLeft - getSlideScrollLeft(card));
          return distance < closest.distance ? { index, distance } : closest;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY }
      ).index;

      setActiveSlide(activeIndex);
    });
  });

  sliderDots.forEach((dot, index) => {
    dot.addEventListener("click", () => scrollToSlide(index));
  });

  const initialIndex = Math.max(0, sliderCards.findIndex((card) => card.classList.contains("featured")));
  setActiveSlide(initialIndex);
  requestAnimationFrame(() => scrollToSlide(initialIndex, true));
}

const planDetails = {
  basic: {
    kicker: "Pacchetto di ingresso",
    title: "Basic",
    description: "Per iniziare con una guida chiara e un metodo sostenibile, senza sovraccaricare il percorso.",
    items: [
      "Scheda di allenamento personalizzata in base al livello iniziale",
      "Progressione settimanale con obiettivi semplici e misurabili",
      "Linee guida pratiche su tecnica, frequenza e recupero",
      "Check mensile per valutare avanzamento e correzioni principali",
    ],
    duration: "Durata consigliata: 4 settimane",
    support: "Supporto: revisione mensile",
  },
  avanzato: {
    kicker: "Pacchetto piu scelto",
    title: "Avanzato",
    description: "Per chi vuole un percorso completo, con piu personalizzazione e monitoraggio costante.",
    items: [
      "Programmazione allenamento su forza, resistenza e composizione corporea",
      "Aggiornamento periodico della scheda in base ai risultati",
      "Check ogni 2 settimane con analisi di progressi, carichi e feedback",
      "Strategia abitudini, disciplina e gestione degli ostacoli",
    ],
    duration: "Durata consigliata: 8-12 settimane",
    support: "Supporto: check bisettimanale",
  },
  premium: {
    kicker: "Coaching completo",
    title: "Premium",
    description: "Per chi cerca massima cura, presenza e ottimizzazione del percorso fisico e mentale.",
    items: [
      "Piano completo con allenamento, monitoraggio performance e priorita settimanali",
      "Adattamenti rapidi in base a recupero, calendario e obiettivi",
      "Check ravvicinati con feedback dettagliato e tracciamento continuo",
      "Supporto prioritario per mantenere costanza, focus e direzione",
    ],
    duration: "Durata consigliata: 12+ settimane",
    support: "Supporto: prioritario e continuativo",
  },
};

const modal = document.querySelector(".plan-modal");
const modalTitle = document.querySelector("#modal-title");
const modalKicker = document.querySelector("#modal-kicker");
const modalDescription = document.querySelector("#modal-description");
const modalList = document.querySelector("#modal-list");
const modalDuration = document.querySelector("#modal-duration");
const modalSupport = document.querySelector("#modal-support");
const modalCloseButton = document.querySelector(".modal-close");
let activeModalTrigger = null;

function openPlanModal(planKey, trigger) {
  const plan = planDetails[planKey];

  if (!plan || !modal) {
    return;
  }

  activeModalTrigger = trigger;
  modalKicker.textContent = plan.kicker;
  modalTitle.textContent = plan.title;
  modalDescription.textContent = plan.description;
  modalDuration.textContent = plan.duration;
  modalSupport.textContent = plan.support;
  modalList.innerHTML = plan.items.map((item) => `<li>${item}</li>`).join("");
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modalCloseButton?.focus();
}

function closePlanModal() {
  if (!modal || modal.hidden) {
    return;
  }

  modal.hidden = true;
  document.body.classList.remove("modal-open");

  if (activeModalTrigger) {
    activeModalTrigger.focus();
    activeModalTrigger = null;
  }
}

document.querySelectorAll("[data-plan]").forEach((button) => {
  button.addEventListener("click", () => openPlanModal(button.dataset.plan, button));
});

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-modal]")) {
      closePlanModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePlanModal();
    }
  });
}
