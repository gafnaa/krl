# Lacak KRL Jogja-Palur

Aplikasi web untuk melacak posisi estimasi KRL (Kereta Rel Listrik) rute Yogyakarta-Palur dan Palur-Yogyakarta secara real-time.

## Deskripsi Proyek

Proyek ini bertujuan untuk menyediakan antarmuka yang nyaman dan mudah digunakan bagi penumpang KRL untuk memantau perkiraan lokasi kereta mereka. Dengan fokus pada pengalaman pengguna seluler, aplikasi ini menampilkan jadwal kereta, stasiun saat ini, dan progres perjalanan.

## Fitur

*   **Pelacakan Real-time (Estimasi):** Menampilkan perkiraan posisi kereta berdasarkan jadwal yang telah ditentukan.
*   **Dua Arah Rute:** Mendukung pelacakan untuk rute Yogyakarta-Palur dan Palur-Yogyakarta.
*   **Pilihan Waktu Keberangkatan:** Pengguna dapat memilih waktu keberangkatan kereta tertentu untuk dilacak.
*   **Antarmuka Pengguna yang Intuitif:** Desain yang bersih dan responsif, dioptimalkan untuk perangkat seluler.
*   **Progres Perjalanan:** Menampilkan persentase progres perjalanan kereta.
*   **Informasi Stasiun:** Daftar stasiun dengan waktu keberangkatan/kedatangan yang relevan.

## Cara Menjalankan Proyek

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

### Instalasi

1.  **Kloning repositori:**
    ```bash
    git clone [URL_REPOSITORI_ANDA]
    cd lacak-krl
    ```
    *(Catatan: Ganti `[URL_REPOSITORI_ANDA]` dengan URL repositori yang sebenarnya jika ini adalah proyek Git.)*

2.  **Instal dependensi:**
    Pastikan Anda memiliki Node.js dan npm/yarn terinstal.
    ```bash
    npm install
    # atau
    yarn install
    ```

### Penggunaan

1.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    # atau
    yarn dev
    ```
2.  Buka browser Anda dan navigasikan ke `http://localhost:3000`.

## Sumber Data

Data jadwal kereta api diambil dari `src/data/trainSchedule.json`. File ini berisi informasi rute, daftar stasiun, dan waktu keberangkatan/kedatangan untuk setiap stasiun.

## Teknologi yang Digunakan

*   **Next.js:** Kerangka kerja React untuk aplikasi web.
*   **React:** Pustaka JavaScript untuk membangun antarmuka pengguna.
*   **Tailwind CSS:** Kerangka kerja CSS untuk styling cepat dan responsif.
*   **Lucide React:** Koleksi ikon.
