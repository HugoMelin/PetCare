FROM node:22-alpine
WORKDIR /app

COPY .output ./.output

# Match Nitro's bundled Sharp version when installing Linux native binaries.
RUN npm init -y && \
    SHARP_VERSION=$(node -p "require('./.output/server/node_modules/sharp/package.json').version") && \
    npm install --save-exact "sharp@${SHARP_VERSION}"

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
