FROM node:24-alpine AS builder

RUN apk add --no-cache ca-certificates openssl python3 make g++ libc6-compat

ARG ENV_NAME
ENV ENV_NAME=$ENV_NAME
ARG NEXT_PUBLIC_LATEST_COMMIT_SHA
ENV NEXT_PUBLIC_LATEST_COMMIT_SHA=$NEXT_PUBLIC_LATEST_COMMIT_SHA
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_VERSION=11.5.1
RUN corepack enable && corepack install -g pnpm@$PNPM_VERSION

WORKDIR /app

# .npmrc carries the @jumperexchange -> GitHub Packages scope mapping. The auth
# token is injected via a BuildKit secret (id=github_token) so it is never baked
# into an image layer. CI passes it through docker/build-push-action `secrets`.
COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=secret,id=github_token \
    if [ -s /run/secrets/github_token ]; then \
      echo "//npm.pkg.github.com/:_authToken=$(cat /run/secrets/github_token)" >> ~/.npmrc; \
    fi && \
    pnpm install --frozen-lockfile && \
    rm -f ~/.npmrc

COPY . .
RUN rm -f .env*
ARG ENV_FILE=.env
#NOTE: Make sure to put the following en variable after setting up corepack
ENV NODE_ENV=production

# Sentry (SENTRY_AUTH_TOKEN, NEXT_PUBLIC_SENTRY_DSN) is not set here on purpose:
# add them to the file copied in as $ENV_FILE (e.g. .env.staging) and/or pass them
# as environment variables in the docker build job so Next/Sentry read a single source of truth.
COPY ./$ENV_FILE ./.env
RUN pnpm build

# Production image, copy all the files and run next
FROM node:24-alpine AS runner
ENV PNPM_VERSION=11.5.1

WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1
RUN corepack enable && corepack install -g pnpm@$PNPM_VERSION
#NOTE: Make sure to put the following en variable after setting up corepack
ENV NODE_ENV=production

RUN apk add --no-cache ca-certificates openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Fix sharp install for image optimization
RUN pnpm install sharp@0.34.5 --allow-build=sharp
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
