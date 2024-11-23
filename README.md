# 🚗⌨️ CLI qui communique avec le Vehicle Server ⌨️🚗

## Installation

```bash
npm ci && npm run start
```

## Utilisation

✅ Assurer-vous d'avoir lancé votre serveur vehicule-server avant de pour utilisez les commandes de notre CLI

#### Créer un véhicule et ajouter à la base de données

```bash
vehicle-cli --address=localhost:8080 create-vehicle --shortcode=abcd --battery=12 --longitude=20.0 --latitude=30.0
```

#### Lister les vehicules

```bash
vehicle-cli --address=localhost:8080  list-vehicles
```