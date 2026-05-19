import { useParams, Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export default function OrderConfirmation() {
  const { orderId } = useParams()

  return (
    <div className="container-custom py-12 text-center">
      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 mb-2">Thank you for your purchase</p>
      <p className="text-gray-600 mb-8">Order ID: {orderId}</p>
      <p className="text-gray-600 mb-8">A confirmation email has been sent to your inbox</p>
      <div className="space-y-4">
        <Link to="/products" className="btn-primary inline-block">
          Continue Shopping
        </Link>
        <Link to="/" className="btn-secondary inline-block ml-4">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
