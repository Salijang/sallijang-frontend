import React, { useState } from 'react';
import type { Page } from '../types';

/**
 * 회원가입 페이지 컴포넌트
 * 구매자 / 판매자 역할을 선택하여 가입합니다.
 */
export function SignupPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [role, setRole] = useState<'USER' | 'SELLER'>('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');

  const handleSignup = () => {
    if (!email || !password || !confirmPassword || !name) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (role === 'SELLER' && !shopName) {
      alert("가게 이름을 입력해주세요.");
      return;
    }

    alert(`${role === 'USER' ? '구매자' : '판매자'} 회원가입이 완료되었습니다!`);
    onNavigate('login');
  };

  return (
    <div className="flex flex-col bg-white min-h-full">
      <header className="bg-white p-4 border-b border-gray-100 sticky top-0 z-10 flex items-center shadow-sm">
        <button onClick={() => onNavigate('login')} className="p-1 mr-2 text-xl absolute left-4">←</button>
        <h1 className="text-lg font-bold mx-auto">회원가입</h1>
      </header>

      <div className="p-6 flex flex-col gap-6 w-full max-w-sm mx-auto">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">가입 유형</label>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setRole('USER')}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${role === 'USER' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
            >
              구매자
            </button>
            <button 
              onClick={() => setRole('SELLER')}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${role === 'SELLER' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
            >
              판매자
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">이메일</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">이름</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
            />
          </div>

          {role === 'SELLER' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700">가게 이름</label>
              <input 
                type="text" 
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="가게 이름을 입력하세요" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">비밀번호 확인</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 재입력" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
            />
          </div>
        </div>

        <button 
          onClick={handleSignup}
          className="w-full bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform shadow-sm mt-4 mb-10"
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
