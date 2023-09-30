
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