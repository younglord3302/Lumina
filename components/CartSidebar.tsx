import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number, selectedColor?: string, selectedSize?: string) => void;
  onUpdateQuantity: (id: number, delta: number, selectedColor?: string, selectedSize?: string) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove,
  onUpdateQuantity 
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="text-primary" />
              Your Bag
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <ShoppingBag size={48} />
                <p>Your bag is empty.</p>
                <button onClick={onClose} className="text-primary font-medium hover:underline">
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${index}`} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 line-clamp-1">{item.name}</h3>
                      <div className="text-slate-500 text-sm flex flex-wrap gap-x-2">
                        <span>{item.category}</span>
                        {(item.selectedColor || item.selectedSize) && (
                          <span className="text-slate-300">|</span>
                        )}
                        {item.selectedColor && <span>{item.selectedColor}</span>}
                        {item.selectedSize && <span>{item.selectedSize}</span>}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1, item.selectedColor, item.selectedSize)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm text-sm font-medium transition"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1, item.selectedColor, item.selectedSize)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm text-sm font-medium transition"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">${(item.price * item.quantity).toLocaleString()}</span>
                        <button 
                          onClick={() => onRemove(item.id, item.selectedColor, item.selectedSize)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-gray-100">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
              <button className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20">
                Checkout Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
