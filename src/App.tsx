import { useState, useEffect } from 'react';
import type { Page, CartOrderItem } from './types';
import { DUMMY_PRODUCTS } from './data';
import { BottomTabBar, PcGnb } from './components/SharedComponents';

// 개별 페이지 Import
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';
import { PaymentPage } from './pages/PaymentPage';
import { CompletePage } from './pages/CompletePage';
import { ReservationsPage } from './pages/ReservationsPage';
import { HistoryPage } from './pages/HistoryPage';
import { RegisterPage } from './pages/RegisterPage';
import { MyPage } from './pages/MyPage';
import { WishlistPage } from './pages/WishlistPage';
import { SalesPage } from './pages/SalesPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { SellerHomePage } from './pages/SellerHomePage';
import { CartPage } from './pages/CartPage';
/**
 * 앱의 메인 라우터이자 레이아웃을 담당하는 App 컴포넌트입니다.
 * 상태 관리를 통해 각 페이지를 불러옵니다.
 */
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [userRole, setUserRole] = useState<'USER' | 'SELLER'>('USER');
  const [isPcVersion, setIsPcVersion] = useState(false);
  // 장바구니 → 결제 연동용 상태
  const [cartOrderItems, setCartOrderItems] = useState<CartOrderItem[]>([]);
  const [cartOrderShopName, setCartOrderShopName] = useState<string>('');
  
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

  /** 장바구니에서 주문하기 클릭 시 호출 */
  const handleCartOrder = (shopName: string, items: CartOrderItem[]) => {
    setCartOrderShopName(shopName);
    setCartOrderItems(items);
    setCurrentPage('payment');
  };

  // PC 버전 UI
  if (isPcVersion) {
    return (
      <div className="bg-gray-50 min-h-screen text-gray-900 font-sans pb-20 relative">
        {currentPage !== 'login' && <PcGnb currentPage={currentPage} onNavigate={navigateTo} userRole={userRole} onSetPcVersion={setIsPcVersion} />}
        <main className={`max-w-[1200px] w-full mx-auto ${currentPage !== 'login' ? 'pt-24' : ''}`}>
           {currentPage === 'login' && <LoginPage onLogin={(role) => { setUserRole(role); navigateTo(role === 'SELLER' ? 'seller_home' : 'home'); }} isPcVersion={isPcVersion} onSetPcVersion={setIsPcVersion} />}
           {currentPage === 'home' && <HomePage onNavigate={(p: number) => navigateTo('detail', p)} onNavigateToCart={() => navigateTo('cart')} now={now} isPcVersion={isPcVersion} />}
           {currentPage === 'detail' && <DetailPage product={selectedProduct} onBack={() => navigateTo('home')} onReserve={(qty) => { setOrderQuantity(qty); navigateTo('payment'); }} now={now} isPcVersion={isPcVersion} />}
           
           {/* Wrap mobile-focused pages in a PC card */}
           {['payment', 'complete', 'reservations', 'history', 'register', 'my', 'wishlist', 'sales', 'seller_home', 'reviews', 'cart'].includes(currentPage) && (
             <div className="max-w-3xl mx-auto bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 min-h-[600px] mt-8">
               {currentPage === 'seller_home' && <SellerHomePage />}
               {currentPage === 'payment' && (
                 cartOrderItems.length > 0
                   ? <PaymentPage cartItems={cartOrderItems} cartShopName={cartOrderShopName} onBack={() => { setCartOrderItems([]); navigateTo('cart'); }} onComplete={() => navigateTo('complete')} />
                   : <PaymentPage product={selectedProduct} quantity={orderQuantity} onBack={() => navigateTo('detail')} onComplete={() => navigateTo('complete')} />
               )}
               {currentPage === 'complete' && <CompletePage onNavigate={navigateTo} product={selectedProduct} />}
               {currentPage === 'reservations' && <ReservationsPage userRole={userRole} />}
               {currentPage === 'history' && <HistoryPage onNavigate={navigateTo} />}
               {currentPage === 'register' && <RegisterPage onNavigate={navigateTo} />}
               {currentPage === 'my' && <MyPage onNavigate={navigateTo} userRole={userRole} />}
               {currentPage === 'wishlist' && <WishlistPage />}
               {currentPage === 'sales' && <SalesPage onNavigate={navigateTo} />}
               {currentPage === 'reviews' && <ReviewsPage onNavigate={navigateTo} userRole={userRole} />}
               {currentPage === 'cart' && <CartPage onNavigate={navigateTo} onBack={() => navigateTo('home')} onOrder={handleCartOrder} />}
             </div>
           )}
           {currentPage === 'map' && <div className="p-4 pt-20 text-center font-bold">PC 지도 페이지 (구현 예정)</div>}
        </main>
      </div>
    );
  }

  // Mobile 버전 UI
  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-[390px] h-screen bg-white relative overflow-y-auto flex flex-col shadow-2xl transition-all duration-300">
        
        {/* Page Routing */}
        <div className={`flex-1 overflow-y-auto ${currentPage !== 'detail' && currentPage !== 'payment' && currentPage !== 'complete' && currentPage !== 'login' && currentPage !== 'cart' ? 'pb-20' : ''}`}>
          {currentPage === 'login' && <LoginPage onLogin={(role) => { setUserRole(role); navigateTo(role === 'SELLER' ? 'seller_home' : 'home'); }} isPcVersion={isPcVersion} onSetPcVersion={setIsPcVersion} />}
          {currentPage === 'home' && <HomePage onNavigate={(p: number) => navigateTo('detail', p)} onNavigateToCart={() => navigateTo('cart')} now={now} isPcVersion={isPcVersion} />}
          {currentPage === 'seller_home' && <SellerHomePage />}
          {currentPage === 'detail' && <DetailPage product={selectedProduct} onBack={() => navigateTo('home')} onReserve={(qty) => { setOrderQuantity(qty); navigateTo('payment'); }} now={now} isPcVersion={isPcVersion} />}
          {currentPage === 'payment' && (
            cartOrderItems.length > 0
              ? <PaymentPage cartItems={cartOrderItems} cartShopName={cartOrderShopName} onBack={() => { setCartOrderItems([]); navigateTo('cart'); }} onComplete={() => navigateTo('complete')} />
              : <PaymentPage product={selectedProduct} quantity={orderQuantity} onBack={() => navigateTo('detail')} onComplete={() => navigateTo('complete')} />
          )}
          {currentPage === 'complete' && <CompletePage onNavigate={navigateTo} product={selectedProduct} />}
          {currentPage === 'reservations' && <ReservationsPage userRole={userRole} />}
          {currentPage === 'history' && <HistoryPage onNavigate={navigateTo} />}
          {currentPage === 'register' && <RegisterPage onNavigate={navigateTo} />}
          {currentPage === 'my' && <MyPage onNavigate={navigateTo} userRole={userRole} />}
          {currentPage === 'wishlist' && <WishlistPage />}
          {currentPage === 'sales' && <SalesPage onNavigate={navigateTo} />}
          {currentPage === 'reviews' && <ReviewsPage onNavigate={navigateTo} userRole={userRole} />}
          {currentPage === 'cart' && <CartPage onNavigate={navigateTo} onBack={() => navigateTo('home')} onOrder={handleCartOrder} />}
          {currentPage === 'map' && <div className="p-4 pt-20 text-center font-bold">지도 페이지</div>}
        </div>

        {/* Bottom Tab Bar */}
        {currentPage !== 'detail' && currentPage !== 'payment' && currentPage !== 'complete' && currentPage !== 'login' && currentPage !== 'cart' && (
          <BottomTabBar currentPage={currentPage} onNavigate={navigateTo} userRole={userRole} isPcVersion={isPcVersion} />
        )}
        
      </div>
    </div>
  );
}
