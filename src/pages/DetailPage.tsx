import React, { useState } from 'react';
import type { Product } from '../types';
import { formatCountdown } from '../utils/timeUtils';

/**
 * 특정 상품의 상세 정보를 확인하고 픽업 예약 수량을 설정하는 상세 페이지.
 */
export function DetailPage({ productId, onBack, onReserve, onAddToCart, now, isPcVersion }: { productId: number, onBack: () => void, onReserve: (qty: number) => void, onAddToCart: (product: Product, quantity: number) => void, now: Date, isPcVersion?: boolean }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pickupTime, setPickupTime] = useState("20:00");

  React.useEffect(() => {
    fetch(`http://localhost:8001/api/v1/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct({
          id: data.id,
          name: data.name,
          originalPrice: data.original_price,
          discountPrice: data.discount_price,
          remaining: data.remaining,
          totalQuantity: data.total_quantity,
          expiryMinutes: data.expiry_minutes,
          category: data.category,
          imageUrl: data.image_url || "https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=600",
          weight: data.weight,
          description: data.description,
          shopName: data.shop_name || "알 수 없는 가게",
          distance: data.distance,
          storeId: data.store_id,
          storeAddress: data.store_address,
        });
      })
      .catch(console.error);
  }, [productId]);

  if (!product) return <div className="p-10 flex justify-center text-gray-500 font-bold">로딩 중...</div>;
  const discountRate = Math.round((product.originalPrice - product.discountPrice) / product.originalPrice * 100);
  
  const targetTime = new Date(now.getTime() + product.expiryMinutes * 60 * 1000 - (now.getTime() % 1000));

  if (isPcVersion) {
    return (
      <div className="flex flex-col bg-white min-h-full">
        {/* PC Layout */}
        <div className="p-8 flex gap-10 max-w-5xl mx-auto w-full">
          {/* Left: Image Box */}
          <div className="w-1/2 shrink-0">
            <div className="relative aspect-square bg-gray-200 w-full rounded-3xl overflow-hidden shadow-md">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              <button onClick={onBack} className="absolute top-4 left-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-xl font-bold z-10 shadow-sm hover:bg-white transition-colors">
                ←
              </button>
              <div className="absolute bottom-4 left-4 bg-red-500 text-white font-black text-3xl px-4 py-2 rounded-xl shadow-lg rotate-[-5deg]">
                -{discountRate}%
              </div>
            </div>
          </div>

          {/* Right: Item Info */}
          <div className="w-1/2 flex flex-col pt-4">
            <div className="bg-red-50 py-3 flex justify-center items-center gap-2 border border-red-100 rounded-xl mb-4 w-fit px-6">
              <span className="text-red-500 font-bold">⏰ 마감까지</span>
              <span className="text-red-600 font-black text-xl tracking-wider">{formatCountdown(targetTime, now)}</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              {product.name}
              {product.weight && <span className="text-2xl text-gray-400 font-bold ml-2">({product.weight})</span>}
            </h1>
            
            <div className="flex flex-col gap-1 mb-6">
              <div className="text-gray-400 line-through font-semibold text-xl">{product.originalPrice.toLocaleString()}원</div>
              <div className="flex items-baseline gap-2">
                <span className="text-red-500 font-black text-4xl">{product.discountPrice.toLocaleString()}원</span>
                <span className="bg-[#FFE400]/20 text-yellow-800 font-bold px-3 py-1 rounded-lg text-sm ml-2">
                  {(product.originalPrice - product.discountPrice).toLocaleString()}원 절약!
                </span>
              </div>
            </div>

            <div className="text-red-500 font-extrabold text-xl mb-6">
              🔥 {product.remaining}개만 남았어요!
            </div>

            {product.description && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6">
                <h3 className="font-bold text-gray-700 text-base mb-2">상세 설명</h3>
                <p className="text-gray-600 text-base leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Shop Card */}
            <div className="border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm flex items-center justify-between">
              <div>
                <div className="font-bold text-xl flex items-center gap-1">
                  {product.shopName}
                  {product.rating && <span className="text-base font-bold text-yellow-500 ml-1">⭐ {product.rating}</span>}
                </div>
                <div className="text-gray-500 text-base mt-2">{product.storeAddress || '주소 정보 없음'}{product.distance ? ` (${product.distance})` : ''}</div>
                <div className="text-blue-600 font-bold text-base mt-1">오늘 오후 6시 ~ 8시 픽업 가능</div>
              </div>
              <button className="px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                지도에서 길 찾기
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Pickup Time Select Box */}
              <div className="flex flex-col justify-center bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <span className="font-bold text-gray-700 mb-3">픽업 예정 시간</span>
                <input 
                  type="time" 
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="p-3 bg-white border border-gray-200 rounded-xl font-bold text-blue-600 focus:border-[#FFE400] outline-none text-lg"
                />
              </div>

              {/* Quantity Select Box */}
              <div className="flex flex-col justify-center bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <span className="font-bold text-gray-700 mb-3">수량 선택</span>
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center font-bold text-2xl text-gray-500 hover:bg-gray-50 rounded-lg">-</button>
                  <span className="font-black w-8 text-center text-xl">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.remaining, quantity + 1))} className="w-10 h-10 flex items-center justify-center font-bold text-2xl text-gray-500 hover:bg-gray-50 rounded-lg">+</button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => onAddToCart(product, quantity)}
                className="flex-1 bg-white border-2 border-[#FFE400] text-black font-extrabold text-lg py-5 rounded-2xl hover:bg-yellow-50 active:scale-95 transition-transform shadow-sm"
              >
                🛒 장바구니에 담기
              </button>
              <button
                onClick={() => onReserve(quantity)}
                className="flex-1 bg-[#FFE400] text-black font-extrabold text-lg py-5 rounded-2xl hover:bg-yellow-400 active:scale-95 transition-transform shadow-md"
              >
                바로 픽업 예약하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile Version
  return (
    <div className="flex flex-col bg-white min-h-full">
      {/* 화면 상단 상품 스틸컷 이미지 */}
      <div className="relative aspect-square bg-gray-200 w-full rounded-b-3xl overflow-hidden">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-xl font-bold z-10 shadow-sm">
          ←
        </button>
        <div className="absolute bottom-4 left-4 bg-red-500 text-white font-black text-2xl px-3 py-1 rounded-lg shadow-lg rotate-[-5deg]">
          -{discountRate}%
        </div>
      </div>

      <div className="bg-red-50 py-3 flex justify-center items-center gap-2 border-y border-red-100">
        <span className="text-red-500 font-bold">⏰ 마감까지</span>
        <span className="text-red-600 font-black text-xl tracking-wider">{formatCountdown(targetTime, now)}</span>
      </div>

      {/* 제품 정보와 가게 정보 묶음 */}
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

        <div className="border border-gray-200 rounded-2xl p-4 mt-2 shadow-sm flex flex-col gap-3">
          <div>
            <div className="font-bold text-lg flex items-center gap-1">
              {product.shopName}
              {product.rating && <span className="text-sm font-bold text-yellow-500 ml-1">⭐ {product.rating}</span>}
            </div>
            <div className="text-gray-500 text-sm mt-1">{product.storeAddress || '주소 정보 없음'}{product.distance ? ` (${product.distance})` : ''}</div>
            <div className="text-blue-600 font-bold text-sm mt-1">오늘 오후 6시 ~ 8시 픽업 가능</div>
          </div>
          <div className="w-full h-24 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 font-bold">
            지도
          </div>
          <button className="w-full py-2 border border-gray-300 rounded-lg font-bold text-gray-700">
            길 찾기
          </button>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mt-2 border border-gray-100">
          <span className="font-bold text-gray-700">픽업 예정 시간</span>
          <input 
            type="time" 
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="p-2 bg-white border border-gray-200 rounded-lg font-bold text-blue-600 focus:border-[#FFE400] outline-none"
          />
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mt-2 border border-gray-100">
          <span className="font-bold text-gray-700">수량 선택</span>
          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-2 py-1">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center font-bold text-xl text-gray-500">-</button>
            <span className="font-black w-4 text-center">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(product.remaining, quantity + 1))} className="w-8 h-8 flex items-center justify-center font-bold text-xl text-gray-500">+</button>
          </div>
        </div>

      </div>

      {/* 모바일 하단 플로팅 버튼 영역 */}
      <div className="sticky bottom-0 w-full bg-white p-4 pb-6 border-t border-gray-100 drop-shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20 flex gap-3">
        <button
          onClick={() => onAddToCart(product, quantity)}
          className="flex-1 bg-white border-2 border-[#FFE400] text-black font-extrabold text-base py-4 rounded-xl hover:bg-yellow-50 active:scale-95 transition-transform"
        >
          🛒 담기
        </button>
        <button
          onClick={() => onReserve(quantity)}
          className="flex-[2] bg-[#FFE400] text-black font-extrabold text-base py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform shadow-sm"
        >
          바로 픽업 예약하기 — {(product.discountPrice * quantity).toLocaleString()}원
        </button>
      </div>
    </div>
  )
}
