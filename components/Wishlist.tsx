import React from 'react';
import { ArrowLeft, Bookmark, ShoppingCart, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistProps {
  items: Product[];
  onRemove: (id: number) => void;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ items, onRemove, onAddToCart, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="text-primary fill-current" size={24} />
              My Wishlist
            </h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
                <Bookmark size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">Your wishlist is empty</h3>
                <p className="text-slate-500 mb-6">Save items you want to buy later.</p>
                <button onClick={onBack} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                  Start Shopping
                </button>
            </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(product => (
               <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                  <div className="aspect-square relative bg-gray-100">
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                     <button 
                       onClick={() => onRemove(product.id)}
                       className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur text-slate-400 hover:text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                       title="Remove from wishlist"
                     >
                       <Trash2 size={18} />
                     </button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="font-bold text-slate-900 mb-4">${product.price}</p>
                    
                    <button 
                      onClick={() => onAddToCart(product)}
                      className="w-full bg-slate-50 text-slate-900 font-semibold py-2.5 rounded-xl border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
