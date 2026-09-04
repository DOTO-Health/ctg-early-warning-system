# Build context must be the repo root (ctg-insight/). See docker-compose.yml.

# ---------- build Tailwind CSS ----------
FROM node:20-alpine AS build
WORKDIR /repo/apps/web
COPY apps/web/package.json ./
RUN npm install
COPY apps/web/src ./src
COPY apps/web/public ./public
RUN npx @tailwindcss/cli -i ./src/input.css -o ./public/output.css --minify

# ---------- runtime ----------
FROM nginx:1.27-alpine
COPY --from=build /repo/apps/web/public /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY apps/web/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
