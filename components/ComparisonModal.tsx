import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Star, Check, ChevronDown } from 'lucide-react';
import { Product } from '../types';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemove: (id: number) => void;
  onAddToCart: (product: Product, options?: { color?: string; size?: string }) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemove,
  onAddToCart
}) => {
  // Store selections as { [productId]: { color?: string, size?: string } }
  const [selections, setSelections] = useState<Record<number, { color?: string; size?: string }>>({});

  useEffect(() => {
    // Initialize default selections when products change
    const newSelections: Record<number, { color?: string; size?: string }> = {};
    products.forEach(p => {
      newSelections[p.id] = {
        color: p.colors?.[0],
        size: p.sizes?.[0]
      };
    });
    setSelections(newSelections);
  }, [products, isOpen]);

  const handleSelectionChange = (productId: number, type: 'color' | 'size', value: string) => {
    setSelections(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [type]: value
      }
    }));
  };

  if (!isOpen) return null;

  // Helper to calculate rating
  const getRating = (p: Product) => {
    if (p.reviews.length === 0) return 0;
    return p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Compare Products</h2>
            <p className="text-slate-500 text-sm">Comparing {products.length} items</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <div className="overflow-auto flex-1 p-0 bg-slate-50/50">
           {products.length === 0 ? (
             <div className="text-center py-32 text-slate-400">
               No products selected for comparison.
             </div>
           ) : (
             <div className="min-w-max">
               <div className="grid" style={{ gridTemplateColumns: `200px repeat(${products.length}, minmax(280px, 1fr))` }}>
                 
                 {/* Header / Image Row */}
                 <div className="p-6 font-semibold text-slate-500 flex items-center bg-white sticky left-0 z-10 border-b border-gray-100 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                   Product Details
                 </div>
                 {products.map(product => (
                   <div key={product.id} className="p-6 flex flex-col items-center text-center border-l border-b border-gray-100 bg-white relative group">
                     <button 
                       onClick={() => onRemove(product.id)}
                       className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                       title="Remove from comparison"
                     >
                       <X size={20} />
                     </button>
                     <div className="w-40 h-40 mb-4 rounded-xl bg-gray-50 p-2 mix-blend-multiply">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                     </div>
                     <h3 className="font-bold text-lg text-slate-900 mb-1 leading-tight">{product.name}</h3>
                     <p className="text-xl font-bold text-primary mb-3">${product.price}</p>
                     
                     {/* Variant Selectors */}
                     <div className="w-full space-y-2 mb-4">
                       {product.colors && product.colors.length > 0 && (
                         <div className="relative">
                           <select
                             className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:border-primary/50"
                             value={selections[product.id]?.color || ''}
                             onChange={(e) => handleSelectionChange(product.id, 'color', e.target.value)}
                           >
                             {product.colors.map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                           <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                         </div>
                       )}
                       {product.sizes && product.sizes.length > 0 && (
                         <div className="relative">
                           <select
                             className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:border-primary/50"
                             value={selections[product.id]?.size || ''}
                             onChange={(e) => handleSelectionChange(product.id, 'size', e.target.value)}
                           >
                             {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                           <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                         </div>
                       )}
                     </div>

                     <button 
                       onClick={() => onAddToCart(product, selections[product.id])}
                       className="w-full py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
                     >
                       <ShoppingCart size={16} />
                       Add to Cart
                     </button>
                   </div>
                 ))}

                 {/* Rating Row */}
                 <div className="p-6 font-semibold text-sm text-slate-500 bg-slate-50 sticky left-0 z-10 border-b border-gray-100 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">Rating</div>
                 {products.map(product => (
                   <div key={product.id} className="p-6 flex justify-center border-l border-b border-gray-100 bg-slate-50">
                     <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                       <span className="font-bold text-slate-700">{getRating(product).toFixed(1)}</span>
                       <Star size={14} className="text-yellow-400 fill-yellow-400" />
                       <span className="text-xs text-slate-400 border-l border-gray-200 pl-1.5 ml-0.5">{product.reviews.length} reviews</span>
                     </div>
                   </div>
                 ))}

                 {/* Category Row */}
                 <div className="p-6 font-semibold text-sm text-slate-500 bg-white sticky left-0 z-10 border-b border-gray-100 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">Category</div>
                 {products.map(product => (
                   <div key={product.id} className="p-6 text-center border-l border-b border-gray-100 bg-white">
                     <span className="bg-slate-100 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 uppercase tracking-wider">
                       {product.category}
                     </span>
                   </div>
                 ))}

                 {/* Description Row */}
                 <div className="p-6 font-semibold text-sm text-slate-500 bg-slate-50 sticky left-0 z-10 border-b border-gray-100 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">Description</div>
                 {products.map(product => (
                   <div key={product.id} className="p-6 text-sm leading-relaxed text-slate-600 border-l border-b border-gray-100 bg-slate-50">
                     {product.description}
                   </div>
                 ))}

                 {/* Features Row */}
                 <div className="p-6 font-semibold text-sm text-slate-500 bg-white sticky left-0 z-10 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">Features</div>
                 {products.map(product => (
                   <div key={product.id} className="p-6 border-l border-gray-100 bg-white">
                     <ul className="space-y-3">
                       {product.features.map((feature, idx) => (
                         <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                           <div className="mt-0.5 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                             <Check size={10} className="text-green-600" />
                           </div>
                           {feature}
                         </li>
                       ))}
                     </ul>
                   </div>
                 ))}

               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
