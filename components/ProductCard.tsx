import { Product } from '@/types/product'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 bg-gray-200">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=' + product.category
          }}
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-pink-600 font-semibold">{product.category}</p>
        <h3 className="font-bold text-lg mt-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-pink-600">${product.price}</span>
          <button className="bg-pink-600 text-white px-3 py-2 rounded hover:bg-pink-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}