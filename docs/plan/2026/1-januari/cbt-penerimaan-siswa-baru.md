# Rencana CBT Penerimaan Siswa Baru MTS Cendekia

## Ringkasan Proyek
Sistem Computer Based Test (CBT) untuk penerimaan siswa baru MTS Cendekia dengan fitur:
- Tanpa login untuk siswa (cukup isi data diri)
- Timer yang bisa diatur per tes
- Soal pilihan ganda
- Admin panel lengkap untuk mengelola soal dan melihat hasil
- Role-based access: Admin (full access) dan Guru (terbatas)

## Teknologi
- **Framework**: Next.js 16.1.4 (App Router)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database ORM**: Prisma 7 (terbaru)
- **Authentication**: Better Auth (terbaru)
- **Language**: TypeScript
- **UI Components**: shadcn/ui (Radix UI primitives)

---

## Arsitektur Sistem

```mermaid
graph TB
    subgraph "Frontend"
        A[Halaman Landing] --> B[Form Data Diri]
        B --> C[Halaman Tes]
        C --> D[Halaman Hasil]
        E[Admin Login] --> F[Admin Dashboard]
        F --> G[Kelola Soal]
        F --> H[Kelola Tes]
        F --> I[Lihat Hasil]
    end
    
    subgraph "Backend API"
        J[/api/auth/*] --> K[Better Auth]
        L[/api/cbt/*] --> M[CBT Handlers]
        N[/api/admin/*] --> O[Admin Handlers]
    end
    
    subgraph "Database"
        P[(PostgreSQL)]
    end
    
    A --> J
    B --> L
    C --> L
    D --> L
    E --> J
    F --> N
    G --> N
    H --> N
    I --> N
    
    K --> P
    M --> P
    O --> P
```

---

## Struktur Database (Prisma Schema)

### Model Utama

```prisma
// User (Admin)
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  tests     Test[]
}

// Tes
model Test {
  id          String   @id @default(cuid())
  title       String
  description String?
  duration    Int      // dalam menit
  isActive    Boolean  @default(false)
  startDate   DateTime?
  endDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  questions   Question[]
  results     Result[]
}

// Soal
model Question {
  id          String   @id @default(cuid())
  testId      String
  test        Test     @relation(fields: [testId], references: [id], onDelete: Cascade)
  question    String
  options     Json     // ["A", "B", "C", "D"]
  correctAnswer String // "A", "B", "C", atau "D"
  order       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  answers     Answer[]
}

// Hasil Tes Siswa
model Result {
  id          String   @id @default(cuid())
  testId      String
  test        Test     @relation(fields: [testId], references: [id], onDelete: Cascade)
  
  // Data Diri Siswa
  studentName String
  studentNISN String?
  studentEmail String?
  studentPhone String?
  
  // Hasil Tes
  score       Int
  totalQuestions Int
  correctAnswers Int
  timeSpent   Int      // dalam detik
  startedAt   DateTime
  finishedAt  DateTime
  
  createdAt   DateTime @default(now())
  
  answers     Answer[]
}

// Jawaban Siswa
model Answer {
  id          String   @id @default(cuid())
  resultId    String
  result      Result   @relation(fields: [resultId], references: [id], onDelete: Cascade)
  questionId  String
  question    Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  selectedAnswer String
  isCorrect   Boolean
  createdAt   DateTime @default(now())
}

enum Role {
  ADMIN
  GURU
}
```

---

## Struktur Direktori Proyek (Modular)

