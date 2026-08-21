// =====================================================
// SHOPEE A/B TESTING — IMAGE VIEWER
// Zoom + Pan + Boundary Control
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


    // =================================================
    // HELPERS
    // =================================================


    function updateZoomLabel() {

        resetButton.textContent =
            `${Math.round(scale * 100)}%`;

    }


    function getBounds() {

        const viewerWidth =
            viewer.clientWidth;

        const viewerHeight =
            viewer.clientHeight;


        const imageWidth =
            image.clientWidth * scale;

        const imageHeight =
            image.clientHeight * scale;


        /*
            How much the image exceeds the viewer.

            Example:

            Viewer = 1000px
            Image   = 1500px

            Maximum horizontal movement:

            (1500 - 1000) / 2
            = 250px
        */

        const maxX =
            Math.max(
                0,
                (imageWidth - viewerWidth) / 2
            );


        const maxY =
            Math.max(
                0,
                (imageHeight - viewerHeight) / 2
            );


        return {
            maxX,
            maxY
        };

    }


    function clampPosition() {

        const {
            maxX,
            maxY
        } = getBounds();


        translateX =
            Math.max(
                -maxX,
                Math.min(
                    translateX,
                    maxX
                )
            );


        translateY =
            Math.max(
                -maxY,
                Math.min(
                    translateY,
                    maxY
                )
            );

    }


    function updateTransform() {

        clampPosition();


        image.style.transform =
            `translate3d(
                ${translateX}px,
                ${translateY}px,
                0
            ) scale(${scale})`;

    }


    // =================================================
    // ZOOM
    // =================================================


    function setZoom(newScale) {

        scale =
            Math.max(
                MIN_SCALE,
                Math.min(
                    newScale,
                    MAX_SCALE
                )
            );


        /*
            When returning to 100%,
            completely recenter the image.
        */

        if (scale === 1) {

            translateX = 0;

            translateY = 0;

        }


        clampPosition();

        updateTransform();

        updateZoomLabel();


        image.style.cursor =
            scale > 1
                ? "grab"
                : "default";

    }


    // -------------------------------------------------
    // Zoom In
    // -------------------------------------------------

    zoomInButton.addEventListener(
        "click",
        () => {

            setZoom(
                scale + ZOOM_STEP
            );

        }
    );


    // -------------------------------------------------
    // Zoom Out
    // -------------------------------------------------

    zoomOutButton.addEventListener(
        "click",
        () => {

            setZoom(
                scale - ZOOM_STEP
            );

        }
    );


    // -------------------------------------------------
    // Reset
    // -------------------------------------------------

    resetButton.addEventListener(
        "click",
        () => {

            setZoom(1);

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
                event.clientX - startX;


            const deltaY =
                event.clientY - startY;


            translateX =
                startTranslateX + deltaX;


            translateY =
                startTranslateY + deltaY;


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
            scale > 1
                ? "grab"
                : "default";

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
    // Prevent native image dragging
    // -------------------------------------------------

    image.addEventListener(
        "dragstart",
        (event) => {

            event.preventDefault();

        }
    );


    // =================================================
    // RESIZE
    // =================================================

    window.addEventListener(
        "resize",
        () => {

            clampPosition();

            updateTransform();

        }
    );


    // =================================================
    // INITIAL STATE
    // =================================================

    setZoom(1);

});
