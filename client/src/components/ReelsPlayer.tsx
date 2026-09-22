'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';

interface ReelsPlayerProps {
  videos: string[];
}

export default function ReelsPlayer({ videos }: ReelsPlayerProps) {
  const [isMuted, setIsMuted] = useState(true);
  
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 pt-4 px-4 sm:px-0">
        {videos.map((video, index) => (
          <ReelCard 
            key={index} 
            videoSrc={`/gallery/${video}`} 
            isMuted={isMuted} 
            onToggleMute={() => setIsMuted(!isMuted)} 
          />
        ))}
      </div>
      
      {/* Custom CSS to hide scrollbar but keep functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}

interface ReelCardProps {
  videoSrc: string;
  isMuted: boolean;
  onToggleMute: () => void;
}

function ReelCard({ videoSrc, isMuted, onToggleMute }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6, // 60% of the video must be visible to trigger autoplay
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!videoRef.current) return;
        
        if (entry.isIntersecting) {
          // Play when in view
          videoRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(err => {
            console.log("Autoplay prevented:", err);
          });
        } else {
          // Pause when out of view
          videoRef.current.pause();
          setIsPlaying(false);
        }
      });
    }, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const currentRef = containerRef.current;
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleVideoTap = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative shrink-0 snap-center w-[280px] sm:w-[320px] h-[500px] sm:h-[570px] rounded-3xl overflow-hidden shadow-xl bg-black flex items-center justify-center cursor-pointer group"
      onClick={handleVideoTap}
    >
      <video 
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
      />
      
      {/* Play Icon Overlay (visible when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity">
          <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
            <Play className="w-10 h-10 text-white fill-white" />
          </div>
        </div>
      )}

      {/* Mute/Unmute Control */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent video tap
          onToggleMute();
        }}
        className="absolute bottom-4 right-4 bg-black/40 hover:bg-black/60 backdrop-blur-md p-2.5 rounded-full transition-colors z-10"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>
      
      {/* Gradient overlay for text/UI readability if needed later */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}
