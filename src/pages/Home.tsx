import { useCurrentUser } from "@/auth/AuthProvider";

export default function Home() {
  const user = useCurrentUser()

  return (
    <div className="w-screen flex flex-col md:flex-row h-screen bg-[#F7F7F7]">
      
      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Hi {user?.name}!</h1>
        </div>

        {/* GRID SECTION 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-40 bg-gray-300 rounded-lg" />
          <div className="h-40 bg-gray-300 rounded-lg" />
          <div className="h-40 bg-gray-300 rounded-lg" />
        </div>

        {/* GRID SECTION 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="h-32 bg-gray-300 rounded-lg" />
          <div className="h-32 bg-gray-300 rounded-lg" />
          <div className="h-32 bg-gray-300 rounded-lg" />
        </div>

        {/* GRID SECTION 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="h-32 bg-gray-300 rounded-lg" />
          <div className="h-32 bg-gray-300 rounded-lg" />
          <div className="h-32 bg-gray-300 rounded-lg" />
        </div>
      </main>
    </div>
  );
}
