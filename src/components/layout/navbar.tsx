import Image from 'next/image'

import { AuthWidget } from './auth-widget'
import { ThemeDropdown } from './theme-dropdown'

const Navbar = () => {
  return (
    <div className="sticky top-0 border-b bg-card py-4 shadow-sm">
      <div className="container">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/supabase-logo-icon.svg"
              width={24}
              height={24}
              alt="Supabase logo"
            />
            <h2 className="text-md font-semibold text-primary">
              Supabase Todo List
            </h2>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <AuthWidget />
            <ThemeDropdown />
          </div>
        </div>
      </div>
    </div>
  )
}

export { Navbar }
