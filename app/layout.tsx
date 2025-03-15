import type { Metadata } from "next";

import "./globals.css";
import 'easymde/dist/easymde.min.css'
import { workSans } from './fonts';

export const metadata: Metadata = {
  title: "YLD",
  description: "Protect your ID",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={workSans.variable}>
      <body>{children}</body>
    </html>
  );
}

