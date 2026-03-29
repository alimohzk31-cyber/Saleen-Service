import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, Filter, Heart, ShoppingCart } from 'lucide-react';

const products = [
  { id: 1, title: 'خاتم ذهب عيار 21', price: 250, weight: 5, karat: 21, image: 'https://picsum.photos/seed/ring/300/300' },
  { id: 2, title: 'سلسلة ذهب عيار 18', price: 400, weight: 8, karat: 18, image: 'https://picsum.photos/seed/necklace/300/300' },
  { id: 3, title: 'إسوارة ذهب عيار 24', price: 600, weight: 12, karat: 24, image: 'https://picsum.photos/seed/bracelet/300/300' },
];

const GoldsmithsBrowseScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-amber-500 p-6">
      <button onClick={onBack} className="mb-6 p-2 rounded-full bg-slate-900 border border-amber-700">
        <ArrowLeft className="w-6 h-6" />
      </button>
      
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-400">منتجات صياغة الذهب</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <motion.div 
            key={product.id}
            whileHover={{ y: -5 }}
            className="bg-slate-900 rounded-xl p-4 border border-amber-800 shadow-lg"
          >
            <img src={product.image} alt={product.title} className="w-full h-40 object-cover rounded-lg mb-4" />
            <h3 className="font-bold text-lg">{product.title}</h3>
            <p className="text-sm text-amber-300">الوزن: {product.weight} غرام | العيار: {product.karat}</p>
            <p className="font-bold text-amber-500 mt-2">{product.price} $</p>
            <button className="mt-4 w-full bg-amber-600 text-slate-950 py-2 rounded-lg font-bold">حجز</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GoldsmithsBrowseScreen;
