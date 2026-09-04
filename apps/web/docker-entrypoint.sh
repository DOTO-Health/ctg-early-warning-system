#!/bin/sh
set -e

# Default to the same-origin nginx proxy path (see nginx.conf) so the
# browser never needs to know the api container's real address.
API_BASE="${API_BASE:-/api}"

cat > /usr/share/nginx/html/config.js <<EOF
window.CTG_API_BASE = "${API_BASE}";
window.CTG_SWAGGER_URL = "${API_BASE}/docs";
EOF

exec nginx -g 'daemon off;'
