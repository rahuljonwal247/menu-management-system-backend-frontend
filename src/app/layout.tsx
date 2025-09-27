import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'CLOIT Menu Management',
  description: 'Hierarchical menu management system built with Next.js 15',
  keywords: ['menu management', 'hierarchical', 'Next.js', 'React'],
  authors: [{ name: 'CLOIT Team' }],
  creator: 'CLOIT',
  publisher: 'CLOIT',
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}