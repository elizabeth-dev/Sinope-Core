### Dependencies
FROM node:14.4-alpine as deps

COPY package.json yarn.lock ./

RUN yarn

### Prod dependencies
FROM node:14.4-alpine as prod-deps

COPY --from=deps package.json yarn.lock ./
COPY --from=deps node_modules ./

RUN yarn --prod

### Builder
FROM node:14.4-alpine as build

RUN yarn global add @nestjs/cli rimraf

WORKDIR /build

COPY --from=deps package.json yarn.lock /build/
COPY --from=deps node_modules /build/node_modules
COPY nest-cli.json tsconfig.json tsconfig.build.json /build/
COPY src /build/src

RUN yarn run build

### Runtime
FROM node:14.4-alpine as runtime
LABEL maintainer="Elizabeth Martín Campos <elizabeth@sinope.app>"

WORKDIR /app

COPY --from=prod-deps package.json yarn.lock /app/
COPY --from=prod-deps node_modules /app/node_modules

RUN apk --no-cache add --virtual bcrypt-deps build-base python &&\
	yarn add bcrypt --force &&\
	apk del -r bcrypt-deps

COPY --from=build /build/dist /app/dist

CMD [ "node", "dist/main" ]