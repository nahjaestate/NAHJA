/* =====================================================
   MARSA JEDDAH
   SCROLL IMAGE SEQUENCE
===================================================== */


/* =====================================================
   CANVAS
===================================================== */

const canvas =
    document.getElementById("sequenceCanvas");

const ctx =
    canvas.getContext("2d");


/* =====================================================
   IMAGES

   fal.js موجود داخل:
   fal/src/

   الصور موجودة داخل:
   fal/Sketsh/

   لذلك نستخدم:
   ../Sketsh/
===================================================== */

const frameSources = [
    "./Sketsh/1.png",
    "./Sketsh/2.png",
    "./Sketsh/3.png",
    "./Sketsh/4.png",
    "./Sketsh/5.png",
    "./Sketsh/6.png"
];

const frames = [];


/* =====================================================
   VARIABLES
===================================================== */

let loadedImages = 0;

let failedImages = 0;


let currentProgress = 0;

let targetProgress = 0;


let mouseX = 0;

let mouseY = 0;


let targetMouseX = 0;

let targetMouseY = 0;


let websiteStarted = false;


/* =====================================================
   LOAD IMAGES
===================================================== */

frameSources.forEach(

    (source, index) => {

        const image =
            new Image();


        image.src =
            source;


        image.onload =
            function () {

                loadedImages++;

                frames[index] =
                    image;

                console.log(
                    `تم تحميل الصورة: ${source}`
                );

                checkImages();

            };


        image.onerror =
            function () {

                failedImages++;

                console.error(
                    `تعذر تحميل الصورة: ${source}`
                );

                checkImages();

            };

    }

);


/* =====================================================
   CHECK LOADING

   حتى لو صورة فشلت،
   الموقع لن يبقى عالقًا في شاشة Loading.
===================================================== */

function checkImages() {

    const finished =

        loadedImages +
        failedImages;


    if (

        finished ===
        frameSources.length

    ) {

        startWebsite();

    }

}


/* =====================================================
   START WEBSITE
===================================================== */

function startWebsite() {

    if (websiteStarted) {
        return;
    }


    websiteStarted = true;


    resizeCanvas();


    updateScroll();


    animate();


    setTimeout(

        () => {

            const loader =
                document.getElementById(
                    "loader"
                );


            loader.classList.add(
                "hidden"
            );

        },

        600

    );

}


/* =====================================================
   CANVAS SIZE
===================================================== */

function resizeCanvas() {

    const dpr =

        Math.min(

            window.devicePixelRatio
            || 1,

            2

        );


    canvas.width =

        window.innerWidth *
        dpr;


    canvas.height =

        window.innerHeight *
        dpr;


    canvas.style.width =

        window.innerWidth
        + "px";


    canvas.style.height =

        window.innerHeight
        + "px";


    ctx.setTransform(

        dpr,

        0,

        0,

        dpr,

        0,

        0

    );

}


/* =====================================================
   DRAW IMAGE AS COVER
===================================================== */

function drawCover(

    image,

    alpha = 1,

    zoom = 1

) {

    if (

        !image
        ||
        !image.complete

    ) {

        return;

    }


    const screenWidth =
        window.innerWidth;


    const screenHeight =
        window.innerHeight;


    const imageWidth =
        image.naturalWidth;


    const imageHeight =
        image.naturalHeight;


    const scale =

        Math.max(

            screenWidth /
            imageWidth,

            screenHeight /
            imageHeight

        )

        * zoom;


    const width =
        imageWidth *
        scale;


    const height =
        imageHeight *
        scale;


    /*
       حركة خفيفة مع الماوس
    */

    const moveX =
        mouseX * 12;


    const moveY =
        mouseY * 8;


    const x =

        (
            screenWidth
            -
            width
        )

        / 2

        + moveX;


    const y =

        (
            screenHeight
            -
            height
        )

        / 2

        + moveY;


    ctx.globalAlpha =
        alpha;


    ctx.drawImage(

        image,

        x,

        y,

        width,

        height

    );

}


/* =====================================================
   SMOOTH EASING
===================================================== */

function smoothStep(value) {

    return (

        value
        *
        value
        *
        (
            3
            -
            2 * value
        )

    );

}


/* =====================================================
   DRAW SCROLL SEQUENCE
===================================================== */

function drawSequence() {

    const usableFrames =

        frames.filter(
            Boolean
        );


    if (
        usableFrames.length === 0
    ) {

        return;

    }


    ctx.clearRect(

        0,

        0,

        window.innerWidth,

        window.innerHeight

    );


    /*
       currentProgress

       0 = الصورة الأولى
       1 = الصورة السادسة
    */

    const framePosition =

        currentProgress
        *
        (
            usableFrames.length
            -
            1
        );


    const currentFrameIndex =

        Math.floor(
            framePosition
        );


    const nextFrameIndex =

        Math.min(

            currentFrameIndex
            + 1,

            usableFrames.length
            - 1

        );


    const rawMix =

        framePosition
        -
        currentFrameIndex;


    /*
       Cross Fade Smooth
    */

    const mix =

        smoothStep(
            rawMix
        );


    /*
       Zoom بسيط أثناء الانتقال
    */

    const zoom =

        1.015

        +

        Math.sin(
            rawMix * Math.PI
        )

        * 0.006;


    /*
       الصورة الحالية
    */

    drawCover(

        usableFrames[
            currentFrameIndex
        ],

        1,

        zoom

    );


    /*
       الصورة التالية فوقها تدريجيًا
    */

    if (

        nextFrameIndex
        !==
        currentFrameIndex

    ) {

        drawCover(

            usableFrames[
                nextFrameIndex
            ],

            mix,

            zoom

        );

    }


    ctx.globalAlpha =
        1;

}


