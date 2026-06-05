import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant"
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cormorant.variable}>
      <body style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
        {children}
      </body>
    </html>
  )
}