import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 font-semibold text-lg text-purple-950">
          Salon CRM
        </div>
        <nav className="p-4 space-y-1">
          <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors">
            Bookings
          </Link>
          <Link href="/admin/customers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors">
            Customers
          </Link>
          <Link href="/admin/services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors">
            Services
          </Link>
          <Link href="/admin/staff" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors">
            Staff
          </Link>
          <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors mt-8">
            Profile Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
