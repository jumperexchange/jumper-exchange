## Dependencies builder
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat git openssh
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

## App builder
FROM node:20-alpine AS builder
ARG ENV_FILE=.env
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY ./$ENV_FILE ./.env
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build

## Runner
FROM node:20-alpine AS runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/next.config.js ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/.env ./.env
USER nextjs
EXPOSE 3000
ENV PORT 3000
ENTRYPOINT ["yarn", "start"]