```
cbt-mts-cendekia/
├── app/
│   ├── (auth)/
│   │   └── admin/
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── layout.tsx
│   ├── (cbt)/
│   │   ├── register/
│   │   │   └── page.tsx          # Form data diri siswa
│   │   ├── test/
│   │   │   ├── [testId]/
│   │   │   │   └── page.tsx      # Halaman tes dengan timer
│   │   │   └── page.tsx          # Pilih tes aktif
│   │   └── result/
│   │       └── [resultId]/
│   │           └── page.tsx      # Halaman hasil
│   ├── (admin)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── tests/
│   │   │   ├── page.tsx         # List tes
│   │   │   ├── new/
│   │   │   │   └── page.tsx     # Buat tes baru
│   │   │   └── [testId]/
│   │   │       ├── page.tsx     # Detail tes
│   │   │       └── questions/
│   │   │           ├── page.tsx # List soal
│   │   │           └── new/
│   │   │               └── page.tsx # Tambah soal
│   │   ├── users/
│   │   │   └── page.tsx         # Manajemen user (admin only)
│   │   └── results/
│   │       └── page.tsx         # Lihat semua hasil
│   ├── (guru)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── tests/
│   │   │   └── [testId]/
│   │   │       └── questions/
│   │   │           ├── page.tsx # List soal (assigned only)
│   │   │           └── new/
│   │   │               └── page.tsx # Tambah soal
│   │   └── results/
│   │       └── page.tsx         # Lihat hasil (assigned only)
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── cbt/
│   │   │   ├── register/
│   │   │   │   └── route.ts
│   │   │   ├── start/
│   │   │   │   └── route.ts
│   │   │   ├── submit/
│   │   │   │   └── route.ts
│   │   │   └── timer/
│   │   │       └── route.ts
│   │   └── admin/
│   │       ├── tests/
│   │       │   ├── route.ts
│   │       │   └── [testId]/
│   │       │       └── route.ts
│   │       ├── questions/
│   │       │   ├── route.ts
│   │       │   └── [questionId]/
│   │       │       └── route.ts
│   │       ├── results/
│   │       │   └── route.ts
│   │       └── users/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                      # Komponen UI reusable
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   └── toast.tsx
│   ├── cbt/
│   │   ├── timer.tsx            # Komponen timer
│   │   ├── question-card.tsx    # Kartu soal
│   │   ├── question-nav.tsx     # Navigasi soal
│   │   └── result-summary.tsx   # Ringkasan hasil
│   ├── admin/
│   │   ├── sidebar.tsx
│   │   ├── test-form.tsx
│   │   ├── question-form.tsx
│   │   ├── results-table.tsx
│   │   └── user-form.tsx
│   ├── guru/
│   │   ├── sidebar.tsx
│   │   └── question-form.tsx
│   └── layout/
│       ├── header.tsx
│       └── footer.tsx
├── lib/
│   ├── prisma.ts                # Prisma client
│   ├── auth.ts                  # Better Auth config
│   ├── utils.ts                 # Utility functions
│   └── validations.ts           # Zod schemas
├── services/                    # Business logic layer
│   ├── auth.service.ts          # Auth operations
│   ├── test.service.ts          # Test operations
│   ├── question.service.ts      # Question operations
│   ├── result.service.ts        # Result operations
│   └── user.service.ts         # User operations
├── repositories/                # Database access layer
│   ├── test.repository.ts
│   ├── question.repository.ts
│   ├── result.repository.ts
│   └── user.repository.ts
├── hooks/                      # Custom React hooks
│   ├── use-timer.ts
│   ├── use-test.ts
│   └── use-auth.ts
├── constants/                   # Application constants
│   ├── roles.ts
│   └── messages.ts
├── types/
│   └── index.ts                 # TypeScript types
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── public/
```

### Prinsip Modularitas

**Saran: Hybrid Approach (Feature + Layer)**

1. **Separation of Concerns**
   - `app/`: Routes dan pages (Next.js App Router)
   - `features/`: Feature-based organization untuk domain logic
   - `components/`: UI components terpisah berdasarkan fitur
   - `shared/`: Shared utilities dan reusable code

2. **Single Responsibility**
   - Setiap feature folder berisi semua file terkait fitur tersebut
   - Setiap service hanya menangani satu domain
   - Setiap repository hanya menangani database operations
   - Setiap component hanya menangani UI rendering

3. **Dependency Injection**
   - Services menggunakan repositories untuk database access
   - Routes menggunakan services untuk business logic
   - Components menggunakan hooks untuk state management

4. **Reusability**
   - UI components di `components/ui/` reusable di seluruh aplikasi
   - Hooks di `shared/hooks/` reusable di berbagai components
   - Constants di `shared/constants/` centralized configuration

### Struktur Direktori Modular (Feature-Based)

