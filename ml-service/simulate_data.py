import pandas as pd
import random

def generer_normal(n=500):
    lignes = []
    for _ in range(n):
        lignes.append({
            "echecs_5min": random.randint(0, 5),
            "comptes_distincts": random.choice([1, 1, 1, 2]),
            "ecart_type_delais": round(random.uniform(5, 60), 2),
        })
    return lignes

def generer_attaques(n=300):
    lignes = []
    for _ in range(n):
        type_attaque = random.choice(["force_brute", "comptes_multiples"])
        if type_attaque == "force_brute":
            lignes.append({
                "echecs_5min": random.randint(25, 45),
                "comptes_distincts": 1,
                "ecart_type_delais": round(random.uniform(0, 1.5), 2),
            })
        else:
            lignes.append({
                "echecs_5min": random.randint(15, 35),
                "comptes_distincts": random.randint(6, 15),
                "ecart_type_delais": round(random.uniform(0, 2), 2),
            })
    return lignes
if __name__ == "__main__":
    normal = generer_normal(1000)
    attaques = generer_attaques(300)
    df = pd.DataFrame(normal + attaques)
    df.to_csv("donnees_entrainement.csv", index=False)
    print(f"{len(df)} lignes générées dans donnees_entrainement.csv")