import React, { useState, useRef } from 'react';
import { formatCountdown } from '../utils/timeUtils';
import { useNotifications, NotificationDrawer } from '../components/SharedComponents';
import type { Product } from '../types';

export function HomePage({ onNavigate, onNavigateToCart, cartCount, now, isPcVersion, userId }: {
  onNavigate: (id: number) => void;
  onNavigateToCart?: () => void;
  cartCount?: number;
  now: Date;
  isPcVersion?: boolean;
  userId?: number | null;
}) {
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
  const [showNotif, setShowNotif] = useState(false);
  const { unreadCount } = useNotifications(userId ?? null);

  const [products, setProducts] = useState<Product[]>([]);
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);
  const userLocRef = useRef<{lat: number, lng: number} | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 20;

  const mapProduct = (d: any): Product => ({
    id: d.id,
    name: d.name,
    originalPrice: d.original_price,
    discountPrice: d.discount_price,
    remaining: d.remaining,
    totalQuantity: d.total_quantity,
    expiryMinutes: d.expiry_minutes,
    category: d.category,
    imageUrl: d.image_url || "https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=600",
    weight: d.weight,
    description: d.description,
    shopName: d.shop_name || "알 수 없는 가게",
    distance: d.distance || "거리 알 수 없음",
    storeId: d.store_id,
    pickupDeadline: d.pickup_deadline,
  });

  const fetchProducts = React.useCallback((
    { lat, lng, pageNum = 0, category, silent = false }:
    { lat?: number; lng?: number; pageNum?: number; category?: string; silent?: boolean }
  ) => {
    if (!silent) setIsLoading(true);
    const params = new URLSearchParams({
      limit: ITEMS_PER_PAGE.toString(),
      offset: (pageNum * ITEMS_PER_PAGE).toString(),
    });
    if (lat !== undefined && lng !== undefined) {
      params.append('user_lat', lat.toString());
      params.append('user_lng', lng.toString());
    }
    if (category && category !== '전체') {
      params.append('category', category.replace(/[^\uAC00-\uD7A3]/g, ''));
    }

    fetch(`http://localhost:8001/api/v1/products/?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(mapProduct);
        if (pageNum === 0) setProducts(mapped);
        else setProducts(prev => [...prev, ...mapped]);
        setHasMore(data.length === ITEMS_PER_PAGE);
        if (!silent) setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        if (!silent) setIsLoading(false);
      });
  }, []);

  // 최초 마운트: 위치 권한 요청 후 첫 로드 + 60초 자동 갱신
  React.useEffect(() => {
    const init = (lat?: number, lng?: number) => {
      userLocRef.current = lat !== undefined && lng !== undefined ? { lat, lng } : null;
      setUserLoc(userLocRef.current);
      setPage(0);
      fetchProducts({ lat, lng, pageNum: 0 });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => init(pos.coords.latitude, pos.coords.longitude),
        err => { console.warn("Geolocation API Error:", err); init(37.556, 126.903); }
      );
    } else {
      init();
    }

    const intervalId = setInterval(() => {
      const loc = userLocRef.current;
      fetchProducts({ lat: loc?.lat, lng: loc?.lng, pageNum: 0, silent: true });
    }, 60_000);

    return () => clearInterval(intervalId);
  }, [fetchProducts]);

  // 카테고리 변경 시 백엔드에서 재조회
  React.useEffect(() => {
    setPage(0);
    fetchProducts({ lat: userLocRef.current?.lat, lng: userLocRef.current?.lng, pageNum: 0, category: selectedCategory });
  }, [selectedCategory, fetchProducts]);

  const filteredProducts = products.filter(p =>
    p.name.includes(searchQuery) || p.shopName.includes(searchQuery)
  );

  return (
    <div className={`flex flex-col min-h-full ${isPcVersion ? 'bg-transparent' : 'bg-white'} relative pb-6`}>

      {/* ── 모바일 헤더 ── */}
      {!isPcVersion && (
        <header className="bg-[#FFE400]/90 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-20 shrink-0 border-b border-yellow-300/50 min-h-[64px]">
          {!isSearching ? (
            <>
              <div className="flex items-center gap-2 font-bold text-lg w-full">
                <span>📍</span> 서울 마포구 망원동 ▾
              </div>
              <div className="flex items-center gap-4 text-xl shrink-0">
                <button onClick={() => setIsSearching(true)} className="active:scale-95 transition-transform hover:scale-110">🔍</button>
                {/* 장바구니 */}
                <div className="relative cursor-pointer" onClick={onNavigateToCart}>
                  <span>🛒</span>
                  {(cartCount ?? 0) > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full border border-[#FFFBE6] flex items-center justify-center">
                      <span className="text-[9px] font-black text-white leading-none px-0.5">{cartCount}</span>
                    </div>
                  )}
                </div>
                {/* 알림 벨 */}
                <div className="relative cursor-pointer" onClick={() => setShowNotif(true)}>
                  <span>🔔</span>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full border border-[#FFE400] flex items-center justify-center">
                      <span className="text-[9px] font-black text-white leading-none px-0.5">{unreadCount}</span>
                    </div>
                  )}
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

      {/* ── 알림 드로어 ── */}
      <NotificationDrawer userId={userId ?? null} isOpen={showNotif} onClose={() => setShowNotif(false)} />

      {/* ── 특가 배너 ── */}
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

      {/* ── 카테고리 탭 ── */}
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

      {/* ── 상품 그리드 ── */}
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
            <div
              key={product.id}
              style={{ animationDelay: `${i * 50}ms` }}
              className={`cursor-pointer group flex flex-col gap-2 animate-slide-up opacity-0 ${isPcVersion ? 'bg-white p-4 rounded-3xl shadow-sm border border-gray-100' : ''}`}
              onClick={() => onNavigate(product.id)}
            >
              <div className={`relative aspect-square bg-[#FFFBE6] rounded-[1.25rem] overflow-hidden shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 border border-yellow-100 ${isPcVersion ? 'mb-2' : ''}`}>
                <img src={product.imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
                {/* 재고 바 */}
                <div className="w-full bg-gray-200 h-1.5 rounded-full mb-1">
                  <div className={`h-full rounded-full ${stockRatio <= 0.3 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${stockRatio * 100}%`}}></div>
                </div>
                <div className="text-[10px] text-gray-500 font-bold">{product.remaining}개 남음</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && filteredProducts.length > 0 && (
        <div className="flex justify-center py-6">
          <button
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchProducts({ lat: userLoc?.lat, lng: userLoc?.lng, pageNum: nextPage, category: selectedCategory });
            }}
            disabled={isLoading}
            className="px-6 py-3 bg-black text-[#FFE400] font-bold rounded-full hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '로딩 중...' : '더보기'}
          </button>
        </div>
      )}

    </div>
  );
}
