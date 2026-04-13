import React, { useState } from 'react';
import { DUMMY_PRODUCTS } from '../data';
import { ReservationCard } from '../components/SharedComponents';

/**
 * 리뷰를 작성할 수 있는 내역 페이지 모음 컴포넌트입니다.
 * 완료된 주문 내역을 볼 수 있고, 모달을 띄워 해당 주문에 대한 리뷰를 작성합니다.
 */
export function HistoryPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [reviewingItem, setReviewingItem] = useState<{name: string, shop: string, weight?: string, quantity?: number} | null>(null);
  const [rating, setRating] = useState(5);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`리뷰 (별점: ${rating}점)가 성공적으로 등록되었습니다. 환경 보호에 동참해주셔서 감사합니다! 🌍`);
    setReviewingItem(null);
    setRating(5); // Reset rating for next time
    onNavigate('reviews');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shadow-sm shrink-0">
        <button onClick={() => onNavigate('my')} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
        <span className="font-bold text-lg flex-1 text-center pr-8">주문 내역</span>
      </header>

      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        <ReservationCard status="완료" name="유기농 시금치" shop="초록 채소가게" time="어제" id="#PK-0038" imageUrl={DUMMY_PRODUCTS[1].imageUrl} onReview={() => setReviewingItem({name: "유기농 시금치", shop: "초록 채소가게", weight: "500g", quantity: 1})} />
        <ReservationCard status="완료" name="갈치" shop="수산 시장" time="3일 전" id="#PK-0031" imageUrl={DUMMY_PRODUCTS[3].imageUrl} onReview={() => setReviewingItem({name: "갈치", shop: "수산 시장", weight: "2마리", quantity: 1})} />
      </div>

      {/* Review Modal UI */}
      {reviewingItem && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 flex flex-col gap-4 animate-slide-up pb-10 sm:pb-6 shadow-2xl max-h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-black">리뷰 쓰기</h2>
              <button onClick={() => setReviewingItem(null)} className="text-gray-400 font-bold text-2xl px-2">✕</button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-1 border border-gray-100 flex items-center gap-3">
              <div className="text-3xl">🛍️</div>
              <div>
                <div className="text-xs text-gray-500 font-bold">{reviewingItem.shop}</div>
                <div className="font-bold text-gray-900">
                  {reviewingItem.name}
                  {reviewingItem.weight && <span className="text-sm text-gray-500 font-normal ml-1">({reviewingItem.weight})</span>}
                  {reviewingItem.quantity && <span className="text-sm text-blue-600 font-bold ml-1">x{reviewingItem.quantity}</span>}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitReview} className="flex flex-col gap-5">
              <div className="flex flex-col items-center gap-2 mt-2">
                <span className="text-sm font-bold text-gray-700">이 상품 어떠셨나요?</span>
                <div className="flex gap-2 text-4xl text-gray-200">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span 
                      key={star}
                      onClick={() => setRating(star)}
                      className={`cursor-pointer active:scale-95 transition-all ${star <= rating ? 'text-[#FFE400] drop-shadow-md grayscale-0 opacity-100' : 'grayscale opacity-30 select-none'}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              <textarea 
                placeholder="식재료의 신선도, 맛, 양 등에 대해 자유롭게 적어주세요!" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] outline-none h-32 resize-none text-sm leading-relaxed"
                required
              ></textarea>
              
              <button type="submit" className="w-full bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform shadow-sm">
                리뷰 등록하기
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
