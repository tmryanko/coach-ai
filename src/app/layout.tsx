// This root layout provides the required HTML structure
// The actual layout with providers is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("layout");
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
