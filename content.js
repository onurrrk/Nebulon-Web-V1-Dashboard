async function loadSiteContent() {
    try {
        const res = await fetch("http://localhost:3000/content");
        const siteContent = await res.json();

        document.getElementById("hero-title").innerText = siteContent.hero.title;
        document.getElementById("hero-desc").innerText = siteContent.hero.desc;
        document.getElementById("view-projects-btn").innerText = siteContent.hero.btn;

        const skillsGrid = document.getElementById("skills-grid");
        skillsGrid.innerHTML = "";
        siteContent.skills.forEach(s=>{
            let div = document.createElement("div");
            div.className = "skill-card";
            div.innerHTML = `<i class="${s.icon}"></i><h3>${s.title}</h3><p>${s.desc}</p>`;
            skillsGrid.appendChild(div);
        });

        const projectsGrid = document.getElementById("projects-grid");
        projectsGrid.innerHTML = "";
        siteContent.projects.forEach(p=>{
            let a = document.createElement("a");
            a.href = p.link;
            a.target="_blank";
            a.className="project-card-link";
            a.innerHTML = `<div class="project-card"><img src="${p.img}" alt="${p.title}"><h3>${p.title}</h3><p>${p.desc}</p></div>`;
            projectsGrid.appendChild(a);
        });

        const contactLinks = document.getElementById("contact-links");
        contactLinks.innerHTML = "";
        siteContent.contacts.forEach(c=>{
            let a = document.createElement("a");
            a.href = c.link;
            a.target="_blank";
            a.className="social-link";
            a.innerHTML = `<i class="${c.icon}"></i>`;
            contactLinks.appendChild(a);
        });

        document.getElementById("footer-text").innerText = siteContent.footer;

    } catch(e) {
        console.error("Site içeriği yüklenemedi", e);
    }
}

document.addEventListener("DOMContentLoaded", loadSiteContent);
