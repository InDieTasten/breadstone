FROM node:22.20.0-alpine@sha256:dbcedd8aeab47fbc0f4dd4bffa55b7c3c729a707875968d467aaaea42d6225af AS web
WORKDIR /web
COPY web/package.json web/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY web/ ./
RUN npm run build

FROM rust:1.98.1-alpine@sha256:7cc1c22d77d9432f7fe012a70e6d3e555af54c2a6832700ed7d553f1769ae89f AS build
# the alpine host target yields a static musl binary
RUN apk add --no-cache musl-dev
WORKDIR /src
COPY Cargo.toml Cargo.lock ./
# dependencies first (cached layer)
RUN mkdir -p src web/dist && echo 'fn main() {}' > src/main.rs && cargo build --release --locked && rm -rf src
COPY src src
COPY --from=web /web/dist web/dist
RUN touch src/main.rs && cargo build --release --locked

FROM gcr.io/distroless/static-debian13:nonroot@sha256:d62067879de890a1def9da0e7766b7d20810a5e5555cef8506b752437d7a3e88
COPY --from=build /src/target/release/breadstone /breadstone
ENV LISTEN=0.0.0.0:8080
USER 1000:1000
EXPOSE 8080
HEALTHCHECK --interval=60s --start-period=10s --start-interval=2s CMD ["/breadstone", "healthcheck"]
ENTRYPOINT ["/breadstone"]
