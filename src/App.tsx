import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex h-screen">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content preview area */}
      <main className="flex-1 bg-white p-8">
        <h1 className="text-2xl font-bold mb-4">Sidebar Preview</h1>
        <p className="text-gray-600">
          This is a temporary preview area to test your Sidebar UI.
        </p>
        <p className="mt-2 text-gray-500">
          You can collapse or expand the sidebar using the toggle button.
        </p>
      </main>
    </div>
  );
}

export default App;
