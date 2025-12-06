FROM node:20-alpine
WORKDIR /app

RUN npm init -y && \
    npm install sharp

COPY .output ./.output

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]