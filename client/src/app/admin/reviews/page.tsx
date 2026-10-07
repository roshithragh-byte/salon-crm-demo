import { ReviewApi, ReviewRecord, ReviewSummary } from '@/lib/api/services';

const TOPIC_LABELS: Record<string, string> = {
  service_quality: 'Service Quality',
  staff_attitude: 'Staff Attitude',
  wait_time: 'Wait Time',
  cleanliness: 'Cleanliness',
  value_for_money: 'Value for Money',
  other: 'Other',
};

const TOPIC_COLORS: Record<string, string> = {
  service_quality: 'bg-purple-100 text-purple-800',
  staff_attitude: 'bg-blue-100 text-blue-800',
  wait_time: 'bg-amber-100 text-amber-800',
  cleanliness: 'bg-green-100 text-green-800',
  value_for_money: 'bg-emerald-100 text-emerald-800',
  other: 'bg-slate-100 text-slate-600',
};

const SENTIMENT_COLORS = [
  '',
  'text-red-600',   // 1 — very negative
  'text-orange-500', // 2 — negative
  'text-amber-500',  // 3 — neutral
  'text-green-500',  // 4 — positive
  'text-emerald-600', // 5 — very positive
];

const SENTIMENT_LABELS = ['', '😠 Very Negative', '😕 Negative', '😐 Neutral', '🙂 Positive', '😄 Very Positive'];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400">
      {'★'.repeat(rating)}
      <span className="text-slate-200">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

export default async function ReviewsPage() {
  let reviews: ReviewRecord[] = [];
  let summary: ReviewSummary | null = null;

  try {
    const [reviewsRes, summaryRes] = await Promise.all([
      ReviewApi.getReviews('hq'),
      ReviewApi.getSentimentSummary('hq'),
    ]);
    reviews = reviewsRes.data ?? [];
    summary = summaryRes.data ?? null;
  } catch {
    // Silently degrade — page still renders with empty state
  }

  const topicBreakdown: Record<string, number> = summary?.topicBreakdown ?? {};
  const totalTopics = Object.values(topicBreakdown).reduce((a, b) => a + (b as number), 0);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-purple-950">Reviews & Feedback</h1>

      {/* Sentiment Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Avg. AI Sentiment</p>
            <p className={`text-2xl font-bold ${SENTIMENT_COLORS[Math.round(summary.avgSentiment ?? 3)]}`}>
              {summary.avgSentiment ? `${summary.avgSentiment} / 5` : '—'}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">AI-Analysed Reviews</p>
            <p className="text-2xl font-bold text-slate-800">{summary.totalAnalysed ?? 0}</p>
          </div>
          {Object.entries(topicBreakdown)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 2)
            .map(([topic, count]) => (
              <div key={topic} className="bg-white rounded-xl border border-purple-100 p-4 shadow-sm">
                <p className="text-xs text-slate-500 mb-1">{TOPIC_LABELS[topic] ?? topic}</p>
                <p className="text-2xl font-bold text-slate-800">
                  {totalTopics > 0 ? `${Math.round(((count as number) / totalTopics) * 100)}%` : '—'}
                </p>
              </div>
            ))}
        </div>
      )}

      {/* Topic Breakdown Bar */}
      {totalTopics > 0 && (
        <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-700 mb-3">What customers talk about</p>
          <div className="flex rounded-full overflow-hidden h-4 gap-px">
            {Object.entries(topicBreakdown)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([topic, count]) => (
                <div
                  key={topic}
                  title={`${TOPIC_LABELS[topic] ?? topic}: ${count}`}
                  style={{ width: `${((count as number) / totalTopics) * 100}%` }}
                  className={`${TOPIC_COLORS[topic] ?? 'bg-slate-200'} transition-all`}
                />
              ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            {Object.entries(topicBreakdown).map(([topic, count]) => (
              <span key={topic} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${TOPIC_COLORS[topic]?.split(' ')[0] ?? 'bg-slate-300'}`} />
                {TOPIC_LABELS[topic] ?? topic} ({count as number})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No reviews yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-purple-50 text-purple-900">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Author</th>
                <th className="text-left px-4 py-3 font-medium">Rating</th>
                <th className="text-left px-4 py-3 font-medium">Review</th>
                <th className="text-left px-4 py-3 font-medium">AI Topic</th>
                <th className="text-left px-4 py-3 font-medium">AI Sentiment</th>
                <th className="text-left px-4 py-3 font-medium">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{review.authorName}</td>
                  <td className="px-4 py-3">
                    <StarRating rating={review.rating} />
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs">
                    <p className="line-clamp-2">{review.content}</p>
                  </td>
                  <td className="px-4 py-3">
                    {review.aiTopic ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TOPIC_COLORS[review.aiTopic] ?? 'bg-slate-100 text-slate-600'}`}>
                        {TOPIC_LABELS[review.aiTopic] ?? review.aiTopic}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Analysing…</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {review.aiSentiment ? (
                      <span className={`text-xs font-medium ${SENTIMENT_COLORS[review.aiSentiment]}`}>
                        {SENTIMENT_LABELS[review.aiSentiment]}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full uppercase">
                      {review.source ?? 'google'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
