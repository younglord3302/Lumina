import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Star, Sparkles, Check, Info, User, Heart, Rotate3d, Loader2, Bookmark } from 'lucide-react';
import { Product } from '../types';
import { enhanceProductDescription, generateProduct360Video } from '../services/geminiService';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, options?: { color?: string; size?: string }) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isInWishlist: boolean;
  onToggleWishlist: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  onClose, 
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  isInWishlist,
  onToggleWishlist
}) => {
  const [enhancedDescription, setEnhancedDescription] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  // 360 Video State
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Initializing AI studio...");

  useEffect(() => {
    setEnhancedDescription(null);
    setVideoUrl(null);
    setIsGeneratingVideo(false);
    
    if (product) {
      document.body.style.overflow = 'hidden';
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [product]);

  // Loading Message Rotation
  useEffect(() => {
    if (!isGeneratingVideo) return;
    const messages = [
        "Analyzing product geometry...",
        "Constructing 3D perspective...",
        "Rendering 360° frames...",
        "Polishing lighting and textures...",
        "Finalizing video stream..."
    ];
    let i = 0;
    setLoadingMessage(messages[0]);
    const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMessage(messages[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isGeneratingVideo]);

  if (!product) return null;

  const handleEnhance = async () => {
    setIsEnhancing(true);
    const desc = await enhanceProductDescription(product);
    setEnhancedDescription(desc);
    setIsEnhancing(false);
  };

  const handleGenerateVideo = async () => {
    const aistudio = (window as any).aistudio;
    
    // Initial Key Check
    if (aistudio) {
        try {
            if (!(await aistudio.hasSelectedApiKey())) {
                await aistudio.openSelectKey();
            }
        } catch (e) {
            console.error("Key selection failed", e);
            return;
        }
    }
    
    setIsGeneratingVideo(true);
    try {
        const url = await generateProduct360Video(product);
        setVideoUrl(url);
    } catch (e: any) {
        console.error("Generation failed", e);
        
        // Handle "Requested entity was not found" error specifically for Veo/API Key issues
        const errorStr = e.message || JSON.stringify(e);
        if (errorStr.includes("Requested entity was not found") && aistudio) {
             try {
                // Prompt for key again
                await aistudio.openSelectKey();
                // Retry generation
                const url = await generateProduct360Video(product);
                setVideoUrl(url);
             } catch (retryError) {
                 console.error("Retry failed", retryError);
                 alert("Unable to generate video. Please ensure you have selected a valid API key with access to the Veo model.");
             }
        } else {
            alert("Failed to generate 360° view. Please try again later.");
        }
    } finally {
        setIsGeneratingVideo(false);
    }
  };

  // Calculate Average Rating
  const totalReviews = product.reviews.length;
  const averageRating = totalReviews > 0 
    ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews 
    : 0;
  
  // Helper to render stars
  const renderStars = (rating: number, size: number = 16) => {
    return (
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={size} 
            fill={star <= Math.round(rating) ? "currentColor" : "none"} 
            className={star <= Math.round(rating) ? "" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur hover:bg-white rounded-full transition-all shadow-sm"
        >
          <X size={24} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-100 relative group shrink-0 overflow-hidden">
          {videoUrl ? (
            <div className="w-full h-full relative bg-black">
                <video 
                    src={videoUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    controls 
                    className="w-full h-full object-cover" 
                />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-white pointer-events-none">
                    AI Generated 360° View
                </div>
            </div>
          ) : (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          )}

          {!videoUrl && (
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {product.category}
              </div>
          )}
          
          {/* Action Buttons (Favorite & Wishlist) */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <button
              onClick={onToggleFavorite}
              className={`p-3 rounded-full backdrop-blur-md transition-all shadow-sm ${
                isFavorite 
                  ? 'bg-red-50 text-red-500' 
                  : 'bg-white/60 text-slate-500 hover:bg-white hover:text-red-500'
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              onClick={onToggleWishlist}
              className={`p-3 rounded-full backdrop-blur-md transition-all shadow-sm ${
                isInWishlist 
                  ? 'bg-blue-50 text-blue-500' 
                  : 'bg-white/60 text-slate-500 hover:bg-white hover:text-blue-500'
              }`}
              title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Bookmark size={20} fill={isInWishlist ? "currentColor" : "none"} />
            </button>
          </div>

          {/* 360 Gen Button */}
          {!videoUrl && (
             <button
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
                className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-full font-semibold text-sm shadow-lg hover:bg-white hover:scale-105 transition-all flex items-center gap-2 disabled:cursor-wait disabled:scale-100 disabled:opacity-80"
            >
                {isGeneratingVideo ? (
                    <Loader2 className="animate-spin text-primary" size={16} />
                ) : (
                    <Rotate3d size={16} className="text-primary" />
                )}
                {isGeneratingVideo ? "Generating..." : "360° AI View"}
            </button>
          )}

          {/* Loading Overlay */}
          {isGeneratingVideo && (
            <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in duration-500">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-accent/30 rounded-full blur-xl animate-pulse"></div>
                    <Loader2 size={48} className="animate-spin text-accent relative z-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Generating 360° View</h3>
                <p className="text-slate-200 animate-pulse font-medium">{loadingMessage}</p>
                <p className="text-xs text-white/40 mt-8 bg-white/10 px-3 py-1 rounded-full">Powered by Gemini Veo</p>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
          <div className="flex-1">
            {/* Header: Rating & Title */}
            <div className="flex items-center gap-2 mb-4">
              {renderStars(averageRating)}
              <span className="text-slate-400 text-sm">
                ({totalReviews} Review{totalReviews !== 1 ? 's' : ''})
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 font-display">
              {product.name}
            </h2>
            <p className="text-2xl font-medium text-primary mb-8">
              ${product.price}
            </p>

            {/* Description */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-slate-900">Description</h3>
                {!enhancedDescription && (
                  <button 
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className="text-xs flex items-center gap-1.5 text-accent hover:text-blue-600 transition-colors bg-blue-50 px-2 py-1 rounded-md font-medium"
                  >
                    {isEnhancing ? (
                      <span className="animate-pulse">Enhancing...</span>
                    ) : (
                      <>
                        <Sparkles size={12} />
                        AI Enhance
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <div className={`text-slate-600 leading-relaxed transition-all duration-500 ${enhancedDescription ? 'bg-blue-50/50 p-4 rounded-xl border border-blue-100' : ''}`}>
                {enhancedDescription || product.description}
                {enhancedDescription && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-blue-400 font-medium">
                    <Sparkles size={10} />
                    Generated by Gemini AI
                  </div>
                )}
              </div>
            </div>

            {/* Variants Selection */}
            {(product.colors || product.sizes) && (
              <div className="mb-8 space-y-4">
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Color</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            selectedColor === color
                              ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                              : 'border-slate-200 text-slate-600 hover:border-primary/50'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            selectedSize === size
                              ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                              : 'border-slate-200 text-slate-600 hover:border-primary/50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Features */}
            <div className="mb-10">
              <h3 className="font-semibold text-slate-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-green-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-100 pt-8 mb-6">
              <h3 className="font-semibold text-slate-900 mb-6 text-lg">Customer Reviews</h3>
              
              {product.reviews.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl text-slate-400">
                  No reviews yet. Be the first to review!
                </div>
              ) : (
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                            <User size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{review.user}</p>
                            <p className="text-xs text-slate-400">{review.date}</p>
                          </div>
                        </div>
                        {renderStars(review.rating, 12)}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed ml-10">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-gray-100 mt-6 sticky bottom-0 bg-white/95 backdrop-blur -mx-8 px-8 pb-0 md:-mx-12 md:px-12">
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  onAddToCart(product, { color: selectedColor, size: selectedSize });
                  onClose();
                }}
                className="flex-1 bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-primary/25 hover:shadow-xl flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1 mb-2">
              <Info size={12} />
              Free shipping on orders over $100
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};