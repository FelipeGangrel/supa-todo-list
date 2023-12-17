import '@/styles/globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { AuthButton } from '@/components/auth-button'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Supabase Todo list',
  description: 'Generated by create next app',
}

type Props = {
  readonly children: React.ReactNode
}

const Navbar = () => {
  return (
    <div className="sticky top-0 border-b bg-card py-4 shadow-sm">
      <div className="container">
        <div className="flex items-center">
          <h2>Supabase Todo list</h2>
          <div className="ml-auto flex items-center gap-2">
            <AuthButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
