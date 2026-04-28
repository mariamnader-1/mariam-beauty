'use client'

import { Product } from '@/types/product'
import { useCart } from '@/lib/CartContext'
import { useState } from 'react'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    
    // Show success animation
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="card card-hover animate-fade-in">
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=' + product.category
          }}
        />
        <div className="absolute top-3 right-3">
          <span className="badge badge-amber text-xs">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {product.description}
        </p>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-blue-900">
            ${product.price.toFixed(2)}
          </span>
          {product.stock < 10 && (
            <span className="text-xs text-red-600 font-semibold">
              Only {product.stock} left
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              −
            </button>
            <span className="flex-1 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
              added
                ? 'bg-green-600 text-white scale-105'
                : product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            {added ? '✓ Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}