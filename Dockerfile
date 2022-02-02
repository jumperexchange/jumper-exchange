# syntax = docker/dockerfile:1.3
#https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/syntax.md
#require set DOCKER_BUILDKIT=1

FROM node:14-buster-slim as base
ARG BUILD_ENV
ENV BUILD_ENV=${BUILD_ENV}
RUN apt-get update -y \
  && apt-get -y --no-install-recommends install unzip curl git ca-certificates\
  && rm -rf /var/lib/apt/lists/*
ENV YARN_CACHE_FOLDER /root/.cache
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

FROM base as modules
COPY . ./
RUN --mount=type=cache,id=yarn,target=${YARN_CACHE_FOLDER} yarn install --prefer-offline --ignore-optional --pure-lockfile --non-interactive
#RUN yarn install --prefer-offline --ignore-optional --pure-lockfile --non-interactive \
#     && yarn cache clean

FROM modules as base-and-source
COPY . .

FROM base-and-source as tester

FROM tester as builder
# RUN --mount=type=cache,id=nm,target=/usr/src/app/node_modules/.cache yarn build --release --verbose
RUN --mount=type=cache,id=yarn,target=${YARN_CACHE_FOLDER} yarn build:lifinance${BUILD_ENV}
# RUN yarn build --release --verbose

FROM modules as production
# production environment
FROM nginx:stable-alpine
# COPY --from=build /app/build /usr/share/nginx/html
COPY  --from=builder /usr/src/app/build /usr/share/nginx/html
# new
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]




# ENV \
#   NODE_ENV=production \
#   PORT=3000
# RUN mkdir -p -m 0770 /home/node/data && chown node:node /home/node/data
# USER node
# COPY --chown=node:node --from=builder /usr/src/app/build .
# # COPY --chown=node:node --from=builder /usr/src/app/config ./config
# VOLUME [ "/home/node/data" ]
# CMD [ "npm", "start" ]
# EXPOSE 3000
