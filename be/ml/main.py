from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os

app = FastAPI(title="Task Risk Prediction API")

# Load model and features
MODEL_PATH = "model.pkl"
FEATURES_PATH = "features.pkl"

if os.path.exists(MODEL_PATH) and os.path.exists(FEATURES_PATH):
    model = joblib.load(MODEL_PATH)
    model_features = joblib.load(FEATURES_PATH)
else:
    model = None
    model_features = None

class TaskInput(BaseModel):
    task_age: float
    time_to_due: float
    block_count: int
    total_blocked_hours: float
    column_change_count: int
    time_in_current_column: float
    dependency_count: int
    unresolved_dependencies: int
    assignee_count: int
    estimateHours: float
    difficulty: int
    progress_ratio: float
    is_overdue: int
    blocked_ratio: float
    reassign_count: int
    comment_count: int
    desc_length: int
    assignee_workload: int

@app.post("/predict")
async def predict(data: TaskInput):
    if model is None:
        # Fallback heuristic
        score = 0.1
        if data.is_overdue: score += 0.5
        if data.unresolved_dependencies >= 2: score += 0.2
        if data.assignee_workload > 5: score += 0.15
        if data.difficulty >= 4 and data.desc_length < 50: score += 0.2
        return {"riskScore": min(score, 1.0)}

    # Convert input to DataFrame
    input_dict = data.dict()
    df = pd.DataFrame([input_dict])
    
    # Ensure columns match training features
    df = df[model_features]
    
    # Predict probability
    prediction_proba = model.predict_proba(df)
    risk_score = float(prediction_proba[0][1])
    
    return {"riskScore": risk_score}

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": model is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
