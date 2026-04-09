import { useState, useEffect, useRef } from 'react';

// --- Types ---
type Page = 'home' | 'detail' | 'payment' | 'complete' | 'reservations' | 'history' | 'register' | 'my' | 'login' | 'wishlist';

interface Product {
  id: number;
  name: string;
  originalPrice: number;
  discountPrice: number;
  shopName: string;
  distance: string;
  remaining: number;
  totalQuantity: number;
  expiryMinutes: number;
  category: string;
  imageUrl: string;
  weight?: string;
  rating?: number;
  description?: string;
}

// --- Dummy Data ---
const getSvgUrl = (emoji: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#FFFBE6"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-size="160">${emoji}</text></svg>`)}`;

const DUMMY_PRODUCTS: Product[] = [
  { id: 1, name: "국내산 삼겹살", weight: "300g", originalPrice: 12000, discountPrice: 3600, shopName: "망원 정육점", distance: "도보 3분", remaining: 3, totalQuantity: 10, expiryMinutes: 23, category: "정육", imageUrl: getSvgUrl("🥩"), rating: 4.8, description: "오늘 썰어 더 신선한 한돈 삼겹살입니다. 구이용으로 강력 추천합니다!" },
  { id: 2, name: "유기농 시금치", weight: "500g", originalPrice: 4500, discountPrice: 1300, shopName: "초록 채소가게", distance: "도보 5분", remaining: 5, totalQuantity: 10, expiryMinutes: 60, category: "채소", imageUrl: getSvgUrl("🥬"), rating: 4.9, description: "무농약 친환경 시금치입니다. 겉잎이 살짝 시들었지만 속은 아주 싱싱합니다." },
  { id: 3, name: "오늘 구운 크루아상", weight: "5개", originalPrice: 8000, discountPrice: 2400, shopName: "동네 베이커리", distance: "도보 2분", remaining: 2, totalQuantity: 10, expiryMinutes: 18, category: "베이커리", imageUrl: getSvgUrl("🥐"), rating: 4.6, description: "프랑스산 고메버터를 사용하여 오늘 아침에 갓 구운 바삭하고 촉촉한 크루아상입니다." },
  { id: 4, name: "갈치", weight: "2마리", originalPrice: 15000, discountPrice: 5200, shopName: "수산 시장", distance: "도보 7분", remaining: 4, totalQuantity: 10, expiryMinutes: 120, category: "수산", imageUrl: getSvgUrl("🐟"), rating: 4.2, description: "구이나 조림 모두 맛있는 제주산 은갈치입니다. 약간의 생채기가 있어서 저렴하게 판매해요." },
  { id: 5, name: "제철 나물 모둠 반찬", originalPrice: 6000, discountPrice: 1800, shopName: "할머니 반찬가게", distance: "도보 4분", remaining: 1, totalQuantity: 10, expiryMinutes: 28, category: "반찬", imageUrl: getSvgUrl("🍱"), rating: 4.7, description: "조미료 없이 건강하게 당일 직접 무친 제철 나물 3종 세트입니다." },
  { id: 6, name: "한우 불고기용", weight: "200g", originalPrice: 18000, discountPrice: 7200, shopName: "망원 정육점", distance: "도보 3분", remaining: 6, totalQuantity: 10, expiryMinutes: 180, category: "정육", imageUrl: getSvgUrl("🍲"), rating: 4.8, description: "1등급 한우 앞다리살입니다. 불고기 양념해서 드시면 아주 부드럽고 맛있어요." },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [userRole, setUserRole] = useState<'USER' | 'SELLER'>('USER');
  
  // Timer state for home
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navigateTo = (page: Page, productId?: number) => {
    setCurrentPage(page);
    if (productId) setSelectedProductId(productId);
  };

  const selectedProduct = DUMMY_PRODUCTS.find(p => p.id === selectedProductId) || DUMMY_PRODUCTS[0];

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-[390px] h-screen bg-white relative overflow-y-auto flex flex-col shadow-2xl">
        
        {/* Page Routing */}
        <div className={`flex-1 overflow-y-auto ${currentPage !== 'detail' && currentPage !== 'payment' && currentPage !== 'complete' && currentPage !== 'login' ? 'pb-20' : ''}`}>
          {currentPage === 'login' && <LoginPage onLogin={(role) => { setUserRole(role); navigateTo('home'); }} />}
          {currentPage === 'home' && <HomePage onNavigate={(p: number) => navigateTo('detail', p)} now={now} />}
          {currentPage === 'detail' && <DetailPage product={selectedProduct} onBack={() => navigateTo('home')} onReserve={(qty) => { setOrderQuantity(qty); navigateTo('payment'); }} now={now} />}
          {currentPage === 'payment' && <PaymentPage product={selectedProduct} quantity={orderQuantity} onBack={() => navigateTo('detail')} onComplete={() => navigateTo('complete')} />}
          {currentPage === 'complete' && <CompletePage onNavigate={navigateTo} product={selectedProduct} />}
          {currentPage === 'reservations' && <ReservationsPage />}
          {currentPage === 'history' && <HistoryPage onNavigate={navigateTo} />}
          {currentPage === 'register' && <RegisterPage onNavigate={navigateTo} />}
          {currentPage === 'my' && <MyPage onNavigate={navigateTo} />}
          {currentPage === 'wishlist' && <WishlistPage />}
        </div>

        {/* Bottom Tab Bar */}
        {currentPage !== 'detail' && currentPage !== 'payment' && currentPage !== 'complete' && currentPage !== 'login' && (
          <BottomTabBar currentPage={currentPage} onNavigate={navigateTo} userRole={userRole} />
        )}
        
      </div>
    </div>
  );
}

