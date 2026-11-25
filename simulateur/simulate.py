import requests
import random
import time

URL = "http://localhost:3000/api/ingest"
CLE = "6211e54e4393b5d3084fe1fede3293a8da15b37a19d67d88"

HEADERS = {"Content-Type": "application/json", "x-api-key": CLE}


def envoyer(system, ip, account, success):
    requests.post(URL, headers=HEADERS, json={
        "system": system,
        "ip": ip,
        "account": account,
        "success": success,
    })


def trafic_normal(nombre=15):
    print(f"Trafic normal : {nombre} connexions...")
    comptes = ["sara", "karim", "nadia", "amine"]
    for _ in range(nombre):
        compte = random.choice(comptes)
        ip = f"41.226.10.{random.randint(1, 20)}"
        reussie = random.random() > 0.15  # 85 % de réussite
        envoyer("VPN", ip, compte, reussie)
        time.sleep(0.3)
    print("Trafic normal terminé.\n")


def attaque_force_brute(ip="192.0.2.200", nombre=35):
    print(f"Attaque force brute : {nombre} tentatives depuis {ip}...")
    for _ in range(nombre):
        envoyer("SSH", ip, "admin", False)
        time.sleep(0.1)
    print("Attaque terminée.\n")


def attaque_comptes_multiples(ip="192.0.2.201", repetitions=3):
    comptes = ["admin", "root", "user1", "user2", "test",
               "backup", "support", "sara", "karim", "nadia"]
    print(f"Attaque sur plusieurs comptes depuis {ip}...")
    for _ in range(repetitions):
        for compte in comptes:
            envoyer("VPN", ip, compte, False)
            time.sleep(0.1)
    print("Attaque terminée.\n")


if __name__ == "__main__":
    trafic_normal(15)
    time.sleep(1)
    attaque_force_brute()
    time.sleep(1)
    attaque_comptes_multiples()