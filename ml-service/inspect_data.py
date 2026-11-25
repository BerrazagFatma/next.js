import pandas as pd

df = pd.read_csv("donnees_entrainement.csv")

print("Nombre total de lignes :", len(df))
print()
print("Statistiques pour echecs_5min :")
print(df["echecs_5min"].describe())
print()
print("Valeurs les plus frequentes de echecs_5min (triees) :")
print(sorted(df["echecs_5min"].unique()))
