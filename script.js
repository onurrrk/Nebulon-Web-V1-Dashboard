document.addEventListener("DOMContentLoaded", function() {

    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    const viewProjectsBtn = document.getElementById('view-projects-btn');
    const projectsSection = document.getElementById('projects');

    if (viewProjectsBtn && projectsSection) {
        viewProjectsBtn.addEventListener('click', function(event) {
            event.preventDefault();
            
            projectsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

});