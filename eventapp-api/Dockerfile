#build stage
FROM golang:1.23-alpine3.20 AS builder

WORKDIR /go/src/app

COPY . .

RUN go get -d -v .

RUN go build -o /go/bin/app/ -v .

#final stage
FROM alpine:3.20

COPY --from=builder /go/bin/app/ /app/

ENTRYPOINT [ "/app/eventapi", "--port", "8080" ]

LABEL Name=eventapp-api Version=0.0.1

EXPOSE 8080
