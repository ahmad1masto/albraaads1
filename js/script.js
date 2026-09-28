/* =========================================================
   AlbaraaAds — التفاعل الرئيسي للموقع
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;

    /* السنة */
    const currentYear = document.getElementById("currentYear");
    if (currentYear) currentYear.textContent = new Date().getFullYear();

    /* التنقل الجانبي */
    const sideLinks = document.querySelectorAll(".side-link");
    const sections = document.querySelectorAll("main section[id]");

    sideLinks.forEach(link => {
        link.addEventListener("click", () => {
            sideLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");
        });
    });

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;

            sideLinks.forEach(link => {
                link.classList.toggle("active", link.dataset.section === id);
            });

            topNavLinks.forEach(link => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
        });
    }, {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));

    /* ظهور العناصر */
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    /* =====================================================
       الشريط العلوي — حركة وتفاعل
    ===================================================== */
    const topHeader = document.querySelector(".top-header");
    const topMenu = document.querySelector(".top-menu");
    const topNavLinks = document.querySelectorAll(".top-menu a[href^='#']");

    const setActiveTopLink = id => {
        topNavLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
    };

    topNavLinks.forEach(link => {
        link.addEventListener("click", () => {
            topNavLinks.forEach(item => item.classList.remove("nav-clicked"));
            link.classList.add("nav-clicked");

            const targetId = link.getAttribute("href");
            if (targetId) setActiveTopLink(targetId.slice(1));

            setTimeout(() => link.classList.remove("nav-clicked"), 500);
        });

        link.addEventListener("pointermove", event => {
            if (window.innerWidth < 901) return;
            const rect = link.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            link.style.transform = `translate(${x * 3}px, ${-2 + y * 2}px)`;
        });

        link.addEventListener("pointerleave", () => {
            link.style.transform = "";
        });
    });

    /* FAQ */
    document.querySelectorAll(".faq-item").forEach(item => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!question || !answer) return;

        question.addEventListener("click", () => {
            const open = item.classList.contains("open");

            document.querySelectorAll(".faq-item.open").forEach(other => {
                other.classList.remove("open");
                const a = other.querySelector(".faq-answer");
                if (a) a.style.maxHeight = null;
            });

            if (!open) {
                item.classList.add("open");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    /* نموذج التواصل */
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            const name = document.getElementById("name")?.value.trim() || "";
            const phone = document.getElementById("phone")?.value.trim() || "";
            const message = document.getElementById("message")?.value.trim() || "";

            if (name.length < 2 || phone.length < 5 || message.length < 5) {
                if (formMessage) {
                    formMessage.className = "form-message error";
                    formMessage.textContent = "يرجى تعبئة البيانات المطلوبة بشكل صحيح.";
                }
                return;
            }

            if (formMessage) {
                formMessage.className = "form-message success";
                formMessage.textContent = "تم استلام طلبك بنجاح. سنتواصل معك لمتابعة التفاصيل.";
            }

            contactForm.reset();
        });
    }

    /* زر العودة للأعلى + شريط تقدم */
    const backToTop = document.getElementById("backToTop");

    const updateScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? (window.scrollY / max) * 100 : 0;

        root.style.setProperty("--scroll-progress", `${progress}%`);
        root.style.setProperty("--scroll-y", `${window.scrollY}px`);

        if (backToTop) {
            backToTop.classList.toggle("show", window.scrollY > 500);
        }

        topHeader?.classList.toggle("nav-scrolled", window.scrollY > 25);
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    backToTop?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* الخلفية تتفاعل مع المؤشر */
    let pointerRAF = null;

    window.addEventListener("pointermove", event => {
        if (pointerRAF) cancelAnimationFrame(pointerRAF);

        pointerRAF = requestAnimationFrame(() => {
            const x = (event.clientX / window.innerWidth) * 100;
            const y = (event.clientY / window.innerHeight) * 100;

            root.style.setProperty("--mouse-x", `${x}%`);
            root.style.setProperty("--mouse-y", `${y}%`);
        });
    }, { passive: true });

    /* عدادات */
    const counters = document.querySelectorAll(".counter");

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const target = Number(el.dataset.target || 0);
            const duration = 1100;
            const start = performance.now();

            const tick = now => {
                const progress = Math.min(1, (now - start) / duration);
                const value = Math.floor(
                    target * (1 - Math.pow(1 - progress, 3))
                );

                el.textContent = value;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target;
                }
            };

            requestAnimationFrame(tick);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    /* حركة البطاقات */
    const interactiveCards = document.querySelectorAll(
        ".social-platform-card, .review-card, .portfolio-card, .offer-card, " +
        ".service-box, .about-card, .product-gallery-card"
    );

    interactiveCards.forEach(card => {
        card.addEventListener("pointermove", event => {
            if (window.innerWidth < 900) return;

            const rect = card.getBoundingClientRect();
            const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -3.5;
            const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 3.5;

            card.style.setProperty("--tilt-x", `${rotateX}deg`);
            card.style.setProperty("--tilt-y", `${rotateY}deg`);
            card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
            card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
        });

        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--tilt-x", "0deg");
            card.style.setProperty("--tilt-y", "0deg");
        });
    });

    /* موجة عند الضغط */
    document.querySelectorAll(".btn, .offer-btn, .header-cta").forEach(button => {
        button.addEventListener("click", event => {
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement("span");

            ripple.className = "click-ripple";
            ripple.style.left = `${event.clientX - rect.left}px`;
            ripple.style.top = `${event.clientY - rect.top}px`;

            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        });
    });

    /* القائمة على الهاتف */
    const mobileButton = document.getElementById("mobileMenuBtn");

    const closeMobileMenu = () => {
        topMenu?.classList.remove("mobile-open");
        mobileButton?.classList.remove("open");
        document.body.classList.remove("menu-open");
    };

    mobileButton?.addEventListener("click", () => {
        const open = !topMenu?.classList.contains("mobile-open");
        topMenu?.classList.toggle("mobile-open", open);
        mobileButton.classList.toggle("open", open);
        document.body.classList.toggle("menu-open", open);
    });

    document.addEventListener("click", event => {
        if (!topMenu?.classList.contains("mobile-open")) return;
        if (topMenu.contains(event.target) || mobileButton?.contains(event.target)) return;
        closeMobileMenu();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMobileMenu();
    });

    topMenu?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    /* الصور: fallback بصري إذا تعذر تحميل مصدر خارجي */
    document.querySelectorAll("img").forEach(img => {
        img.addEventListener("error", () => {
            img.classList.add("image-failed");
            img.alt = "صورة المنتج";
        }, { once: true });
    });

    /* =====================================================
       خلفية متحركة تلقائياً على الهاتف
       تعمل حتى بدون حركة المؤشر
    ===================================================== */
    let ambientRAF = null;
    let ambientStart = performance.now();

    const animateMobileBackground = now => {
        if (window.innerWidth > 900) return;

        const t = (now - ambientStart) * 0.00018;
        const x = 50 + Math.sin(t * 1.15) * 18;
        const y = 50 + Math.cos(t * 0.9) * 16;
        const driftX = Math.sin(t * 1.7) * 12;
        const driftY = Math.cos(t * 1.25) * 10;

        root.style.setProperty("--mobile-bg-x", `${x}%`);
        root.style.setProperty("--mobile-bg-y", `${y}%`);
        root.style.setProperty("--mobile-drift-x", `${driftX}px`);
        root.style.setProperty("--mobile-drift-y", `${driftY}px`);

        ambientRAF = requestAnimationFrame(animateMobileBackground);
    };

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        ambientRAF = requestAnimationFrame(animateMobileBackground);
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900 && ambientRAF) {
            cancelAnimationFrame(ambientRAF);
            ambientRAF = null;
        } else if (window.innerWidth <= 900 && !ambientRAF && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            ambientStart = performance.now();
            ambientRAF = requestAnimationFrame(animateMobileBackground);
        }
    }, { passive: true });

    /* اهتزاز/ضغط خفيف للأزرار والبطاقات على الهاتف */
    document.querySelectorAll(".btn, .offer-btn, .product-gallery-card, .service-box, .portfolio-card").forEach(el => {
        el.addEventListener("touchstart", () => el.classList.add("touch-active"), { passive: true });
        el.addEventListener("touchend", () => {
            setTimeout(() => el.classList.remove("touch-active"), 180);
        }, { passive: true });
    });

    /* احترام تقليل الحركة */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root.style.scrollBehavior = "auto";
        document.body.classList.add("reduce-motion");
    }
});
