import React, { useState } from 'react';
import type { Page, Product } from '../types';
import { DUMMY_PRODUCTS } from '../data';

/**
 * 판매자가 등록한 상품을 관리하는 페이지.
 */
export function SalesPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [products, setProducts] = useState(DUMMY_PRODUCTS.filter(p => ["망원 정육점", "초록 채소가게", "수산 시장"].includes(p.shopName)));
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (editingProduct) {
     return <EditProductView product={editingProduct} onSave={() => { alert('수정되었습니다.'); setEditingProduct(null); }} onCancel={() => setEditingProduct(null)} />
  }

  const handleDelete = (id: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
      alert("삭제가 완료되었습니다.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-20">
      <header className="bg-white p-4 border-b border-gray-100 sticky top-0 z-10 flex items-center shadow-sm">
        <button onClick={() => onNavigate('seller_home')} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
        <h1 className="flex-1 text-lg font-bold text-center pr-8">판매 상품 관리</h1>
      </header>
      <div className="p-4 flex flex-col gap-3">
        {products.map(p => (
           <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
             <div className="w-16 h-16 bg-[#FFFBE6] rounded-xl shrink-0 overflow-hidden border border-yellow-100">
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
             </div>
             <div className="flex-1 flex flex-col justify-center gap-0.5">
                <div className="font-bold text-gray-900 text-[15px]">{p.name} <span className="text-xs text-gray-400 font-normal ml-0.5">{p.weight && `(${p.weight})`}</span></div>
                <div className="text-[14px] font-extrabold text-red-500">{p.discountPrice.toLocaleString()}원 <span className="text-[11px] text-gray-400 line-through font-normal ml-1 pr-1">{p.originalPrice.toLocaleString()}원</span></div>
                <div className="text-[11px] text-gray-500 font-bold mt-0.5">남은 수량: <span className="text-blue-600 font-extrabold">{p.remaining}개</span> / 총 {p.totalQuantity}개</div>
             </div>
             <div className="flex flex-col gap-1.5 shrink-0">
               <button onClick={() => setEditingProduct(p)} className="px-3 py-1.5 bg-gray-100/80 border border-gray-200 text-gray-700 font-bold rounded-lg text-xs hover:bg-gray-200 active:scale-95 transition-transform w-[72px]">
                 수정하기
               </button>
               <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 bg-red-50 border border-red-100 text-red-500 font-bold rounded-lg text-xs hover:bg-red-100 active:scale-95 transition-transform w-[72px]">
                 삭제하기
               </button>
             </div>
           </div>
        ))}
        <button onClick={() => onNavigate('register')} className="w-full mt-3 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold flex justify-center items-center gap-2 hover:bg-gray-50 active:scale-95 transition-all">
          <span className="text-xl">➕</span> 새 마감 특가 등록하기
        </button>
      </div>
    </div>
  )
}

/**
 * 상품 수정 뷰 컴포넌트
 */
function EditProductView({ product, onSave, onCancel }: { product: Product, onSave: () => void, onCancel: () => void }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.originalPrice);
  const [discountPrice, setDiscountPrice] = useState(product.discountPrice);
  const [quantity, setQuantity] = useState(product.totalQuantity);
  const [remaining, setRemaining] = useState(product.remaining);

  return (
    <div className="flex flex-col bg-gray-50 h-full relative z-20 overflow-y-auto pb-10">
      <header className="bg-white p-4 border-b border-gray-100 sticky top-0 z-10 flex items-center shadow-sm">
        <button onClick={onCancel} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
        <div className="font-bold flex-1 text-center pr-8 text-lg">상품 정보 수정</div>
      </header>
      <div className="p-4 flex flex-col gap-5">
         
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
           <div className="flex flex-col gap-1.5">
              <span className="font-bold text-sm text-gray-700">상품명</span>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-[#FFE400] transition-colors focus:bg-white" />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-sm text-gray-700">총 수량</span>
                <div className="relative">
                  <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none text-right pr-8 focus:border-[#FFE400] transition-colors focus:bg-white" />
                  <span className="absolute right-3 top-3.5 font-bold text-gray-500">개</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-sm text-gray-700">잔여 수량</span>
                <div className="relative">
                  <input type="number" value={remaining} onChange={e => setRemaining(Number(e.target.value))} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none text-right pr-8 focus:border-[#FFE400] transition-colors focus:bg-white" />
                  <span className="absolute right-3 top-3.5 font-bold text-gray-500">개</span>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-sm text-gray-700">원래 가격</span>
                <div className="relative">
                  <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none text-right pr-8 focus:border-[#FFE400] transition-colors focus:bg-white" />
                  <span className="absolute right-3 top-3.5 font-bold text-gray-500">원</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-sm text-gray-700 text-red-500">마감 할인가</span>
                <div className="relative">
                  <input type="number" value={discountPrice} onChange={e => setDiscountPrice(Number(e.target.value))} className="w-full p-3.5 bg-red-50 border border-red-200 rounded-xl font-bold outline-none text-right pr-8 focus:border-red-400 transition-colors text-red-600 focus:bg-white" />
                  <span className="absolute right-3 top-3.5 font-bold text-red-500">원</span>
                </div>
              </div>
           </div>
         </div>
         
         <button onClick={onSave} className="w-full mt-2 bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform shadow-sm">
           변경사항 저장
         </button>
      </div>
    </div>
  )
}
