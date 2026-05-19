import { Link } from 'react-router-dom'
import { Sparkles, Truck, Shield, Clock } from 'lucide-react'

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-4">Premium Cleaning Supplies</h1>
          <p className="text-xl mb-8 text-blue-100">Fast delivery | Best prices | Quality guaranteed</p>
          <Link to="/products" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CleanSupply?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 text-center">
              <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Only the best cleaning products for your home</p>
            </div>
            <div className="card p-6 text-center">
              <Truck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Same-day delivery in Johannesburg</p>
            </div>
            <div className="card p-6 text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Safe and encrypted transactions</p>
            </div>
            <div className="card p-6 text-center">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Always here to help you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12">Featured Products</h2>
          <div className="grid-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card overflow-hidden hover:shadow-xl transition">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Premium Cleaner {i}</h3>
                  <p className="text-gray-600 text-sm mb-4">High-quality cleaning solution</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">R{89.99}</span>
                    <button className="btn-primary text-sm">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Clean?</h2>
          <p className="text-lg mb-8">Browse our complete selection of cleaning supplies</p>
          <Link to="/products" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
            View All Products
          </Link>
        </div>
      </section>
    </div>
  )
}
