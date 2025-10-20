FROM node:18-alpine AS base
# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash
WORKDIR /backend
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install --immutable

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /backend
COPY favicon.png package.json yarn.lock .yarnrc.yml ./
COPY public/robots.txt public/
COPY src/ src/
COPY database/ database/
COPY config/ config/
COPY --from=deps /backend/node_modules ./node_modules
COPY --from=deps /backend/.yarn ./.yarn

ENV NODE_ENV production

RUN yarn build

# Production image, copy all the files and run strapi
FROM base AS runner
WORKDIR /backend

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S strapi -u 1001

COPY --from=builder --chown=strapi:nodejs /backend/build ./build
COPY --from=builder --chown=strapi:nodejs /backend/public ./public
RUN mkdir /backend/public/uploads
RUN chown strapi:nodejs /backend/public/uploads
COPY --from=builder /backend/node_modules ./node_modules
COPY --from=builder /backend/package.json ./package.json
COPY --from=builder /backend/src ./src
COPY --from=builder /backend/config ./config
COPY --from=builder /backend/database ./database
COPY --from=builder /backend/favicon.png ./

USER strapi

EXPOSE 1337

ENV PORT 1337

CMD ["node_modules/.bin/strapi", "start"]