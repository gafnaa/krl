"use client";

import Link from "next/link";
import { Train, MapPin, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl mb-6 transform hover:scale-105 transition-transform shadow-xl">
            <Train className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-300 dark:to-blue-500 mb-4">
            Selamat Datang di Lacak KRL
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Aplikasi web inovatif untuk memantau posisi estimasi KRL Commuter Line rute{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">Yogyakarta-Palur</span> dan{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">Palur-Yogyakarta</span> secara real-time.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 mb-10 border border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Apa yang Bisa Anda Lakukan?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md">
              <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Lacak Posisi</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lihat perkiraan lokasi kereta Anda di sepanjang rute.
              </p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md">
              <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Jadwal Akurat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Akses jadwal keberangkatan dan kedatangan setiap stasiun.
              </p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md">
              <Train className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Pilih Rute</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pilih rute Jogja-Palur atau Palur-Jogja dengan mudah.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/tracking"
          className="inline-flex items-center px-8 py-4 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
        >
          Mulai Pelacakan KRL
          <span className="ml-2">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
