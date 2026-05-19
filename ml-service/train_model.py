import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "careers.csv"
MODEL_PATH = BASE_DIR / "models" / "career_model.pkl"
META_PATH = BASE_DIR / "models" / "careers_meta.json"


def main():
    df = pd.read_csv(DATA_PATH)

    feature_cols = ["logical", "creative", "technical", "social", "leadership"]
    X = df[feature_cols].values
    y = df["title"].values

    model = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            ("knn", KNeighborsClassifier(n_neighbors=3, weights="distance")),
        ]
    )
    model.fit(X, y)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    # Store metadata for detail pages
    careers = []
    for _, row in df.iterrows():
        careers.append(
            {
                "title": row["title"],
                "category": row["category"],
                "description": row["description"],
                "skills": str(row["skills"]).split("|"),
                "salaryRange": row["salaryRange"],
                "roadmap": str(row["roadmap"]).split("|"),
                "featureScores": {
                    "logical": int(row["logical"]),
                    "creative": int(row["creative"]),
                    "technical": int(row["technical"]),
                    "social": int(row["social"]),
                    "leadership": int(row["leadership"]),
                },
            }
        )

    with open(META_PATH, "w", encoding="utf-8") as f:
        json.dump({"careers": careers}, f, indent=2)

    print(f"Model saved to {MODEL_PATH}")
    print(f"Metadata saved to {META_PATH}")


if __name__ == "__main__":
    main()
