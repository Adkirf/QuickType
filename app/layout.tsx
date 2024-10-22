import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/components/context/AuthProvider';


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'QuickType',
  description: 'Improve your typing skills',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col h-screen`}>
        <AuthProvider>
          <Header />
          <main className="">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
