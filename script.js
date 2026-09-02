const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
const topbar = document.querySelector(".topbar");
const topBtn = document.querySelector("#topBtn");

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  topbar.classList.toggle("scrolled", window.scrollY > 30);
  topBtn.classList.toggle("show", window.scrollY > 500);
});

topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* Reveal sections on scroll */
const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach(item => observer.observe(item));

/* Music player */
const audio = document.querySelector("#audio");
const playBtn = document.querySelector("#playBtn");
const progress = document.querySelector("#progress");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const backBtn = document.querySelector("#backBtn");
const forwardBtn = document.querySelector("#forwardBtn");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

playBtn?.addEventListener("click", async () => {
  if (!audio) return;

  if (audio.paused) {
    try {
      await audio.play();
      playBtn.textContent = "Ⅱ";
    } catch (error) {
      console.log("Add your MP3 file to music/our-song.mp3 first.");
    }
  } else {
    audio.pause();
    playBtn.textContent = "▶";
  }
});

audio?.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio?.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audio.currentTime);

  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});

progress?.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

backBtn?.addEventListener("click", () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

forwardBtn?.addEventListener("click", () => {
  audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
});

audio?.addEventListener("ended", () => {
  playBtn.textContent = "▶";
  progress.value = 0;
});

/* Gentle hero parallax on larger screens */
window.addEventListener("scroll", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const heroImage = document.querySelector(".hero-image");
  if (!heroImage || window.innerWidth < 760) return;

  const offset = Math.min(window.scrollY * 0.12, 80);
  heroImage.style.transform = `translateY(${offset}px)`;
});

/* =========================
   AUTO PLAY MUSIC
========================= */

window.addEventListener("load", async () => {
  if (!audio) return;

  try {
    await audio.play();

    playBtn.textContent = "Ⅱ";

  } catch (error) {
    console.log("Autoplay blocked by browser.");

    // لو المتصفح منع التشغيل التلقائي،
    // أول لمسة/ضغطة في الصفحة تشغل الأغنية.
    const startMusicOnInteraction = async () => {
      try {
        await audio.play();
        playBtn.textContent = "Ⅱ";

        document.removeEventListener("click", startMusicOnInteraction);
        document.removeEventListener("touchstart", startMusicOnInteraction);
      } catch (error) {
        console.log("Music could not start.");
      }
    };

    document.addEventListener("click", startMusicOnInteraction, {
      once: true
    });

    document.addEventListener("touchstart", startMusicOnInteraction, {
      once: true
    });
  }
});
window.addEventListener("load", () => {
    if (!audio) return;

    audio.muted = false;

    audio.play()
        .then(() => {
            playBtn.textContent = "Ⅱ";
        })
        .catch(() => {
            console.log("Browser blocked autoplay.");
        });
});