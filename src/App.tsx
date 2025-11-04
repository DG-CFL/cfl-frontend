import { routeTree } from './main'

function App() {
  const allRoutes = extractAllRoutes(routeTree)
  
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <h1 className="text-4xl font-bold mb-8">Welcome to CFL</h1>
        <p className="mb-6">
          These are the paths
        </p>
        <div className="space-y-4">
          {allRoutes.map((route, index) => (
            <a
              key={index}
              className="text-[#61dafb] hover:underline block"
              href={route.path}
            >
            {route.name}
            </a>
          ))}
        </div>
      </header>
    </div>
  )
}

function extractAllRoutes(routeTree: any): { path: string; name: string }[] {
  const routes: { path: string; name: string }[] = []
  
  function traverseRoute(route: any, basePath: string = '') {
    const currentPath = basePath + (route.path || '')
    
    if (route.id !== '__root__') {
      routes.push({
        path: currentPath,
        name: route.id.replace('Route', '').replace(/([A-Z])/g, ' $1').trim()
      })
    }
    
    if (route.children) {
      route.children.forEach((child: any) => traverseRoute(child, currentPath))
    }
  }
  
  traverseRoute(routeTree)
  return routes
}

export default App
