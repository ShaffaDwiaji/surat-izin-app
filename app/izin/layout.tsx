import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Pengajuan Surat Izin - Darman Prasetyo",
  description: "Layanan perizinan keluar kampus, asrama, dan berlibur",
};

export default function IzinLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Hanya gunakan div atau fragment kosong <></>
  return <div className="w-full flex-1 flex flex-col">
    {children}
    </div>;
}