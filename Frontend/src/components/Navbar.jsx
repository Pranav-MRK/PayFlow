import React from 'react'
import { Bell,User } from 'lucide-react'
function Navbar() {
    const auth = JSON.parse(localStorage.getItem('auth'));

  return (
    <nav className="h-16 border-b border-slate-800 flex items-center justify-between px-8">
        <h1 className="text-2xl font-bold text-cyan-400">PayFlow</h1>
        <div className="flex items-center gap-6">
            <Bell size={22} className="cursor-pointer"/>
            <div className="flex items-center gap-2">
                <User size={20}/>
                <span>{auth.user.name}</span>
            </div>
        </div>
    </nav>
  )
}

export default Navbar
