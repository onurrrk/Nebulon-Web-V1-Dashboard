const USERNAME = "admin";
const PASSWORD = "admin";

document.getElementById("login-form").addEventListener("submit", function(e){
    e.preventDefault();
    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;
    const msg = document.getElementById("login-msg");

    if(usernameInput === USERNAME && passwordInput === PASSWORD){
        localStorage.setItem("isAdmin", "true");
        window.location.href = "dashboard.html";
    } else {
        msg.innerText = "Kullanıcı adı veya şifre yanlış!";
        msg.style.color = "red";
        msg.style.fontWeight = "bold";
    }
});