// ==========================================
// Pages
// ==========================================

function LoginPage({ onLogin }: { onLogin: (role: 'USER' | 'SELLER') => void }) {
  return (
    <div className="flex flex-col bg-white min-h-full p-6 justify-center pb-20">
      <div className="flex flex-col items-center mb-10">
        <div className="w-28 h-28 bg-gradient-to-tr from-[#FFE400] to-[#FFF170] rounded-[2rem] flex items-center justify-center text-6xl mb-6 shadow-xl shadow-yellow-200 animate-float border border-yellow-300/50">
          🛍️
        </div>
        <h1 className="text-4xl font-black text-center tracking-tight text-gray-900 leading-tight">
          살리장
        </h1>
        <p className="text-sm text-gray-500 mt-2 font-bold">우리 동네 마감 식자재 구출 작전!</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
        <input 
          type="text" 
          placeholder="아이디 또는 이메일" 
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
        />
        <input 
          type="password" 
          placeholder="비밀번호" 
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
        />

        <button 
          onClick={() => onLogin('USER')} 
          className="w-full bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform shadow-sm mt-3"
        >
          로그인
        </button>

        <button 
          onClick={() => onLogin('SELLER')} 
          className="w-full bg-black text-[#FFE400] font-extrabold text-lg py-4 rounded-xl hover:bg-gray-800 active:scale-95 transition-transform shadow-sm mt-1"
        >
          판매자 로그인
        </button>

        <div className="flex items-center justify-center gap-4 mt-6 text-sm font-bold text-gray-500">
          <button className="hover:text-black transition-colors">회원가입</button>
          <div className="w-px h-3 bg-gray-300"></div>
          <button onClick={() => onLogin('USER')} className="hover:text-black transition-colors">비회원으로 시작하기</button>
        </div>
      </div>
    </div>
  )
}

