"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, Scissors, UserCheck, Settings, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role || '';

  const allNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/admin/bookings', icon: Calendar },
    { name: 'Clients CRM', href: '/admin/customers', icon: Users, adminOnly: true },
    { name: 'Treatments Menu', href: '/admin/services', icon: Scissors, adminOnly: true },
    { name: 'Master Staff', href: '/admin/staff', icon: UserCheck, adminOnly: true },
    { name: 'Salon Settings', href: '/admin/profile', icon: Settings, adminOnly: true },
  ];

  const navigation = allNavigation.filter(item => !item.adminOnly || userRole === 'ADMIN' || userRole === 'OWNER');

  return (
    <div className="flex h-screen bg-[#FAFAF8] text-[#1E1822] overflow-hidden selection:bg-[#5E127E]/10 selection:text-[#5E127E]">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Luxury Plum Brand Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#230B29] border-r border-[#3D1947] transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between border-b border-[#3D1947]/70 px-6">
          <Link href="/admin/dashboard" className="block relative w-36 h-10">
            <Image
              src="/logo-white.svg"
              alt="Natural's Salon CRM"
              fill
              className="object-contain object-left"
            />
          </Link>
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">
            CRM
          </span>
        </div>

        <div className="flex flex-col h-[calc(100vh-5rem)] justify-between pb-6">
          <nav className="p-4 space-y-1.5 overflow-y-auto">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-3 px-3 mt-3">
              Operations Menu
            </div>
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#5E127E] text-white shadow-md shadow-[#5E127E]/30'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-white/50'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 space-y-2 border-t border-[#3D1947]/70 pt-4">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span>View Public Website</span>
            </Link>

            <button
              onClick={() => {
                sessionStorage.removeItem('accessToken');
                signOut({ callbackUrl: '/admin/login' });
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#EFECE6] bg-white lg:hidden shrink-0">
          <div className="font-serif text-sm font-semibold text-[#230B29]">Natural&apos;s Salon CRM</div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 text-[#615668] hover:text-[#1E1822]"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Page Shell */}
        <main className="flex-1 overflow-auto bg-[#FAFAF8]">
          <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
