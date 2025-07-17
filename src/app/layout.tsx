import type { Metadata } from "next";
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Coach AI - Personal Relationship Coach",
  description: "AI-powered personal relationship coaching with structured programs",
};

// This file is required for the app directory setup but should redirect to locale-specific pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
