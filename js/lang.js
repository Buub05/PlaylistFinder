// Traduzioni e gestione lingua
const translations = {
    it: {
        login: "Accedi con Spotify",
        logout: "Esci",
        processing: "Elaborazione playlist..."
    },
    en: {
        login: "Login with Spotify",
        logout: "Logout",
        processing: "Processing playlists..."
    }
};

let currentLang = "it";

function t(key) {
    return translations[currentLang][key] || key;
}
