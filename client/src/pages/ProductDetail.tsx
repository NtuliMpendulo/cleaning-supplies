import { useParams } from 'react-router-dom'
import { Sparkles, Star } from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()

  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-200 h-96 flex items-center justify-center rounded-lg">
          <Sparkles className="w-24 h-24 text-gray-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">Premium Cleaner {id}</h1>
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-gray-600">(125 reviews)</span>
          </div>
          <p className="text-gray-600 mb-6">High-quality cleaning solution for all surfaces</p>
          <div className="text-3xl font-bold text-blue-600 mb-6">R89.99</div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input type="number" min="1" defaultValue="1" className="w-20" />
            </div>
            <button className="btn-primary w-full">Add to Cart</button>
            <button className="btn-outline w-full">Add to Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  )
}
