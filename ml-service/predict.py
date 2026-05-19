import json
from pathlib import Path

import joblib
import numpy as np

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "career_model.pkl"
META_PATH = BASE_DIR / "models" / "careers_meta.json"


def load_assets():
    if not MODEL_PATH.exists() or not META_PATH.exists():
        raise FileNotFoundError(
            "Model or metadata not found. Run train_model.py first."
        )
    model = joblib.load(MODEL_PATH)
    with open(META_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)
    return model, meta["careers"]


def build_explanation(scores):
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top_two = [name for name, _ in sorted_scores[:2]]
    return (
        f"Your strongest areas are {top_two[0]} and {top_two[1]}, "
        "so careers that balance these strengths are recommended."
    )


def predict(scores, top_k=3):
    model, careers = load_assets()
    ordered = [
        scores.get("logical", 0),
        scores.get("creative", 0),
        scores.get("technical", 0),
        scores.get("social", 0),
        scores.get("leadership", 0),
    ]
    X = np.array([ordered])

    try:
        proba = model.predict_proba(X)[0]
        classes = model.classes_
        ranked = sorted(
            zip(classes, proba), key=lambda x: x[1], reverse=True
        )[:top_k]
        top_titles = [title for title, _ in ranked]
    except Exception:
        # Fallback if model does not support probabilities
        top_titles = [model.predict(X)[0]]

    career_lookup = {c["title"]: c for c in careers}
    recommended = [career_lookup[t] for t in top_titles if t in career_lookup]

    return {
        "careers": recommended,
        "explanation": build_explanation(scores),
    }
