// Gestione UI generale
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

function showSidebar(content) {
    document.getElementById("sidebar").innerHTML = content;
}
