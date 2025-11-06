export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="min-h-screen flex items-center justify-center p-4 ">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}