/* =====================================================
   SCROLL
===================================================== */

function updateScroll() {

    const scrollableHeight =

        document
            .documentElement
            .scrollHeight

        -

        window.innerHeight;


    if (
        scrollableHeight <= 0
    ) {

        targetProgress = 0;

        return;

    }


    targetProgress =

        window.scrollY
        /
        scrollableHeight;


    targetProgress =

        Math.max(

            0,

            Math.min(

                1,

                targetProgress

            )

        );


    /*
       Scroll Progress Bar
    */

    const progressBar =

        document.getElementById(
            "scrollProgress"
        );


    if (progressBar) {

        progressBar.style.height =

            (
                targetProgress
                *
                100
            )

            + "%";

    }

}


/* =====================================================
   MAIN ANIMATION LOOP
===================================================== */

function animate() {

    /*
       كل ما صغرت القيمة
       صار تحرك الصور أبطأ وأنعم.

       جرب:
       0.04
       0.06
       0.08
       0.12
    */

    currentProgress +=

        (

            targetProgress
            -
            currentProgress

        )

        * 0.075;


    /*
       Mouse Smooth
    */

    mouseX +=

        (

            targetMouseX
            -
            mouseX

        )

        * 0.05;


    mouseY +=

        (

            targetMouseY
            -
            mouseY

        )

        * 0.05;


    drawSequence();


    requestAnimationFrame(
        animate
    );

}


/* =====================================================
   MOUSE PARALLAX
===================================================== */

window.addEventListener(

    "mousemove",

    function (event) {

        const x =

            event.clientX
            /
            window.innerWidth;


        const y =

            event.clientY
            /
            window.innerHeight;


        targetMouseX =

            (
                x
                -
                0.5
            )

            * -1;


        targetMouseY =

            (
                y
                -
                0.5
            )

            * -1;

    }

);


/* =====================================================
   SCROLL EVENT
===================================================== */

window.addEventListener(

    "scroll",

    updateScroll,

    {
        passive: true
    }

);


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(

    "resize",

    function () {

        resizeCanvas();

        updateScroll();

    }

);


/* =====================================================
   ACTIVE SECTION ANIMATION
===================================================== */

const sections =

    document.querySelectorAll(
        ".scene"
    );


const sectionObserver =

    new IntersectionObserver(

        function (entries) {

            entries.forEach(

                function (entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add(
                                "active"
                            );

                    }

                    else {

                        entry.target
                            .classList
                            .remove(
                                "active"
                            );

                    }

                }

            );

        },

        {

            threshold:
                0.30

        }

    );


sections.forEach(

    function (section) {

        sectionObserver.observe(
            section
        );

    }

);


/* =====================================================
   PROPERTY SEARCH
===================================================== */

const searchForms =

    document.querySelectorAll(
        ".property-search"
    );


searchForms.forEach(

    function (form) {

        form.addEventListener(

            "submit",

            function (event) {

                event.preventDefault();


                const section =

                    form.closest(
                        ".property-section"
                    );


                const cards =

                    section.querySelectorAll(
                        ".property-card"
                    );


                const resultText =

                    section.querySelector(
                        ".search-result"
                    );


                const area =

                    form.elements.area.value;


                const rooms =

                    form.elements.rooms.value;


                const budget =

                    form.elements.budget.value;


                let visibleCards = 0;


                cards.forEach(

                    function (card) {

                        const cardArea =

                            card.dataset.area;


                        const cardRooms =

                            card.dataset.rooms;


                        const cardPrice =

                            Number(
                                card.dataset.price
                            );


                        const areaMatch =

                            area === "all"

                            ||

                            cardArea === area;


                        const roomMatch =

                            rooms === "all"

                            ||

                            cardRooms === rooms;


                        const budgetMatch =

                            budget === "all"

                            ||

                            cardPrice
                            <=
                            Number(budget);


                        if (

                            areaMatch
                            &&
                            roomMatch
                            &&
                            budgetMatch

                        ) {

                            card.classList.remove(
                                "hidden"
                            );


                            visibleCards++;

                        }

                        else {

                            card.classList.add(
                                "hidden"
                            );

                        }

                    }

                );


                if (
                    visibleCards === 0
                ) {

                    resultText.textContent =

                        "لا توجد عقارات مطابقة حاليًا، جرّب تغيير خيارات البحث.";

                }

                else {

                    resultText.textContent =

                        `تم العثور على ${visibleCards} خيار/خيارات.`;

                }

            }

        );

    }

);


/* =====================================================
   DEBUG

   افتح F12 > Console
   وستظهر حالة تحميل الصور.
===================================================== */

console.log(
    "Marsa Jeddah JavaScript loaded."
);