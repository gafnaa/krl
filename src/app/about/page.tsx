"use client";

import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl mb-6 transform hover:scale-105 transition-transform shadow-xl">
            <Info className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-300 dark:to-blue-500 mb-4">
            Tentang Lacak KRL
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Lacak KRL adalah proyek yang dibuat untuk membantu pengguna memantau posisi estimasi kereta KRL Commuter Line di rute Yogyakarta-Palur dan Palur-Yogyakarta.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 mb-10 border border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Misi Kami
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Misi kami adalah menyediakan informasi yang akurat dan mudah diakses mengenai jadwal dan posisi kereta, sehingga perjalanan Anda menjadi lebih nyaman dan terencana.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Kami berkomitmen untuk terus meningkatkan fitur dan akurasi aplikasi ini untuk pengalaman pengguna yang lebih baik.
          </p>
        </div>

        <div className="text-gray-600 dark:text-gray-400 text-sm">
          <p>Proyek ini dibuat dengan Next.js, React, dan Tailwind CSS.</p>
          <p className="mt-2">
            Untuk informasi lebih lanjut atau kontribusi, silakan kunjungi repositori proyek.
          </p>
        </div>
      </div>
    </div>
  );
}
