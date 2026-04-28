'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Makeup',
    image_url: '',
    stock: 0,
  })
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*')
    setProducts(data || [])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingId) {
        // Update product
        await supabase
          .from('products')
          .update(formData)
          .eq('id', editingId)
        setEditingId(null)
      } else {
        // Add new product
        await supabase.from('products').insert([formData])
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'Makeup',
        image_url: '',
        stock: 0,
      })

      // Refresh products
      fetchProducts()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
      stock: product.stock,
    })
    setEditingId(product.id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add/Edit Form */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-6">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  required
                  className="input-field"
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Makeup">Makeup</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Haircare">Haircare</option>
                  <option value="Perfume">Perfume</option>
                </select>
                <input
                  type="url"
                  name="image_url"
                  placeholder="Image URL"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="input-field"
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
                
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="btn-primary flex-1">
                    {editingId ? 'Update' : 'Add'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null)
                        setFormData({
                          name: '',
                          description: '',
                          price: 0,
                          category: 'Makeup',
                          image_url: '',
                          stock: 0,
                        })
                      }}
                      className="btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Products List */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-6">Products ({products.length})</h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price} • Stock: {product.stock}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}