document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // ===== 1. HERO ENTRANCE =====
    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
        .to(".hero-bg", { scale: 1, duration: 3, ease: "power2.out" }, 0)
        .fromTo(".hero-eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 0.5)
        .fromTo(".hero-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: "power3.out" }, 0.7)
        .fromTo(".hero-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 1.0)
        .fromTo(".hero-bottom", { opacity: 0 }, { opacity: 1, duration: 1.5 }, 1.5);

    // ===== 2. HERO PARALLAX =====
    gsap.to(".hero-bg", {
        y: "20%",
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // ===== 3. FADE-UP ELEMENTS =====
    document.querySelectorAll(".anim-up").forEach(el => {
        gsap.fromTo(el,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 88%" }
            }
        );
    });

    // ===== 4. IMAGE REVEAL MASKS =====
    document.querySelectorAll(".img-reveal").forEach(mask => {
        gsap.fromTo(mask,
            { clipPath: "inset(100% 0 0 0)" },
            {
                clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "power3.inOut",
                scrollTrigger: { trigger: mask, start: "top 85%" }
            }
        );
        const img = mask.querySelector(".par-img");
        if (img) {
            gsap.fromTo(img,
                { y: -30, scale: 1.05 },
                {
                    y: 30, scale: 1, ease: "none",
                    scrollTrigger: { trigger: mask, start: "top bottom", end: "bottom top", scrub: true }
                }
            );
        }
    });

    // ===== 5. IMAGE BREAK PARALLAX =====
    document.querySelectorAll(".image-break-bg").forEach(bg => {
        gsap.fromTo(bg,
            { y: "-5%" },
            {
                y: "5%", ease: "none",
                scrollTrigger: {
                    trigger: bg.closest(".image-break"),
                    start: "top bottom", end: "bottom top", scrub: true
                }
            }
        );
    });

    // ===== 6. DIVIDER LINES =====
    document.querySelectorAll(".divider-line").forEach(line => {
        gsap.to(line, {
            scaleX: 1, duration: 1.2, ease: "power2.inOut",
            scrollTrigger: { trigger: line, start: "top 90%" }
        });
    });

    // ===== 7. TYPEWRITER EFFECT =====
    const twEl = document.getElementById("typewriter-text");
    if (twEl) {
        const fullText = twEl.textContent;
        twEl.textContent = "";
        twEl.classList.add("typing");
        let triggered = false;

        ScrollTrigger.create({
            trigger: ".atmosphere-section",
            start: "top 60%",
            onEnter: () => {
                if (triggered) return;
                triggered = true;
                let i = 0;
                const interval = setInterval(() => {
                    twEl.textContent += fullText[i];
                    i++;
                    if (i >= fullText.length) {
                        clearInterval(interval);
                        // Remove cursor after typing finishes
                        setTimeout(() => twEl.classList.remove("typing"), 600);
                    }
                }, 60);
            }
        });
    }

    // ===== 8. COUNTDOWN TIMER =====
    const targetDate = new Date("2026-03-23T19:00:00+05:00");

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            document.getElementById("cd-days").textContent = "00";
            document.getElementById("cd-hours").textContent = "00";
            document.getElementById("cd-mins").textContent = "00";
            document.getElementById("cd-secs").textContent = "00";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        document.getElementById("cd-days").textContent = String(days).padStart(2, "0");
        document.getElementById("cd-hours").textContent = String(hours).padStart(2, "0");
        document.getElementById("cd-mins").textContent = String(mins).padStart(2, "0");
        document.getElementById("cd-secs").textContent = String(secs).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ===== 9. AUDIO (volume lowered) =====
    const soundBtn = document.getElementById("sound-toggle");
    const soundStatus = document.getElementById("sound-status");
    const audio = document.getElementById("bg-audio");
    audio.volume = 0.3; // Lower volume
    let playing = false;

    soundBtn.addEventListener("click", () => {
        if (playing) {
            audio.pause();
            soundStatus.textContent = "OFF";
            soundStatus.classList.remove("active");
        } else {
            audio.play();
            soundStatus.textContent = "ON";
            soundStatus.classList.add("active");
        }
        playing = !playing;
    });

    // ===== 10. RSVP FORM SUBMISSION =====
    const form = document.getElementById("rsvp-form");
    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault();
            const submitBtn = form.querySelector('.btn-submit');
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            const url = "https://script.google.com/macros/s/AKfycbyl2mLyTpOdN1i4QmSNaWdlj-U7fICGeOnwdbMJ6xZVN5FxVCWji8eZDUCQWeMcKArk9g/exec";

            fetch(url, {
                method: "POST",
                body: new FormData(form)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.result === "success") {
                        submitBtn.textContent = 'Принято ✓';
                    } else {
                        submitBtn.textContent = 'Ошибка, попробуйте еще раз';
                        submitBtn.disabled = false;
                    }
                })
                .catch(error => {
                    console.error("Error!", error.message);
                    submitBtn.textContent = 'Ошибка, попробуйте еще раз';
                    submitBtn.disabled = false;
                });
        });
    }
});
