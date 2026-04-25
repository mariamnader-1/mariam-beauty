'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, Category } from '@/types/product'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')

      if (productsError) throw productsError
      setProducts(productsData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-pink-600">✨ Mariam Beauty</h1>
          <p className="text-gray-600 mt-1">Premium Beauty & Skincare</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === 'All'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white border border-gray-300 hover:border-pink-600'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full transition ${
                  selectedCategory === cat.name
                    ? 'bg-pink-600 text-white'
                    : 'bg-white border border-gray-300 hover:border-pink-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            Error: {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <>
            <p className="text-gray-600 mb-6">{filteredProducts.length} products found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-3">About Mariam Beauty</h3>
              <p className="text-gray-400 text-sm">Premium beauty and skincare products curated for you</p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Quick Links</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">Products</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Contact</h3>
              <p className="text-gray-400 text-sm">info@mariambeauty.com</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Mariam Beauty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}