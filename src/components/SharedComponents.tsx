import { useState, useEffect } from 'react';
import type { Page } from '../types';

// ==========================================
// 알림 서비스 (useNotifications + NotificationDrawer)
// ==========================================

const NOTIFY_BASE = 'http://localhost:8003/api/v1/notifications';

export type ApiNotif = {
  id: number;
  event_type: string;
  order_id: number | null;
  order_number: string | null;
  store_name: string | null;
  product_names: string | null;
  pickup_expected_at: string | null;
  is_read: boolean;
  created_at: string;
};

type NotifType = 'urgent' | 'warning' | 'normal' | 'info';

const EVENT_META: Record<string, { type: NotifType; icon: string; message: string }> = {
  order_confirmed:      { type: 'info',    icon: '✅', message: '예약이 확정되었어요' },
  new_order:            { type: 'info',    icon: '📦', message: '새 주문이 들어왔어요' },
  pickup_completed:     { type: 'normal',  icon: '🎉', message: '픽업이 완료되었어요' },
  order_cancelled:      { type: 'warning', icon: '❌', message: '주문이 취소되었어요' },
  order_cancelled_self: { type: 'warning', icon: '↩️', message: '주문을 취소했어요' },
  pickup_reminder:      { type: 'urgent',  icon: '🔥', message: '픽업까지 15분 남았어요!' },
};

