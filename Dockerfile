FROM node:20 AS builder

ARG ENV_NAME
ENV ENV_NAME=$ENV_NAME
ARG NEXT_PUBLIC_LATEST_COMMIT_SHA
ENV NEXT_PUBLIC_LATEST_COMMIT_SHA=$NEXT_PUBLIC_LATEST_COMMIT_SHA
ENV NEXT_TELEMETRY_DISABLED=1 PNPM_VERSION=9.15.3
RUN corepack enable && corepack install -g pnpm@${PNPM_VERSION}

WORKDIR /app

COPY . .
RUN rm .env*
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
ARG ENV_FILE=.env

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ENV NODE_ENV=production
RUN corepack enable && corepack install -g pnpm@${PNPM_VERSION}

COPY ./$ENV_FILE ./.env
RUN pnpm build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1
RUN corepack enable && corepack install -g pnpm@${PNPM_VERSION}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Fix sharp install for image optimization
RUN pnpm install sharp
RUN chown -R nextjs:nodejs /app/node_modules
ENV NEXT_SHARP_PATH="/app/node_modules/sharp"

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js
