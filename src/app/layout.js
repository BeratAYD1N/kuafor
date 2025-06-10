import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "../components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kuaför Randevu Sistemi",
  description: "Online kuaför randevu sistemi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
