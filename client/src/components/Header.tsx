import { Link } from 'react-router-dom'
import { ShoppingCart, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount] = useState(0)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">CS</div>
            <span className="text-xl font-bold text-gray-900">CleanSupply</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition">Products</Link>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition hidden md:block">
              <Search size={20} className="text-gray-700" />
            </button>
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <ShoppingCart size={20} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200">
            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/products" className="block py-2 text-gray-700 hover:text-blue-600">Products</Link>
            <a href="#about" className="block py-2 text-gray-700 hover:text-blue-600">About</a>
            <a href="#contact" className="block py-2 text-gray-700 hover:text-blue-600">Contact</a>
          </nav>
        )}
      </div>
    </header>
  )
}
