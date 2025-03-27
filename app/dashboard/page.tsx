"use client";

import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Link from 'next/link';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold ">Dashboard</h1>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
            
            <div className=" rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold mb-2">Welcome, {user?.name}!</h2>
              <p className="text-white">Email: {user?.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/youtube">
                <div className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer p-9">
                  <h3 className="font-semibold text-blue-900">YouTube Agent</h3>
                  <p className="text-sm text-blue-600">Analyze and summarize YouTube videos</p>
                </div>
              </Link>
              
              <Link href="/dashboard/research">
                <div className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors cursor-pointer p-9">
                  <h3 className="font-semibold text-green-900">Research Agent</h3>
                  <p className="text-sm text-green-600">Generate research papers and analysis</p>
                </div>
              </Link>
              
              <Link href="/dashboard/twitter">
                <div className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer p-9">
                  <h3 className="font-semibold text-purple-900">Twitter Agent</h3>
                  <p className="text-sm text-purple-600">Create engaging Twitter content</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}