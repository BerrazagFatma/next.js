from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()
modele = joblib.load("modele_isolation_forest.joblib")
scaler = joblib.load("scaler.joblib")
bornes = joblib.load("bornes_score.joblib")


class Features(BaseModel):
    echecs_5min: int
    comptes_distincts: int
    ecart_type_delais: float


def score_0_1(brut: float) -> float:
    score = (bornes["max"] - brut) / (bornes["max"] - bornes["min"])
    return max(0.0, min(1.0, score))


@app.post("/score")
def score(features: Features):
    X = scaler.transform(np.array([[
        features.echecs_5min,
        features.comptes_distincts,
        features.ecart_type_delais,
    ]]))

    brut = modele.decision_function(X)[0]
    score_ml = score_0_1(brut)

    return {"score": round(score_ml, 4)}