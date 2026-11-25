import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib

df = pd.read_csv("donnees_entrainement.csv")

colonnes = ["echecs_5min", "comptes_distincts", "ecart_type_delais"]
X = df[colonnes]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

modele = IsolationForest(
    n_estimators=200,
    contamination=0.23,
    random_state=42,
)
modele.fit(X_scaled)

# On calcule les scores bruts sur toutes les données d'entraînement,
# pour connaître la vraie plage min/max et transformer en 0-1 ensuite.
scores_bruts = modele.decision_function(X_scaled)
score_min = float(scores_bruts.min())
score_max = float(scores_bruts.max())

joblib.dump(modele, "modele_isolation_forest.joblib")
joblib.dump(scaler, "scaler.joblib")
joblib.dump({"min": score_min, "max": score_max}, "bornes_score.joblib")

print("Modèle, normaliseur et bornes sauvegardés")
print(f"Score brut min : {score_min:.4f}, max : {score_max:.4f}")