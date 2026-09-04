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
   DYNAMIC PROPERTY FILTERS
===================================================== */

const propertyTypeSelect =
    document.getElementById("propertyType");

const dynamicFilters =
    document.getElementById("dynamicFilters");


const propertyFilterConfig = {

    villa: [

        {
            name: "rooms",
            label: "عدد الغرف",
            options: [
                ["all", "جميع الغرف"],
                ["3", "3 غرف"],
                ["4", "4 غرف"],
                ["5", "5 غرف"],
                ["6", "6 غرف فأكثر"]
            ]
        },

        {
            name: "size",
            label: "المساحة",
            options: [
                ["all", "جميع المساحات"],
                ["250", "حتى 250 م²"],
                ["400", "حتى 400 م²"],
                ["600", "حتى 600 م²"],
                ["1000", "حتى 1000 م²"]
            ]
        },

        {
            name: "age",
            label: "عمر العقار",
            options: [
                ["all", "أي عمر"],
                ["1", "حتى سنة"],
                ["5", "حتى 5 سنوات"],
                ["10", "حتى 10 سنوات"],
                ["20", "حتى 20 سنة"]
            ]
        },

        {
            name: "budget",
            label: "السعر",
            options: [
                ["all", "جميع الأسعار"],
                ["1000000", "حتى 1 مليون"],
                ["2000000", "حتى 2 مليون"],
                ["3000000", "حتى 3 مليون"],
                ["5000000", "حتى 5 مليون"]
            ]
        }

    ],


    apartment: [

        {
            name: "rooms",
            label: "عدد الغرف",
            options: [
                ["all", "جميع الغرف"],
                ["1", "غرفة"],
                ["2", "غرفتان"],
                ["3", "3 غرف"],
                ["4", "4 غرف فأكثر"]
            ]
        },

        {
            name: "size",
            label: "المساحة",
            options: [
                ["all", "جميع المساحات"],
                ["80", "حتى 80 م²"],
                ["120", "حتى 120 م²"],
                ["180", "حتى 180 م²"],
                ["250", "حتى 250 م²"]
            ]
        },

        {
            name: "age",
            label: "عمر العقار",
            options: [
                ["all", "أي عمر"],
                ["1", "حتى سنة"],
                ["5", "حتى 5 سنوات"],
                ["10", "حتى 10 سنوات"],
                ["20", "حتى 20 سنة"]
            ]
        },

        {
            name: "budget",
            label: "السعر",
            options: [
                ["all", "جميع الأسعار"],
                ["500000", "حتى 500 ألف"],
                ["750000", "حتى 750 ألف"],
                ["1000000", "حتى 1 مليون"],
                ["1500000", "حتى 1.5 مليون"]
            ]
        }

    ],


    building: [

        {
            name: "size",
            label: "المساحة",
            options: [
                ["all", "جميع المساحات"],
                ["400", "حتى 400 م²"],
                ["700", "حتى 700 م²"],
                ["1000", "حتى 1000 م²"],
                ["2000", "حتى 2000 م²"]
            ]
        },

        {
            name: "age",
            label: "عمر العقار",
            options: [
                ["all", "أي عمر"],
                ["5", "حتى 5 سنوات"],
                ["10", "حتى 10 سنوات"],
                ["20", "حتى 20 سنة"],
                ["30", "حتى 30 سنة"]
            ]
        },

        {
            name: "subtype",
            label: "نوع العمارة",
            options: [
                ["all", "جميع الأنواع"],
                ["residential", "سكني"],
                ["commercial", "تجاري"]
            ]
        },

        {
            name: "budget",
            label: "السعر",
            options: [
                ["all", "جميع الأسعار"],
                ["2000000", "حتى 2 مليون"],
                ["5000000", "حتى 5 مليون"],
                ["10000000", "حتى 10 مليون"],
                ["20000000", "حتى 20 مليون"]
            ]
        }

    ],


    land: [

        {
            name: "size",
            label: "المساحة",
            options: [
                ["all", "جميع المساحات"],
                ["300", "حتى 300 م²"],
                ["500", "حتى 500 م²"],
                ["1000", "حتى 1000 م²"],
                ["2000", "حتى 2000 م²"]
            ]
        },

        {
            name: "subtype",
            label: "نوع الأرض",
            options: [
                ["all", "جميع الأنواع"],
                ["residential", "سكني"],
                ["commercial", "تجاري"]
            ]
        },

        {
            name: "budget",
            label: "السعر",
            options: [
                ["all", "جميع الأسعار"],
                ["500000", "حتى 500 ألف"],
                ["1000000", "حتى 1 مليون"],
                ["2000000", "حتى 2 مليون"],
                ["5000000", "حتى 5 مليون"]
            ]
        }

    ],


    shop: [

        {
            name: "size",
            label: "المساحة",
            options: [
                ["all", "جميع المساحات"],
                ["50", "حتى 50 م²"],
                ["100", "حتى 100 م²"],
                ["200", "حتى 200 م²"],
                ["500", "حتى 500 م²"]
            ]
        },

        {
            name: "budget",
            label: "السعر",
            options: [
                ["all", "جميع الأسعار"],
                ["250000", "حتى 250 ألف"],
                ["500000", "حتى 500 ألف"],
                ["1000000", "حتى 1 مليون"],
                ["2000000", "حتى 2 مليون"]
            ]
        }

    ],


    studio: [

        {
            name: "size",
            label: "المساحة",
            options: [
                ["all", "جميع المساحات"],
                ["40", "حتى 40 م²"],
                ["60", "حتى 60 م²"],
                ["80", "حتى 80 م²"],
                ["100", "حتى 100 م²"]
            ]
        },

        {
            name: "budget",
            label: "السعر",
            options: [
                ["all", "جميع الأسعار"],
                ["300000", "حتى 300 ألف"],
                ["500000", "حتى 500 ألف"],
                ["750000", "حتى 750 ألف"],
                ["1000000", "حتى 1 مليون"]
            ]
        }

    ]

};


