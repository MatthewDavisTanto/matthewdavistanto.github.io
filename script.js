// =====================================================
// MATTHEW DAVIS TANTO — PORTFOLIO
// SCRIPT
// =====================================================


// =====================================================
// 1. SCROLL REVEAL
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
// 2. MARQUEE ENGINE
// =====================================================

function initializeMarquee({
    wrapperSelector,
    trackSelector,
    groupSelector,
    previousSelector,
    nextSelector,
    direction,
    speed
}) {

    document.querySelectorAll(wrapperSelector).forEach((wrapper) => {

        const track =
            wrapper.querySelector(trackSelector);

        const groups =
            track?.querySelectorAll(groupSelector);

        const previousButton =
            wrapper.querySelector(previousSelector);

        const nextButton =
            wrapper.querySelector(nextSelector);


        // -------------------------------------------------
        // Safety check
        // -------------------------------------------------

        if (!track || !groups || groups.length < 2) {
            return;
        }


        // -------------------------------------------------
        // State
        // -------------------------------------------------

        let groupWidth = 0;

        let position = 0;

        let animationFrame = null;

        let isPaused = false;

        let isDragging = false;

        let pointerStartX = 0;

        let positionAtDragStart = 0;

        let resumeTimer = null;


        // -------------------------------------------------
        // Configuration
        // -------------------------------------------------

        const stepMultiplier = 0.45;


        // -------------------------------------------------
        // Touch / pointer behavior
        // -------------------------------------------------

        wrapper.style.touchAction = "pan-y";


        // -------------------------------------------------
        // Measure group
        // -------------------------------------------------

        function measure() {

            const firstGroup =
                groups[0];

            if (!firstGroup) {
                return;
            }

            const rect =
                firstGroup.getBoundingClientRect();

            const trackStyles =
                window.getComputedStyle(track);

            const gap =
                parseFloat(trackStyles.columnGap) ||
                parseFloat(trackStyles.gap) ||
                0;

            groupWidth =
                rect.width + gap;

        }


        // -------------------------------------------------
        // Normalize position
        // -------------------------------------------------

        function normalizePosition() {

            if (groupWidth <= 0) {
                return;
            }


            /*
                Forward:
                0 → -groupWidth → 0

                Reverse:
                -groupWidth → 0 → -groupWidth
            */

            while (position <= -groupWidth) {

                position += groupWidth;

            }

            while (position > 0) {

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
        // Initial position
        // -------------------------------------------------

        function initializePosition() {

            /*
                For the reverse marquee we begin on the
                second group so the animation can move
                toward the first group without showing
                an empty area.
            */

            if (direction === 1) {

                position = -groupWidth;

            } else {

                position = 0;

            }

            normalizePosition();

            render();

        }


        // -------------------------------------------------
        // Animation
        // -------------------------------------------------

        function animate() {

            if (!isPaused && !isDragging) {

                position +=
                    speed * direction;

                normalizePosition();

                render();

            }

            animationFrame =
                requestAnimationFrame(animate);

        }


        // -------------------------------------------------
        // Pause
        // -------------------------------------------------

        function pause() {

            isPaused = true;

        }


        // -------------------------------------------------
        // Resume
        // -------------------------------------------------

        function resume() {

            if (!isDragging) {

                isPaused = false;

            }

        }


        // -------------------------------------------------
        // Hover
        // -------------------------------------------------

        wrapper.addEventListener(
            "mouseenter",
            pause
        );


        wrapper.addEventListener(
            "mouseleave",
            () => {

                if (!isDragging) {

                    resume();

                }

            }
        );


        // -------------------------------------------------
        // Manual movement
        // -------------------------------------------------

        function moveBy(amount) {

            position += amount;

            normalizePosition();

            render();

        }


        // -------------------------------------------------
        // Next
        // -------------------------------------------------

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    pause();

                    moveBy(
                        direction *
                        groupWidth *
                        stepMultiplier
                    );

                }
            );

        }


        // -------------------------------------------------
        // Previous
        // -------------------------------------------------

        if (previousButton) {

            previousButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    pause();

                    moveBy(
                        -direction *
                        groupWidth *
                        stepMultiplier
                    );

                }
            );

        }


        // =================================================
        // 3. POINTER DRAG
        // =================================================

        wrapper.addEventListener(
            "pointerdown",
            (event) => {

                /*
                    Ignore arrow controls.
                */

                if (
                    event.target.closest(
                        ".marquee-control, .experience-marquee-control"
                    )
                ) {

                    return;

                }


                clearTimeout(resumeTimer);


                isDragging = true;

                isPaused = true;


                pointerStartX =
                    event.clientX;

                positionAtDragStart =
                    position;


                wrapper.setPointerCapture(
                    event.pointerId
                );


                wrapper.style.cursor =
                    "grabbing";

            }
        );


        wrapper.addEventListener(
            "pointermove",
            (event) => {

                if (!isDragging) {
                    return;
                }


                const delta =
                    event.clientX -
                    pointerStartX;


                position =
                    positionAtDragStart +
                    delta;


                normalizePosition();

                render();

            }
        );


        function endPointerDrag(event) {

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
                Small delay before autoplay resumes.
            */

            clearTimeout(resumeTimer);


            resumeTimer =
                setTimeout(() => {

                    if (!wrapper.matches(":hover")) {

                        isPaused = false;

                    }

                }, 550);

        }


        wrapper.addEventListener(
            "pointerup",
            endPointerDrag
        );


        wrapper.addEventListener(
            "pointercancel",
            endPointerDrag
        );


        // =================================================
        // 4. KEYBOARD ACCESS
        // =================================================

        wrapper.addEventListener(
            "keydown",
            (event) => {

                /*
                    Allow users who focus the marquee
                    to use arrow keys.
                */

                if (event.key === "ArrowLeft") {

                    event.preventDefault();

                    pause();

                    moveBy(
                        -groupWidth *
                        stepMultiplier
                    );

                }


                if (event.key === "ArrowRight") {

                    event.preventDefault();

                    pause();

                    moveBy(
                        groupWidth *
                        stepMultiplier
                    );

                }

            }
        );


        // =================================================
        // 5. RESIZE
        // =================================================

        let resizeTimer = null;


        window.addEventListener(
            "resize",
            () => {

                clearTimeout(resizeTimer);


                resizeTimer =
                    setTimeout(() => {

                        measure();

                        normalizePosition();

                        render();

                    }, 120);

            }
        );


        // =================================================
        // 6. INITIALIZE
        // =================================================

        measure();

        initializePosition();

        animationFrame =
            requestAnimationFrame(animate);

    });

}


// =====================================================
// 7. TECHNOLOGY MARQUEE
//    Right → Left
// =====================================================

initializeMarquee({

    wrapperSelector: ".marquee-wrapper",

    trackSelector: ".marquee-track",

    groupSelector: ".marquee-group",

    previousSelector: ".marquee-control-prev",

    nextSelector: ".marquee-control-next",

    direction: -1,

    speed: 0.42

});


// =====================================================
// 8. EXPERIENCE MARQUEE
//    Left → Right
// =====================================================

initializeMarquee({

    wrapperSelector:
        ".experience-marquee-wrapper",

    trackSelector:
        ".experience-marquee-track",

    groupSelector:
        ".experience-marquee-group",

    previousSelector:
        ".experience-marquee-prev",

    nextSelector:
        ".experience-marquee-next",

    direction: 1,

    speed: 0.32

});
