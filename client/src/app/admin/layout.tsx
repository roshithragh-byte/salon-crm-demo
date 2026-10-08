"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, Scissors, UserCheck, Settings, LogOut, Menu, MessageSquareQuote } from 'lucide-react';
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
    { name: 'Customers', href: '/admin/customers', icon: Users, adminOnly: true },
    { name: 'Services', href: '/admin/services', icon: Scissors, adminOnly: true },
    { name: 'Staff', href: '/admin/staff', icon: UserCheck, adminOnly: true },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquareQuote, adminOnly: true },
  ];

  const navigation = allNavigation.filter(item => !item.adminOnly || userRole === 'ADMIN' || userRole === 'OWNER');

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-center border-b border-sidebar-border relative px-4">
          <Link href="/admin/dashboard" className="block relative w-44 h-12 overflow-hidden mt-1">
            <Image
              src="/logo-white.svg"
              alt="Natural's Salon CRM"
              fill
              className="object-contain"
            />
          </Link>
        </div>

        <div className="flex flex-col h-[calc(100vh-5rem)] justify-between pb-6">
          <nav className="p-4 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-4 px-2 mt-4">Menu</div>
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-sidebar-primary-foreground/80' : 'text-sidebar-foreground/50'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 space-y-1">
            {(userRole === 'ADMIN' || userRole === 'OWNER') && (
              <>
                <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-4 px-2">Settings</div>
                <Link
                  href="/admin/profile"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${pathname === '/admin/profile'
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                >
                  <Settings className="w-4 h-4 text-sidebar-foreground/50" />
                  Salon Profile
                </Link>
              </>
            )}
            <button
              onClick={() => {
                sessionStorage.removeItem('accessToken');
                signOut({ callbackUrl: '/admin/login' });
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-4"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Mobile only) */}
        <header className="h-16 flex items-center justify-between px-4 border-b bg-background lg:hidden shrink-0">
          <div className="font-serif text-lg tracking-tight font-medium">BeaSalon CRM</div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
