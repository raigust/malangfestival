import "./globals.css";

export const metadata = {
  title: "Malang Fest — Mading Seni Kota Malang",
  description: "Mading digital untuk konser, pertunjukan, dan karya seni di Malang.",
  openGraph: {
    title: "Malang Fest — Mading Seni Kota Malang",
    description: "Mading digital untuk konser, pertunjukan, dan karya seni di Malang.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
