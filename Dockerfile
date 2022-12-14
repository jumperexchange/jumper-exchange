FROM node:18.12.1-alpine3.16 as builder

WORKDIR /app

RUN apk add --no-cache libc6-compat git openssh

RUN corepack enable
RUN corepack prepare yarn@stable --activate

COPY package.json yarn.lock tsconfig.base.json lerna.json ./
COPY packages/ ./packages

RUN yarn install
RUN yarn build

###

FROM nginx:stable-alpine

COPY --from=builder /app/packages/dapp/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]