function HomePage({ onNavigate, now }: { onNavigate: (id: number) => void, now: Date }) {
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
    <div className="flex flex-col min-h-full bg-white relative pb-6">
      {/* Header */}
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

      {/* Urgency Banner */}
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

      {/* Category Tabs */}
      <div 
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeaveOrUp}
        onMouseUp={onMouseLeaveOrUp}
        onMouseMove={onMouseMove}
        className="flex overflow-x-auto gap-2 pl-4 py-4 border-b border-gray-100 shrink-0 hide-scrollbar cursor-grab active:cursor-grabbing select-none"
      >
        {categories.map((cat, i) => (
          <button 
            key={i} 
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-colors ${selectedCategory === cat ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
        {/* 우측 끝 마진을 완벽하게 확보하기 위한 패딩 더미 */}
        <div className="w-4 shrink-0"></div>
      </div>

      {/* Product List */}
      <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-6">
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
            <div key={product.id} style={{ animationDelay: `${i * 50}ms` }} className="cursor-pointer group flex flex-col gap-2 animate-slide-up opacity-0" onClick={() => onNavigate(product.id)}>
              <div className="relative aspect-square bg-[#FFFBE6] rounded-[1.25rem] overflow-hidden shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 border border-yellow-100">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {/* 뱃지 */}
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

function DetailPage({ product, onBack, onReserve, now }: { product: Product, onBack: () => void, onReserve: (qty: number) => void, now: Date }) {
  const [quantity, setQuantity] = useState(1);
  const [pickupTime, setPickupTime] = useState("20:00");
  const discountRate = Math.round((product.originalPrice - product.discountPrice) / product.originalPrice * 100);
  
  // Calculate a fixed target time for the countdown based on product expiry
  const targetTime = new Date(now.getTime() + product.expiryMinutes * 60 * 1000 - (now.getTime() % 1000));

  return (
    <div className="flex flex-col bg-white min-h-full">
      {/* Upper Area */}
      <div className="relative aspect-square bg-gray-200 w-full rounded-b-3xl overflow-hidden">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-xl font-bold z-10 shadow-sm">
          ←
        </button>
        <div className="absolute bottom-4 left-4 bg-red-500 text-white font-black text-2xl px-3 py-1 rounded-lg shadow-lg rotate-[-5deg]">
          -{discountRate}%
        </div>
      </div>

      {/* Countdown */}
      <div className="bg-red-50 py-3 flex justify-center items-center gap-2 border-y border-red-100">
        <span className="text-red-500 font-bold">⏰ 마감까지</span>
        <span className="text-red-600 font-black text-xl tracking-wider">{formatCountdown(targetTime, now)}</span>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col gap-4">
        <h1 className="text-2xl font-extrabold leading-tight">
          {product.name}
          {product.weight && <span className="text-lg text-gray-400 font-bold ml-2">({product.weight})</span>}
        </h1>
        
        <div className="flex flex-col gap-1">
          <div className="text-gray-400 line-through font-semibold text-lg">{product.originalPrice.toLocaleString()}원</div>
          <div className="flex items-baseline gap-2">
            <span className="text-red-500 font-black text-3xl">{product.discountPrice.toLocaleString()}원</span>
          </div>
        </div>

        <div className="bg-[#FFE400]/20 text-yellow-800 font-bold px-4 py-2 rounded-lg w-fit">
          {(product.originalPrice - product.discountPrice).toLocaleString()}원 절약!
        </div>

        <div className="text-red-500 font-extrabold text-lg mt-2">
          🔥 {product.remaining}개만 남았어요!
        </div>

        {product.description && (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-2">
            <h3 className="font-bold text-gray-700 text-sm mb-1">상세 설명</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Shop Info Card */}
        <div className="border border-gray-200 rounded-2xl p-4 mt-2 shadow-sm flex flex-col gap-3">
          <div>
            <div className="font-bold text-lg flex items-center gap-1">
              {product.shopName}
              {product.rating && <span className="text-sm font-bold text-yellow-500 ml-1">⭐ {product.rating}</span>}
            </div>
            <div className="text-gray-500 text-sm mt-1">서울 마포구 망원동 123 ({product.distance})</div>
            <div className="text-blue-600 font-bold text-sm mt-1">오늘 오후 6시 ~ 8시 픽업 가능</div>
          </div>
          <div className="w-full h-24 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 font-bold">
            지도
          </div>
          <button className="w-full py-2 border border-gray-300 rounded-lg font-bold text-gray-700">
            길 찾기
          </button>
        </div>

        {/* Pickup Time Select */}
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mt-2 border border-gray-100">
          <span className="font-bold text-gray-700">픽업 예정 시간</span>
          <input 
            type="time" 
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="p-2 bg-white border border-gray-200 rounded-lg font-bold text-blue-600 focus:border-[#FFE400] outline-none"
          />
        </div>

        {/* Quantity Select */}
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mt-2 border border-gray-100">
          <span className="font-bold text-gray-700">수량 선택</span>
          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-2 py-1">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center font-bold text-xl text-gray-500">-</button>
            <span className="font-black w-4 text-center">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(product.remaining, quantity + 1))} className="w-8 h-8 flex items-center justify-center font-bold text-xl text-gray-500">+</button>
          </div>
        </div>

      </div>

      {/* Bottom Fixed Button */}
      <div className="sticky bottom-0 w-full bg-white p-4 pb-6 border-t border-gray-100 drop-shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
        <button onClick={() => onReserve(quantity)} className="w-full bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform shadow-sm">
          지금 픽업 예약하기 — {(product.discountPrice * quantity).toLocaleString()}원
        </button>
      </div>
    </div>
  )
}

function PaymentPage({ product, quantity, onBack, onComplete }: { product: Product, quantity: number, onBack: () => void, onComplete: () => void }) {
  const [method, setMethod] = useState<'toss' | 'onsite'>('toss');
  const totalPrice = product.discountPrice * quantity;

  return (
    <div className="flex flex-col bg-gray-50 min-h-full relative">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0 shadow-sm">
        <button onClick={onBack} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
        <span className="font-bold text-lg flex-1 text-center pr-8">결제하기</span>
      </header>

      <div className="p-4 flex flex-col gap-6 flex-1">
        {/* Order Summary */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm pb-2 border-b border-gray-50">
            <span className="font-bold text-gray-500">주문 상품</span>
            {product.rating && <span className="font-bold text-yellow-500">⭐ {product.rating}</span>}
          </div>
          
          <div className="flex gap-4 items-center py-1">
            <div className="w-16 h-16 bg-[#FFFBE6] rounded-xl overflow-hidden shrink-0 border border-yellow-100 shadow-sm">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-1">
              <div className="font-extrabold text-lg leading-tight">
                {product.name}
                {product.weight && <span className="text-sm text-gray-400 font-bold ml-1">({product.weight})</span>}
              </div>
              <div className="text-gray-600 font-bold mt-1 text-sm">{product.discountPrice.toLocaleString()}원 x {quantity}개</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-1 pt-3 border-t border-gray-100">
            <span className="font-bold text-gray-700">총 결제 금액</span>
            <span className="text-2xl font-black text-red-500">{totalPrice.toLocaleString()}원</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col gap-3 pb-20">
          <h3 className="font-bold text-lg px-1">결제 수단</h3>
          
          <button 
            onClick={() => setMethod('toss')} 
            className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${method === 'toss' ? 'border-[#0050FF] bg-[#0050FF]/5' : 'border-gray-200 bg-white'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0050FF] rounded-lg flex items-center justify-center text-white font-black text-xs">toss</div>
              <span className="font-bold text-lg">토스페이</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'toss' ? 'border-[#0050FF] bg-[#0050FF]' : 'border-gray-300'}`}>
              {method === 'toss' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
            </div>
          </button>

          <button 
            onClick={() => setMethod('onsite')} 
            className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${method === 'onsite' ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl">🏪</div>
              <span className="font-bold text-lg flex flex-col items-start"><span className="leading-tight">현장 결제</span><span className="text-xs text-gray-500 font-normal mt-0.5">가게에서 직접 결제</span></span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'onsite' ? 'border-black bg-black' : 'border-gray-300'}`}>
              {method === 'onsite' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
            </div>
          </button>
        </div>
      </div>

      <div className="sticky bottom-0 w-full bg-white p-4 pb-6 border-t border-gray-100 drop-shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
        <button onClick={onComplete} className="w-full bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform shadow-sm">
          {method === 'toss' ? `${totalPrice.toLocaleString()}원 결제하기` : '예약하고 현장에서 결제하기'}
        </button>
      </div>
    </div>
  )
}

function CompletePage({ onNavigate, product }: { onNavigate: (page: Page) => void, product: Product }) {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowCheck(true), 100);
  }, []);

  return (
    <div className="flex flex-col items-center p-6 h-full bg-white pt-20">
      {/* Animated Check */}
      <div className={`w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-6 transition-all duration-700 ${showCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <span className="text-white text-5xl">✓</span>
      </div>
      
      <h1 className="text-3xl font-black mb-8">예약 완료!</h1>

      {/* Info Card */}
      <div className="w-full bg-[#FFE400]/20 border border-[#FFE400] rounded-2xl p-5 flex flex-col gap-3 mb-8">
        <div className="font-extrabold text-lg mb-2 flex items-center justify-between">
          <span>{product.name} {product.weight && <span className="text-sm font-bold text-yellow-800 ml-1">({product.weight})</span>}</span>
          {product.rating && <span className="text-sm font-bold text-yellow-700 bg-yellow-100/50 px-2 py-0.5 rounded-full">⭐ {product.rating}</span>}
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-bold text-gray-600">픽업 장소</span>
          <span className="font-bold">{product.shopName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-bold text-gray-600">주소</span>
          <span className="font-bold">서울 마포구 망원동 123-45</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-bold text-gray-600">픽업 가능 시간</span>
          <span className="font-bold text-blue-600">오늘 오후 6시 ~ 8시</span>
        </div>
        <div className="border-t border-[#FFE400]/50 my-2"></div>
        <div className="flex justify-between text-xs">
          <span className="font-bold text-gray-600">예약 번호</span>
          <span className="font-mono font-bold">#PK-20260408-0042</span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
        <button className="w-full bg-[#FFE400] text-black font-bold py-4 rounded-xl flex justify-center items-center gap-2">
          <span className="text-xl">💬</span> 카카오톡으로 공유
        </button>
        <button onClick={() => onNavigate('reservations')} className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl">
          예약 목록 보기
        </button>
      </div>
    </div>
  )
}

function ReservationsPage() {
  const [reservations, setReservations] = useState([
    { id: '#PK-0042', name: '국내산 삼겹살', shop: '망원 정육점', time: '오늘 오후 6~8시', imageUrl: DUMMY_PRODUCTS[0].imageUrl },
    { id: '#PK-0041', name: '오늘 구운 크루아상', shop: '동네 베이커리', time: '오늘 오후 5~6시', imageUrl: DUMMY_PRODUCTS[2].imageUrl }
  ]);

  const handleCancel = (id: string) => {
    if (window.confirm("정말 취소하겠습니까?")) {
      // 나중에 실제 취소 API가 연동될 곳
      setReservations(prev => prev.filter(r => r.id !== id));
      alert("예약이 취소되었습니다.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="bg-white p-4 border-b border-gray-100 sticky top-0 z-10 flex justify-center shadow-sm">
        <h1 className="text-lg font-bold">픽업 대기</h1>
      </header>

      <div className="p-4 flex flex-col gap-4">
        {reservations.length > 0 ? (
          reservations.map(r => (
            <ReservationCard 
              key={r.id}
              status="대기" 
              name={r.name} 
              shop={r.shop} 
              time={r.time} 
              id={r.id} 
              imageUrl={r.imageUrl} 
              onCancel={() => handleCancel(r.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl mb-2">텅</span>
            <span className="font-bold">당연함, 이미 다 구출함!</span>
            <span className="text-xs">대기 중인 픽업 예약이 없습니다.</span>
          </div>
        )}
      </div>
    </div>
  )
}

function HistoryPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [reviewingItem, setReviewingItem] = useState<{name: string, shop: string} | null>(null);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    alert("리뷰가 성공적으로 등록되었습니다. 환경 보호에 동참해주셔서 감사합니다! 🌍");
    setReviewingItem(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shadow-sm shrink-0">
        <button onClick={() => onNavigate('my')} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
        <span className="font-bold text-lg flex-1 text-center pr-8">주문 내역</span>
      </header>

      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        <ReservationCard status="완료" name="유기농 시금치" shop="초록 채소가게" time="어제" id="#PK-0038" imageUrl={DUMMY_PRODUCTS[1].imageUrl} onReview={() => setReviewingItem({name: "유기농 시금치", shop: "초록 채소가게"})} />
        <ReservationCard status="완료" name="갈치" shop="수산 시장" time="3일 전" id="#PK-0031" imageUrl={DUMMY_PRODUCTS[3].imageUrl} onReview={() => setReviewingItem({name: "갈치", shop: "수산 시장"})} />
      </div>

      {/* Review Modal UI */}
      {reviewingItem && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full rounded-t-3xl p-6 flex flex-col gap-4 animate-slide-up pb-10 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-black">리뷰 쓰기</h2>
              <button onClick={() => setReviewingItem(null)} className="text-gray-400 font-bold text-2xl px-2">✕</button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-1 border border-gray-100 flex items-center gap-3">
              <div className="text-3xl">🛍️</div>
              <div>
                <div className="text-xs text-gray-500 font-bold">{reviewingItem.shop}</div>
                <div className="font-bold text-gray-900">{reviewingItem.name}</div>
              </div>
            </div>

            <form onSubmit={handleSubmitReview} className="flex flex-col gap-5">
              <div className="flex flex-col items-center gap-2 mt-2">
                <span className="text-sm font-bold text-gray-700">이 상품 어떠셨나요?</span>
                <div className="flex gap-2 text-4xl text-gray-200">
                  <span className="text-[#FFE400] cursor-pointer active:scale-95 transition-transform drop-shadow-md">⭐</span>
                  <span className="text-[#FFE400] cursor-pointer active:scale-95 transition-transform drop-shadow-md">⭐</span>
                  <span className="text-[#FFE400] cursor-pointer active:scale-95 transition-transform drop-shadow-md">⭐</span>
                  <span className="text-[#FFE400] cursor-pointer active:scale-95 transition-transform drop-shadow-md">⭐</span>
                  <span className="cursor-pointer active:scale-95 transition-transform">⭐</span>
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

function ReservationCard({status, name, shop, time, id, imageUrl, onCancel, onReview}: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
      <div className="w-20 h-20 bg-[#FFFBE6] rounded-xl shrink-0 overflow-hidden border border-yellow-100">
        {imageUrl && <img src={imageUrl} alt={name} className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <div className="font-bold line-clamp-1">{name}</div>
          <div className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${status === '대기' ? 'bg-[#FFE400] text-black' : 'bg-gray-200 text-gray-600'}`}>
            {status === '대기' ? '픽업 대기중' : '픽업 완료'}
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-1">{shop}</div>
        <div className="text-sm font-bold text-blue-600 mb-2">{time} <span className="text-gray-400 font-normal ml-1">({id})</span></div>
        <div className="mt-auto">
          {status === '대기' ? (
            <button onClick={onCancel} className="w-full py-1.5 border border-red-200 text-red-500 font-bold rounded-lg text-xs hover:bg-red-50 transition-colors">예약 취소</button>
          ) : (
            <button onClick={onReview} className="w-full py-1.5 border border-gray-200 font-bold rounded-lg text-xs hover:bg-gray-50 transition-colors">리뷰 쓰기</button>
          )}
        </div>
      </div>
    </div>
  )
}

