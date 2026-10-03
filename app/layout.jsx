import "./globals.css";

export const metadata = {
  title: "Malang Fest — Mading Seni Kota Malang",
  description: "Mading digital untuk konser, pertunjukan, dan karya seni di Malang.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Malang Fest — Mading Seni Kota Malang",
    description: "Mading digital untuk konser, pertunjukan, dan karya seni di Malang.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
