FROM golang:1.14-alpine as wasm-build
ENV GOOS=js GOARCH=wasm
WORKDIR /work
COPY go.mod go.sum ./
RUN go mod download
COPY main.go .
RUN go build -o gpg.wasm main.go

FROM node:14-alpine as ui-build
WORKDIR /work
COPY package.json package-lock.json ./
RUN npm i
COPY .browserslistrc .editorconfig .eslintrc.js babel.config.js vue.config.js ./
COPY src src
COPY public public
RUN npm run build

FROM caddy:2.3.0-alpine
COPY --from=ui-build /work/dist /usr/share/caddy
COPY --from=wasm-build /work/gpg.wasm /usr/share/caddy/gpg.wasm
COPY Caddyfile /etc/caddy/Caddyfile