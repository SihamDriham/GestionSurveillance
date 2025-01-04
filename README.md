# GestionSurveillance

L'application Gestion de la Surveillance des Examens est conçue pour organiser et répartir de manière équitable les surveillances des examens au sein des départements universitaires. Elle permet de gérer les enseignants, les locaux, ainsi que les plannings de surveillance en respectant des contraintes spécifiques (nombre de surveillants par salle, réservistes, etc.).

## Table des matières

1. [Architecture du projet](#architecture-du-projet)  
2. [Frontend](#frontend)  
   1. [Technologies utilisées](#technologies-utilisées)  
3. [Backend](#backend)  
   1. [Structure du backend](#structure)
4. [Commencer](#commencer)
   1. [Prérequis](#prérequis)  
   2. [Configuration du Backend](#configuration-du-backend)  
   3. [Configuration du Frontend](#configuration-du-frontend)  
   4. [Tester l'application](#tester-lapplication)  
5. [Vidéo Démonstrative](#vidéo-démonstrative)  
6. [Contributrice](#contributrice)  


# Architecture du projet
![archi](https://github.com/user-attachments/assets/b4013e4f-e5c7-448a-bc5b-98e9d2623083)


L'application suit une architecture client-serveur, avec un serveur backend implémenté à l'aide du framework Spring Boot et un client web développé avec ReactJS. Le système permet une communication sécurisée et efficace entre les utilisateurs et le serveur grâce aux APIs REST.

---
# Frontend:
- Authentification sécurisée : Connexion avec gestion des rôles via JWT.
- Interface intuitive : Navigation fluide avec des pages dédiées à la gestion des sessions, des départements, des enseignants, des locaux, des options, des modules et des examens.

### 1.Technologies utilisés:
- React.js : Bibliothéque JavaScript pour construire des interfaces utilisateur réactives.
- Axios : Gestion des requêtes HTTP vers le backend.

# Backend:
- Spring Boot : Framework Java pour développer rapidement des API robustes.
- Spring Security : Module pour l'authentification et l'autorisation.
- JWT (JSON Web Tokens) : Gestion sécurisée des sessions utilisateur.

### 1.Structure:
Backend
- **`com.example.application`**  
  - Classe principale de l'application (`Application.java`) servant de point d'entrée pour Spring Boot.
- **`com.example.controller`**  
  - Contient les contrôleurs pour gérer les requêtes HTTP entrantes et exposer des endpoints RESTful.
- **`com.example.model`**  
  - Définit les entités JPA représentant les tables de la base de données MySQL.
- **`com.example.repository`**  
  - Regroupe les interfaces des repositories Spring Data JPA pour effectuer les opérations CRUD.

---
## Commencer

Suivez ces étapes pour configurer et exécuter le projet **Gestion de la Surveillance des Examens** en local :

### **Prérequis :**

- **JDK 17 ou version ultérieure** : Nécessaire pour exécuter le backend.
- **Node.js** : Requis pour exécuter le frontend ReactJS.
- **MySQL** : Base de données utilisée pour le stockage des données.

---

### **Configuration du Backend :**

1. **Cloner le projet :**
   - Ouvrez un terminal et exécutez les commandes suivantes :
   ```bash
   git clone <url_du_dépôt_backend>
   cd <dossier_du_projet_backend>
   ```

---

### **Configuration du Frontend :**

1. **Cloner le projet :**
   - Ouvrez un terminal et exécutez les commandes suivantes :
   ```bash
   git clone <url_du_dépôt_frontend>
   cd <dossier_du_projet_frontend>

   ```
2. **Installer les dépendances :**
   - Ouvrez un terminal et exécutez le commande suivante :
   ```bash
   npm install
   ```

2. **Lancer le frontend :**
 - Ouvrez un terminal et exécutez le commande suivante :
   ```bash
   npm start
   ```
---

### **Tester l'Application :**
- Une fois le backend et le frontend en cours d'exécution :
  - Accédez à l'interface utilisateur via http://localhost:4000.
  - Connectez-vous.
  - Ajoutez des départements, enseignants, locaux, sessions, examens, options et modules.

Votre application full-stack **GestionSurveillance** est maintenant opérationnelle en local. Si vous rencontrez des problèmes, consultez les journaux de la console pour identifier les messages d'erreur et vérifiez que toutes les dépendances sont correctement installées.

## Vidéo Démonstrative

---

## Contributrice
- DRIHAM Siham [Github](https://github.com/SihamDriham)
- ZENNOURI Nassima [Github](https://github.com/NassimaZENNOURI)
- SABROU Hafsa [Github](https://github.com/Hafsa1sa)
- ZAHIR Oumaima [Github](https://github.com/ZahirOuma)

