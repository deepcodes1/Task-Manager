import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import { useAuth } from '../context/AuthContext';
import { FiKey, FiTerminal, FiCloud } from 'react-icons/fi';

export const MainLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isAuthenticated, loading: authLoading, user, login, loginMock, isMock } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          <p className="text-slate-400 text-sm animate-pulse font-medium">Establishing secure handshake...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 text-slate-100 font-sans relative overflow-hidden px-4">
        {/* Decorative Blur Spheres */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-md w-full text-center space-y-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative z-10 animate-fade-in">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-glow mb-2">
              <FiCloud className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tight">
              CloudTaskManager
            </h1>
            <p className="text-sm text-slate-400">
              Cloud-Powered Task Manager backed by IBM Cloudant NoSQL Database & secured via IBM App ID.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={login}
              className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-600/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <FiKey className="w-5 h-5 mr-2" />
              <span>Sign In with IBM App ID</span>
            </button>

            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="absolute px-3 bg-slate-900 text-xs text-slate-500 uppercase tracking-widest">
                or
              </span>
            </div>

            <button
              onClick={loginMock}
              className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-2xl text-sm font-semibold text-slate-300 bg-slate-800/60 hover:bg-slate-850 border border-slate-800/80 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <FiTerminal className="w-5 h-5 mr-2" />
              <span>Developer Bypass Mode</span>
            </button>
          </div>
          
          <div className="text-[11px] text-slate-500 leading-normal">
            For local offline development, or if App ID credentials are not configured, choose Developer Bypass Mode.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sidebar */}
        <Sidebar
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Page Content Container */}
        <main className="flex-1 py-6 lg:px-8 min-w-0">
          <Outlet />
        </main>

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/60 py-4 text-center text-xs text-slate-500 mt-auto">
        <p>
          Cloud-Powered Task Manager CRUD &copy; {new Date().getFullYear()} &bull; IBM Cloudant NoSQL &bull; React.js & Vite
        </p>
      </footer>

    </div>
  );
};

export default MainLayout;
