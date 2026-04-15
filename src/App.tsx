import { useState, useEffect } from 'react';
import type { Page, CartOrderItem } from './types';
import { DUMMY_PRODUCTS } from './data';
import { BottomTabBar, PcGnb } from './components/SharedComponents';

// 개별 페이지 Import
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
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
import { CustomerCenterPage } from './pages/CustomerCenterPage';
import { NotificationSettingsPage } from './pages/NotificationSettingsPage';
import { TermsPolicyPage } from './pages/TermsPolicyPage';
import { MapPage } from './pages/MapPage';

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

  const [storeId, setStoreId] = useState<number | null>(null);
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

  const [fetchedProduct, setFetchedProduct] = useState<Product | null>(null);
  useEffect(() => {
    if (selectedProductId && ['payment', 'complete'].includes(currentPage)) {
       fetch(`http://localhost:8001/api/v1/products/${selectedProductId}`)
         .then(res => res.json())
         .then(data => {
            setFetchedProduct({
              id: data.id, name: data.name, originalPrice: data.original_price, discountPrice: data.discount_price, remaining: data.remaining, totalQuantity: data.total_quantity, expiryMinutes: data.expiry_minutes, category: data.category, imageUrl: data.image_url || "https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=600", weight: data.weight, description: data.description, shopName: data.shop_name || "가게", distance: data.distance || "500m"
            });
         }).catch(console.error);
    }
  }, [selectedProductId, currentPage]);

  const selectedProduct = fetchedProduct || DUMMY_PRODUCTS[0];

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
        {currentPage !== 'login' && currentPage !== 'signup' && <PcGnb currentPage={currentPage} onNavigate={navigateTo} userRole={userRole} onSetPcVersion={setIsPcVersion} />}
        <main className={`max-w-[1200px] w-full mx-auto ${currentPage !== 'login' && currentPage !== 'signup' ? 'pt-24' : ''}`}>
           {currentPage === 'login' && <LoginPage onLogin={(role, _userId, sid) => { setUserRole(role); if (sid) setStoreId(sid); navigateTo(role === 'SELLER' ? 'seller_home' : 'home'); }} isPcVersion={isPcVersion} onSetPcVersion={setIsPcVersion} onNavigate={navigateTo} />}
           {currentPage === 'signup' && <SignupPage onNavigate={navigateTo} />}
           {currentPage === 'home' && <HomePage onNavigate={(p: number) => navigateTo('detail', p)} onNavigateToCart={() => navigateTo('cart')} now={now} isPcVersion={isPcVersion} />}
           {currentPage === 'detail' && selectedProductId && <DetailPage productId={selectedProductId} onBack={() => navigateTo('home')} onReserve={(qty) => { setOrderQuantity(qty); navigateTo('payment'); }} now={now} isPcVersion={isPcVersion} />}
           
           {/* Wrap mobile-focused pages in a PC card */}
           {['payment', 'complete', 'reservations', 'history', 'register', 'my', 'wishlist', 'sales', 'seller_home', 'reviews', 'cart', 'customer_center', 'notification_settings', 'terms_policy'].includes(currentPage) && (
             <div className="max-w-3xl mx-auto bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 min-h-[600px] mt-8">
               {currentPage === 'seller_home' && <SellerHomePage isPcVersion={isPcVersion} />}
               {currentPage === 'payment' && (
                 cartOrderItems.length > 0
                   ? <PaymentPage cartItems={cartOrderItems} cartShopName={cartOrderShopName} onBack={() => { setCartOrderItems([]); navigateTo('cart'); }} onComplete={() => navigateTo('complete')} />
                   : <PaymentPage product={selectedProduct} quantity={orderQuantity} onBack={() => navigateTo('detail')} onComplete={() => navigateTo('complete')} />
               )}
               {currentPage === 'complete' && <CompletePage onNavigate={navigateTo} product={selectedProduct} />}
               {currentPage === 'reservations' && <ReservationsPage userRole={userRole} />}
               {currentPage === 'history' && <HistoryPage onNavigate={navigateTo} />}
               {currentPage === 'register' && <RegisterPage onNavigate={navigateTo} storeId={storeId} />}
               {currentPage === 'my' && <MyPage onNavigate={navigateTo} userRole={userRole} />}
               {currentPage === 'wishlist' && <WishlistPage />}
               {currentPage === 'sales' && <SalesPage onNavigate={navigateTo} storeId={storeId} />}
               {currentPage === 'reviews' && <ReviewsPage onNavigate={navigateTo} userRole={userRole} />}
               {currentPage === 'cart' && <CartPage onNavigate={navigateTo} onBack={() => navigateTo('home')} onOrder={handleCartOrder} />}
               {currentPage === 'customer_center' && <CustomerCenterPage onNavigate={navigateTo} userRole={userRole} />}
               {currentPage === 'notification_settings' && <NotificationSettingsPage onNavigate={navigateTo} userRole={userRole} />}
               {currentPage === 'terms_policy' && <TermsPolicyPage onNavigate={navigateTo} />}
             </div>
           )}
           {currentPage === 'map' && (
             <div className="max-w-3xl mx-auto bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 min-h-[600px] mt-8 relative" style={{ height: "600px" }}>
                <MapPage onNavigate={navigateTo} />
             </div>
           )}
        </main>
      </div>
    );
  }

  // Mobile 버전 UI
  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-[390px] h-screen bg-white relative overflow-y-auto flex flex-col shadow-2xl transition-all duration-300">
        
        {/* Page Routing */}
        <div className={`flex-1 overflow-y-auto ${currentPage !== 'detail' && currentPage !== 'payment' && currentPage !== 'complete' && currentPage !== 'login' && currentPage !== 'signup' && currentPage !== 'cart' ? 'pb-20' : ''}`}>
          {currentPage === 'login' && <LoginPage onLogin={(role, _userId, sid) => { setUserRole(role); if (sid) setStoreId(sid); navigateTo(role === 'SELLER' ? 'seller_home' : 'home'); }} isPcVersion={isPcVersion} onSetPcVersion={setIsPcVersion} onNavigate={navigateTo} />}
          {currentPage === 'signup' && <SignupPage onNavigate={navigateTo} />}
          {currentPage === 'home' && <HomePage onNavigate={(p: number) => navigateTo('detail', p)} onNavigateToCart={() => navigateTo('cart')} now={now} isPcVersion={isPcVersion} />}
          {currentPage === 'seller_home' && <SellerHomePage isPcVersion={isPcVersion} />}
          {currentPage === 'detail' && selectedProductId && <DetailPage productId={selectedProductId} onBack={() => navigateTo('home')} onReserve={(qty) => { setOrderQuantity(qty); navigateTo('payment'); }} now={now} isPcVersion={isPcVersion} />}
          {currentPage === 'payment' && (
            cartOrderItems.length > 0
              ? <PaymentPage cartItems={cartOrderItems} cartShopName={cartOrderShopName} onBack={() => { setCartOrderItems([]); navigateTo('cart'); }} onComplete={() => navigateTo('complete')} />
              : <PaymentPage product={selectedProduct} quantity={orderQuantity} onBack={() => navigateTo('detail')} onComplete={() => navigateTo('complete')} />
          )}
          {currentPage === 'complete' && <CompletePage onNavigate={navigateTo} product={selectedProduct} />}
          {currentPage === 'reservations' && <ReservationsPage userRole={userRole} />}
          {currentPage === 'history' && <HistoryPage onNavigate={navigateTo} />}
          {currentPage === 'register' && <RegisterPage onNavigate={navigateTo} storeId={storeId} />}
          {currentPage === 'my' && <MyPage onNavigate={navigateTo} userRole={userRole} />}
          {currentPage === 'wishlist' && <WishlistPage />}
          {currentPage === 'sales' && <SalesPage onNavigate={navigateTo} storeId={storeId} />}
          {currentPage === 'reviews' && <ReviewsPage onNavigate={navigateTo} userRole={userRole} />}
          {currentPage === 'cart' && <CartPage onNavigate={navigateTo} onBack={() => navigateTo('home')} onOrder={handleCartOrder} />}
          {currentPage === 'customer_center' && <CustomerCenterPage onNavigate={navigateTo} userRole={userRole} />}
          {currentPage === 'notification_settings' && <NotificationSettingsPage onNavigate={navigateTo} userRole={userRole} />}
          {currentPage === 'terms_policy' && <TermsPolicyPage onNavigate={navigateTo} />}
          {currentPage === 'map' && <MapPage onNavigate={(p, id) => navigateTo(p as any, id)} />}
        </div>

        {/* Bottom Tab Bar */}
        {currentPage !== 'detail' && currentPage !== 'payment' && currentPage !== 'complete' && currentPage !== 'login' && currentPage !== 'signup' && currentPage !== 'cart' && currentPage !== 'customer_center' && currentPage !== 'notification_settings' && currentPage !== 'terms_policy' && (
          <BottomTabBar currentPage={currentPage} onNavigate={navigateTo} userRole={userRole} isPcVersion={isPcVersion} />
        )}
        
      </div>
    </div>
  );
}
