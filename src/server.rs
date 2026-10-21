//! HTTP API for the React UI (embedded) and the health check.
use std::sync::{Arc, Mutex};

use axum::extract::State;
use axum::http::{StatusCode, Uri, header};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use rust_embed::RustEmbed;
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};

#[derive(RustEmbed)]
#[folder = "web/dist/"]
struct Web;

#[derive(Clone, Serialize)]
pub struct Circuit {
    pub id: u32,
    pub name: String,
}

#[derive(Deserialize)]
pub struct NewCircuit {
    pub name: String,
}

#[derive(Default)]
pub struct App {
    pub circuits: Mutex<Vec<Circuit>>,
    pub next_id: Mutex<u32>,
}

type St = State<Arc<App>>;

pub fn router(app: Arc<App>) -> Router {
    Router::new()
        .route("/healthz", get(healthz))
        .route("/api/version", get(version))
        .route("/api/circuits", get(list_circuits).post(create_circuit))
        .fallback(spa)
        .with_state(app)
}

async fn healthz() -> Json<Value> {
    Json(json!({"ok": true}))
}

async fn version() -> Json<Value> {
    Json(json!({"name": "breadstone", "version": env!("CARGO_PKG_VERSION")}))
}

async fn list_circuits(State(a): St) -> Json<Value> {
    let circuits = a.circuits.lock().unwrap();
    Json(json!({"circuits": *circuits}))
}

async fn create_circuit(State(a): St, Json(body): Json<NewCircuit>) -> Response {
    if body.name.trim().is_empty() {
        return (StatusCode::BAD_REQUEST, Json(json!({"error": "name must not be empty"}))).into_response();
    }
    let mut next = a.next_id.lock().unwrap();
    let circuit = Circuit {
        id: *next,
        name: body.name.trim().to_string(),
    };
    *next += 1;
    a.circuits.lock().unwrap().push(circuit.clone());
    (StatusCode::CREATED, Json(json!(circuit))).into_response()
}

async fn spa(uri: Uri) -> Response {
    let path = uri.path().trim_start_matches('/');
    if let Some(f) = (!path.is_empty()).then(|| Web::get(path)).flatten() {
        let cache = if path.starts_with("assets/") {
            "public, max-age=31536000, immutable"
        } else {
            "no-cache"
        };
        return (
            [
                (header::CONTENT_TYPE, f.metadata.mimetype().to_string()),
                (header::CACHE_CONTROL, cache.into()),
            ],
            f.data,
        )
            .into_response();
    }
    match Web::get("index.html") {
        Some(f) => (
            [
                (header::CONTENT_TYPE, "text/html; charset=utf-8"),
                (header::CACHE_CONTROL, "no-cache"),
            ],
            f.data,
        )
            .into_response(),
        None => (StatusCode::INTERNAL_SERVER_ERROR, "UI not built").into_response(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::Request;
    use tower::ServiceExt;

    fn app() -> Router {
        router(Arc::new(App::default()))
    }

    async fn status_and_body(resp: Response) -> (StatusCode, String) {
        let status = resp.status();
        let bytes = axum::body::to_bytes(resp.into_body(), 1 << 20).await.unwrap();
        (status, String::from_utf8_lossy(&bytes).to_string())
    }

    #[tokio::test]
    async fn healthz_ok() {
        let resp = app()
            .oneshot(Request::builder().uri("/healthz").body(Body::empty()).unwrap())
            .await
            .unwrap();
        let (status, body) = status_and_body(resp).await;
        assert_eq!(status, StatusCode::OK);
        assert!(body.contains("\"ok\":true"));
    }

    #[tokio::test]
    async fn circuits_roundtrip() {
        let app = app();
        let resp = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/circuits")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(
                        r#"{"name":" oscillator "}#))
                    .unwrap(),
            )
            .await
            .unwrap();
        let (status, body) = status_and_body(resp).await;
        assert_eq!(status, StatusCode::CREATED);
        assert!(body.contains("\"name\":\"oscillator\""));

        let resp = app.clone().oneshot(Request::builder().uri("/api/circuits").body(Body::empty()).unwrap()).await.unwrap();
        let (status, body) = status_and_body(resp).await;
        assert_eq!(status, StatusCode::OK);
        assert!(body.contains("\"name\":\"oscillator\""));

        let resp = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/circuits")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(r#"{"name":"  "}"#,
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();
        let (status, _) = status_and_body(resp).await;
        assert_eq!(status, StatusCode::BAD_REQUEST);
    }
}
