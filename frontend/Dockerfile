
FROM node:18-alpine AS base
# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install --immutable && yarn rebuild sharp

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1
ARG NEXT_INTERNAL_STRAPI_API_URL
ENV NEXT_INTERNAL_STRAPI_API_URL=$NEXT_INTERNAL_STRAPI_API_URL
ARG NEXT_PUBLIC_UPLOADS_URL
ENV NEXT_PUBLIC_UPLOADS_URL=$NEXT_PUBLIC_UPLOADS_URL
ARG NEXT_INTERNAL_IMAGE_DOMAIN_PROTOCOL
ENV NEXT_INTERNAL_IMAGE_DOMAIN_PROTOCOL=$NEXT_INTERNAL_IMAGE_DOMAIN_PROTOCOL
ARG NEXT_INTERNAL_IMAGE_DOMAIN
ENV NEXT_INTERNAL_IMAGE_DOMAIN=$NEXT_INTERNAL_IMAGE_DOMAIN
ARG DEFAULT_LOCALES
ENV DEFAULT_LOCALES=$DEFAULT_LOCALES
ARG LOCALES
ENV LOCALES=$LOCALES
ARG STRAPI_API_TOKEN
ENV STRAPI_API_TOKEN=$STRAPI_API_TOKEN

# CF access
ARG CF_ACCESS_CLIENT_ID
ENV CF_ACCESS_CLIENT_ID=$CF_ACCESS_CLIENT_ID
ARG CF_ACCESS_CLIENT_SECRET
ENV CF_ACCESS_CLIENT_SECRET=$CF_ACCESS_CLIENT_SECRET

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# # You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
# # Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# #COPY --from=builder /app/package.json ./package.json

# # Automatically leverage output traces to reduce image size 
# # https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]