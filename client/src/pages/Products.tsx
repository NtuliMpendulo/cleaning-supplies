import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  category: string
  image_url?: string
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Set dummy data for development
        setProducts([
          { id: 1, name: 'All-Purpose Cleaner', price: 89.99, category: 'general' },
          { id: 2, name: 'Disinfectant Spray', price: 129.99, category: 'disinfectant' },
          { id: 3, name: 'Floor Cleaner', price: 99.99, category: 'floor' },
          { id: 4, name: 'Glass Cleaner', price: 79.99, category: 'glass' },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>

      {/* Category Filter */}
      <div className="mb-8 flex gap-4 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg transition ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All Products
        </button>
        {['general', 'disinfectant', 'floor', 'glass'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid-auto">
          {products.map((product) => (
            <div key={product.id} className="card overflow-hidden hover:shadow-xl transition">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 capitalize">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">R{product.price.toFixed(2)}</span>
                  <button className="btn-primary text-sm">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
