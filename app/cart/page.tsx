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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✨</div>
            <h1 className="text-2xl font-bold text-blue-900">Mariam Beauty</h1>
          </div>
          
          <Link
            href="/cart"
            className="relative btn-primary flex items-center gap-2"
          >
            🛒 Cart
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs 
                rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse-custom">
                {getTotalItems()}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold mb-4">Premium Beauty & Skincare</h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover our curated collection of luxury beauty products
          </p>
          <div className="flex gap-4">
            <button className="bg-amber-500 text-white px-8 py-3 rounded-lg font-bold 
              hover:bg-amber-600 transition-all hover:scale-105">
              Shop Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold 
              hover:bg-white hover:text-blue-900 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-12 animate-slide-left">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Shop by Category</h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === 'All'
                  ? 'bg-blue-900 text-white shadow-lg scale-105'
                  : 'bg-white border-2 border-gray-300 text-gray-900 hover:border-blue-900'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === cat.name
                    ? 'bg-blue-900 text-white shadow-lg scale-105'
                    : 'bg-white border-2 border-gray-300 text-gray-900 hover:border-blue-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 mb-6 rounded animate-slide-left">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-900 rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Loading products...</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <>
            <p className="text-gray-600 mb-8 font-semibold text-lg animate-fade-in">
              {filteredProducts.length} products found
            </p>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-3">About Mariam Beauty</h3>
              <p className="text-gray-400 text-sm">Premium beauty and skincare products curated for you</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Quick Links</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#" className="hover:text-white transition">Products</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Customer Service</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition">Returns</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Contact</h3>
              <p className="text-gray-400 text-sm">info@mariambeauty.com</p>
              <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Mariam Beauty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}