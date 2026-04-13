/**
 * 앱 전반적으로 사용되는 타입 정의 파일입니다.
 * Page: 앱의 라우팅 가능한 페이지 목록
 * Product: 상품 정보 인터페이스
 */
export type Page = 'home' | 'seller_home' | 'sales' | 'map' | 'detail' | 'payment' | 'complete' | 'reservations' | 'history' | 'register' | 'my' | 'login' | 'wishlist' | 'reviews';

export interface Product {
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
