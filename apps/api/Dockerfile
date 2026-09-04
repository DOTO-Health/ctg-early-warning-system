# Build context must be the repo root (ctg-insight/), since this needs the
# @ctg-insight/core workspace package alongside apps/api. See docker-compose.yml.

# ---------- deps + build ----------
FROM node:20-alpine AS build
WORKDIR /repo

# Install all workspace deps first (better layer caching on source changes)
COPY package.json package-lock.json* ./
COPY packages/core/package.json packages/core/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm install

# Now bring in the actual source and build core, then the api
COPY packages/core packages/core
COPY apps/api apps/api
RUN npm run build --workspace=packages/core
RUN npm run build --workspace=apps/api

# ---------- runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /repo
ENV NODE_ENV=production

COPY package.json package-lock.json* ./
COPY packages/core/package.json packages/core/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm install --omit=dev

COPY --from=build /repo/packages/core/dist packages/core/dist
COPY --from=build /repo/apps/api/dist apps/api/dist

WORKDIR /repo/apps/api
EXPOSE 3000
CMD ["node", "dist/main.js"]
