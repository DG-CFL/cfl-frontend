import { useState } from "react";

export default function Home() {
  const [role, setRole] = useState<"user" | "admin">("user");

  return (
    <div className="w-screen flex flex-col md:flex-row h-screen bg-[#F7F7F7]">
      
      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-auto">
        
        {/* TOP BAR: TITLE + ROLE SWITCHER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Hi Tom!</h1>

          {/* ROLE SWITCHER FOR DEMO */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="border border-gray-300 px-3 py-2 rounded-lg bg-white text-sm"
          >
            <option value="user">User View</option>
            <option value="admin">Admin View</option>
          </select>
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

        {/* OPTIONAL ROLE-SPECIFIC CONTENT FOR TESTING */}
        <div className="mt-10 text-gray-700 text-center text-sm">
          {role === "admin" ? "Admin dashboard layout active" : "User dashboard layout active"}
        </div>
      </main>
    </div>
  );
}
