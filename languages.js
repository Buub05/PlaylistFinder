// Lingue universali
const languages = [
  {code:"it",label:"🇮🇹 Italiano"},
  {code:"en",label:"🇬🇧 English"},
  {code:"es",label:"🇪🇸 Español"},
  {code:"fr",label:"🇫🇷 Français"},
  {code:"de",label:"🇩🇪 Deutsch"},
  {code:"pt",label:"🇵🇹 Português"},
  {code:"ru",label:"🇷🇺 Русский"}
];
// Traduzioni base - espandibile
const translations = {
  it: {
    login: "🔐 Accedi con Spotify",
    playlist: "Nome playlist:",
    notLogged: "❌ Non autenticato",
    logged: "Login effettuato",
    findTracks: "🎯 Trova tracce originali",
    createSelection: "📥 Crea dalla selezione",
    export: "📄 Esporta CSV",
    theme: "🌓 Cambia tema",
    stats: "📊 Statistiche playlist",
    share: "🔗 Condividi playlist",
    shareStats: "🔗 Condividi / Statistiche playlist"
  },
  en: {
    login: "🔐 Login with Spotify",
    playlist: "Playlist name:",
    notLogged: "❌ Not logged in",
    logged: "Login successful",
    findTracks: "🎯 Find original tracks",
    createSelection: "📥 Create from selection",
    export: "📄 Export CSV",
    theme: "🌓 Toggle theme",
    stats: "📊 Playlist stats",
    share: "🔗 Share playlist",
    shareStats: "🔗 Share / Stats playlist"
  },
  es: {
    login: "🔐 Iniciar sesión con Spotify",
    playlist: "Nombre de la playlist:",
    notLogged: "❌ No conectado",
    logged: "Inicio de sesión correcto",
    findTracks: "🎯 Buscar canciones originales",
    createSelection: "📥 Crear a partir de la selección",
    export: "📄 Exportar CSV",
    theme: "🌓 Cambiar tema",
    stats: "📊 Estadísticas de la playlist",
    share: "🔗 Compartir playlist",
    shareStats: "🔗 Compartir / Estadísticas playlist"
  },
  fr: {
    login: "🔐 Connexion avec Spotify",
    playlist: "Nom de la playlist:",
    notLogged: "❌ Non connecté",
    logged: "Connexion réussie",
    findTracks: "🎯 Trouver les titres originaux",
    createSelection: "📥 Créer à partir de la sélection",
    export: "📄 Exporter CSV",
    theme: "🌓 Changer le thème",
    stats: "📊 Statistiques de la playlist",
    share: "🔗 Partager la playlist",
    shareStats: "🔗 Partager / Statistiques playlist"
  },
  de: {
    login: "🔐 Mit Spotify anmelden",
    playlist: "Playlist-Name:",
    notLogged: "❌ Nicht angemeldet",
    logged: "Erfolgreich angemeldet",
    findTracks: "🎯 Originaltitel finden",
    createSelection: "📥 Aus Auswahl erstellen",
    export: "📄 CSV exportieren",
    theme: "🌓 Thema wechseln",
    stats: "📊 Playlist-Statistiken",
    share: "🔗 Playlist teilen",
    shareStats: "🔗 Teilen / Playlist-Statistiken"
  },
  pt: {
    login: "🔐 Entrar com Spotify",
    playlist: "Nome da playlist:",
    notLogged: "❌ Não autenticado",
    logged: "Login realizado",
    findTracks: "🎯 Encontrar músicas originais",
    createSelection: "📥 Criar da seleção",
    export: "📄 Exportar CSV",
    theme: "🌓 Alternar tema",
    stats: "📊 Estatísticas da playlist",
    share: "🔗 Compartilhar playlist",
    shareStats: "🔗 Compartilhar / Estatísticas playlist"
  },
  ru: {
    login: "🔐 Войти через Spotify",
    playlist: "Название плейлиста:",
    notLogged: "❌ Не авторизован",
    logged: "Вход выполнен",
    findTracks: "🎯 Найти оригинальные треки",
    createSelection: "📥 Создать из выбранного",
    export: "📄 Экспорт в CSV",
    theme: "🌓 Сменить тему",
    stats: "📊 Статистика плейлиста",
    share: "🔗 Поделиться плейлистом",
    shareStats: "🔗 Поделиться / Статистика плейлиста"
  }
};
function setLang(lang) {
  document.getElementById("loginBtn").textContent = translations[lang].login;
  document.getElementById("playlistLabel").textContent = translations[lang].playlist;
  document.getElementById("loginStatus").textContent = translations[lang].notLogged;
  document.querySelector('button[onclick="startProcessing()"]').textContent = translations[lang].findTracks;
  document.getElementById("createManualPlaylist").textContent = translations[lang].createSelection;
  document.querySelector('button[onclick="exportCSV()"]').textContent = translations[lang].export;
  document.getElementById("shareStatsBtn").textContent = translations[lang].shareStats;
}