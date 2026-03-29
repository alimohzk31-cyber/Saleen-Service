import React from 'react';
import { Provider } from '../types';
import { Language } from '../App';
import { Image as ImageIcon, Video } from 'lucide-react';

interface Props {
  providers: Provider[];
  language: Language;
}

export function MediaLibrary({ providers, language }: Props) {
  const allImages = providers.flatMap(p => p.images || []);
  const allVideos = providers.filter(p => p.video).map(p => p.video!);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">{language === 'ar' ? 'مكتبة الوسائط' : 'Media Library'}</h1>
      
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ImageIcon className="w-6 h-6" />
        {language === 'ar' ? 'الصور' : 'Images'} ({allImages.length})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {allImages.map((img, i) => (
          <img key={i} src={img} alt="Media" className="w-full h-32 object-cover rounded-xl shadow-md" />
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Video className="w-6 h-6" />
        {language === 'ar' ? 'الفيديوهات' : 'Videos'} ({allVideos.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allVideos.map((vid, i) => (
          <video key={i} src={vid} className="w-full h-48 object-cover rounded-xl shadow-md" controls />
        ))}
      </div>
    </div>
  );
}
