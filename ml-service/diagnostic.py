import joblib
import numpy as np

modele = joblib.load("modele_isolation_forest.joblib")
scaler = joblib.load("scaler.joblib")
bornes = joblib.load("bornes_score.joblib")

def score_0_1(brut):
    score = (bornes["max"] - brut) / (bornes["max"] - bornes["min"])
    return max(0.0, min(1.0, score))

cas = [
    ("Normal 1 échec", [1, 1, 30]),
    ("Normal 3 échecs", [3, 1, 20]),
    ("Normal 5 échecs", [5, 1, 15]),
    ("Attaque 15 échecs", [15, 1, 1]),
    ("Attaque 20 échecs", [20, 1, 1]),
    ("Attaque 25 échecs", [25, 1, 1]),
    ("Attaque 30 échecs", [30, 1, 1]),
    ("Attaque 35 échecs", [35, 1, 1]),
    ("Attaque 40 échecs", [40, 1, 1]),
    ("Attaque 45 échecs", [45, 1, 1]),
]

print(f"{'Cas':25} {'score (0 à 1)'}")
for nom, features in cas:
    X = scaler.transform(np.array([features]))
    brut = modele.decision_function(X)[0]
    print(f"{nom:25} {score_0_1(brut):.4f}")