'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, Category } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getTotalItems } = useCart()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')

      if (productsError) throw productsError
      setProducts(productsData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ fontSize: '1.875rem' }}>✨</div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1e3a8a'
            }}>Mariam Beauty</h1>
          </div>
          
          <Link href="/cart" style={{
            backgroundColor: '#1e3a8a',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            position: 'relative',
            fontWeight: '500'
          }}>
            🛒 Cart
            {getTotalItems() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-0.5rem',
                right: '-0.5rem',
                backgroundColor: '#d97706',
                color: 'white',
                fontSize: '0.75rem',
                borderRadius: '9999px',
                width: '1.5rem',
                height: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                animation: 'pulse 2s infinite'
              }}>
                {getTotalItems()}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(to right, #1e3a8a, #1e40af, #1e3a8a)',
        color: 'white',
        padding: '4rem 1rem',
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>Premium Beauty & Skincare</h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#dbeafe',
            marginBottom: '2rem'
          }}>
            Discover our curated collection of luxury beauty products
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              backgroundColor: '#d97706',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#b45309'
              e.currentTarget.style.transform = 'scale(1.05)'
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#d97706'
              e.currentTarget.style.transform = 'scale(1)'
            }}>
              Shop Now
            </button>
            <button style={{
              border: '2px solid white',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.color = '#1e3a8a'
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'white'
            }}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '3rem 1rem'
      }}>
        {/* Category Filter */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#111827'
          }}>Shop by Category</h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('All')}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '9999px',
                fontWeight: '600',
                transition: 'all 0.3s',
                backgroundColor: selectedCategory === 'All' ? '#1e3a8a' : 'white',
                color: selectedCategory === 'All' ? 'white' : '#111827',
                border: selectedCategory === 'All' ? 'none' : '2px solid #d1d5db',
                cursor: 'pointer',
                boxShadow: selectedCategory === 'All' ? '0 10px 15px rgba(0,0,0,0.1)' : 'none',
                transform: selectedCategory === 'All' ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                  backgroundColor: selectedCategory === cat.name ? '#1e3a8a' : 'white',
                  color: selectedCategory === cat.name ? 'white' : '#111827',
                  border: selectedCategory === cat.name ? 'none' : '2px solid #d1d5db',
                  cursor: 'pointer',
                  boxShadow: selectedCategory === cat.name ? '0 10px 15px rgba(0,0,0,0.1)' : 'none',
                  transform: selectedCategory === cat.name ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            borderLeft: '4px solid #dc2626',
            color: '#991b1b',
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: '0.25rem'
          }}>
            <p style={{ fontWeight: 'bold' }}>Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 0'
          }}>
            <div style={{
              display: 'inline-block'
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                border: '4px solid #d1d5db',
                borderTop: '4px solid #1e3a8a',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{
                color: '#4b5563',
                marginTop: '1rem'
              }}>Loading products...</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <>
            <p style={{
              color: '#4b5563',
              marginBottom: '2rem',
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>
              {filteredProducts.length} products found
            </p>
            
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>No products found in this category</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#111827',
        color: 'white',
        marginTop: '5rem'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '3rem 1rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3 style={{
                fontWeight: 'bold',
                fontSize: '1.125rem',
                marginBottom: '0.75rem'
              }}>About Mariam Beauty</h3>
              <p style={{
                color: '#9ca3af',
                fontSize: '0.875rem'
              }}>Premium beauty and skincare products curated for you</p>
            </div>
            <div>
              <h3 style={{
                fontWeight: 'bold',
                fontSize: '1.125rem',
                marginBottom: '0.75rem'
              }}>Quick Links</h3>
              <ul style={{
                color: '#9ca3af',
                fontSize: '0.875rem',
                listStyle: 'none'
              }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Products</a></li>
                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 style={{
                fontWeight: 'bold',
                fontSize: '1.125rem',
                marginBottom: '0.75rem'
              }}>Contact</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>info@mariambeauty.com</p>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>+1 (555) 123-4567</p>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '2rem',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <p>&copy; 2024 Mariam Beauty. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
