'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
interface Review { id: string; rating: number; content: string; authorName: string; }

interface ReviewCarouselProps {
  reviews: Review[];
}

export default function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // We want to display a set of 5 reviews at a time (if the screen allows)
  const itemsToShow = 5;

  useEffect(() => {
    if (reviews.length <= itemsToShow) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Move by 1 item, or reset if we reached the end
        if (prevIndex + itemsToShow >= reviews.length) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 4000); // Transitions every 4 seconds

    return () => clearInterval(interval);
  }, [reviews.length, itemsToShow]);

  if (!reviews || reviews.length === 0) return null;

  // Get the current window of reviews to display
  // We wrap around if we are at the end
  const visibleReviews = [];
  for (let i = 0; i < Math.min(itemsToShow, reviews.length); i++) {
    const index = (currentIndex + i) % reviews.length;
    visibleReviews.push(reviews[index]);
  }

  return (
    <div className="relative overflow-hidden w-full">
      <div 
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-all duration-700 ease-in-out"
      >
        {visibleReviews.map((review, i) => (
          <div
            key={`${review.id}-${currentIndex}-${i}`}
            className="bg-purple-50/50 p-5 rounded-2xl shadow-sm border border-purple-100 flex flex-col justify-between h-full animate-in fade-in duration-500"
          >
            <div>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                  />
                ))}
              </div>
              <p className="text-slate-700 italic leading-relaxed mb-4 line-clamp-4 text-xs">
                &ldquo;{review.content}&rdquo;
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium text-purple-950 text-xs">— {review.authorName}</div>
              <div className="text-[9px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">Google</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Indicators */}
      {reviews.length > itemsToShow && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: reviews.length - itemsToShow + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === i ? 'bg-purple-900' : 'bg-purple-200 hover:bg-purple-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
