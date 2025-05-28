# Lacak KRL Jogja-Palur

Aplikasi web untuk melacak posisi estimasi KRL (Kereta Rel Listrik) rute Yogyakarta-Palur dan Palur-Yogyakarta secara real-time.

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
    git clone https://github.com/gafnaa/krl
    cd krl
    ```
   

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


