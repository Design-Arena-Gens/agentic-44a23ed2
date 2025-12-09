import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expense Dashboard',
  description: 'Track your personal expenses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
