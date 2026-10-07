import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import ReelsPlayer from './ReelsPlayer';

const STATIC_GALLERY_IMAGES = [
  'SaveClip.App_742267988_18064408028720091_204410455176690846_n.jpg',
  'SaveClip.App_743347655_18064408049720091_6201965608429646086_n.jpg',
  'SaveClip.App_744784265_18064408037720091_6469346449516578416_n.jpg',
  'SaveClip.App_745411724_18065187323720091_2602614340396606052_n.jpg',
  'SaveClip.App_745394307_18065187332720091_3245186223671142317_n.jpg',
  'SaveClip.App_748354535_18065354852720091_8341057156380435130_n.jpg',
  'SaveClip.App_748964098_18065354861720091_1518512072553041344_n.jpg',
  'SaveClip.App_752509326_1636815918446829_8691928574390951284_n.jpg',
  'SaveClip.App_759746368_18067405739720091_1776159767614329044_n.jpg',
  'SaveClip.App_760030933_18067405730720091_6661137171196443892_n.jpg',
  'SaveClip.App_766599534_18068811929720091_4670861764654897106_n.jpg',
  'SaveClip.App_769363727_18068811920720091_7280064185649872612_n.jpg',
  'SaveClip.App_770679021_18069133910720091_6875594047769241924_n.jpg',
  'SaveClip.App_770739252_18069133922720091_5384221185578018441_n.jpg',
  'SaveClip.App_746319957_18065354870720091_9073197800622140403_n.jpg',
  'SaveClip.App_746399735_1004830682454607_2745577334654600476_n.jpg',
  'SaveClip.App_574282100_1231758975427860_3391702160142554424_n.jpg',
  'SaveClip.App_723942026_27174763602178080_7402933092243913719_n.jpg',
  'SaveClip.App_731754109_28122599427346578_6281772001969398465_n.jpg',
  'SaveClip.App_743951410_1739394387064251_8766770797639540307_n.jpg'
];

const STATIC_GALLERY_VIDEOS = [
  'SaveClip.App_AQNA3rEOxlgy0ApDQ-j_OAt6OQ6enxZVMuhB0bkAXihskR2Z9x65z6QbeheccQ2W-AK_kwoKxq_FNSkkeL8lLeaG-Z89-2VB6QIzOvo.mp4',
  'SaveClip.App_AQNapSq0gozvVXX7mx4fkuH7PkEb0jHhLGawz0xhh1rBS-k479vJnR2MV6kdakXXQTOrRlV2WP-2FWWJkCKb75iKs_Rdugk-IsQFA6Y.mp4',
  'SaveClip.App_AQNxzc5QJmqSaxtPCk2HJOW977iubInoLM01WRrnNQb4khIXko0168GgpsDQXiJEqUMlvWxip8IpEVPHNpFZ142nbA-1vtGp6gn0-OQ.mp4',
  'SaveClip.App_AQOFZwODCpo2vfsMOIJjMrNzbM2oc9LneZJDw0ZfOrcCWsdrOAwN1PSUBxQ-576CDy9aCl57Gw1KOD6YRTdkRxwOmBjy2yuhbD96HUE.mp4'
];

export default async function Gallery() {
  let images = STATIC_GALLERY_IMAGES;
  let videos = STATIC_GALLERY_VIDEOS;

  try {
    const galleryDir = path.join(process.cwd(), 'public', 'gallery');
    if (fs.existsSync(galleryDir)) {
      const files = fs.readdirSync(galleryDir);
      const fsImages = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));
      const fsVideos = files.filter(f => f.endsWith('.mp4') || f.endsWith('.webm'));
      if (fsImages.length > 0) images = fsImages;
      if (fsVideos.length > 0) videos = fsVideos;
    }
  } catch {
    // Graceful fallback to static list
  }

  if (images.length === 0 && videos.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-28 lg:py-36 bg-background text-foreground border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-ring mb-3">
            Our Portfolio
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">
            Client Transformations &amp; Artistry
          </h2>
          <div className="w-12 h-[1px] bg-ring mx-auto mb-8" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Real moments, bespoke cuts, styling, and radiant bridal glow crafted for our guests at de salon bea.
          </p>
        </div>

        {videos.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-border/40">
              <h3 className="text-2xl font-serif font-medium flex items-center gap-3">
                <span className="text-ring">Featured Shorts</span>
              </h3>
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-light">Swipe to explore</span>
            </div>
            <ReelsPlayer videos={videos} />
          </div>
        )}

        {images.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-border/40">
              <h3 className="text-2xl font-serif font-medium">
                Photo Gallery
              </h3>
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-light">{images.length} Captures</span>
            </div>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className="break-inside-avoid relative group overflow-hidden border border-border/50 bg-secondary/10 transition-all duration-500 hover:border-ring/60 hover:shadow-2xl"
                >
                  <Image 
                    src={`/gallery/${img}`} 
                    alt={`de salon bea customer showcase ${index + 1}`} 
                    width={500} 
                    height={600} 
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-xs font-serif tracking-wider text-white/90">de salon bea · client artistry</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
