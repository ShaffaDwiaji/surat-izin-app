import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Portal Digital Campus - Darman Prasetyo",
  description: "Sistem Layanan Terpadu Darman Prasetyo Campus",
};

export default function MonitoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Menggunakan tag <div> agar jelas terbaca sebagai komponen React
  return (
    <div>
      {children}
    </div>
  );
}