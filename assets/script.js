
function handleTabs() {
    const tabToggles = document.querySelectorAll('[data-toggle="tab"]');

    tabToggles.forEach((toggle) => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();

            tabToggles.forEach((tab) => {
                tab.classList.remove('active');
                const targetId = tab.getAttribute('href').substring(1);
                document.getElementById(targetId).classList.remove('active');
            });

            toggle.classList.add('active');
            const targetId = toggle.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');

        });
    });
    console.log("Element to click:", tabToggles[0]);
    tabToggles[0].click();
}
function handleSideBar() {

    const contain = document.querySelector('.contain');
    // const mainContent = document.querySelector('.main-content');
    const hamburger = document.querySelector(".hamburger");

    hamburger.addEventListener('click', function () {
        contain.classList.toggle('toggled')
    })


}

function handleAlert() {
    document.querySelectorAll('.close').forEach(function (e) {
        e.addEventListener('click', function () {
            parentAlert = this.closest('.alert');
            if (parentAlert) {
                parentAlert.style.display = 'none';
            }
        })
    });
}

function handleCarousel() {
    const carousel = document.querySelector('.carousel');
    const arrowBtns = document.querySelectorAll('.carousel-nav')

    let isDragging = false, startX, startScrollleft;

    // arrowBtns.forEach(btn => {
    //     btn.addEventListener('click', () => {
    //         carousel.scrollLeft = btn.id ===  
    //     })
    // })

    const dragStart = (e) => {
        isDragging = true;
        carousel.classList.add('dragging');
        startX = e.pageX;
        startScrollleft = carousel.scrollLeft
    }

    const dragging = (e) => {
        if (!isDragging) return;
        carousel.scrollLeft = startScrollleft - (e.pageX - startX)
    }

    const dragStop = () => {
        isDragging = false;
        carousel.classList.remove("dragging")
    }

    carousel.addEventListener("mousedown", dragStart)
    carousel.addEventListener("mousemove", dragging)
    document.addEventListener("mouseup", dragStop)
} 