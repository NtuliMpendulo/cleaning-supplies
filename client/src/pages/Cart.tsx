import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'

export default function Cart() {
  const cartItems = [] // Empty cart for now

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item: any) => (
                <div key={item.id} className="card p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">R{item.price}</p>
                  </div>
                  <button className="text-red-600 hover:text-red-700">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>R0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>R0.00</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total:</span>
              <span>R0.00</span>
            </div>
            <Link to="/checkout" className="btn-primary w-full text-center">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
