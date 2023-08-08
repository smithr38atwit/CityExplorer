import uvicorn

# Main entry point for running back end
if __name__ == "__main__":
    uvicorn.run(
        "server.app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        ssl_keyfile="backend\certs\key.pem",
        ssl_certfile="backend\certs\cert.pem",
    )
