import React, { useState } from 'react';

/**
 * 판매자 전용 홈 데시보드.
 * 매출액, 요약 등 판매자의 전반적 활동을 요약합니다.
 */
export function SellerHomePage() {
  const [pauseBusiness, setPauseBusiness] = useState(false);
  const [noticeExpanded, setNoticeExpanded] = useState(false);

  return (
    <div className="flex flex-col min-h-full bg-gray-50 relative pb-20">
      <header className="bg-gray-50 p-4 flex justify-between items-center sticky top-0 z-20 shrink-0 min-h-[64px]">
        <button className="text-2xl text-gray-800 focus:outline-none flex items-center justify-center p-1 relative -left-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="miter"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
        </button>
        <div className="flex items-center gap-1 font-black text-xl tracking-tight text-gray-900 absolute left-1/2 -translate-x-1/2">
          살리장셀프서비스 <span className="text-[22px] ml-0.5">🥜</span>
        </div>
        <div className="w-8"></div>
      </header>

      <div className="px-5 py-2 flex flex-col gap-5">
        <div className="mt-1">
          <div className="text-gray-500 font-bold mb-1 flex items-center gap-1.5 text-[13px]">
            <span>2024. 11. 19 (화)</span>
            <span>·</span>
            <span>☀️ 20.2°</span>
          </div>
          <h2 className="text-[21px] font-black text-gray-900 tracking-tight leading-snug">김살리 사장님을 언제나 응원해요!</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100/80 cursor-pointer transition-shadow">
            <div className="text-gray-600 font-bold mb-2.5 text-sm">오늘 판매금액</div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-[19px] text-gray-900">120,500원</span>
              <span className="text-gray-400 font-light text-xl -mt-1">›</span>
            </div>
            <div className="text-emerald-500 font-extrabold text-[13px] tracking-tight">어제보다 + 14,000원</div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100/80 cursor-pointer transition-shadow">
            <div className="text-gray-600 font-bold mb-2.5 text-sm">오늘 판매수</div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-[19px] text-gray-900">8건</span>
              <span className="text-gray-400 font-light text-xl -mt-1">›</span>
            </div>
            <div className="text-emerald-500 font-extrabold text-[13px] tracking-tight">어제보다 + 2건</div>
          </div>
        </div>

        <div className="bg-gray-100/60 rounded-2xl p-5 flex justify-between items-center h-[90px] mt-1 shadow-sm border border-gray-50/50">
          <div className="flex flex-col gap-1.5 h-full justify-center mt-1">
            <span className="font-extrabold text-[16px] text-gray-900 leading-none">영업임시중지</span>
            <span className="text-gray-500 font-bold text-[13px] leading-none tracking-tight">모든 가게에 적용돼요</span>
          </div>
          <div 
            onClick={() => setPauseBusiness(!pauseBusiness)}
            className={`w-[52px] h-[30px] rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out relative flex items-center ${pauseBusiness ? 'bg-gray-800' : 'bg-gray-300'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ease-in-out absolute ${pauseBusiness ? 'translate-x-[22px]' : 'translate-x-0'}`}></div>
          </div>
        </div>
        
        <div className="h-px bg-gray-200/60 w-full mt-4 mb-1"></div>

        <div>
          <div 
            className="flex justify-between items-center mb-4 cursor-pointer pt-2"
            onClick={() => setNoticeExpanded(!noticeExpanded)}
          >
            <h3 className="font-extrabold text-[17px] flex items-center gap-1 text-gray-900">공지사항 <span className="text-gray-400 font-light text-[22px] ml-0.5 -mt-1">›</span></h3>
            <span className="text-gray-500 font-bold text-[13px] flex items-center gap-1 pr-1">펼치기 <span className={`transition-transform duration-300 inline-block font-normal text-[10px] ${noticeExpanded ? 'rotate-180' : ''}`}>▼</span></span>
          </div>
          <div className="flex flex-col gap-1 mb-1 px-1">
            <div className="flex items-start gap-1.5">
               <span className="text-orange-500 font-black mt-1 text-[22px] leading-[10px]">·</span>
               <p className="text-gray-700 font-bold text-[14.5px] leading-snug tracking-tight">
                 [공지] 주문접수채널에서 '라이더 호출' 기능을 사용해보세요
               </p>
            </div>
            <span className="text-gray-400 text-[13px] font-bold mt-1.5 ml-3.5">2025. 1. 31</span>
          </div>
          {noticeExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-gray-600 text-sm animate-fade-in font-bold px-1">
              추가 공지사항 내용이 여기에 표시됩니다.
            </div>
          )}
        </div>

        <div className="h-px bg-gray-200/60 w-full mt-5 mb-1"></div>

        <div className="pb-10">
          <div className="flex items-center gap-3 mb-5 pt-2">
            <h3 className="font-extrabold text-[17px] flex items-center gap-1 text-gray-900 cursor-pointer">리뷰 <span className="text-gray-400 font-light text-[22px] ml-0.5 -mt-1">›</span></h3>
            <div className="flex gap-2 text-[12px] font-extrabold tracking-tight">
              <div className="bg-gray-800 text-white px-2.5 py-1 rounded-full leading-none">신규 3</div>
              <div className="text-gray-500 flex items-center px-1">미답변 7</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5 px-1">
            <div className="flex items-center gap-2">
              <div className="flex text-[#FFC400] text-[15px] tracking-tighter">
                ★★★★<span className="text-gray-200">★</span>
              </div>
              <span className="text-gray-400 font-bold text-[13px] ml-0.5">오늘</span>
            </div>
            <p className="font-bold text-[15px] text-gray-800 mt-1 tracking-tight">서비스로 주신 음료 잘 먹었습니다!</p>
          </div>
          
          <div className="h-px bg-gray-100/80 w-full mt-6 mb-5"></div>

          <div className="flex flex-col gap-1.5 px-1 relative">
            <div className="flex items-center gap-2">
              <div className="flex text-[#FFC400] text-[15px] tracking-tighter">
                ★★★★★
              </div>
              <span className="text-gray-400 font-bold text-[13px] ml-0.5">어제</span>
            </div>
            <p className="font-bold text-[15px] text-gray-800 mt-1 tracking-tight">고기가 너무 신선해요. 다음에 또 주문할게요!</p>
            <div className="absolute -bottom-8 w-full h-16 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
