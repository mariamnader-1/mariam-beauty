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
    
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="card card-hover animate-fade-in">
      <div style={{
        position: 'relative',
        width: '100%',
        height: '12rem',
        backgroundColor: '#e5e7eb',
        overflow: 'hidden'
      }}>
        <img
          src={product.image_url}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'
          }}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=' + product.category
          }}
        />
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem'
        }}>
          <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
            {product.category}
          </span>
        </div>
      </div>
      
      <div style={{ padding: '1.25rem' }}>
        <h3 style={{
          fontWeight: 'bold',
          fontSize: '1.125rem',
          marginBottom: '0.5rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.name}
        </h3>
        
        <p style={{
          color: '#4b5563',
          fontSize: '0.875rem',
          marginBottom: '1rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          height: '2.5rem'
        }}>
          {product.description}
        </p>
        
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <span style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#1e3a8a'
          }}>
            ${product.price.toFixed(2)}
          </span>
          {product.stock < 10 && (
            <span style={{
              fontSize: '0.75rem',
              color: '#dc2626',
              fontWeight: '600'
            }}>
              Only {product.stock} left
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.5rem',
            padding: '0.5rem'
          }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '0.25rem',
                backgroundColor: '#d1d5db',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#9ca3af'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#d1d5db'
              }}
            >
              −
            </button>
            <span style={{
              flex: 1,
              textAlign: 'center',
              fontWeight: '600'
            }}>{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '0.25rem',
                backgroundColor: '#d1d5db',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#9ca3af'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#d1d5db'
              }}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              backgroundColor: added
                ? '#16a34a'
                : product.stock === 0
                ? '#d1d5db'
                : '#1e3a8a',
              color: 'white',
              transform: added ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {added ? '✓ Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}