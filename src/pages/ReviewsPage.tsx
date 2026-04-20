import { useState, useEffect } from 'react';
import type { Page } from '../types';

interface Review {
  id: number;
  store_id: number;
  buyer_id: number;
  order_id: number;
  rating: number;
  content: string;
  store_name: string | null;
  created_at: string;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-500 font-bold text-sm">
      {'⭐'.repeat(rating)}{'<span className="text-gray-200">⭐</span>'.repeat(5 - rating)}
      {' '}{rating}.0
    </span>
  );
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  const now = new Date();
  const diffD = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffD === 0) return '오늘';
  if (diffD === 1) return '어제';
  return `${diffD}일 전`;
}

export function ReviewsPage({
  onNavigate,
  userRole,
  buyerId,
  storeId,
}: {
  onNavigate: (page: Page) => void;
  userRole?: 'USER' | 'SELLER';
  buyerId?: number | null;
  storeId?: number | null;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const param = userRole === 'SELLER'
          ? `store_id=${storeId}`
          : `buyer_id=${buyerId}`;
        if (!storeId && !buyerId) { setReviews([]); return; }
        const res = await fetch(`http://localhost:8001/api/v1/reviews?${param}`);
        if (res.ok) setReviews(await res.json());
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [buyerId, storeId, userRole]);

  const handleDelete = async (reviewId: number) => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;
    const res = await fetch(`http://localhost:8001/api/v1/reviews/${reviewId}`, { method: 'DELETE' });
    if (res.ok) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } else {
      alert('삭제에 실패했습니다.');
    }
  };

  const renderStars = (rating: number) => (
    <span className="font-bold text-sm tracking-widest">
      <span className="text-yellow-400">{'★'.repeat(rating)}</span>
      <span className="text-gray-300">{'★'.repeat(5 - rating)}</span>
      {' '}{rating}.0
    </span>
  );

  if (userRole === 'SELLER') {
    return (
      <div className="flex flex-col bg-gray-50 min-h-full pb-20">
        <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0 shadow-sm">
          <button onClick={() => onNavigate('my')} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
          <h1 className="font-bold text-lg text-center flex-1 pr-8">고객 리뷰 관리</h1>
        </header>
        <div className="p-4 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
              <span className="text-4xl animate-spin">⏳</span>
              <span className="font-bold">리뷰 불러오는 중...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
              <span className="text-4xl mb-2">📭</span>
              <span className="font-bold">아직 작성된 리뷰가 없어요!</span>
            </div>
          ) : reviews.map(review => (
            <div key={review.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="font-extrabold">구매자 #{review.buyer_id}</div>
                {renderStars(review.rating)}
              </div>
              <div className="text-xs text-gray-400 font-bold">{formatDate(review.created_at)}</div>
              <p className="text-[14px] text-gray-700 leading-relaxed font-semibold mt-1">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 min-h-full pb-20">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0 shadow-sm">
        <button onClick={() => onNavigate('my')} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
        <h1 className="font-bold text-lg text-center flex-1 pr-8">내가 작성한 리뷰</h1>
      </header>
      <div className="p-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl animate-spin">⏳</span>
            <span className="font-bold">리뷰 불러오는 중...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl mb-2">📭</span>
            <span className="font-bold">작성한 리뷰가 없어요!</span>
            <span className="text-xs">구매 완료 후 리뷰를 남겨보세요.</span>
          </div>
        ) : reviews.map(review => (
          <div key={review.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
              <div className="w-10 h-10 bg-[#FFFBE6] rounded-full flex items-center justify-center text-xl border border-yellow-100">🛍️</div>
              <div className="flex flex-col">
                <div className="font-extrabold text-[15px]">{review.store_name ?? `가게 #${review.store_id}`}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              {renderStars(review.rating)}
              <div className="text-gray-400 text-xs font-bold">{formatDate(review.created_at)}</div>
            </div>
            <p className="text-[14px] text-gray-700 leading-relaxed font-bold">{review.content}</p>
            <button
              onClick={() => handleDelete(review.id)}
              className="mt-1 flex items-center gap-1.5 text-red-500 text-sm font-bold w-fit bg-red-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
            >
              <span>🗑️</span> 삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
