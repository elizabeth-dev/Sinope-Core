FROM golang:1.19-alpine as builder

WORKDIR /usr/src/app

COPY go.mod .
COPY go.sum .

RUN go version

RUN go mod download -x

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -ldflags="-w -s" -o /app ./cmd/copper

# Prod container
FROM --platform=linux/arm64 gcr.io/distroless/static as prod

COPY --from=builder /app /bin/app

USER 10001:10001

CMD ["/bin/app"]