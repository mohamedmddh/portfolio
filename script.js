const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const year = document.querySelector("[data-year]");
const robot = document.querySelector(".hero-robot");
const robotSpeech = document.querySelector(".robot-speech");
const educationTimeline = document.querySelector("[data-education-timeline]");
const educationSection = document.querySelector(".education-section");
const certificateCards = document.querySelectorAll("[data-certificate-pdf]");
const certificateModal = document.querySelector("[data-certificate-modal]");
const certificateFrame = document.querySelector("[data-certificate-frame]");
const certificateClose = document.querySelector("[data-certificate-close]");
const certificateModalTitle = document.querySelector("#certificate-modal-title");
const contactForm = document.querySelector("[data-contact-form]");

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeNavigation = () => {
  document.body.classList.remove("nav-open");
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

year.textContent = new Date().getFullYear();
syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (educationSection) {
  let certificateScrollTimer;
  const certificateStack = educationSection.querySelector(".education-papers");
  const backCertificate = educationSection.querySelector(".education-paper-back");

  const pulseCertificateWiggle = () => {
    const rect = educationSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const isNearEducation = rect.top < viewportHeight && rect.bottom > 0;

    if (!isNearEducation) {
      educationSection.classList.remove("is-certificate-scrolling");
      return;
    }

    educationSection.classList.add("is-certificate-scrolling");
    window.clearTimeout(certificateScrollTimer);
    certificateScrollTimer = window.setTimeout(() => {
      educationSection.classList.remove("is-certificate-scrolling");
    }, 220);
  };

  window.addEventListener("scroll", pulseCertificateWiggle, { passive: true });

  if (certificateStack && backCertificate) {
    backCertificate.addEventListener("mouseenter", () => certificateStack.classList.add("is-revealing-back"));
    backCertificate.addEventListener("mouseleave", () => certificateStack.classList.remove("is-revealing-back"));
    backCertificate.addEventListener("focus", () => certificateStack.classList.add("is-revealing-back"));
    backCertificate.addEventListener("blur", () => certificateStack.classList.remove("is-revealing-back"));
  }
}

if (certificateCards.length && certificateModal && certificateFrame && certificateClose) {
  let activeCertificateCard = null;

  const openCertificate = (card) => {
    activeCertificateCard = card;
    const pdfPath = card.dataset.certificatePdf;
    const title = card.dataset.certificateTitle || "Certificate";

    certificateFrame.title = `${title} certificate preview`;
    if (certificateModalTitle) {
      certificateModalTitle.textContent = title;
    }
    certificateFrame.removeAttribute("src");
    certificateModal.classList.add("is-open");
    certificateModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("certificate-modal-open");
    certificateClose.focus();
    window.setTimeout(() => {
      certificateFrame.src = `${pdfPath}#toolbar=0&navpanes=0&scrollbar=0&zoom=70`;
    }, 120);
  };

  const closeCertificate = () => {
    certificateModal.classList.remove("is-open");
    certificateModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("certificate-modal-open");
    certificateFrame.removeAttribute("src");
    activeCertificateCard?.focus();
    activeCertificateCard = null;
  };

  certificateCards.forEach((card) => {
    card.addEventListener("click", () => openCertificate(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCertificate(card);
      }
    });
  });

  certificateClose.addEventListener("click", closeCertificate);
  certificateModal.addEventListener("click", (event) => {
    if (event.target === certificateModal) {
      closeCertificate();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && certificateModal.classList.contains("is-open")) {
      closeCertificate();
    }
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "Portfolio contact").trim();
    const message = String(formData.get("message") || "").trim();
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message
    ].join("\n");

    window.location.href = `mailto:meddh.contact@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

if (educationTimeline) {
  const educationEvents = educationTimeline.querySelectorAll(".education-event");

  const setActiveEducation = (activeEvent) => {
    educationEvents.forEach((item) => {
      const itemButton = item.querySelector(".education-node");
      const isSelected = item === activeEvent;
      item.classList.toggle("is-active", isSelected);
      itemButton.setAttribute("aria-expanded", String(isSelected));
    });
  };

  educationEvents.forEach((event) => {
    const button = event.querySelector(".education-node");

    button.addEventListener("click", () => setActiveEducation(event));
    button.addEventListener("mouseenter", () => setActiveEducation(event));
    button.addEventListener("focus", () => setActiveEducation(event));
  });
}


const experienceCards = document.querySelectorAll("[data-experience-card]");

if (experienceCards.length) {
  let pinnedExperienceCard = null;

  const createGalleryFallback = (label) => {
    const safeLabel = label || "Experience moment";
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 390" role="img" aria-label="${safeLabel}">
        <defs>
          <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#ffffff" />
            <stop offset="1" stop-color="#e9f2ec" />
          </linearGradient>
        </defs>
        <rect width="640" height="390" fill="url(#bg)" />
        <rect x="34" y="34" width="572" height="322" rx="28" fill="none" stroke="#0d6b46" stroke-width="6" stroke-opacity="0.38" />
        <circle cx="156" cy="143" r="38" fill="#0d6b46" fill-opacity="0.18" />
        <path d="M82 306l126-122 86 82 60-54 204 94H82z" fill="#0d6b46" fill-opacity="0.2" />
        <text x="320" y="184" text-anchor="middle" fill="#073d2a" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="800">${safeLabel}</text>
        <text x="320" y="226" text-anchor="middle" fill="#51645c" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="700">Event image coming soon</text>
      </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const loadExperienceMedia = (card) => {
    if (card.dataset.mediaLoaded === "true") {
      return;
    }

    card.querySelectorAll(".experience-gallery img[data-src]").forEach((image) => {
      const fallbackLabel = image.closest("figure")?.querySelector("figcaption")?.textContent?.trim() || image.alt;
      const slide = image.closest(".experience-gallery-item");
      const setSlideBackground = (source) => {
        slide?.style.setProperty("--gallery-image", `url("${source.replace(/"/g, "%22")}")`);
      };

      image.addEventListener("error", () => {
        if (image.dataset.fallbackApplied === "true") {
          return;
        }

        image.dataset.fallbackApplied = "true";
        const fallback = createGalleryFallback(fallbackLabel);
        setSlideBackground(fallback);
        image.src = fallback;
      });

      setSlideBackground(image.dataset.src);
      image.src = image.dataset.src;
    });

    card.dataset.mediaLoaded = "true";
  };

  const setGallerySlide = (gallery, index) => {
    if (!gallery) {
      return;
    }

    const slides = [...gallery.querySelectorAll(".experience-gallery-item")];

    if (!slides.length) {
      return;
    }

    const boundedIndex = (index + slides.length) % slides.length;
    gallery.dataset.activeIndex = String(boundedIndex);
    gallery.style.setProperty("--gallery-index", boundedIndex);

    slides.forEach((slide, slideIndex) => {
      slide.style.setProperty("--slide-offset", `${(slideIndex - boundedIndex) * 108}%`);
      slide.classList.toggle("is-active", slideIndex === boundedIndex);
      slide.setAttribute("aria-hidden", String(slideIndex !== boundedIndex));
    });

    const count = gallery.querySelector(".experience-gallery-count");
    if (count) {
      count.textContent = `${boundedIndex + 1} / ${slides.length}`;
    }
  };

  const setupExperienceGallery = (gallery) => {
    if (!gallery) {
      return;
    }

    if (gallery.dataset.carouselReady === "true") {
      return;
    }

    const slides = [...gallery.querySelectorAll(".experience-gallery-item")];

    slides.forEach((slide, index) => {
      slide.style.setProperty("--item-index", index);
    });

    if (slides.length > 1) {
      const controls = document.createElement("div");
      controls.className = "experience-gallery-controls";
      controls.innerHTML = `
        <button class="experience-gallery-control" type="button" data-gallery-step="-1" aria-label="Previous experience picture"></button>
        <button class="experience-gallery-control" type="button" data-gallery-step="1" aria-label="Next experience picture"></button>
      `;
      gallery.append(controls);
      const count = document.createElement("span");
      count.className = "experience-gallery-count";
      count.setAttribute("aria-live", "polite");
      gallery.append(count);

      controls.querySelectorAll("[data-gallery-step]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          const currentIndex = Number(gallery.dataset.activeIndex || 0);
          setGallerySlide(gallery, currentIndex + Number(button.dataset.galleryStep));
        });
      });
    } else {
      const count = document.createElement("span");
      count.className = "experience-gallery-count";
      gallery.append(count);
    }

    gallery.dataset.carouselReady = "true";
    setGallerySlide(gallery, 0);
  };

  const closeExperienceMedia = (card) => {
    const trigger = card.querySelector(".experience-media-trigger");
    const gallery = card.querySelector(".experience-gallery");

    card.classList.remove("is-media-active");
    trigger?.setAttribute("aria-expanded", "false");
    gallery?.setAttribute("aria-hidden", "true");
  };

  const openExperienceMedia = (card, { pin = false } = {}) => {
    experienceCards.forEach((item) => {
      if (item !== card) {
        closeExperienceMedia(item);
      }
    });

    loadExperienceMedia(card);
    setupExperienceGallery(card.querySelector(".experience-gallery"));
    card.classList.add("is-media-active");
    card.querySelector(".experience-media-trigger")?.setAttribute("aria-expanded", "true");
    card.querySelector(".experience-gallery")?.setAttribute("aria-hidden", "false");

    if (pin) {
      pinnedExperienceCard = card;
    }
  };

  experienceCards.forEach((card) => {
    const trigger = card.querySelector(".experience-media-trigger");

    if (!trigger) {
      return;
    }

    trigger.addEventListener("mouseenter", () => openExperienceMedia(card));
    trigger.addEventListener("focus", () => openExperienceMedia(card));

    trigger.addEventListener("click", () => {
      const isPinnedOpen = pinnedExperienceCard === card && card.classList.contains("is-media-active");

      if (isPinnedOpen) {
        pinnedExperienceCard = null;
        closeExperienceMedia(card);
        return;
      }

      openExperienceMedia(card, { pin: true });
    });

    card.addEventListener("mouseleave", () => {
      if (pinnedExperienceCard !== card) {
        closeExperienceMedia(card);
      }
    });
  });
}

