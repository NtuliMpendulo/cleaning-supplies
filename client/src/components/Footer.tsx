import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Share2, Heart, MessageCircle } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">CS</div>
              <span className="text-xl font-bold text-white">CleanSupply</span>
            </div>
            <p className="text-sm mb-4">Premium cleaning supplies delivered to your doorstep.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition"><Heart size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition"><Share2 size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition"><MessageCircle size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-blue-400 transition">Products</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Returns</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+27 (0) 11 234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@cleansupply.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span>Johannesburg, South Africa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
            <a href="#" className="hover:text-blue-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition">Cookie Policy</a>
          </div>
          <div className="text-center text-xs text-gray-500">
            <p>&copy; {currentYear} CleanSupply. All rights reserved.</p>
            <p>Built for South Africa with ❤️</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
