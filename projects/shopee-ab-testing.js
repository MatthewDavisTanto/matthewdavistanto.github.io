// =====================================================
// SHOPEE A/B TESTING — IMAGE VIEWER
// Zoom + Pan
// =====================================================


document.querySelectorAll(".design-image-viewer").forEach((viewer) => {

    const image =
        viewer.querySelector(".zoomable-design-image");

    const zoomInButton =
        viewer.querySelector(".zoom-in");

    const zoomOutButton =
        viewer.querySelector(".zoom-out");

    const resetButton =
        viewer.querySelector(".zoom-reset");


    // -------------------------------------------------
    // Safety check
    // -------------------------------------------------

    if (
        !image ||
        !zoomInButton ||
        !zoomOutButton ||
        !resetButton
    ) {
        return;
    }


    // -------------------------------------------------
    // State
    // -------------------------------------------------

    let scale = 1;

    let translateX = 0;

    let translateY = 0;

    let isDragging = false;

    let startX = 0;

    let startY = 0;

    let startTranslateX = 0;

    let startTranslateY = 0;


    // -------------------------------------------------
    // Configuration
    // -------------------------------------------------

    const MIN_SCALE = 1;

    const MAX_SCALE = 3;

    const ZOOM_STEP = 0.25;


    // -------------------------------------------------
    // Update zoom label
    // -------------------------------------------------

    function updateZoomLabel() {

        resetButton.textContent =
            `${Math.round(scale * 100)}%`;

    }


    // -------------------------------------------------
    // Apply transform
    // -------------------------------------------------

    function updateTransform() {

        image.style.transform =
            `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;

    }


    // -------------------------------------------------
    // Reset
    // -------------------------------------------------

    function resetZoom() {

        scale = 1;

        translateX = 0;

        translateY = 0;

        image.style.cursor = "default";

        updateTransform();

        updateZoomLabel();

    }


    // -------------------------------------------------
    // Zoom In
    // -------------------------------------------------

    zoomInButton.addEventListener(
        "click",
        () => {

            scale =
                Math.min(
                    scale + ZOOM_STEP,
                    MAX_SCALE
                );

            if (scale > 1) {

                image.style.cursor =
                    "grab";

            }

            updateTransform();

            updateZoomLabel();

        }
    );


    // -------------------------------------------------
    // Zoom Out
    // -------------------------------------------------

    zoomOutButton.addEventListener(
        "click",
        () => {

            scale =
                Math.max(
                    scale - ZOOM_STEP,
                    MIN_SCALE
                );


            /*
                When returning to 100%,
                reset the image position.
            */

            if (scale === 1) {

                translateX = 0;

                translateY = 0;

                image.style.cursor =
                    "default";

            }

            updateTransform();

            updateZoomLabel();

        }
    );


    // -------------------------------------------------
    // Reset Button
    // -------------------------------------------------

    resetButton.addEventListener(
        "click",
        () => {

            resetZoom();

        }
    );


    // =================================================
    // DRAG / PAN
    // =================================================


    image.addEventListener(
        "pointerdown",
        (event) => {

            if (scale <= 1) {
                return;
            }


            isDragging = true;


            startX =
                event.clientX;

            startY =
                event.clientY;


            startTranslateX =
                translateX;

            startTranslateY =
                translateY;


            image.setPointerCapture(
                event.pointerId
            );


            image.style.cursor =
                "grabbing";


            event.preventDefault();

        }
    );


    image.addEventListener(
        "pointermove",
        (event) => {

            if (!isDragging) {
                return;
            }


            const deltaX =
                event.clientX -
                startX;


            const deltaY =
                event.clientY -
                startY;


            translateX =
                startTranslateX +
                deltaX;


            translateY =
                startTranslateY +
                deltaY;


            updateTransform();

        }
    );


    function stopDragging(event) {

        if (!isDragging) {
            return;
        }


        isDragging = false;


        try {

            image.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {

            // Pointer capture may already be released.

        }


        image.style.cursor =
            "grab";

    }


    image.addEventListener(
        "pointerup",
        stopDragging
    );


    image.addEventListener(
        "pointercancel",
        stopDragging
    );


    // -------------------------------------------------
    // Prevent browser image dragging
    // -------------------------------------------------

    image.addEventListener(
        "dragstart",
        (event) => {

            event.preventDefault();

        }
    );


    // -------------------------------------------------
    // Initial state
    // -------------------------------------------------

    resetZoom();

});
