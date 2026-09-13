import { Outlet } from 'react-router-dom'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <PublicHeader />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
