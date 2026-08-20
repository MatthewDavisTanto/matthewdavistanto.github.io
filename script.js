// =====================================================
// SCROLL REVEAL
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


// =====================================================
// INFINITE MARQUEE
// =====================================================

document.querySelectorAll(".marquee-wrapper").forEach((wrapper) => {

    const track = wrapper.querySelector(".marquee-track");
    const groups = track.querySelectorAll(".marquee-group");

    const previousButton =
        wrapper.querySelector(".marquee-control-prev");

    const nextButton =
        wrapper.querySelector(".marquee-control-next");


    // -------------------------------------------------
    // Safety check
    // -------------------------------------------------

    if (!track || groups.length < 2) {
        return;
    }


    // -------------------------------------------------
    // Configuration
    // -------------------------------------------------

    const direction =
        track.classList.contains("marquee-track-reverse")
            ? 1
            : -1;

    const speed = 0.45;

    let position = 0;

    let groupWidth = 0;

    let isPaused = false;

    let isDragging = false;

    let startPointerX = 0;

    let startPosition = 0;

    let animationFrame = null;


    // -------------------------------------------------
    // Measure the first group
    // -------------------------------------------------

    function measure() {

        groupWidth = groups[0].getBoundingClientRect().width;

        /*
            The gap between two groups is part of the
            track layout, so we calculate it separately.
        */

        const trackStyles = window.getComputedStyle(track);

        const gap = parseFloat(trackStyles.gap) || 0;

        groupWidth += gap;
    }


    // -------------------------------------------------
    // Normalize position
    // -------------------------------------------------

    function normalizePosition() {

        if (groupWidth <= 0) {
            return;
        }


        /*
            Left-to-right / right-to-left loop.

            We keep position inside exactly one group width.
            This prevents the visible "reset" effect.
        */

        while (position <= -groupWidth) {

            position += groupWidth;

        }

        while (position >= groupWidth) {

            position -= groupWidth;

        }

    }


    // -------------------------------------------------
    // Render
    // -------------------------------------------------

    function render() {

        track.style.transform =
            `translate3d(${position}px, 0, 0)`;

    }


    // -------------------------------------------------
    // Animation loop
    // -------------------------------------------------

    function animate() {

        if (!isPaused && !isDragging) {

            position += speed * direction;

            normalizePosition();

            render();

        }

        animationFrame =
            requestAnimationFrame(animate);

    }


    // -------------------------------------------------
    // Pause / Resume
    // -------------------------------------------------

    wrapper.addEventListener("mouseenter", () => {

        isPaused = true;

    });


    wrapper.addEventListener("mouseleave", () => {

        if (!isDragging) {

            isPaused = false;

        }

    });


    // -------------------------------------------------
    // Manual movement
    // -------------------------------------------------

    function moveBy(amount) {

        position += amount;

        normalizePosition();

        render();

    }


    // -------------------------------------------------
    // Previous button
    // -------------------------------------------------

    if (previousButton) {

        previousButton.addEventListener("click", (event) => {

            event.preventDefault();

            moveBy(direction === -1
                ? groupWidth * 0.45
                : -groupWidth * 0.45
            );

        });

    }


    // -------------------------------------------------
    // Next button
    // -------------------------------------------------

    if (nextButton) {

        nextButton.addEventListener("click", (event) => {

            event.preventDefault();

            moveBy(direction === -1
                ? -groupWidth * 0.45
                : groupWidth * 0.45
            );

        });

    }


    // =================================================
    // MOUSE DRAG
    // =================================================

    wrapper.addEventListener("pointerdown", (event) => {

        /*
            Don't start dragging when clicking directly
            on one of the control buttons.
        */

        if (
            event.target.closest(".marquee-control")
        ) {
            return;
        }


        isDragging = true;

        isPaused = true;

        startPointerX = event.clientX;

        startPosition = position;

        wrapper.setPointerCapture(event.pointerId);

        wrapper.style.cursor = "grabbing";

    });


    wrapper.addEventListener("pointermove", (event) => {

        if (!isDragging) {
            return;
        }

        const delta =
            event.clientX - startPointerX;

        position =
            startPosition + delta;

        normalizePosition();

        render();

    });


    function stopDragging(event) {

        if (!isDragging) {
            return;
        }

        isDragging = false;

        wrapper.style.cursor = "";

        try {

            wrapper.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {
            // Pointer capture may already be released.
        }

        /*
            Resume autoplay after a short delay.
            This makes manual dragging feel deliberate.
        */

        setTimeout(() => {

            if (!wrapper.matches(":hover")) {

                isPaused = false;

            }

        }, 450);

    }


    wrapper.addEventListener(
        "pointerup",
        stopDragging
    );

    wrapper.addEventListener(
        "pointercancel",
        stopDragging
    );


    // =================================================
    // TOUCH / SWIPE
    // =================================================

    wrapper.addEventListener(
        "touchstart",
        (event) => {

            if (
                event.target.closest(".marquee-control")
            ) {
                return;
            }

            isDragging = true;

            isPaused = true;

            startPointerX =
                event.touches[0].clientX;

            startPosition =
                position;

        },
        {
            passive: true
        }
    );


    wrapper.addEventListener(
        "touchmove",
        (event) => {

            if (!isDragging) {
                return;
            }

            const currentX =
                event.touches[0].clientX;

            const delta =
                currentX - startPointerX;

            position =
                startPosition + delta;

            normalizePosition();

            render();

        },
        {
            passive: true
        }
    );


    wrapper.addEventListener(
        "touchend",
        () => {

            isDragging = false;

            setTimeout(() => {

                isPaused = false;

            }, 450);

        }
    );


    // =================================================
    // RESIZE
    // =================================================

    window.addEventListener(
        "resize",
        () => {

            /*
                Re-measure the group because item widths
                can change on responsive breakpoints.
            */

            measure();

            normalizePosition();

            render();

        }
    );


    // =================================================
    // INITIALIZE
    // =================================================

    measure();

    normalizePosition();

    render();

    animationFrame =
        requestAnimationFrame(animate);

});