function RegisterPage({ onNavigate }: { onNavigate?: (page: Page) => void }) {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState<number | "">(15000);
  const [quantity, setQuantity] = useState<number | "">(5);
  const [discount, setDiscount] = useState(60);
  const [time, setTime] = useState("20:00");
  const [description, setDescription] = useState("");
  
  const [attempted, setAttempted] = useState(false);

  // 10원 단위를 버리고 100원 단위로 맞춤 (예: 5850원 -> 5800원)
  const discountedPrice = Math.floor(((Number(price) || 0) * (1 - discount / 100)) / 100) * 100;

  const handleSubmit = () => {
    setAttempted(true);
    if (!name || !weight || !price || !quantity || !time || !description) {
      return;
    }
    alert("성공적으로 상품이 등록되었습니다!");
    if (onNavigate) onNavigate('home');
  };

  const getBorderClass = (val: any) => {
    if (attempted && !val) return "border-red-500 focus:border-red-500 bg-red-50";
    return "border-gray-200 focus:border-[#FFE400] bg-gray-50";
  };

  return (
    <div className="flex flex-col bg-white">
      <header className="bg-white p-4 border-b border-gray-100 sticky top-0 z-10 flex justify-center shadow-sm">
        <h1 className="text-lg font-bold">마감 재고 등록</h1>
      </header>

      <div className="p-4 flex flex-col gap-6">
        {/* Image Upload */}
        <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl h-32 flex flex-col items-center justify-center text-gray-400 gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <span className="text-2xl">📷</span>
          <span className="font-bold text-sm">상품 사진 등록</span>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">상품명 <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="예) 국내산 삼겹살" className={`w-full p-3 rounded-lg font-bold outline-none transition-colors border ${getBorderClass(name)}`} />
              {attempted && !name && <p className="text-red-500 text-xs font-bold mt-1">상품명을 입력해주세요.</p>}
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-1 whitespace-nowrap">중량 / 갯수 <span className="text-red-500">*</span></label>
              <input type="text" value={weight} onChange={e => setWeight(e.target.value)} placeholder="300g, 5개" className={`w-full p-3 rounded-lg font-bold outline-none text-center px-1 text-sm border transition-colors ${getBorderClass(weight)}`} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">카테고리 <span className="text-red-500">*</span></label>
            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold focus:border-[#FFE400] outline-none appearance-none">
              <option>🥩 정육</option>
              <option>🥬 채소</option>
              <option>🐟 수산</option>
              <option>🍱 반찬</option>
              <option>🥐 베이커리</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">원래 가격 <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value) || "")} className={`w-full p-3 rounded-lg font-bold outline-none text-right pr-8 border transition-colors ${getBorderClass(price)}`} />
                <span className="absolute right-3 top-3 font-bold text-gray-500">원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">수량 <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value) || "")} className={`w-full p-3 rounded-lg font-bold outline-none text-right pr-8 border transition-colors ${getBorderClass(quantity)}`} />
                <span className="absolute right-3 top-3 font-bold text-gray-500">개</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-gray-700">할인율 (50% ~ 80%) <span className="text-red-500">*</span></label>
              <span className="text-red-500 border border-red-200 bg-red-50 px-2 py-0.5 rounded font-black text-sm">{discount}% 할인</span>
            </div>
            <input type="range" min="50" max="80" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-full accent-[#FFE400]" />
            <div className="flex justify-between mt-2 font-bold px-1">
              <span className="text-gray-400 line-through text-sm">{(Number(price) || 0).toLocaleString()}원</span>
              <span className="text-xl">👉 <span className="font-extrabold text-red-500">{discountedPrice.toLocaleString()}원</span></span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">픽업 마감 시간 <span className="text-red-500">*</span></label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className={`w-full p-3 rounded-lg font-bold outline-none border transition-colors ${getBorderClass(time)}`} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">추가 설명 <span className="text-red-500">*</span></label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="신선도 등 상품 상태를 적어주세요!" className={`w-full p-3 rounded-lg font-bold outline-none h-24 resize-none border transition-colors ${getBorderClass(description)}`}></textarea>
            {attempted && !description && <p className="text-red-500 text-xs font-bold mt-1">상품의 상태나 추가 설명을 입력해주세요.</p>}
          </div>
        </div>

        {/* Registration Button */}
        <button onClick={handleSubmit} className="w-full bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform mt-4 mb-20 shadow-sm">
          마감 특가로 등록하기
        </button>

      </div>
    </div>
  )
}

function MyPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="flex flex-col bg-gray-50 min-h-full">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0">
        <h1 className="font-bold text-lg text-center w-full">마이 살리장</h1>
      </header>

      <div className="flex-1 flex flex-col gap-2 pb-6">
        {/* Profile Section */}
        <div className="bg-white p-5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-4xl">😎</div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl">마포구 식객님 ❯</span>
              <span className="text-gray-500 text-sm mt-1">오늘도 지구를 구하는 중! 🌍</span>
            </div>
          </div>
          
          <div className="flex justify-around mt-6 pt-5 border-t border-gray-100">
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
              <span className="text-2xl">🎟️</span>
              <span className="text-gray-600 text-xs font-bold">할인쿠폰</span>
              <span className="font-extrabold text-sm">2장</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
              <span className="text-2xl">💰</span>
              <span className="text-gray-600 text-xs font-bold">포인트</span>
              <span className="font-extrabold text-sm">1,500P</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
              <span className="text-2xl">❤️</span>
              <span className="text-gray-600 text-xs font-bold">찜한가게</span>
              <span className="font-extrabold text-sm">5곳</span>
            </div>
          </div>
        </div>

        {/* My Activity */}
        <div className="bg-white pt-2 border-y border-gray-100 shadow-sm">
          <MenuList title="나의 쇼핑" items={[
            { label: '주문 내역', icon: '🧾', onClick: () => onNavigate('history') },
            { label: '리뷰 관리', icon: '⭐' },
          ]} />
        </div>

        {/* Customer Center */}
        <div className="bg-white pt-2 border-y border-gray-100 shadow-sm">
          <MenuList title="고객센터" items={[
            { label: '공지사항', icon: '📢' },
            { label: '자주 묻는 질문', icon: '❓' },
            { label: '1:1 문의', icon: '💬' },
          ]} />
        </div>

        {/* Settings */}
        <div className="bg-white pt-2 pb-4 border-y border-gray-100 shadow-sm">
          <MenuList title="설정" items={[
            { label: '알림 설정', icon: '🔔' },
            { label: '약관 및 정책', icon: '📄' },
            { label: '현재 버전', icon: 'ℹ️', value: '1.0.0' },
            { label: '로그아웃', icon: '🚪', textClass: 'text-red-500', onClick: () => onNavigate('login') },
          ]} />
        </div>
      </div>
    </div>
  );
}

