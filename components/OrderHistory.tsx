import React from 'react';
import { ArrowLeft, Package, Clock, Truck, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { MOCK_ORDERS } from '../constants';
import { OrderStatus } from '../types';

interface OrderHistoryProps {
  onBack: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ onBack }) => {
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return <CheckCircle size={14} />;
      case 'Processing': return <Clock size={14} />;
      case 'Shipped': return <Truck size={14} />;
      case 'Cancelled': return <XCircle size={14} />;
      default: return <Package size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Order History</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {MOCK_ORDERS.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
                <Package size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">No orders yet</h3>
                <p className="text-slate-500 mb-6">Looks like you haven't placed any orders yet.</p>
                <button 
                  onClick={onBack}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                  Start Shopping
                </button>
            </div>
        ) : (
          <div className="space-y-6">
            {MOCK_ORDERS.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-slate-50/50 p-6 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Order Placed</p>
                      <p className="text-sm font-medium text-slate-900">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Total</p>
                      <p className="text-sm font-medium text-slate-900">${order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Order #</p>
                      <p className="text-sm font-medium text-slate-900">{order.id}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-slate-900 truncate pr-4">{item.name}</h3>
                              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                              
                              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                                {item.selectedColor && (
                                    <span className="bg-slate-100 px-2 py-0.5 rounded">Color: {item.selectedColor}</span>
                                )}
                                {item.selectedSize && (
                                    <span className="bg-slate-100 px-2 py-0.5 rounded">Size: {item.selectedSize}</span>
                                )}
                                <span className="bg-slate-100 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <p className="font-medium text-slate-900">${item.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-gray-200">
                      View Invoice
                    </button>
                    {order.status !== 'Cancelled' && (
                        <button className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm">
                        Track Order
                        </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
