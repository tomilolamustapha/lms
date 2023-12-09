function searchTable(tableBodyId) {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const tableBody = document.getElementById(tableBodyId);
    const rows = tableBody.getElementsByTagName('tr');
    let matchCount = 0;

    for (const row of rows) {
        const cells = row.getElementsByTagName('td');
        let rowMatches = false;

        for (const cell of cells) {
            if (cell.textContent.toLowerCase().includes(searchTerm)) {
                rowMatches = true;
                break;
            }
        }

        if (rowMatches) {
            row.style.display = '';
            matchCount++;
        } else {
            row.style.display = 'none';
        }
    }
}

function searchList() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const courseCards = document.querySelectorAll('.course-card');
    let matchCount = 0;

    courseCards.forEach(card => {
        const cardContent = card.textContent.toLowerCase();
        const cardMatches = cardContent.includes(searchTerm);

        if (cardMatches) {
            card.style.display = '';
            matchCount++;
        } else {
            card.style.display = 'none';
        }
    })
}

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

function handleAccordion() {
    const accordionBtns = document.querySelectorAll('.accordion-btn')

    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('active')
            const accordionBody = this.nextElementSibling
            const close = this.querySelector('.fa-caret-down')
            const open = this.querySelector('.fa-caret-up')

            if (accordionBody.style.maxHeight) {
                accordionBody.style.maxHeight = null
                close.style.display = 'block'
                open.style.display = 'none'
            }
            else {
                accordionBody.style.maxHeight = accordionBody.scrollHeight + 'px'
                close.style.display = 'none'
                open.style.display = 'block'
            }
        })
    })
}