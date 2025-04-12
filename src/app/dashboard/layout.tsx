'use client'

import { AuthCheck } from '@/lib/auth/AuthCheck'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthCheck>{children}</AuthCheck>
} 