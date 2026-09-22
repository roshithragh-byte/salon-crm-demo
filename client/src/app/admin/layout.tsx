import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 font-semibold text-lg">
          Salon Admin
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            Dashboard
          </Link>
          <Link href="/admin/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            Bookings
          </Link>
          <Link href="/admin/customers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            Customers
          </Link>
          <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            Profile
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