function WishlistPage() {
  return (
    <div className="flex flex-col bg-gray-50 min-h-full">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0 shadow-sm">
        <h1 className="font-bold text-lg text-center w-full">찜한 가게</h1>
      </header>
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-[#FFE400] transition-colors">
            <div className="w-14 h-14 bg-[#FFFBE6] rounded-full flex items-center justify-center text-3xl border border-yellow-100">🥩</div>
            <div className="flex-1">
                <div className="font-bold text-lg">망원 정육점</div>
                <div className="text-gray-500 text-xs mt-0.5">서울 마포구 망원동 123</div>
            </div>
            <button className="text-red-500 text-2xl font-bold p-2 active:scale-95 transition-transform drop-shadow-sm">❤️</button>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-[#FFE400] transition-colors">
            <div className="w-14 h-14 bg-[#FFFBE6] rounded-full flex items-center justify-center text-3xl border border-yellow-100">🥐</div>
            <div className="flex-1">
                <div className="font-bold text-lg">동네 베이커리</div>
                <div className="text-gray-500 text-xs mt-0.5">서울 마포구 망원동 456</div>
            </div>
            <button className="text-red-500 text-2xl font-bold p-2 active:scale-95 transition-transform drop-shadow-sm">❤️</button>
        </div>
      </div>
    </div>
  );
}

function MenuList({ title, items }: { title: string, items: Array<{label: string, icon: string, value?: string, textClass?: string, onClick?: () => void}> }) {
  return (
    <div className="flex flex-col">
      <h2 className="px-5 py-3 font-bold text-gray-500 text-xs">{title}</h2>
      <ul className="flex flex-col">
        {items.map((item, i) => (
          <li key={i} onClick={item.onClick} className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors border-t border-gray-50 first:border-t-0">
            <div className="flex flex-row items-center justify-start gap-4">
              <span className="text-xl w-6 flex justify-center items-center">{item.icon}</span>
              <span className={`font-semibold ${item.textClass || 'text-gray-800'}`}>{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.value && <span className="text-xs font-bold text-[#FFE400] bg-black px-2 py-0.5 rounded-full">{item.value}</span>}
              {!item.value && <span className="text-gray-300 font-bold">❯</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ==========================================
// Utils & Shared Components
// ==========================================

function BottomTabBar({ currentPage, onNavigate, userRole }: { currentPage: Page, onNavigate: (page: Page) => void, userRole: 'USER' | 'SELLER' }) {
  return (
    <nav className="absolute bottom-0 w-full max-w-[390px] bg-white border-t border-gray-100 flex items-center justify-around h-16 px-2 drop-shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <TabButton icon="🏠" label="홈" isActive={currentPage === 'home'} onClick={() => onNavigate('home')} />
      <TabButton icon="🗺️" label="근처 지도" isActive={false} onClick={() => {}} />
      
      {/* Center Action Button */}
      {userRole === 'SELLER' ? (
        <div className="relative -top-5 flex flex-col items-center justify-center">
          <button onClick={() => onNavigate('register')} className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-white ${currentPage === 'register' ? 'bg-black text-[#FFE400]' : 'bg-[#FFE400] text-black'}`}>
            ➕
          </button>
          <span className={`text-[10px] font-bold mt-1 ${currentPage === 'register' ? 'text-black' : 'text-gray-500'}`}>등록</span>
        </div>
      ) : (
        <div className="relative -top-5 flex flex-col items-center justify-center">
          <button onClick={() => onNavigate('wishlist')} className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-white ${currentPage === 'wishlist' ? 'bg-red-50 text-red-500' : 'bg-red-50 text-red-500'}`}>
            ❤️
          </button>
          <span className={`text-[10px] font-bold mt-1 ${currentPage === 'wishlist' ? 'text-black' : 'text-gray-500'}`}>찜</span>
        </div>
      )}

      <TabButton icon="🧾" label="예약" isActive={currentPage === 'reservations' || currentPage === 'complete'} onClick={() => onNavigate('reservations')} />
      <TabButton icon="👤" label="마이" isActive={currentPage === 'my'} onClick={() => onNavigate('my')} />
    </nav>
  )
}

function TabButton({ icon, label, isActive, onClick }: { icon: string, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 w-16 h-full ${isActive ? 'text-black' : 'text-gray-400'}`}>
      <span className={`text-xl ${isActive ? 'opacity-100' : 'opacity-60 grayscale'}`}>{icon}</span>
      <span className={`text-[10px] font-bold ${isActive ? 'text-black' : 'text-gray-500'}`}>{label}</span>
    </button>
  )
}

function formatCountdown(targetDate: Date, now: Date) {
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return "00:00:00";
  
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
