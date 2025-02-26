import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';

export default function RootLayout() {
  return (
    <>
      <div className="min-h-screen text-white flex flex-col">
        <div className="fixed inset-0 noise" />
        <Navbar />
        <div className="w-full flex-grow flex justify-center relative">
          <main className="w-8/12 px-6 py-16">
            <Outlet />
          </main>
        </div>
        <footer className="border-t border-zinc-800/50 py-4 w-full mt-auto relative">
          <div className="w-1/3 mx-auto px-6 text-center text-sm text-zinc-500">
            Helical AI © 2025
          </div>
        </footer>
      </div>
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          style: { 
            background: '#1a1a1a', 
            color: '#fff',
            border: '1px solid #333'
          }
        }}
      />
    </>
  );
} 