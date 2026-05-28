import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monitoring Fasilitas | Darman Prasetyo',
  description: 'Sistem Reservasi & Penggunaan Ruang Darman Prasetyo Campus',
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