if (robot && robotSpeech) {
  const introMessage = robotSpeech.dataset.speech || "";
  let typeTimer;
  let hideTimer;
  let isHoveringRobot = false;
  let lastMoodKey = "";
  const speechIntervalMs = 60000;

  const stopTyping = () => {
    window.clearTimeout(typeTimer);
    window.clearTimeout(hideTimer);
    robotSpeech.classList.remove("is-typing");
  };

  const typeMessage = (message, index = 0) => {
    robotSpeech.textContent = message.slice(0, index);

    if (index >= message.length) {
      robotSpeech.classList.remove("is-typing");
      return;
    }

    const current = message[index] || "";
    const delay = current === "\n" ? 420 : current === "." || current === "!" || current === "?" ? 180 : 55;
    typeTimer = window.setTimeout(() => typeMessage(message, index + 1), delay);
  };

  const speak = (message, { autoHide = false, mood = "" } = {}) => {
    stopTyping();
    if (mood) {
      robot.dataset.mood = mood;
    }
    robot.classList.add("is-speaking");
    robotSpeech.classList.add("is-typing");
    typeMessage(message);

    if (autoHide) {
      const readTime = Math.max(4200, message.length * 42);
      hideTimer = window.setTimeout(() => {
        if (!isHoveringRobot) {
          robot.classList.remove("is-speaking");
          robot.dataset.mood = "idle";
          robotSpeech.textContent = "";
        }
      }, readTime);
    }
  };

  const getRandomThought = () => {
    const moods = window.robotMoods || {};
    const moodKeys = Object.keys(moods).filter((key) => Array.isArray(moods[key].thoughts) && moods[key].thoughts.length);

    if (!moodKeys.length) {
      return null;
    }

    const availableKeys = moodKeys.length > 1 ? moodKeys.filter((key) => key !== lastMoodKey) : moodKeys;
    const moodKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
    const thoughts = moods[moodKey].thoughts;
    lastMoodKey = moodKey;
    return {
      mood: moodKey,
      thought: thoughts[Math.floor(Math.random() * thoughts.length)]
    };
  };

  robot.addEventListener("mouseenter", () => {
    isHoveringRobot = true;
    speak(introMessage, { mood: "happy" });
  });

  robot.addEventListener("mouseleave", () => {
    isHoveringRobot = false;
    stopTyping();
    robot.classList.remove("is-speaking");
    robot.dataset.mood = "idle";
    robotSpeech.textContent = "";
  });

  window.setInterval(() => {
    if (isHoveringRobot) {
      return;
    }

    const randomSpeech = getRandomThought();
    if (randomSpeech) {
      speak(randomSpeech.thought, { autoHide: true, mood: randomSpeech.mood });
    }
  }, speechIntervalMs);
}
