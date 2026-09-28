# Dedicated REST API Backend Server (Port 5000)

Server backend RESTful API mandiri berbasis **Express.js** dan **TypeScript** untuk Portfolio Management CMS.

---

## 🚀 Cara Menjalankan Server Backend

Pastikan berada di folder `backend/`:

```bash
cd backend
npm install
npm run dev
```

Server akan aktif di:
- **Base URL**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

---

## 📂 Struktur Arsitektur Backend (Layered Clean Architecture)

```text
backend/
├── src/
│   ├── config/
│   │   └── supabase.ts          # Koneksi client ke database PostgreSQL
│   ├── middlewares/
│   │   ├── cors.ts              # Whitelist domain frontend (http://localhost:3000)
│   │   └── errorHandler.ts      # Global centralized error handler (400, 404, 500)
│   ├── controllers/             # Business Logic & Data Handling
│   │   ├── auth.controller.ts
│   │   ├── profile.controller.ts # Data sanitization (mencegah error 400)
│   │   ├── projects.controller.ts # CRUD Proyek & Detail Studi Kasus
│   │   ├── skills.controller.ts
│   │   ├── experiences.controller.ts
│   │   └── messages.controller.ts
│   ├── routes/                  # RESTful API Route Handlers
│   │   ├── auth.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── projects.routes.ts
│   │   ├── skills.routes.ts
│   │   ├── experiences.routes.ts
│   │   ├── messages.routes.ts
│   │   └── index.ts             # Master Router agregator (/api)
│   ├── app.ts                   # Konfigurasi middleware Express & logging
│   └── server.ts                # Entry point server listener (PORT 5000)
├── package.json
└── tsconfig.json
```

---

## 📡 Daftar Endpoint REST API

| Resource | HTTP Method | Endpoint URL | Keterangan |
| :--- | :---: | :--- | :--- |
| **System** | `GET` | `/api/health` | Status kesehatan server |
| **Auth** | `POST` | `/api/auth/login` | Login admin dengan password |
| **Auth** | `POST` | `/api/auth/logout` | Logout admin |
| **Auth** | `GET` | `/api/auth/session` | Cek status sesi login |
| **Profile** | `GET` | `/api/profile` | Mengambil data profil |
| **Profile** | `PUT` | `/api/profile` | Memperbarui profil (dengan payload whitelist) |
| **Projects** | `GET` | `/api/projects` | Mengambil semua proyek & studi kasus |
| **Projects** | `GET` | `/api/projects/:id` | Mengambil proyek spesifik berdasarkan ID |
| **Projects** | `POST` | `/api/projects` | Menambah proyek baru |
| **Projects** | `PUT` | `/api/projects/:id` | Mengedit proyek & checklist studi kasus |
| **Projects** | `DELETE`| `/api/projects/:id` | Menghapus proyek |
| **Skills** | `GET` | `/api/skills` | Mengambil semua keahlian |
| **Skills** | `POST` | `/api/skills` | Menambah keahlian baru |
| **Skills** | `PUT` | `/api/skills/:id` | Update keahlian |
| **Skills** | `DELETE`| `/api/skills/:id` | Menghapus keahlian |
| **Experiences**| `GET` | `/api/experiences` | Mengambil riwayat karir/pendidikan |
| **Experiences**| `POST` | `/api/experiences` | Menambah riwayat |
| **Experiences**| `PUT` | `/api/experiences/:id` | Update riwayat |
| **Experiences**| `DELETE`| `/api/experiences/:id`| Menghapus riwayat |
| **Messages** | `GET` | `/api/messages` | Mengambil pesan dari form kontak |
| **Messages** | `PATCH`| `/api/messages/:id/read` | Menandai pesan telah dibaca |
| **Messages** | `DELETE`| `/api/messages/:id` | Menghapus pesan |

---

## 🎓 Panduan Demo ke Dosen (Live Dual-Terminal)

Untuk mendemonstrasikan pemisahan Frontend & Backend secara meyakinkan ke dosen:

1. **Buka Terminal 1 (Backend)**:
   ```bash
   cd portofolio-admin/backend
   npm run dev
   ```
   *Terminal akan menampilkan:*
   ```text
   🚀 REST API Backend Server is running!
   📡 URL: http://localhost:5000
   🛡️ CORS Allowed Origin: http://localhost:3000
   ```

2. **Buka Terminal 2 (Frontend)**:
   ```bash
   cd portofolio-admin/frontend
   npm run dev
   ```
   *Frontend aktif di `http://localhost:3000`.*

3. **Demonstrasi Interaksi**:
   - Buka browser di `http://localhost:3000`.
   - Lakukan klik simpan profil atau edit proyek di UI.
   - Arahkan perhatian dosen ke **Terminal 1 (Backend)**: Terminal backend akan mencetak log HTTP request secara langsung:
     ```text
     [22.30.12] GET /api/projects
     [22.30.45] PUT /api/profile
     ```
   - Ini membuktikan 100% kepada dosen bahwa frontend dan backend telah terpisah secara nyata dan berkomunikasi melalui protokol HTTP REST API standar.
