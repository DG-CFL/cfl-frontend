function App() {
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <h1 className="text-4xl font-bold mb-8">Welcome to CFL</h1>
        <p className="mb-6">
          This is a placeholder page for the CFL application.
        </p>
        <div className="space-y-4">
          <a
            className="text-[#61dafb] hover:underline block"
            href="/login"
          >
            Go to Login
          </a>
          <a
            className="text-[#61dafb] hover:underline block"
            href="/sign-up"
          >
            Go to Sign Up
          </a>
          <a
            className="text-[#61dafb] hover:underline block"
            href="/events/manage-events"
          >
            Manage Events
          </a>
        </div>
      </header>
    </div>
  )
}

export default App
