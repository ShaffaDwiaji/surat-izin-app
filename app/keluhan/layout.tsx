import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Lapor Keluhan - Darman Prasetyo",
  description: "Formulir pelaporan kendala fasilitas, kebersihan, atau pelayanan area kampus",
};

export default function KeluhanLayout({
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