import React, { useState, useRef } from 'react';
import { formatCountdown } from '../utils/timeUtils';
import { DUMMY_PRODUCTS } from '../data';

/**
 * 앱의 메인 홈 피드 페이지입니다. 
 * 고객이 구매 가능한 마감 임박 상품들을 카테고리별로 볼 수 있습니다.
 */
export function HomePage({ onNavigate, now, isPcVersion }: { onNavigate: (id: number) => void, now: Date, isPcVersion?: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const categories = ["전체", "🥩 정육", "🥬 채소", "🐟 수산", "🍱 반찬", "🥐 베이커리"];

  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    dragState.current.isDown = true;
    if (scrollRef.current) {
      dragState.current.startX = e.pageX - scrollRef.current.offsetLeft;
      dragState.current.scrollLeft = scrollRef.current.scrollLeft;
    }
  };
  const onMouseLeaveOrUp = () => { dragState.current.isDown = false; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current.isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = DUMMY_PRODUCTS.filter(p => {
    const matchCategory = selectedCategory === "전체" || selectedCategory.includes(p.category);
    const matchSearch = p.name.includes(searchQuery) || p.shopName.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  return (
    <div className={`flex flex-col min-h-full ${isPcVersion ? 'bg-transparent' : 'bg-white'} relative pb-6`}>
      {/* 모바일 헤더 */}
      {!isPcVersion && (
        <header className="bg-[#FFE400]/90 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-20 shrink-0 border-b border-yellow-300/50 min-h-[64px]">
          {!isSearching ? (
            <>
              <div className="flex items-center gap-2 font-bold text-lg w-full">
                <span>📍</span> 서울 마포구 망원동 ▾
              </div>
              <div className="flex items-center gap-4 text-xl shrink-0">
                <button onClick={() => setIsSearching(true)} className="active:scale-95 transition-transform hover:scale-110">🔍</button>
                <div className="relative cursor-pointer">
                  <span>🔔</span>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <button onClick={() => { setIsSearching(false); setSearchQuery(""); }} className="font-bold text-xl active:scale-95 transition-transform">←</button>
              <input 
                type="text" 
                placeholder="상품명 또는 가게명 검색" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white border border-yellow-500/50 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:ring-4 focus:ring-yellow-500/30 transition-all placeholder-gray-400 shadow-inner"
                autoFocus
              />
            </div>
          )}
        </header>
      )}

      {/* 특가 배너 영역 */}
      {isPcVersion ? (
        <div className="bg-gradient-to-r from-[#FFE400] to-[#FFD500] rounded-3xl p-10 flex justify-between items-center mb-8 shadow-sm relative overflow-hidden border border-yellow-300/50 mt-4">
           <div className="absolute right-0 top-0 w-80 h-80 bg-white/30 rounded-full blur-[50px] -translate-y-20 translate-x-20"></div>
           <div className="relative z-10">
             <h2 className="text-4xl font-black mb-4 tracking-tight">🔥 지금 이 순간 특가!</h2>
             <div className="text-xl font-bold flex items-center gap-4">
                마감까지 남은 시간 
                <span className="bg-black text-[#FFE400] px-4 py-2 rounded-xl shadow-lg shadow-black/10 text-2xl tracking-wider font-mono animate-pulse-soft">
                  {formatCountdown(new Date(now.getTime() + 60 * 60 * 1000 - (now.getTime() % (60 * 60 * 1000))), now)}
                </span>
             </div>
           </div>
           <div className="text-8xl relative z-10 animate-float drop-shadow-xl select-none hidden md:block">🏃‍♂️💨</div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#FFE400] to-[#FFD500] px-4 py-4 shrink-0 relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/30 rounded-full blur-[30px] -translate-y-10 translate-x-10"></div>
          <h2 className="text-[26px] font-black mb-1.5 relative z-10 tracking-tight">🔥 지금 이 순간만!</h2>
          <div className="flex items-center gap-2 font-bold relative z-10">
            <span className="opacity-90">마감까지 남은 시간</span>
            <span className="bg-black text-[#FFE400] px-3 py-1 rounded shadow-lg shadow-black/10 text-lg tracking-wider font-mono animate-pulse-soft">
              {formatCountdown(new Date(now.getTime() + 60 * 60 * 1000 - (now.getTime() % (60 * 60 * 1000))), now)}
            </span>
          </div>
        </div>
      )}

      {/* 카테고리 탭 (가로 스크롤 가능) */}
      <div 
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeaveOrUp}
        onMouseUp={onMouseLeaveOrUp}
        onMouseMove={onMouseMove}
        className={isPcVersion ? "flex gap-4 mb-4 select-none" : "flex overflow-x-auto gap-2 pl-4 py-4 border-b border-gray-100 shrink-0 hide-scrollbar cursor-grab active:cursor-grabbing select-none"}
      >
        {categories.map((cat, i) => (
          <button 
            key={i} 
            onClick={() => setSelectedCategory(cat)}
            className={
              isPcVersion 
                ? `shrink-0 whitespace-nowrap px-6 py-3 rounded-full font-bold text-lg transition-colors shadow-sm ${selectedCategory === cat ? 'bg-black text-[#FFE400]' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`
                : `shrink-0 whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-colors ${selectedCategory === cat ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
            }
          >
            {cat}
          </button>
        ))}
        {!isPcVersion && <div className="w-4 shrink-0"></div>}
      </div>

      {/* 상품 리스트 영역 */}
      <div className={`p-4 grid ${isPcVersion ? 'grid-cols-4 md:grid-cols-5 lg:grid-cols-6' : 'grid-cols-2'} gap-x-4 gap-y-6`}>
        {filteredProducts.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl mb-2">😢</span>
            <span className="font-bold">검색 결과가 없어요!</span>
            <span className="text-sm">다른 키워드로 검색해보세요.</span>
          </div>
        )}
        {filteredProducts.map((product, i) => {
          const discountRate = Math.round((product.originalPrice - product.discountPrice) / product.originalPrice * 100);
          const isUrgent = product.expiryMinutes <= 30;
          const stockRatio = product.remaining / product.totalQuantity;

          return (
            <div key={product.id} style={{ animationDelay: `${i * 50}ms` }} className={`cursor-pointer group flex flex-col gap-2 animate-slide-up opacity-0 ${isPcVersion ? 'bg-white p-4 rounded-3xl shadow-sm border border-gray-100' : ''}`} onClick={() => onNavigate(product.id)}>
              <div className={`relative aspect-square bg-[#FFFBE6] rounded-[1.25rem] overflow-hidden shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 border border-yellow-100 ${isPcVersion ? 'mb-2' : ''}`}>
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {/* 뱃지들 */}
                <div className="absolute top-2 left-2 bg-red-500 text-white font-black text-xs px-2 py-1 rounded-md shadow">
                  -{discountRate}%
                </div>
                <div className={`absolute top-2 right-2 font-bold text-xs px-2 py-1 rounded-md shadow ${isUrgent ? 'bg-red-500 text-white' : 'bg-white text-gray-800'}`}>
                  ⏰ {product.expiryMinutes <= 60 ? `${product.expiryMinutes}분` : `${Math.floor(product.expiryMinutes/60)}시간+`}
                </div>
              </div>
              <div>
                <div className="flex items-center text-xs text-gray-500 font-semibold mb-1 truncate">
                  {product.shopName} · {product.distance}
                  {product.rating && <span className="ml-1 text-yellow-500">⭐<span className="text-gray-500">{product.rating}</span></span>}
                </div>
                <div className="font-bold text-sm mb-1 leading-tight line-clamp-2">
                  {product.name}
                  {product.weight && <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded ml-1 truncate">{product.weight}</span>}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-gray-400 line-through text-xs">{product.originalPrice.toLocaleString()}원</span>
                  <span className="font-extrabold text-lg">{product.discountPrice.toLocaleString()}원</span>
                </div>
                {/* 재고 상태 표시 바 */}
                <div className="w-full bg-gray-200 h-1.5 rounded-full mb-1">
                  <div className={`h-full rounded-full ${stockRatio <= 0.3 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${stockRatio * 100}%`}}></div>
                </div>
                <div className="text-[10px] text-gray-500 font-bold mb-2">{product.remaining}개 남음</div>
                
                <button className="w-full bg-[#FFE400] text-black font-bold py-2 rounded-lg text-sm hover:bg-yellow-400 active:scale-95 transition-transform">
                  예약하기
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
