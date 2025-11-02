import uvicorn

if __name__ == "__main__":
    # Start dev server on port 8000 (team default)
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
