
document.addEventListener('DOMContentLoaded', function () {
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
})