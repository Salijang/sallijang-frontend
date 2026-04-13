import React, { useState } from 'react';
import { ReservationCard } from '../components/SharedComponents';
import { DUMMY_PRODUCTS } from '../data';

/**
 * 픽업 예약 리스트를 볼 수 있는 페이지.
 * 유저 역할과 판매자 역할에 따라 들어온 주문 스택을 보여줍니다.
 */
export function ReservationsPage({ userRole }: { userRole?: 'USER' | 'SELLER' }) {
  const [reservations, setReservations] = useState([
    { id: '#PK-0042', name: '국내산 삼겹살', shop: '망원 정육점', time: '오늘 오후 6~8시', imageUrl: DUMMY_PRODUCTS[0].imageUrl, customer: '마포구 식객님', quantity: 2, price: 7200 },
    { id: '#PK-0041', name: '오늘 구운 크루아상', shop: '동네 베이커리', time: '오늘 오후 5~6시', imageUrl: DUMMY_PRODUCTS[2].imageUrl, customer: '빵돌이', quantity: 1, price: 2400 }
  ]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleCancel = (id: string) => {
    if (window.confirm("정말 취소하겠습니까?")) {
      setReservations(prev => prev.filter(r => r.id !== id));
      alert("예약이 취소되었습니다.");
    }
  };

  if (userRole === 'SELLER') {
    if (selectedOrder) {
      return (
        <div className="flex flex-col h-full bg-gray-50">
          <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0 shadow-sm">
            <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
            <span className="font-bold text-lg flex-1 text-center pr-8">주문 상세 내역</span>
          </header>
          <div className="p-4 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm pb-2 border-b border-gray-50">
                <span className="font-bold text-gray-500">주문 번호 {selectedOrder.id}</span>
                <span className="font-bold text-blue-600">픽업 대기중</span>
              </div>
              
              <div className="flex gap-4 items-center py-2">
                <div className="w-20 h-20 bg-[#FFFBE6] rounded-xl overflow-hidden shrink-0 border border-yellow-100 shadow-sm relative">
                  <img src={selectedOrder.imageUrl} alt={selectedOrder.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <div className="font-extrabold text-[17px] flex items-center gap-1 leading-tight text-gray-900">
                    {selectedOrder.name}
                  </div>
                  <div className="text-gray-500 font-bold mt-1 text-[15px]">
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[13px] mr-1">{selectedOrder.quantity}개</span> 
                    <span className="text-gray-900">{(selectedOrder.price * selectedOrder.quantity).toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
              <h3 className="font-bold text-gray-800">고객 정보</h3>
              <div className="flex justify-between text-sm items-center">
                <span className="font-bold text-gray-500">닉네임</span>
                <span className="font-bold text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">{selectedOrder.customer}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="font-bold text-gray-500">픽업 예정 시간</span>
                <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">{selectedOrder.time}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
               <button onClick={() => { alert('픽업 완료 처리되었습니다.'); setSelectedOrder(null); setReservations(prev => prev.filter(r => r.id !== selectedOrder.id)); }} className="w-full bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform shadow-sm">
                 픽업 완료 처리하기
               </button>
               <button onClick={() => setSelectedOrder(null)} className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl active:scale-95 transition-transform shadow-sm">
                 목록로 돌아가기
               </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-gray-50">
        <header className="bg-white p-4 border-b border-gray-100 sticky top-0 z-10 flex justify-center shadow-sm">
          <h1 className="text-lg font-bold text-gray-900">새로 들어온 주문</h1>
        </header>

        <div className="p-4 flex flex-col gap-3">
          {reservations.length > 0 ? (
            reservations.map(r => (
              <div key={r.id} onClick={() => setSelectedOrder(r)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:border-[#FFE400] hover:shadow-md transition-all relative overflow-hidden group">
                <div className="w-16 h-16 bg-[#FFFBE6] rounded-xl shrink-0 overflow-hidden border border-yellow-100 transition-transform group-hover:scale-105">
                  <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-center gap-1">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-[16px] line-clamp-1 leading-snug text-gray-900 pr-2">
                       {r.name} <span className="text-blue-600 ml-0.5">x{r.quantity}</span>
                    </div>
                    <div className="text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0 bg-[#FFE400] text-black shadow-sm tracking-tight">
                      대기중
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-700 flex items-center justify-between">
                    <span className="flex items-center gap-1"><span className="text-lg leading-none">😎</span> {r.customer}</span>
                    <span className="text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md text-xs">{r.time}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                <span className="text-4xl mb-2 grayscale opacity-50">🛍️</span>
                <span className="font-bold">아직 들어온 주문이 없어요!</span>
                <span className="text-xs">특가 상품을 등록해 주문을 받아보세요.</span>
             </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="bg-white p-4 border-b border-gray-100 sticky top-0 z-10 flex justify-center shadow-sm">
        <h1 className="text-lg font-bold">픽업 대기</h1>
      </header>

      <div className="p-4 flex flex-col gap-4">
        {reservations.length > 0 ? (
          reservations.map(r => (
            <ReservationCard 
              key={r.id}
              status="대기" 
              name={r.name} 
              shop={r.shop} 
              time={r.time} 
              id={r.id} 
              imageUrl={r.imageUrl} 
              onCancel={() => handleCancel(r.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl mb-2">텅</span>
            <span className="font-bold">당연함, 이미 다 구출함!</span>
            <span className="text-xs">대기 중인 픽업 예약이 없습니다.</span>
          </div>
        )}
      </div>
    </div>
  )
}
