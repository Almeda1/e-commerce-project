import { Outlet } from 'react-router-dom'
import Navbar from './Navbar' // <--- REMOVED CURLY BRACES { }
import Footer from './Footer'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}