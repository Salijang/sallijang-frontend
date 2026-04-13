import React, { useState } from 'react';
import type { Product } from '../types';

/**
 * 결제 진행 페이지
 * 현장 결제 혹은 토스페이 등의 결제수단 선택지를 제공합니다.
 */
export function PaymentPage({ product, quantity, onBack, onComplete }: { product: Product, quantity: number, onBack: () => void, onComplete: () => void }) {
  const [method, setMethod] = useState<'toss' | 'onsite'>('toss');
  const totalPrice = product.discountPrice * quantity;

  return (
    <div className="flex flex-col bg-gray-50 min-h-full relative">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0 shadow-sm">
        <button onClick={onBack} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
        <span className="font-bold text-lg flex-1 text-center pr-8">결제하기</span>
      </header>

      <div className="p-4 flex flex-col gap-6 flex-1">
        {/* 주문 정보 카드 */}
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

        {/* 결제 방식 선택 섹션 */}
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
