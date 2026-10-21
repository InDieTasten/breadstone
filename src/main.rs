//! breadstone: circuit design for minecraft redstone. Axum API serving the embedded React UI (web/dist).
mod server;

use std::io::{Read as _, Write as _};
use std::sync::Arc;

fn env(k: &str, default: &str) -> String {
    std::env::var(k)
        .ok()
        .filter(|v| !v.is_empty())
        .unwrap_or_else(|| default.to_string())
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let listen = env("LISTEN", "0.0.0.0:8080");
    if std::env::args().nth(1).as_deref() == Some("healthcheck") {
        // for the container health check (no shell in the distroless image)
        let mut stream = std::net::TcpStream::connect(&listen)?;
        stream.set_read_timeout(Some(std::time::Duration::from_secs(2)))?;
        stream.write_all(b"GET /healthz HTTP/1.0\r\nHost: localhost\r\n\r\n")?;
        let mut buf = [0u8; 64];
        let n = stream.read(&mut buf)?;
        let ok = String::from_utf8_lossy(&buf[..n]).contains(" 200 ");
        std::process::exit(if ok { 0 } else { 1 });
    }
    tracing_subscriber::fmt().with_target(false).init();

    let app = server::router(Arc::new(server::App::default()));
    let listener = tokio::net::TcpListener::bind(&listen).await?;
    tracing::info!("breadstone listening on {listen}");
    axum::serve(listener, app).with_graceful_shutdown(shutdown_signal()).await?;
    Ok(())
}

async fn shutdown_signal() {
    let _ = tokio::signal::ctrl_c().await;
    tracing::info!("shutting down");
}
