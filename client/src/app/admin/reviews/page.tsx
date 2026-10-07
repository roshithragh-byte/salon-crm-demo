"use client";

import { useEffect, useState } from 'react';
import { ReviewApi, ReviewRecord, ReviewSummary } from '@/lib/api/services';
import { Star, MessageSquareQuote, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const TOPIC_LABELS: Record<string, string> = {
  service_quality: 'Service Quality',
  staff_attitude: 'Staff Attitude',
  wait_time: 'Wait Time',
  cleanliness: 'Cleanliness',
  value_for_money: 'Value for Money',
  other: 'Other',
};

const TOPIC_COLORS: Record<string, string> = {
  service_quality: 'bg-purple-100 text-purple-800 border-purple-200',
  staff_attitude: 'bg-blue-100 text-blue-800 border-blue-200',
  wait_time: 'bg-amber-100 text-amber-800 border-amber-200',
  cleanliness: 'bg-green-100 text-green-800 border-green-200',
  value_for_money: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  other: 'bg-slate-100 text-slate-600 border-slate-200',
};

const SENTIMENT_COLORS = [
  '',
  'text-red-600 bg-red-50 border-red-200',   // 1 — very negative
  'text-orange-500 bg-orange-50 border-orange-200', // 2 — negative
  'text-amber-500 bg-amber-50 border-amber-200',  // 3 — neutral
  'text-green-500 bg-green-50 border-green-200',  // 4 — positive
  'text-emerald-600 bg-emerald-50 border-emerald-200', // 5 — very positive
];

const SENTIMENT_LABELS = ['', '😠 Very Negative', '😕 Negative', '😐 Neutral', '🙂 Positive', '😄 Very Positive'];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center text-amber-400 gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
        />
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReviewsData() {
      try {
        setLoading(true);
        const [reviewsRes, summaryRes] = await Promise.all([
          ReviewApi.getReviews('hq'),
          ReviewApi.getSentimentSummary('hq'),
        ]);
        setReviews(reviewsRes.data ?? []);
        setSummary(summaryRes.data ?? null);
      } catch (err: unknown) {
        console.error('Failed to load reviews data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    }
    loadReviewsData();
  }, []);

  const topicBreakdown: Record<string, number> = summary?.topicBreakdown ?? {};
  const totalTopics = Object.values(topicBreakdown).reduce((a, b) => a + (b as number), 0);

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto p-6 animate-pulse">
        <div className="h-8 w-60 bg-muted rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquareQuote className="w-6 h-6 text-primary" />
            Reviews &amp; AI Sentiment
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            AI-driven customer feedback analysis, topic categorisation, and sentiment scores.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Sentiment Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Avg. AI Sentiment</p>
            <p className={`text-2xl font-bold ${SENTIMENT_COLORS[Math.round(summary.avgSentiment ?? 3)]?.split(' ')[0] ?? 'text-foreground'}`}>
              {summary.avgSentiment ? `${summary.avgSentiment} / 5` : '—'}
            </p>
          </div>
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-muted-foreground mb-1 font-medium">AI-Analysed Reviews</p>
            <p className="text-2xl font-bold text-foreground">{summary.totalAnalysed ?? reviews.length}</p>
          </div>
          {Object.entries(topicBreakdown)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 2)
            .map(([topic, count]) => (
              <div key={topic} className="bg-card border rounded-xl p-4 shadow-sm">
                <p className="text-xs text-muted-foreground mb-1 font-medium">{TOPIC_LABELS[topic] ?? topic}</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalTopics > 0 ? `${Math.round(((count as number) / totalTopics) * 100)}%` : '—'}
                </p>
              </div>
            ))}
        </div>
      )}

      {/* Topic Breakdown Bar */}
      {totalTopics > 0 && (
        <div className="bg-card border rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> What customers talk about
            </p>
            <span className="text-xs text-muted-foreground">{totalTopics} topic tags detected</span>
          </div>
          <div className="flex rounded-full overflow-hidden h-3 gap-px bg-muted">
            {Object.entries(topicBreakdown)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([topic, count]) => (
                <div
                  key={topic}
                  title={`${TOPIC_LABELS[topic] ?? topic}: ${count}`}
                  style={{ width: `${((count as number) / totalTopics) * 100}%` }}
                  className={`${TOPIC_COLORS[topic]?.split(' ')[0] ?? 'bg-primary/50'} transition-all`}
                />
              ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            {Object.entries(topicBreakdown).map(([topic, count]) => (
              <span key={topic} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${TOPIC_COLORS[topic]?.split(' ')[0] ?? 'bg-slate-300'}`} />
                {TOPIC_LABELS[topic] ?? topic} ({count as number})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <MessageSquareQuote className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-base font-medium text-foreground">No customer reviews yet</p>
            <p className="text-sm mt-1">Verified reviews will automatically appear here with AI analysis.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Author</th>
                  <th className="px-6 py-4 font-medium">Rating</th>
                  <th className="px-6 py-4 font-medium">Review Content</th>
                  <th className="px-6 py-4 font-medium">AI Topic</th>
                  <th className="px-6 py-4 font-medium">AI Sentiment</th>
                  <th className="px-6 py-4 font-medium text-right">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">{review.authorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StarRating rating={review.rating} />
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-sm">
                      <p className="line-clamp-2">{review.content}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {review.aiTopic ? (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${TOPIC_COLORS[review.aiTopic] ?? 'bg-slate-100 text-slate-600'}`}>
                          {TOPIC_LABELS[review.aiTopic] ?? review.aiTopic}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Analysing…</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {review.aiSentiment ? (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${SENTIMENT_COLORS[review.aiSentiment]}`}>
                          {SENTIMENT_LABELS[review.aiSentiment]}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {review.source ?? 'GOOGLE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
