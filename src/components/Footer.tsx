"use client";

import Link from "next/link";
import { Train } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 shadow-inner dark:shadow-lg mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center justify-center mb-6">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Train className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              Lacak KRL
            </span>
          </Link>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
            Pantau perjalanan kereta secara real-time
          </p>
        </div>
        <div className="flex flex-wrap justify-center space-x-4 mb-6">
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors duration-200">
            Beranda
          </Link>
          <Link href="/tracking" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors duration-200">
            Pelacakan KRL
          </Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors duration-200">
            Tentang
          </Link>
        </div>
        <p className="text-gray-500 dark:text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Lacak KRL. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
