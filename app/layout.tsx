import { Inter } from "next/font/google"
import { getServerSession } from "next-auth/next"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Next.js Auth App",
  description: "A simple authentication app built with Next.js and NextAuth",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}