import { Link } from '@tanstack/react-router'
import { routeTree } from './main'
import { getUserRole, useCurrentUser } from './auth/AuthProvider'

function App() {
  const allRoutes = extractAllRoutes(routeTree)

  const currentUser = useCurrentUser()

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <h1 className="text-4xl font-bold mb-8">Welcome to CFL</h1>
        <p className="mb-6">These are the paths</p>
        <p>{'You are logged in with role: ' + getUserRole(currentUser)}</p>
        <div className="space-y-4">
          {allRoutes.map((route, index) => (
            <Link
              key={index}
              className="block text-[#61dafb] hover:underline"
              to={route.path}
            >
              {route.name}
            </Link>
          ))}
        </div>
      </header>
    </div>
  )
}

function extractAllRoutes(tree: any): Array<{ path: string; name: string }> {
  const routes: Array<{ path: string; name: string }> = []

  const joinPaths = (base: string, segment: string) => {
    const normalizedBase = base === '/' ? '' : base.replace(/\/$/, '')
    const normalizedSegment = segment.startsWith('/') ? segment : `/${segment}`
    const combined = `${normalizedBase}${normalizedSegment}`
    return combined || '/'
  }

  function traverseRoute(route: any, basePath: string = '') {
    const hasPath = Boolean(route.path)
    const currentPath = hasPath
      ? joinPaths(basePath, route.path)
      : basePath || '/'
    const nextBase = hasPath ? currentPath : basePath

    if (route.id !== '__root__' && route.options?.component) {
      routes.push({
        path: currentPath,
        name: route.id
          .replace('Route', '')
          .replace(/([A-Z])/g, ' $1')
          .trim(),
      })
    }

    if (route.children) {
      route.children.forEach((child: any) => traverseRoute(child, nextBase))
    }
  }

  traverseRoute(tree)
  return routes
}

export default App
