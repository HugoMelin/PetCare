# Dockerfile
FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
COPY package*.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
ENV DATABASE_URL="mysql://user:pass@localhost:3306/db"
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV HOST=0.0.0.0
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/generated ./generated
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