/* =====================================================
   CREATE SELECT
===================================================== */

function createFilterSelect(filter) {

    const group =
        document.createElement("div");


    group.className =
        "search-group";


    const label =
        document.createElement("label");


    label.textContent =
        filter.label;


    const select =
        document.createElement("select");


    select.name =
        filter.name;


    filter.options.forEach(

        function (optionData) {

            const option =
                document.createElement("option");


            option.value =
                optionData[0];


            option.textContent =
                optionData[1];


            select.appendChild(
                option
            );

        }

    );


    group.appendChild(
        label
    );


    group.appendChild(
        select
    );


    return group;

}


/* =====================================================
   UPDATE FILTERS BY PROPERTY TYPE
===================================================== */

function updateDynamicFilters() {

    if (
        !propertyTypeSelect
        ||
        !dynamicFilters
    ) {

        return;

    }


    const selectedType =
        propertyTypeSelect.value;


    dynamicFilters.innerHTML =
        "";


    if (
        selectedType === "all"
    ) {

        return;

    }


    const filters =
        propertyFilterConfig[
            selectedType
        ];


    if (
        !filters
    ) {

        return;

    }


    filters.forEach(

        function (filter) {

            dynamicFilters.appendChild(

                createFilterSelect(
                    filter
                )

            );

        }

    );

}


if (propertyTypeSelect) {

    propertyTypeSelect.addEventListener(

        "change",

        updateDynamicFilters

    );


    updateDynamicFilters();

}


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


                const formData =
                    new FormData(form);


                const area =
                    formData.get("area") || "all";


                const propertyType =
                    formData.get("property_type") || "all";


                const rooms =
                    formData.get("rooms") || "all";


                const size =
                    formData.get("size") || "all";


                const age =
                    formData.get("age") || "all";


                const subtype =
                    formData.get("subtype") || "all";


                const budget =
                    formData.get("budget") || "all";


                let visibleCards = 0;


                cards.forEach(

                    function (card) {

                        const cardArea =
                            card.dataset.area;


                        const cardType =
                            card.dataset.propertyType;


                        const cardRooms =
                            card.dataset.rooms;


                        const cardSize =
                            Number(
                                card.dataset.size
                            );


                        const cardAge =
                            Number(
                                card.dataset.age
                            );


                        const cardSubtype =
                            card.dataset.subtype;


                        const cardPrice =
                            Number(
                                card.dataset.price
                            );


                        const areaMatch =

                            area === "all"

                            ||

                            cardArea === area;


                        const typeMatch =

                            propertyType === "all"

                            ||

                            cardType === propertyType;


                        const roomMatch =

                            rooms === "all"

                            ||

                            cardRooms === rooms;


                        const sizeMatch =

                            size === "all"

                            ||

                            cardSize <=
                            Number(size);


                        const ageMatch =

                            age === "all"

                            ||

                            cardAge <=
                            Number(age);


                        const subtypeMatch =

                            subtype === "all"

                            ||

                            cardSubtype === subtype;


                        const budgetMatch =

                            budget === "all"

                            ||

                            cardPrice <=
                            Number(budget);


                        if (

                            areaMatch
                            &&
                            typeMatch
                            &&
                            roomMatch
                            &&
                            sizeMatch
                            &&
                            ageMatch
                            &&
                            subtypeMatch
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