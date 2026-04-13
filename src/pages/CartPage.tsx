import React, { useState } from 'react';
import type { Page, CartOrderItem } from '../types';
import { DUMMY_PRODUCTS } from '../data';

/**
 * 장바구니 페이지
 * 가게별로 담긴 상품을 그룹화하여 보여주며, 가게별 선택 후 주문이 가능합니다.
 * 살리장 앱 디자인 시스템(#FFE400 노란색, 검정 포인트)을 따릅니다.
 */

interface CartItem {
  productId: number;
  quantity: number;
}

interface CartGroup {
  shopName: string;
  items: CartItem[];
}

// 초기 장바구니 데이터: DUMMY_PRODUCTS 기반으로 구성
const INITIAL_CART_GROUPS: CartGroup[] = [
  {
    shopName: '망원 정육점',
    items: [
      { productId: 1, quantity: 1 }, // 국내산 삼겹살
      { productId: 6, quantity: 1 }, // 한우 불고기용
    ],
  },
  {
    shopName: '동네 베이커리',
    items: [
      { productId: 3, quantity: 2 }, // 오늘 구운 크루아상
    ],
  },
];

export function CartPage({ onNavigate, onBack, onOrder }: {
  onNavigate: (page: Page) => void;
  onBack: () => void;
  /** 주문하기 버튼 클릭 시 호출: 가게명과 주문 상품 목록을 App.tsx로 전달 */
  onOrder: (shopName: string, items: CartOrderItem[]) => void;
}) {
  const [cartGroups, setCartGroups] = useState<CartGroup[]>(INITIAL_CART_GROUPS);
  // 체크된 가게 목록 (기본: 첫 번째 가게만 선택)
  const [checkedShops, setCheckedShops] = useState<string[]>([INITIAL_CART_GROUPS[0].shopName]);

  const toggleShopCheck = (shopName: string) => {
    setCheckedShops(prev =>
      prev.includes(shopName)
        ? prev.filter(s => s !== shopName)
        : [...prev, shopName]
    );
  };

  const removeItem = (shopName: string, productId: number) => {
    setCartGroups(prev => {
      const updated = prev.map(group => {
        if (group.shopName !== shopName) return group;
        return { ...group, items: group.items.filter(i => i.productId !== productId) };
      }).filter(group => group.items.length > 0);
      // 상품이 사라진 가게는 체크 해제
      const remainingShops = updated.map(g => g.shopName);
      setCheckedShops(s => s.filter(name => remainingShops.includes(name)));
      return updated;
    });
  };

  const updateQuantity = (shopName: string, productId: number, delta: number) => {
    setCartGroups(prev =>
      prev.map(group => {
        if (group.shopName !== shopName) return group;
        return {
          ...group,
          items: group.items.map(item => {
            if (item.productId !== productId) return item;
            const product = DUMMY_PRODUCTS.find(p => p.id === productId);
            const max = product?.remaining ?? 99;
            const next = Math.max(1, Math.min(max, item.quantity + delta));
            return { ...item, quantity: next };
          }),
        };
      })
    );
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">

      {/* ── 상단 헤더 ── */}
      <header className="bg-white sticky top-0 z-20 flex items-center justify-between h-14 px-4 border-b border-gray-100 shadow-sm shrink-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          ←
        </button>
        <h1 className="font-bold text-[17px] text-gray-900">장바구니</h1>
        <div className="flex gap-1">
          <button onClick={() => onNavigate('home')} className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 rounded-full transition-colors">🏠</button>
          <button onClick={() => onNavigate('my')} className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 rounded-full transition-colors">👤</button>
        </div>
      </header>

      {/* ── 안내 문구 ── */}
      <p className="text-xs text-red-500 font-bold px-5 pt-4 pb-1">주문하고자 하는 가게 선택</p>

      {/* ── 가게별 그룹 ── */}
      <div className="flex-1 flex flex-col gap-3 px-4 pb-8">
        {cartGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400 py-32 gap-4">
            <span className="text-6xl">🛒</span>
            <p className="font-bold text-base">장바구니가 비어있어요!</p>
            <button
              onClick={() => onNavigate('home')}
              className="mt-2 bg-[#FFE400] text-black font-extrabold px-8 py-3 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform shadow-sm"
            >
              상품 담으러 가기
            </button>
          </div>
        ) : (
          cartGroups.map(group => {
            const isChecked = checkedShops.includes(group.shopName);
            let subtotal = 0;
            group.items.forEach(item => {
              const p = DUMMY_PRODUCTS.find(p => p.id === item.productId);
              if (p) subtotal += p.discountPrice * item.quantity;
            });

            return (
              <div key={group.shopName} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mt-2">

                {/* 가게 헤더 (체크박스 포함) */}
                <button
                  onClick={() => toggleShopCheck(group.shopName)}
                  className="w-full flex items-center gap-3 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  {/* 체크박스 */}
                  <span className={`w-[22px] h-[22px] shrink-0 rounded border-2 flex items-center justify-center transition-colors ${isChecked ? 'bg-black border-black' : 'bg-white border-gray-300'}`}>
                    {isChecked && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  {/* 가게 이모지 배지 */}
                  <span className="w-7 h-7 bg-[#FFE400] rounded-lg flex items-center justify-center text-base shrink-0">🏪</span>
                  <span className="font-bold text-[16px] text-gray-900 text-left flex-1">{group.shopName}</span>
                  <span className="text-xs text-gray-400 font-medium">
                    {group.items.reduce((s, i) => s + i.quantity, 0)}개
                  </span>
                </button>

                {/* 상품 목록 */}
                <div className="px-5 pt-4 pb-2 flex flex-col gap-5">
                  {group.items.map(item => {
                    const product = DUMMY_PRODUCTS.find(p => p.id === item.productId);
                    if (!product) return null;
                    const discountRate = Math.round((product.originalPrice - product.discountPrice) / product.originalPrice * 100);

                    return (
                      <div key={item.productId} className="flex flex-col gap-3">
                        {/* 상품명 + 삭제 */}
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-[15px] text-gray-900 leading-snug flex-1 pr-2">{product.name}</span>
                          <button
                            onClick={() => removeItem(group.shopName, item.productId)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>

                        {/* 이미지 + 가격 정보 */}
                        <div className="flex gap-3">
                          <div className="w-[72px] h-[72px] bg-[#FFFBE6] rounded-xl overflow-hidden shrink-0 border border-yellow-100 relative">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            {/* 할인율 배지 */}
                            <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-black px-1 py-0.5 rounded">
                              -{discountRate}%
                            </span>
                          </div>
                          <div className="flex flex-col justify-center gap-1">
                            <span className="text-[12px] text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</span>
                            {product.weight && (
                              <span className="text-[11px] text-gray-500">· {product.weight}</span>
                            )}
                            <span className="font-extrabold text-[16px] text-gray-900">{product.discountPrice.toLocaleString()}원</span>
                          </div>
                        </div>

                        {/* 수량 조절 */}
                        <div className="flex justify-end items-center gap-2">
                          <div className="flex items-center border border-gray-200 rounded-lg h-9 overflow-hidden bg-white">
                            <button
                              onClick={() => updateQuantity(group.shopName, item.productId, -1)}
                              className="w-9 h-full flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            </button>
                            <span className="w-8 text-center text-[14px] font-bold text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(group.shopName, item.productId, 1)}
                              className="w-9 h-full flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 더 담으러 가기 */}
                <button
                  onClick={() => onNavigate('home')}
                  className="w-full py-4 flex items-center justify-center gap-1.5 border-t border-gray-100 font-bold text-[14px] text-gray-500 hover:bg-gray-50 transition-colors mt-2"
                >
                  <span className="text-base leading-none">+</span> 더 담으러 가기
                </button>

                {/* 배달 방식 */}
                <div className="px-5 pb-3 pt-1 border-t border-gray-50 flex items-center gap-1.5">
                  <span className="font-bold text-[15px] text-gray-900 border-b-2 border-black pb-0.5 cursor-pointer inline-flex items-center gap-1">
                    배달
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                  <span className="text-[15px] text-gray-600">로 받을게요</span>
                </div>

                {/* 금액 요약 */}
                <div className="mx-5 mb-4 pt-3 border-t border-gray-100 flex flex-col gap-2.5">
                  <div className="flex justify-between text-[14px] text-gray-500">
                    <span>총 주문금액</span>
                    <span className="font-medium text-gray-700">{subtotal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-[14px] text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <span>배달팁</span>
                      <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full cursor-pointer font-medium hover:bg-gray-200">자세히</span>
                    </div>
                    <span className="font-medium text-gray-700">3,000원</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                    <span className="font-bold text-[16px] text-gray-900">결제예정금액</span>
                    <span className="font-extrabold text-[20px] text-gray-900">{(subtotal + 3000).toLocaleString()}원</span>
                  </div>
                </div>

                {/* 가게별 주문 버튼 */}
                <div className="px-5 pb-5">
                  <button
                    disabled={!isChecked}
                    onClick={() => isChecked && onOrder(group.shopName, group.items)}
                    className={`w-full font-extrabold py-4 rounded-xl text-[16px] transition-all active:scale-95 ${
                      isChecked
                        ? 'bg-[#FFE400] text-black hover:bg-yellow-400 shadow-sm'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isChecked ? `${group.shopName} 주문하기` : '가게를 선택해주세요'}
                  </button>
                  {!isChecked && (
                    <p className="text-center text-xs text-red-400 font-semibold mt-2">
                      체크 시에만 [주문하기] 버튼 활성화
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