```
cbt-mts-cendekia/
├── app/
│   ├── (auth)/
│   │   └── admin/
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── layout.tsx
│   ├── (cbt)/
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── test/
│   │   │   ├── [testId]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── result/
│   │       └── [resultId]/
│   │           └── page.tsx
│   ├── (admin)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── tests/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [testId]/
│   │   │       ├── page.tsx
│   │   │       └── questions/
│   │   │           ├── page.tsx
│   │   │           └── new/
│   │   │               └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   └── results/
│   │       └── page.tsx
│   ├── (guru)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── tests/
│   │   │   └── [testId]/
│   │   │       └── questions/
│   │   │           ├── page.tsx
│   │   │           └── new/
│   │   │               └── page.tsx
│   │   └── results/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── cbt/
│   │   │   ├── register/
│   │   │   │   └── route.ts
│   │   │   ├── start/
│   │   │   │   └── route.ts
│   │   │   ├── submit/
│   │   │   │   └── route.ts
│   │   │   └── timer/
│   │   │       └── route.ts
│   │   ├── admin/
│   │   │   ├── tests/
│   │   │   │   ├── route.ts
│   │   │   │   └── [testId]/
│   │   │   │       └── route.ts
│   │   │   ├── questions/
│   │   │   │   ├── route.ts
│   │   │   │   └── [questionId]/
│   │   │   │       └── route.ts
│   │   │   ├── results/
│   │   │   │   └── route.ts
│   │   │   └── users/
│   │   │       └── route.ts
│   │   └── guru/
│   │       ├── questions/
│   │       │   ├── route.ts
│   │       │   └── [questionId]/
│   │       │       └── route.ts
│   │       └── results/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── features/                    # Feature-based organization
│   ├── auth/
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── repositories/
│   │   │   └── user.repository.ts
│   │   ├── hooks/
│   │   │   └── use-auth.ts
│   │   └── types/
│   │       └── auth.types.ts
│   ├── test/
│   │   ├── services/
│   │   │   └── test.service.ts
│   │   ├── repositories/
│   │   │   └── test.repository.ts
│   │   ├── hooks/
│   │   │   └── use-test.ts
│   │   └── types/
│   │       └── test.types.ts
│   ├── question/
│   │   ├── services/
│   │   │   └── question.service.ts
│   │   ├── repositories/
│   │   │   └── question.repository.ts
│   │   └── types/
│   │       └── question.types.ts
│   ├── result/
│   │   ├── services/
│   │   │   └── result.service.ts
│   │   ├── repositories/
│   │   │   └── result.repository.ts
│   │   └── types/
│   │       └── result.types.ts
│   └── user/
│       ├── services/
│       │   └── user.service.ts
│       ├── repositories/
│       │   └── user.repository.ts
│       └── types/
│           └── user.types.ts
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   ├── table.tsx
│   │   ├── select.tsx
│   │   ├── label.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── cbt/
│   │   ├── timer.tsx
│   │   ├── question-card.tsx
│   │   ├── question-nav.tsx
│   │   └── result-summary.tsx
│   ├── admin/
│   │   ├── sidebar.tsx
│   │   ├── test-form.tsx
│   │   ├── question-form.tsx
│   │   ├── results-table.tsx
│   │   └── user-form.tsx
│   ├── guru/
│   │   ├── sidebar.tsx
│   │   └── question-form.tsx
│   └── layout/
│       ├── header.tsx
│       └── footer.tsx
├── shared/                      # Shared utilities
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   └── use-timer.ts
│   ├── constants/
│   │   ├── roles.ts
│   │   └── messages.ts
│   └── validations/
│       └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── public/
```

### Keuntungan Feature-Based Organization

1. **Cohesion Tinggi**
   - Semua file terkait satu fitur berada dalam satu folder
   - Mudah menemukan dan memodifikasi kode untuk fitur tertentu

2. **Independent Development**
   - Setiap fitur bisa dikembangkan secara independen
   - Tim bisa bekerja pada fitur berbeda tanpa konflik

3. **Easy Testing**
   - Test untuk setiap fitur bisa ditempatkan di folder yang sama
   - Mocking dependencies lebih mudah

4. **Scalability**
   - Menambah fitur baru cukup buat folder baru di `features/`
   - Menghapus fitur cukup hapus folder fitur tersebut

5. **Clear Boundaries**
   - Batas antar fitur jelas
   - Mengurangi coupling antar fitur

---

## Todo List Implementasi

### Fase 1: Setup & Konfigurasi
- [x] Install Prisma 7 dan setup database
- [x] Setup Better Auth
- [x] Setup shadcn/ui (init, add components)
- [x] Buat Prisma schema lengkap
- [x] Jalankan migration database
- [x] Setup environment variables (.env)
- [x] Buat struktur direktori

### Fase 2: Backend API
- [x] Implementasi Better Auth (login admin)
- [x] API: Register siswa (simpan data diri)
- [x] API: Start tes (ambil soal, set timer)
- [x] API: Submit jawaban (simpan progress)
- [x] API: Finish tes (hitung skor, simpan hasil)
- [x] API: CRUD Tes (admin)
- [x] API: CRUD Soal (admin)
- [x] API: Get hasil tes (admin)

### Fase 3: Frontend - Siswa
- [x] Halaman landing / home
- [x] Form data diri siswa (validasi)
- [x] Halaman pilih tes aktif
- [x] Halaman tes dengan:
  - Timer countdown
  - Navigasi soal (prev/next)
  - Daftar nomor soal
  - Auto-save jawaban
  - Konfirmasi selesai
- [x] Halaman hasil tes (score, review jawaban)

### Fase 4: Frontend - Admin
- [x] Login admin
- [x] Dashboard overview
- [x] Manajemen Tes:
  - List tes
  - Buat tes baru
  - Edit tes
  - Aktifkan/nonaktifkan tes
