ARG APP_NAME=tracking-integrations

FROM node:18-alpine AS node

FROM node AS node-with-gyp
RUN apk add g++ make python3

FROM node-with-gyp AS builder
ARG APP_NAME

WORKDIR /app
ADD ./package.json .
ADD ./yarn.lock .
RUN yarn install

ADD ./ .
RUN yarn build ${APP_NAME}

FROM node AS deps-builder
COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
RUN yarn install --production

FROM node:18.19 AS indexer
ARG APP_NAME

WORKDIR /app
COPY --from=builder /app/package.json .
COPY --from=builder /app/dist/apps/${APP_NAME}/ .
COPY --from=deps-builder /node_modules ./node_modules

EXPOSE 3000

CMD ["node", "main.js"]
