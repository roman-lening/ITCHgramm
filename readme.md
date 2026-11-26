# ITCHgram

**A Full-Stack Social Media Application**  
**Eine Full-Stack-Social-Media-Anwendung**

🌐 **Live demo:** [itchgram.de](https://itchgram.de)  
💻 **Repository:** [GitHub](https://github.com/roman-lening/ITCHgramm)

[English](#english) · [Deutsch](#deutsch)

---

## English

### About the project

**ITCHgram** is a full-stack social media application inspired by Instagram. It was built as a practical web development project to bring together a modern React interface, a REST API, authentication, a database, and cloud services.

Users can register, customize their profiles, share photos and short videos, discover other users, follow accounts, and interact with posts through likes and comments.

### Implemented features

**Accounts and profiles**
- Register and log in with JWT-based authentication
- Recover a password using a code sent by email
- Access protected pages only when authenticated
- View and edit a personal profile, including the profile picture
- Find users by username or full name
- Follow and unfollow other users

**Posts and interactions**
- Publish photos and short videos with descriptions
- Browse posts in **Home** and **Explore**
- Open posts in a detailed view
- Like and unlike posts
- Delete your own posts
- Read and write comments
- Like and unlike comments
- Insert emojis when writing comments

### Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, JavaScript, Vite, Material UI, Emotion |
| State management | Redux Toolkit, React Redux |
| Navigation and forms | React Router, React Hook Form |
| API communication | Axios, REST API |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication and security | JWT, bcrypt, CORS, express-rate-limit |
| Media uploads | Multer, Cloudinary |
| Email | Resend |
| Deployment | Vercel (frontend), Railway (backend), MongoDB Atlas (database) |

### How it works

1. The **React frontend** displays the interface and sends HTTP requests with **Axios**.
2. **Redux Toolkit** manages shared state, such as users, posts, likes, and comments.
3. The **Express REST API** validates requests, checks authorization, and processes application logic.
4. **Mongoose** stores and retrieves data in **MongoDB Atlas**.
5. **Cloudinary** stores uploaded images and videos; **Resend** handles application emails.

### Project structure

```text
ITCHgramm/
├── client/      # React + Vite frontend
├── server/      # Express + MongoDB backend
└── readme.md    # Project documentation
```

### Run locally

**Prerequisites:** Node.js, npm, a MongoDB connection, and credentials for the cloud services used by the application.

Clone the repository:

```bash
git clone https://github.com/roman-lening/ITCHgramm.git
cd ITCHgramm
```

**1. Start the backend**

```bash
cd server
npm install
```

Create `server/.env` and provide your own values:

```dotenv
PORT=3333
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_key
EMAIL_FROM=your_verified_sender_email
```

Then start the development server:

```bash
npm run dev
```

**2. Start the frontend** in another terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```dotenv
VITE_API_URL=http://localhost:3333
```

Start Vite:

```bash
npm run dev
```

The frontend normally runs at `http://localhost:5173`. Some features require valid Cloudinary and Resend credentials. **Never commit real `.env` files or secrets.**

### Project status

**Functional educational MVP.** The core features of a social media application have been implemented. ITCHgram is a learning project and should not be considered a production-hardened commercial platform.

---

## Deutsch

### Über das Projekt

**ITCHgram** ist eine Full-Stack-Social-Media-Anwendung, die von Instagram inspiriert wurde. Sie entstand als praxisorientiertes Webentwicklungsprojekt und verbindet eine moderne React-Benutzeroberfläche mit einer REST-API, Authentifizierung, einer Datenbank und verschiedenen Cloud-Diensten.

Nutzer können sich registrieren, ihre Profile bearbeiten, Fotos und kurze Videos veröffentlichen, andere Nutzer entdecken, ihnen folgen und über Likes und Kommentare mit Beiträgen interagieren.

### Implementierte Funktionen

**Konten und Profile**
- Registrierung und Anmeldung mit JWT-basierter Authentifizierung
- Passwortwiederherstellung mit einem per E-Mail versendeten Code
- Geschützte Seiten für angemeldete Nutzer
- Eigenes Profil und Profilbild ansehen und bearbeiten
- Nutzersuche nach Benutzername oder vollständigem Namen
- Anderen Nutzern folgen und entfolgen

**Beiträge und Interaktionen**
- Fotos und kurze Videos mit Beschreibungen veröffentlichen
- Beiträge in **Home** und **Explore** entdecken
- Einzelne Beiträge in einer Detailansicht öffnen
- Beiträge liken und Likes entfernen
- Eigene Beiträge löschen
- Kommentare lesen und verfassen
- Kommentare liken und Likes entfernen
- Emojis in Kommentare einfügen

### Verwendete Technologien

| Bereich | Technologien |
| --- | --- |
| Frontend | React, JavaScript, Vite, Material UI, Emotion |
| Zustandsverwaltung | Redux Toolkit, React Redux |
| Navigation und Formulare | React Router, React Hook Form |
| API-Kommunikation | Axios, REST API |
| Backend | Node.js, Express.js |
| Datenbank | MongoDB, Mongoose |
| Authentifizierung und Sicherheit | JWT, bcrypt, CORS, express-rate-limit |
| Datei-Uploads | Multer, Cloudinary |
| E-Mail-Versand | Resend |
| Hosting | Vercel (Frontend), Railway (Backend), MongoDB Atlas (Datenbank) |

### Architektur

1. Das **React-Frontend** stellt die Benutzeroberfläche dar und sendet HTTP-Anfragen über **Axios**.
2. **Redux Toolkit** verwaltet gemeinsame Anwendungsdaten wie Nutzer, Beiträge, Likes und Kommentare.
3. Die **Express-REST-API** prüft Anfragen und Berechtigungen und verarbeitet die Anwendungslogik.
4. **Mongoose** speichert und liest Daten aus **MongoDB Atlas**.
5. **Cloudinary** speichert Bilder und Videos; **Resend** übernimmt den E-Mail-Versand.

### Projektstruktur und lokaler Start

Das Repository enthält zwei Hauptverzeichnisse: `client/` für das React-Frontend und `server/` für das Express-Backend.

Für den lokalen Start müssen in beiden Verzeichnissen die Abhängigkeiten mit `npm install` installiert und die erforderlichen Umgebungsvariablen konfiguriert werden. Anschließend können Frontend und Backend jeweils mit `npm run dev` gestartet werden.

Die ausführlichen Befehle und Beispielkonfigurationen stehen oben unter [Run locally](#run-locally). Eigene Zugangsdaten sind erforderlich; echte `.env`-Dateien und Zugangsschlüssel dürfen nicht veröffentlicht werden.

### Projektstatus

**Funktionsfähiger Lernprototyp (MVP).** Die wichtigsten Funktionen eines sozialen Netzwerks sind umgesetzt. ITCHgram ist ein Lernprojekt und keine vollständig für den kommerziellen Produktivbetrieb abgesicherte Plattform.

---

**ITCHgram — built to learn full-stack development.**  
🌐 [itchgram.de](https://itchgram.de)
