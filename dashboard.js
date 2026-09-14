document.addEventListener("DOMContentLoaded", () => {

    if(localStorage.getItem("isAdmin") !== "true"){
        alert("Yetkisiz erişim!");
        window.location.href = "login.html";
    }

    const logoutBtn = document.getElementById("logout");
    if(logoutBtn){
        logoutBtn.addEventListener("click", ()=>{
            localStorage.removeItem("isAdmin");
            window.location.href = "login.html";
        });
    }

    let content = {};

    async function loadContent() {
        try {
            const res = await fetch("http://localhost:3000/content");
            content = await res.json();
            if(!content.hero) {
                content = { hero:{title:"Nebulon Project",desc:"V1",btn:"Projelerimi Gör"}, skills:[], projects:[], contacts:[], footer:"© 2025 Nebulon" }
                await saveContent();
            }
            setHeroFields();
            renderSkills();
            renderProjects();
            renderContacts();
            setFooter();
        } catch(e) {
            alert("Sunucuya bağlanılamadı! Node.js çalışıyor mu?");
            console.error(e);
        }
    }

    async function saveContent() {
        await fetch("http://localhost:3000/content", {
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(content)
        });
    }

    function setHeroFields(){
        document.getElementById("hero-title-input").value = content.hero.title || "";
        document.getElementById("hero-desc-input").value = content.hero.desc || "";
        document.getElementById("hero-btn-input").value = content.hero.btn || "";
    }
    document.getElementById("save-hero")?.addEventListener("click", async ()=>{
        content.hero.title = document.getElementById("hero-title-input").value;
        content.hero.desc = document.getElementById("hero-desc-input").value;
        content.hero.btn = document.getElementById("hero-btn-input").value;
        await saveContent();
        alert("Hero kaydedildi!");
    });

    function renderSkills(){
        const skillsList = document.getElementById("skills-list");
        skillsList.innerHTML = "";
        content.skills.forEach((s,i)=>{
            const div = document.createElement("div");
            div.className = "dashboard-item";
            div.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="${s.icon}" style="font-size:1.5rem;"></i>
                    <div>
                        <h4>${s.title}</h4>
                        <p>${s.desc}</p>
                    </div>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="edit" onclick="editSkill(${i})">Düzenle</button>
                    <button class="delete" onclick="deleteSkill(${i})">Sil</button>
                </div>
            `;
            skillsList.appendChild(div);
        });
    }

    async function addSkill(){
        const title = document.getElementById("skill-title").value;
        const desc = document.getElementById("skill-desc").value;
        const icon = document.getElementById("skill-icon").value;
        if(!title || !desc) return alert("Tüm alanları doldurun!");
        content.skills.push({title, desc, icon});
        await saveContent();
        renderSkills();
        document.getElementById("skill-title").value="";
        document.getElementById("skill-desc").value="";
        document.getElementById("skill-icon").value="";
    }
    document.getElementById("add-skill")?.addEventListener("click", addSkill);

    window.editSkill = async function(i){
        const newTitle = prompt("Yeni başlık:", content.skills[i].title);
        const newDesc = prompt("Yeni açıklama:", content.skills[i].desc);
        if(newTitle!==null && newDesc!==null){
            content.skills[i].title=newTitle;
            content.skills[i].desc=newDesc;
            await saveContent();
            renderSkills();
        }
    }

    window.deleteSkill = async function(i){
        content.skills.splice(i,1);
        await saveContent();
        renderSkills();
    }

    function renderProjects(){
        const projectsList = document.getElementById("projects-list");
        projectsList.innerHTML = "";
        content.projects.forEach((p,i)=>{
            const div = document.createElement("div");
            div.className = "dashboard-item";
            div.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${p.img}" alt="${p.title}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;">
                    <div>
                        <h4>${p.title}</h4>
                        <p>${p.desc}</p>
                        <a href="${p.link}" target="_blank">${p.link}</a>
                    </div>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="edit" onclick="editProject(${i})">Düzenle</button>
                    <button class="delete" onclick="deleteProject(${i})">Sil</button>
                </div>
            `;
            projectsList.appendChild(div);
        });
    }

    async function addProject(){
        const title = document.getElementById("project-title").value;
        const desc = document.getElementById("project-desc").value;
        const link = document.getElementById("project-link").value;
        const file = document.getElementById("project-img-file").files[0];

        if(!title || !desc || !link) return alert("Tüm alanları doldurun!");

        let imgUrl = "";
        if(file){
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("http://localhost:3000/assets", { method:"POST", body:formData });
            const data = await res.json();
            imgUrl = data.url;
        }

        content.projects.push({title, desc, link, img: imgUrl});
        await saveContent();
        renderProjects();
        document.getElementById("project-title").value="";
        document.getElementById("project-desc").value="";
        document.getElementById("project-link").value="";
        document.getElementById("project-img-file").value="";
    }
    document.getElementById("add-project")?.addEventListener("click", addProject);

    window.editProject = async function(i){
        const newTitle = prompt("Yeni başlık:", content.projects[i].title);
        const newDesc = prompt("Yeni açıklama:", content.projects[i].desc);
        const newLink = prompt("Yeni link:", content.projects[i].link);
        if(newTitle!==null && newDesc!==null && newLink!==null){
            content.projects[i].title=newTitle;
            content.projects[i].desc=newDesc;
            content.projects[i].link=newLink;
            await saveContent();
            renderProjects();
        }
    }

    window.deleteProject = async function(i){
        content.projects.splice(i,1);
        await saveContent();
        renderProjects();
    }

    function renderContacts(){
        const contactList = document.getElementById("contact-list");
        contactList.innerHTML = "";
        content.contacts.forEach((c,i)=>{
            const div = document.createElement("div");
            div.className = "dashboard-item";
            div.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="${c.icon}" style="font-size:1.5rem;"></i>
                    <div>
                        <h4>${c.name}</h4>
                        <a href="${c.link}" target="_blank">${c.link}</a>
                    </div>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="edit" onclick="editContact(${i})">Düzenle</button>
                    <button class="delete" onclick="deleteContact(${i})">Sil</button>
                </div>
            `;
            contactList.appendChild(div);
        });
    }

    async function addContact(){
        const name = document.getElementById("contact-name").value;
        const link = document.getElementById("contact-link").value;
        const icon = document.getElementById("contact-icon").value;
        if(!name || !link) return alert("Tüm alanları doldurun!");
        content.contacts.push({name, link, icon});
        await saveContent();
        renderContacts();
        document.getElementById("contact-name").value="";
        document.getElementById("contact-link").value="";
        document.getElementById("contact-icon").value="";
    }
    document.getElementById("add-contact")?.addEventListener("click", addContact);

    window.editContact = async function(i){
        const newName = prompt("Yeni isim:", content.contacts[i].name);
        const newLink = prompt("Yeni link:", content.contacts[i].link);
        if(newName!==null && newLink!==null){
            content.contacts[i].name=newName;
            content.contacts[i].link=newLink;
            await saveContent();
            renderContacts();
        }
    }

    window.deleteContact = async function(i){
        content.contacts.splice(i,1);
        await saveContent();
        renderContacts();
    }

    function setFooter(){
        document.getElementById("footer-input").value = content.footer || "";
    }
    document.getElementById("save-footer")?.addEventListener("click", async ()=>{
        content.footer = document.getElementById("footer-input").value;
        await saveContent();
        alert("Footer kaydedildi!");
    });

    loadContent();
});