- [x] Manajemen Soal:
  - List soal per tes
  - Tambah soal
  - Edit soal
  - Hapus soal
  - Reorder soal
- [x] Lihat Hasil:
  - List semua hasil
  - Detail hasil per siswa
  - Export data (CSV/Excel)

### Fase 5: Fitur Tambahan
- [ ] Validasi form dengan Zod
- [x] Toast notifications
- [x] Loading states
- [x] Error handling
- [x] Responsive design (mobile-friendly)
- [ ] Security (rate limiting, input sanitization)

### Fase 6: Testing & Deployment
- [ ] Testing manual semua fitur
- [ ] Fix bugs
- [ ] Optimize performance
- [ ] Deploy ke production

---

## Fitur Detail

### Untuk Siswa
1. **Form Data Diri**
   - Nama lengkap (wajib)
   - NISN (opsional)
   - Email (opsional)
   - No. HP (opsional)

2. **Halaman Tes**
   - Timer countdown real-time
   - Navigasi soal (prev/next)
   - Daftar nomor soal dengan status:
     - Belum dijawab (abu-abu)
     - Sudah dijawab (biru)
     - Soal saat ini (kuning)
   - Auto-save jawaban setiap 30 detik
   - Auto-submit saat waktu habis
   - Konfirmasi sebelum submit

3. **Halaman Hasil**
   - Skor total
   - Jumlah benar/salah
   - Waktu yang digunakan
   - Review jawaban (opsional)

### Untuk Admin
1. **Dashboard**
   - Statistik: total tes, total peserta, rata-rata skor
   - Manajemen user (tambah/hapus admin & guru)

2. **Manajemen Tes**
   - Buat tes baru (judul, deskripsi, durasi)
   - Edit tes
   - Aktifkan/nonaktifkan tes
   - Set periode tes (start date, end date)
   - Assign tes ke guru (opsional)

3. **Manajemen Soal**
   - Tambah soal pilihan ganda
   - Edit soal
   - Hapus soal
   - Reorder soal
   - Import soal dari CSV/Excel (opsional)

4. **Lihat Hasil**
   - List semua hasil tes
   - Filter berdasarkan tes
   - Detail hasil per siswa
   - Export ke CSV/Excel

### Untuk Guru
1. **Dashboard**
   - Statistik: tes yang diassign, total peserta, rata-rata skor

2. **Manajemen Soal**
   - Tambah soal pilihan ganda (hanya tes yang diassign)
   - Edit soal (hanya tes yang diassign)
   - Reorder soal

3. **Lihat Hasil**
   - List hasil tes (hanya tes yang diassign)
   - Detail hasil per siswa
   - Export ke CSV/Excel

---

## Security Considerations
- Rate limiting pada API endpoints
- Input sanitization untuk mencegah XSS
- CSRF protection
- Validasi data di client dan server
- Password hashing (bcrypt)
- Environment variables untuk sensitive data

---

## Catatan Penting
- Siswa tidak perlu login, hanya isi data diri
- Timer berjalan di client dengan sync ke server
- Jawaban di-save secara berkala
- Auto-submit saat waktu habis
- Admin & Guru panel butuh login dengan Better Auth
- Admin memiliki akses penuh ke semua fitur
- Guru memiliki akses terbatas (hanya tes yang diassign)

---

## Penyesuaian Hasil Diskusi (Januari 2026)

### 1. Keamanan & Integritas Sesi Siswa
- Meskipun tes dilakukan di sekolah dan tanpa login, sistem akan menggunakan **Unique Session Token** (disimpan di LocalStorage atau Cookie) setelah siswa mengisi data diri.
- Jika browser tertutup atau terjadi kendala teknis, siswa dapat melanjutkan tes yang sama selama token masih valid dan waktu belum habis (Auto-resume).

### 2. Dukungan Media pada Soal
- Update pada model `Question`: Menambahkan field `image` (String, opsional) untuk mendukung soal bergambar, terutama untuk soal Matematika atau IPA tingkat SD.

### 3. Integritas Data & Kebijakan Edit
- Guru atau Admin dilarang untuk mengedit atau menghapus soal jika tes tersebut sedang aktif (`isActive: true`) atau sudah memiliki data hasil siswa (`Result`).
- Tombol edit akan di-disable untuk mencegah inkonsistensi nilai siswa.

### 4. Monitoring Real-time (Schema Result)
- Update pada model `Result`: Menambahkan field `status` dengan tipe Enum `TestStatus`:
    - `IN_PROGRESS`: Sedang mengerjakan.
    - `FINISHED`: Selesai secara manual oleh siswa.
    - `TIMED_OUT`: Selesai otomatis karena waktu habis.
- Hal ini mempermudah monitoring progres siswa di Dashboard Admin secara real-time.
