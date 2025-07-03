import LoginButton from "@/component/login-button"

export default async function LoginPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg 
                className="h-10 w-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
              Welcome
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Button */}
          <div className="mt-8 space-y-6">
            <LoginButton />
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500 sm:text-sm">
              By continuing, you agree to our{" "}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}