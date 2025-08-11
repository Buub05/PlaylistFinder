const LANG_IT = {
  welcome: "Benvenuto in Playlist Finder",
  loading: "Caricamento in corso...",
  error: "Errore, riprova.",
  loginPrompt: "Accedi con Spotify per continuare.",
  // altri messaggi
};

let CURRENT_LANG = LANG_IT;

function t(key) {
  return CURRENT_LANG[key] || key;
}
