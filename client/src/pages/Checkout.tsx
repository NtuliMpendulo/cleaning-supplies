import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Checkout() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle checkout
    console.log('Checkout:', formData)
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-4"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-4"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-4"
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="radio" name="payment" value="stripe" defaultChecked />
                  <span className="ml-2">Credit/Debit Card (Stripe)</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="payment" value="bank" />
                  <span className="ml-2">Bank Transfer</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              Place Order
            </button>
          </form>
        </div>

        {/* Order Summary */}
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
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>R0.00</span>
          </div>
        </div>
      </div>
    </div>
  )
}
