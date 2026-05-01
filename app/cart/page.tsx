'use client'

import { useCart } from '@/lib/CartContext'
import Link from 'next/link'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  if (items.length === 0 && !isCheckingOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center animate-slide-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
          <Link href="/" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (isCheckingOut) {
    return <CheckoutPage onBack={() => setIsCheckingOut(false)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 mb-4 inline-block">
            ← Back to Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="card p-6 flex gap-6 animate-fade-in">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/100'
                    }}
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 animate-slide-right">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-bold text-blue-900">
                  ${(getTotalPrice() * 1.1).toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="btn-secondary w-full mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                className="btn-outline w-full"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function CheckoutPage({ onBack }: { onBack: () => void }) {
  const { items, getTotalPrice, clearCart } = useCart()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Save order to Supabase (optional - advanced feature)
    console.log('Order placed:', { ...formData, items, total: getTotalPrice() })

    setOrderComplete(true)
    clearCart()
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center card p-12 max-w-md animate-slide-left">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. A confirmation email has been sent to {formData.email}
          </p>
          <Link href="/" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 mb-4 inline-block"
          >
            ← Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="card p-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="card p-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number (4111 1111 1111 1111)"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-secondary w-full py-3 font-semibold ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Processing...' : `Place Order - $${(getTotalPrice() * 1.1).toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8 animate-slide-right">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-blue-900">${(getTotalPrice() * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}