const NOTIF_STYLES: Record<NotifType, { bg: string; badge: string }> = {
  urgent:  { bg: 'bg-red-50 border-red-100',       badge: 'bg-red-500 text-white' },
  warning: { bg: 'bg-[#FFF8E1] border-yellow-100', badge: 'bg-[#FFE400] text-black' },
  normal:  { bg: 'bg-gray-50 border-gray-100',     badge: 'bg-gray-200 text-gray-600' },
  info:    { bg: 'bg-blue-50 border-blue-100',     badge: 'bg-blue-500 text-white' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return '방금 전';
  if (min < 60) return `${min}분 전`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export function useNotifications(userId: number | null, interval = 30_000) {
  const [notifications, setNotifications] = useState<ApiNotif[]>([]);

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${NOTIFY_BASE}/?user_id=${userId}`);
      if (res.ok) setNotifications(await res.json());
    } catch {}
  };

  const markRead = async (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    try { await fetch(`${NOTIFY_BASE}/${id}/read`, { method: 'PATCH' }); } catch {}
  };

  const markAllRead = async () => {
    if (!userId) return;
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    try { await fetch(`${NOTIFY_BASE}/read-all?user_id=${userId}`, { method: 'PATCH' }); } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, interval);
    return () => clearInterval(id);
  }, [userId, interval]);

  return { notifications, unreadCount: notifications.filter(n => !n.is_read).length, markRead, markAllRead };
}

export function NotificationDrawer({
  userId, isOpen, onClose,
}: {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(userId);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="absolute bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh]"
        style={{ animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)' }}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-[18px] text-gray-900">알림</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[13px] font-semibold text-gray-400 hover:text-gray-700 transition-colors">
                모두 읽음
              </button>
            )}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5 pb-8">
          {notifications.map(notif => {
            const meta = EVENT_META[notif.event_type] ?? { type: 'normal' as NotifType, icon: '🔔', message: notif.event_type };
            const style = NOTIF_STYLES[meta.type];
            return (
              <button
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`w-full text-left border rounded-2xl px-4 py-3.5 flex gap-3 items-start transition-all hover:opacity-90 active:scale-[0.98] ${style.bg} ${notif.is_read ? 'opacity-60' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${style.badge}`}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5 gap-2">
                    <span className="font-extrabold text-[14px] text-gray-900 leading-snug">{meta.message}</span>
                    {!notif.is_read && <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-1" />}
                  </div>
                  <p className="text-[12px] text-gray-600 font-semibold truncate">
                    {notif.store_name}{notif.product_names ? ` · ${notif.product_names}` : ''}
                  </p>
                  {notif.pickup_expected_at && (
                    <p className="text-[11px] text-gray-400 mt-0.5">픽업 예정 {notif.pickup_expected_at}</p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(notif.created_at)}</p>
                </div>
              </button>
            );
          })}
          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
              <span className="text-5xl">🔔</span>
              <p className="font-bold">아직 알림이 없어요</p>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}

// ==========================================
// 판매자 처리중 주문 수 polling hook
// ==========================================
export function usePendingOrderCount(storeId: number | null) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!storeId) return;
    const fetch_ = () =>
      fetch(`http://localhost:8002/api/v1/orders/?status=pending&store_id=${storeId}`)
        .then(r => r.ok ? r.json() : [])
        .then((orders: unknown[]) => setCount(orders.length))
        .catch(() => {});
    fetch_();
    const id = setInterval(fetch_, 5_000);
    return () => clearInterval(id);
  }, [storeId]);

  return count;
}

// ==========================================
// 하단 탭 바 컴포넌트
// ==========================================
export function BottomTabBar({ currentPage, onNavigate, userRole, isPcVersion, pendingOrderCount }: { currentPage: Page, onNavigate: (page: Page) => void, userRole: 'USER' | 'SELLER', isPcVersion?: boolean, pendingOrderCount?: number }) {
  return (
    <nav className={`absolute bottom-0 w-full ${isPcVersion ? 'max-w-[1200px]' : 'max-w-[390px]'} bg-white border-t border-gray-100 flex items-center justify-around h-16 px-2 drop-shadow-[0_-4px_10px_rgba(0,0,0,0.05)] transition-all duration-300`}>
      <TabButton icon="🏠" label="홈" isActive={currentPage === 'home' || currentPage === 'seller_home'} onClick={() => onNavigate(userRole === 'SELLER' ? 'seller_home' : 'home')} />
      {userRole === 'SELLER' ? (
        <TabButton icon="🛍️" label="판매" isActive={currentPage === 'sales'} onClick={() => onNavigate('sales')} />
      ) : (
        <TabButton icon="🗺️" label="근처 지도" isActive={currentPage === 'map'} onClick={() => onNavigate('map')} />
      )}

      {/* 중앙 플로팅 버튼 (판매자: 등록, 일반: 찜) */}
      {userRole === 'SELLER' ? (
        <div className="relative -top-5 flex flex-col items-center justify-center">
          <button onClick={() => onNavigate('register')} className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-white ${currentPage === 'register' ? 'bg-black text-[#FFE400]' : 'bg-[#FFE400] text-black'}`}>
            ➕
          </button>
          <span className={`text-[10px] font-bold mt-1 ${currentPage === 'register' ? 'text-black' : 'text-gray-500'}`}>등록</span>
        </div>
      ) : (
        <TabButton icon="❤️" label="찜" isActive={currentPage === 'wishlist'} onClick={() => onNavigate('wishlist')} />
      )}

      <TabButton icon="🧾" label="예약" isActive={currentPage === 'reservations' || currentPage === 'complete'} onClick={() => onNavigate('reservations')} badge={userRole === 'SELLER' ? pendingOrderCount : undefined} />
      <TabButton icon="👤" label="마이" isActive={currentPage === 'my' || currentPage === 'customer_center'} onClick={() => onNavigate('my')} />
    </nav>
  )
}

// 탭 버튼 단위 컴포넌트
export function TabButton({ icon, label, isActive, onClick, badge }: { icon: string, label: string, isActive: boolean, onClick: () => void, badge?: number }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 w-16 h-full ${isActive ? 'text-black' : 'text-gray-400'}`}>
      <div className="relative">
        <span className={`text-xl ${isActive ? 'opacity-100' : 'opacity-60 grayscale'}`}>{icon}</span>
        {badge != null && badge > 0 && (
          <div className="absolute -top-1 -right-2 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center border border-white">
            <span className="text-[9px] font-black text-white leading-none px-0.5">{badge > 99 ? '99+' : badge}</span>
          </div>
        )}
      </div>
      <span className={`text-[10px] font-bold ${isActive ? 'text-black' : 'text-gray-500'}`}>{label}</span>
    </button>
  )
}

// ==========================================
// 예약 아이템 카드 컴포넌트
// ==========================================
export function ReservationCard({status, name, shop, time, id, imageUrl, onCancel, onReview}: any) {
  const statusConfig = {
    '대기':  { label: '픽업 대기중', cls: 'bg-[#FFE400] text-black' },
    '완료':  { label: '픽업 완료',   cls: 'bg-green-100 text-green-700' },
    '취소':  { label: '취소됨',      cls: 'bg-gray-200 text-gray-500' },
  } as Record<string, { label: string; cls: string }>;
  const cfg = statusConfig[status] ?? statusConfig['완료'];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
      <div className="w-20 h-20 bg-[#FFFBE6] rounded-xl shrink-0 overflow-hidden border border-yellow-100">
        {imageUrl && <img src={imageUrl} alt={name} className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <div className={`font-bold line-clamp-1 ${status === '취소' ? 'text-gray-400 line-through' : ''}`}>{name}</div>
          <div className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${cfg.cls}`}>
            {cfg.label}
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-1">{shop}</div>
        <div className="text-sm font-bold text-blue-600 mb-2">{time}</div>
        <div className="text-gray-400 font-normal ml-1">주문 번호: {id}</div>
        <div className="mt-auto">
          {status === '대기' && onCancel && (
            <button onClick={onCancel} className="w-full py-1.5 border border-red-200 text-red-500 font-bold rounded-lg text-xs hover:bg-red-50 transition-colors">예약 취소</button>
          )}
          {status === '완료' && onReview && (
            <button onClick={onReview} className="w-full py-1.5 border border-gray-200 font-bold rounded-lg text-xs hover:bg-gray-50 transition-colors">리뷰 쓰기</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 마이페이지 메뉴 리스트 컴포넌트
// ==========================================
export function MenuList({ title, items }: { title: string, items: Array<{label: string, icon: string, value?: string, textClass?: string, onClick?: () => void}> }) {
  return (
    <div className="flex flex-col">
      <h2 className="px-5 py-3 font-bold text-gray-500 text-xs">{title}</h2>
      <ul className="flex flex-col">
        {items.map((item, i) => (
          <li key={i} onClick={item.onClick} className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors border-t border-gray-50 first:border-t-0">
            <div className="flex flex-row items-center justify-start gap-4">
              <span className="text-xl w-6 flex justify-center items-center">{item.icon}</span>
              <span className={`font-semibold ${item.textClass || 'text-gray-800'}`}>{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.value && <span className="text-xs font-bold text-[#FFE400] bg-black px-2 py-0.5 rounded-full">{item.value}</span>}
              {!item.value && <span className="text-gray-300 font-bold">❯</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ==========================================
// PC 환경 글로벌 네비게이션(GNB) 컴포넌트
// ==========================================
export function PcGnb({ currentPage, onNavigate, userRole, onSetPcVersion }: { currentPage: Page, onNavigate: (page: Page) => void, userRole: 'USER' | 'SELLER', onSetPcVersion: (v: boolean) => void }) {
  return (
    <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm h-16">
      <div className="max-w-[1200px] w-full mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(userRole === 'SELLER' ? 'seller_home' : 'home')}>
           <span className="text-2xl">🛍️</span>
           <span className="font-black text-2xl text-gray-900 tracking-tight">살리장</span>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="flex gap-8 items-center h-full font-bold text-gray-700">
          <button onClick={() => onNavigate(userRole === 'SELLER' ? 'seller_home' : 'home')} className={`h-full border-b-4 ${currentPage === 'home' || currentPage === 'seller_home' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>홈</button>
          
          {userRole === 'SELLER' ? (
            <>
              <button onClick={() => onNavigate('sales')} className={`h-full border-b-4 ${currentPage === 'sales' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>판매</button>
              <button onClick={() => onNavigate('register')} className={`h-full border-b-4 ${currentPage === 'register' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>등록</button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('map')} className={`h-full border-b-4 ${currentPage === 'map' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>지도</button>
              <button onClick={() => onNavigate('wishlist')} className={`h-full border-b-4 ${currentPage === 'wishlist' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>찜</button>
            </>
          )}

          <button onClick={() => onNavigate('reservations')} className={`h-full border-b-4 ${currentPage === 'reservations' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>예약</button>
          <button onClick={() => onNavigate('my')} className={`h-full border-b-4 ${currentPage === 'my' || currentPage === 'customer_center' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>마이</button>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-4">
           {currentPage !== 'login' && userRole !== 'SELLER' && (
             <button onClick={() => onNavigate('cart')} className="relative p-2 text-xl hover:scale-110 transition-transform">
               <span>🛒</span>
               <div className="absolute top-1 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
             </button>
           )}
           {currentPage !== 'login' && (
             <button onClick={() => onSetPcVersion(false)} className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
               📱 모바일 전환
             </button>
           )}
           <div className="font-bold text-sm text-gray-800 cursor-pointer hover:text-black transition-colors" onClick={() => onNavigate('my')}>
             {userRole === 'SELLER' ? '👨‍🍳 김살리 사장님' : '😎 마포구 식객님'}
           </div>
        </div>
      </div>
    </header>
  );
}
