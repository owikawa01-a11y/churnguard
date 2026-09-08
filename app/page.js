import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🛡️ ChurnGuard</h1>
        <p className="text-gray-600 mb-6">Protect your revenue. Know why your customers cancel.</p>
        <div className="space-y-3">
          <Link href="/signup">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition">
              Get Started Free
            </button>
          </Link>
          <Link href="/login">
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition">
              Log In
            </button>
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-6">Your data is protected with RLS.</p>
      </div>
    </div>
  );
}