import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import ReelsPlayer from './ReelsPlayer';

export default async function Gallery() {
  const galleryDir = path.join(process.cwd(), 'public', 'gallery');
  let files: string[] = [];
  try {
    if (fs.existsSync(galleryDir)) {
      files = fs.readdirSync(galleryDir);
    }
  } catch (err) {
    console.error("Error reading gallery directory:", err);
  }

  // Separate images and videos
  const images = files.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
  const videos = files.filter(file => file.endsWith('.mp4') || file.endsWith('.webm'));

  if (images.length === 0 && videos.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-24 bg-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-purple-950 mb-4">Our Customer Gallery</h2>
          <div className="w-24 h-1 bg-amber-200 mx-auto rounded-full mb-6" />
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Glimpses of happy clients and the transformative results they achieved with us.
          </p>
        </div>

        {videos.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-serif text-purple-900 mb-6 border-b border-purple-100 pb-2 flex items-center gap-2">
              <span className="bg-gradient-to-r from-purple-600 to-amber-500 text-transparent bg-clip-text font-bold">Featured Shorts</span>
            </h3>
            <ReelsPlayer videos={videos} />
          </div>
        )}

        {images.length > 0 && (
          <div>
            <h3 className="text-2xl font-serif text-purple-900 mb-6 border-b border-purple-100 pb-2">Photo Gallery</h3>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {images.map((img, index) => (
                <div key={index} className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <Image 
                    src={`/gallery/${img}`} 
                    alt={`Customer gallery image ${index + 1}`} 
                    width={500} 
                    height={500} 
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/10 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
