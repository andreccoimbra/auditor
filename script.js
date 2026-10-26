const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");
const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const homeView = document.querySelector("#home-view");
const methodologyView = document.querySelector("#methodology-view");
const aboutView = document.querySelector("#about-view");
const homeTitle = document.title;
const renderRoute = (initial = false) => {
  const isMethodology = window.location.hash === "#metodologia";
  const isAbout = window.location.hash === "#sobre-nos";
  homeView.hidden = isMethodology || isAbout;
  methodologyView.hidden = !isMethodology;
  aboutView.hidden = !isAbout;
  document.title = isMethodology
    ? "A nossa metodologia"
    : isAbout
      ? "Sobre nós"
      : homeTitle;

  if (isMethodology || isAbout) {
    navLinks.forEach((link) => link.removeAttribute("aria-current"));
    window.scrollTo(0, 0);
    document.querySelector(isMethodology ? "#methodology-title" : "#about-title").focus({ preventScroll: true });
  } else if (!initial && window.location.hash) {
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    target?.scrollIntoView();
  }
};
window.addEventListener("hashchange", () => renderRoute());
renderRoute(true);

const closeMenu = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  navigation.classList.remove("is-open");
};

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    closeMenu();
    menuToggle.focus();
  }
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const animatedElements = document.querySelectorAll(
  ".section-heading, .service-card, .service-areas, .contact-inner, .trust-inner"
);

if ("IntersectionObserver" in window && !reduceMotion) {
  animatedElements.forEach((element) => element.classList.add("js-reveal"));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
  animatedElements.forEach((element) => revealObserver.observe(element));

  const trackedSections = [...document.querySelectorAll("#inicio, #servicos, #abordagem, #contacto")];
  const updateActiveLink = () => {
    if (homeView.hidden) {
      navLinks.forEach((link) => link.removeAttribute("aria-current"));
      return;
    }
    const activeSection = [...trackedSections].reverse().find(
      (section) => section.getBoundingClientRect().top <= window.innerHeight * 0.35
    );
    navLinks.forEach((link) => {
      if (activeSection && link.getAttribute("href") === `#${activeSection.id}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };
  let scrollUpdatePending = false;
  window.addEventListener("scroll", () => {
    if (!scrollUpdatePending) {
      scrollUpdatePending = true;
      window.requestAnimationFrame(() => {
        updateActiveLink();
        scrollUpdatePending = false;
      });
    }
  }, { passive: true });
  updateActiveLink();
} else {
  animatedElements.forEach((element) => element.classList.add("is-visible"));
}

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const subject = `[AR/CC] ${formData.get("subject")}`;
  const message = [
    `Nome: ${formData.get("name")}`,
    `Organização: ${formData.get("organization") || "Não indicada"}`,
    `E-mail: ${formData.get("email")}`,
    `Telefone: ${formData.get("phone") || "Não indicado"}`,
    "",
    "Mensagem:",
    formData.get("message")
  ].join("\n");
  window.location.href = `mailto:geral@ar-cc.pt?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
});
