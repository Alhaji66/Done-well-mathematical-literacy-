import { useEffect } from 'react'
import { useDemoAuth, type DemoRole } from '@/context/DemoAuthContext'

export function RoleAutoSet({ role }: { role: DemoRole }) {
  const { role: currentRole, signIn } = useDemoAuth()

  useEffect(() => {
    if (currentRole !== role) {
      signIn(role)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])

  return null
}
