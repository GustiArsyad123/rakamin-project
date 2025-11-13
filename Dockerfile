FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./ 2>/dev/null || true
RUN npm i --legacy-peer-deps
COPY tsconfig.json ./
COPY src ./src
COPY docs ./docs
RUN npm run build


FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/docs ./docs
COPY .env ./.env 2>/dev/null || true
RUN mkdir -p /app/storage
EXPOSE 8080
CMD ["node","dist/server.js"]