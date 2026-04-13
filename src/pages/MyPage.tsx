import React from 'react';
import type { Page } from '../types';
import { MenuList } from '../components/SharedComponents';

/**
 * 마이페이지 컴포넌트.
 * 판매자 혹은 유저의 프로필 및 각종 메뉴를 표시합니다.
 */
export function MyPage({ onNavigate, userRole }: { onNavigate: (page: Page) => void, userRole?: 'USER' | 'SELLER' }) {
  if (userRole === 'SELLER') {
    return (
      <div className="flex flex-col bg-gray-50 min-h-full">
        <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0">
          <h1 className="font-bold text-lg text-center w-full">가게 관리</h1>
        </header>

        <div className="flex-1 flex flex-col gap-2 pb-6">
          {/* Profile Section */}
          <div className="bg-white p-5 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FFE400] rounded-full flex items-center justify-center text-4xl shadow-sm">👨‍🍳</div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl">김살리 사장님</span>
                <span className="text-gray-500 text-sm mt-1">망원 정육점</span>
              </div>
            </div>
            
            <div className="flex justify-around mt-6 pt-5 border-t border-gray-100">
              <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
                <span className="text-2xl">📦</span>
                <span className="text-gray-600 text-xs font-bold">판매중</span>
                <span className="font-extrabold text-sm">3건</span>
              </div>
              <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
                <span className="text-2xl">🤝</span>
                <span className="text-gray-600 text-xs font-bold">단골 손님</span>
                <span className="font-extrabold text-sm">128명</span>
              </div>
              <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
                <span className="text-2xl">⭐</span>
                <span className="text-gray-600 text-xs font-bold">가게 평점</span>
                <span className="font-extrabold text-sm">4.8</span>
              </div>
            </div>
          </div>

          <div className="bg-white pt-2 border-y border-gray-100 shadow-sm">
            <MenuList title="가게 관리" items={[
              { label: '상품 등록/관리', icon: '📝', onClick: () => onNavigate('sales') },
              { label: '리뷰 관리', icon: '⭐', onClick: () => onNavigate('reviews') },
              { label: '정산 내역', icon: '💰' },
            ]} />
          </div>

          <div className="bg-white pt-2 border-y border-gray-100 shadow-sm">
            <MenuList title="고객센터" items={[
              { label: '사장님 공지사항', icon: '📢' },
              { label: '자주 묻는 질문', icon: '❓' },
              { label: '사장님 만족도 조사', icon: '📋' },
            ]} />
          </div>

          <div className="bg-white pt-2 pb-4 border-y border-gray-100 shadow-sm">
            <MenuList title="설정" items={[
              { label: '알림 설정', icon: '🔔' },
              { label: '로그아웃', icon: '🚪', textClass: 'text-red-500', onClick: () => onNavigate('login') },
            ]} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 min-h-full">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0">
        <h1 className="font-bold text-lg text-center w-full">마이 살리장</h1>
      </header>

      <div className="flex-1 flex flex-col gap-2 pb-6">
        {/* Profile Section */}
        <div className="bg-white p-5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-4xl">😎</div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl">마포구 식객님</span>
              <span className="text-gray-500 text-sm mt-1">오늘도 지구를 구하는 중! 🌍</span>
            </div>
          </div>
          
          <div className="flex justify-around mt-6 pt-5 border-t border-gray-100">
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
              <span className="text-2xl">🎟️</span>
              <span className="text-gray-600 text-xs font-bold">할인쿠폰</span>
              <span className="font-extrabold text-sm">2장</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
              <span className="text-2xl">💰</span>
              <span className="text-gray-600 text-xs font-bold">포인트</span>
              <span className="font-extrabold text-sm">1,500P</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
              <span className="text-2xl">❤️</span>
              <span className="text-gray-600 text-xs font-bold">찜한가게</span>
              <span className="font-extrabold text-sm">5곳</span>
            </div>
          </div>
        </div>

        {/* My Activity */}
        <div className="bg-white pt-2 border-y border-gray-100 shadow-sm">
          <MenuList title="나의 쇼핑" items={[
            { label: '주문 내역', icon: '🧾', onClick: () => onNavigate('history') },
            { label: '리뷰 관리', icon: '⭐', onClick: () => onNavigate('reviews') },
          ]} />
        </div>

        {/* Customer Center */}
        <div className="bg-white pt-2 border-y border-gray-100 shadow-sm">
          <MenuList title="고객센터" items={[
            { label: '공지사항', icon: '📢' },
            { label: '자주 묻는 질문', icon: '❓' },
            { label: '1:1 문의', icon: '💬' },
          ]} />
        </div>

        {/* Settings */}
        <div className="bg-white pt-2 pb-4 border-y border-gray-100 shadow-sm">
          <MenuList title="설정" items={[
            { label: '알림 설정', icon: '🔔' },
            { label: '약관 및 정책', icon: '📄' },
            { label: '현재 버전', icon: 'ℹ️', value: '1.0.0' },
            { label: '로그아웃', icon: '🚪', textClass: 'text-red-500', onClick: () => onNavigate('login') },
          ]} />
        </div>
      </div>
    </div>
  );
}
