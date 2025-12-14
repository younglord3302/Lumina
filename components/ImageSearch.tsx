import React, { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { identifyProductFromImage } from '../services/geminiService';
import { Product } from '../types';

interface ImageSearchProps {
  products: Product[];
  onProductFound: (productId: number) => void;
}

export const ImageSearch: React.FC<ImageSearchProps> = ({ products, onProductFound }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = (reader.result as string).split(',')[1];
      const foundId = await identifyProductFromImage(base64Image, products);
      
      setIsAnalyzing(false);
      if (foundId && foundId > 0) {
        onProductFound(foundId);
      } else {
        alert("No matching product found in our catalog.");
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isAnalyzing}
        className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"
        title="Visual Search"
      >
        {isAnalyzing ? (
          <Loader2 size={20} className="animate-spin text-accent" />
        ) : (
          <Camera size={20} />
        )}
      </button>
    </div>
  );
};
