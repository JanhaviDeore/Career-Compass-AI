from fastapi import FastAPI, HTTPException, Request

from predict import predict

app = FastAPI(title="Career Compass ML Service")


@app.get("/")
def root():
    return {"status": "ML service running"}


@app.post("/predict")
async def predict_endpoint(request: Request):
    try:
        try:
            payload = await request.json()
        except Exception:
            raise ValueError("Invalid JSON body. Expected {scores:{...}}.")

        if not isinstance(payload, dict):
            raise ValueError("Invalid JSON body. Expected an object.")

        scores = payload.get("scores", payload)
        top_k = payload.get("top_k", 3)

        result = predict(scores, top_k)
        return result
    except Exception as exc:
        # Helpful error detail for debugging
        raise HTTPException(status_code=500, detail=str(exc))
