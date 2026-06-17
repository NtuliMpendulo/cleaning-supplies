import { Link } from 'react-router-dom'
import { Sparkles, Truck, Shield, Clock, ArrowRight, Star } from 'lucide-react'

/**
 * CleanSupply Home Page
 * Design: Fresh & Professional - Modern E-Commerce with Trust & Cleanliness
 * Colors: Fresh Blue (#0066CC) + Clean Green (#00AA44) + Warm Orange (#FF6600)
 */

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: 'PureGuard Disinfectant Spray',
      price: 89.99,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663612063168/cu9hhCEXxL5bqWf7jJRSJ3/cleansupply-product-disinfectant-8ubn4UnmhDdBA778Poy9ax.webp',
      category: 'Disinfectants',
      rating: 4.8,
      reviews: 234,
      inStock: true
    },
    {
      id: 2,
      name: 'GreenLeaf Hand Soap',
      price: 49.99,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663612063168/cu9hhCEXxL5bqWf7jJRSJ3/cleansupply-product-soap-aFvEhxpsK6iSKDUSQAzzv4.webp',
      category: 'Soaps',
      rating: 4.9,
      reviews: 156,
      inStock: true
    },
    {
      id: 3,
      name: 'Premium Cleaning Tools Bundle',
      price: 129.99,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663612063168/cu9hhCEXxL5bqWf7jJRSJ3/cleansupply-product-tools-SHYruwYoT24KhZ6JnADewT.webp',
      category: 'Tools',
      rating: 4.7,
      reviews: 89,
      inStock: true
    },
    {
      id: 4,
      name: 'PureGuard Disinfectant Spray',
      price: 89.99,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663612063168/cu9hhCEXxL5bqWf7jJRSJ3/cleansupply-product-disinfectant-8ubn4UnmhDdBA778Poy9ax.webp',
      category: 'Disinfectants',
      rating: 4.8,
      reviews: 234,
      inStock: true
    }
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center text-white py-24 md:py-32 overflow-hidden"
        style={{
          backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663612063168/cu9hhCEXxL5bqWf7jJRSJ3/cleansupply-hero-background-KMEkAwzego4CavPqfaTjUG.webp)',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-1 w-12 bg-orange-400"></div>
              <span className="text-sm font-semibold text-orange-300 uppercase tracking-wide">Premium Quality</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Clean Spaces, <span className="text-blue-300">Better Places</span>
            </h1>
            
            <p className="text-xl mb-8 text-gray-100 leading-relaxed">
              Professional cleaning solutions for every environment. Quality products you can trust, delivered fast to your door.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                to="/products" 
                className="btn-primary bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/products" 
                className="btn-secondary border-2 border-white text-white hover:bg-white/10 inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Browse Catalog
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-300" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-300" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-green-300" />
                <span>Trusted Brand</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose CleanSupply?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're committed to providing premium cleaning supplies with exceptional service and competitive pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Premium Quality',
                description: 'Only the best cleaning products for your home and office'
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                description: 'Same-day delivery in Johannesburg and surrounding areas'
              },
              {
                icon: Shield,
                title: 'Secure Payment',
                description: 'Safe and encrypted transactions with Stripe'
              },
              {
                icon: Clock,
                title: '24/7 Support',
                description: 'Always here to help with any questions or concerns'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="card p-8 text-center hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] border border-gray-200 rounded-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-600">Our best-selling cleaning supplies</p>
            </div>
            <Link 
              to="/products" 
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`/products/${product.id}`}
                className="card overflow-hidden hover:shadow-xl transition-all duration-300 group rounded-lg border border-gray-200 bg-white"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gray-100 h-48 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide bg-blue-50 px-2 py-1 rounded">
                      {product.category}
                    </span>
                    {product.inStock && (
                      <span className="text-xs font-semibold text-green-600">In Stock</span>
                    )}
                  </div>

                  <h3 className="font-semibold mb-2 text-gray-900 line-clamp-2">{product.name}</h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({product.reviews})</span>
                  </div>

                  {/* Price and Button */}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">R{product.price}</span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        // Add to cart logic here
                      }}
                      className="btn-primary bg-blue-600 text-white hover:bg-blue-700 text-sm px-4 py-2 rounded-lg font-semibold transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-12 text-center">Shop by Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Disinfectants', icon: '🧴', color: 'bg-blue-50' },
              { name: 'Soaps & Detergents', icon: '🧼', color: 'bg-green-50' },
              { name: 'Cleaning Tools', icon: '🧹', color: 'bg-orange-50' }
            ].map((category, idx) => (
              <Link 
                key={idx}
                to={`/products?category=${category.name}`}
                className={`${category.color} p-8 rounded-lg hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] border border-gray-200 text-center group cursor-pointer`}
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                <p className="text-gray-600 text-sm">Browse our selection</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-12 text-center">What Our Customers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Homeowner',
                text: 'CleanSupply has the best products and delivery is incredibly fast. Highly recommended!',
                rating: 5
              },
              {
                name: 'James Mthembu',
                role: 'Business Owner',
                text: 'Professional service, quality products, and competitive pricing. Perfect for our office cleaning needs.',
                rating: 5
              },
              {
                name: 'Maria Santos',
                role: 'Cleaning Professional',
                text: 'I use CleanSupply for all my clients. The products work great and the customer service is excellent.',
                rating: 5
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="card p-8 rounded-lg border border-gray-200 bg-white">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">\"{ testimonial.text }\"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Clean?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Browse our complete selection of premium cleaning supplies and get fast delivery to your door.
          </p>
          <Link 
            to="/products" 
            className="btn-primary bg-white text-blue-600 hover:bg-gray-100 inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all"
          >
            Shop Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
