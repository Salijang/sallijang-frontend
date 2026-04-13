import React, { useState } from 'react';
import type { Page } from '../types';

/**
 * 마감 재고(특가 상품)를 새로 등록하는 폼 컴포넌트.
 * 모든 정보를 입력받고, 할인율 스크롤바를 통해 최종 가격을 계산합니다.
 */
export function RegisterPage({ onNavigate }: { onNavigate?: (page: Page) => void }) {
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
    if (window.confirm("이대로 등록하시겠습니까?")) {
      alert("성공적으로 상품이 등록되었습니다!");
      if (onNavigate) onNavigate('home');
    }
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
        {/* Image Upload Component */}
        <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl h-32 flex flex-col items-center justify-center text-gray-400 gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <span className="text-2xl">📷</span>
          <span className="font-bold text-sm">상품 사진 등록</span>
        </div>

        {/* Input Form Groups */}
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

        {/* Submit Action */}
        <button onClick={handleSubmit} className="w-full bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform mt-4 mb-20 shadow-sm">
          마감 특가로 등록하기
        </button>

      </div>
    </div>
  )
}
