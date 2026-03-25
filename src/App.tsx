import { BrowserRouter as Router} from 'react-router-dom'


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                PrimeCart
              </h1>
              <nav className="flex space-x-8">
                <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                  Home
                </a>
                <a href="/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                  Login
                </a>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        </main>
      </div>
    </Router>
  )
}

export default App