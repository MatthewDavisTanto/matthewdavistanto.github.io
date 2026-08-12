// =====================================================
// SIMPLE SCROLL REVEAL
// =====================================================

const revealElements = document.querySelectorAll(
    ".section, .project-card, .skill-group, .contact-link"
);

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element) => {

    element.classList.add("reveal");

    observer.observe(element);

});
