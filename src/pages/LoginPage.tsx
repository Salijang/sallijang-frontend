import React from 'react';
import type { Page } from '../types';

/**
 * 로그인 페이지 컴포넌트
 * 일반 유저 / 판매자 역할을 선택하여 로그인합니다.
 */
export function LoginPage({ onLogin, isPcVersion, onSetPcVersion, onNavigate }: { onLogin: (role: 'USER' | 'SELLER') => void, isPcVersion: boolean, onSetPcVersion: (v: boolean) => void, onNavigate: (page: Page) => void }) {
  if (isPcVersion) {
    return (
      <div className="flex h-[calc(100vh-100px)] w-full bg-white rounded-3xl overflow-hidden shadow-sm mt-8 border border-gray-100">
         <div className="flex-1 bg-[#FFE400] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
            <div className="text-9xl mb-8 shadow-2xl shadow-yellow-500/30 bg-white/30 p-10 rounded-full backdrop-blur-md animate-float z-10 border border-white/40">🛍️</div>
            <h1 className="text-6xl font-black text-gray-900 tracking-tight z-10 drop-shadow-sm">살리장</h1>
            <p className="text-xl font-bold mt-4 text-gray-800 z-10">우리 동네 마감 식자재 구출 작전!</p>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
         </div>
         <div className="flex-1 flex flex-col justify-center items-center p-10 bg-white relative">
            <div className="max-w-md w-full flex flex-col gap-5 relative z-10">
              <h2 className="text-3xl font-black mb-4 text-center">로그인</h2>
              <input type="text" placeholder="아이디 또는 이메일" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all" />
              <input type="password" placeholder="비밀번호" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all" />
              <button onClick={() => onLogin('USER')} className="w-full bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 mt-2 active:scale-95 transition-transform shadow-sm">일반 로그인</button>
              <button onClick={() => onLogin('SELLER')} className="w-full bg-black text-[#FFE400] font-extrabold text-lg py-4 rounded-xl hover:bg-gray-800 active:scale-95 transition-transform shadow-sm">판매자 로그인</button>
              <div className="flex justify-center items-center mt-6 gap-4 font-bold text-sm text-gray-500">
                <button onClick={() => onNavigate('signup')} className="hover:text-black transition-colors">회원가입</button>
                <div className="w-px h-3 bg-gray-300"></div>
                <button onClick={() => onSetPcVersion(false)} className="hover:text-black transition-colors text-blue-500 font-black drop-shadow-sm flex items-center gap-1">📱 모바일 버전으로 보기</button>
              </div>
            </div>
         </div>
      </div>
    );
  }

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
          <button onClick={() => onNavigate('signup')} className="hover:text-black transition-colors">회원가입</button>
          <div className="w-px h-3 bg-gray-300"></div>
          <button onClick={() => onSetPcVersion(true)} className="hover:text-black transition-colors text-[#FFE400] font-black drop-shadow-sm flex items-center gap-1">💻 PC 버전으로 보기</button>
        </div>
      </div>
    </div>
  )
}
