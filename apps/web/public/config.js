// Runtime configuration, loaded before main.js.
// Locally this stays empty, so main.js falls back to its hardcoded
// http://localhost:3000/api default. In Docker, docker-entrypoint.sh
// rewrites this file at container start using the API_BASE env var,
// so the same built image can point at different API URLs without a rebuild.
window.CTG_API_BASE = "";
window.CTG_SWAGGER_URL = "";
