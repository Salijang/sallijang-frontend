import { useState, useEffect } from 'react';
import type { Page } from '../types';

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface SaleOrder {
  id: number;
  order_number: string;
  buyer_id: number;
  total_price: number;
  pickup_expected_at: string | null;
  created_at: string;
  items: OrderItem[];
  buyer_name?: string;
}

export function SalesHistoryPage({ onNavigate, storeId }: {
  onNavigate: (page: Page) => void;
  storeId?: number | null;
}) {
  const [orders, setOrders] = useState<SaleOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!storeId) { setIsLoading(false); return; }

    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/service/order/api/v1/orders/?store_id=${storeId}&status=completed`);
        if (!res.ok) { setIsLoading(false); return; }
        const data: SaleOrder[] = await res.json();

        const uniqueBuyerIds = [...new Set(data.map(o => o.buyer_id))];
        const nameMap = new Map<number, string>();
        await Promise.all(
          uniqueBuyerIds.map(uid =>
            fetch(`/service/user/api/v1/users/${uid}`)
              .then(r => r.ok ? r.json() : null)
              .then(u => { if (u) nameMap.set(uid, u.full_name); })
              .catch(() => {})
          )
        );

        setOrders(data.map(o => ({ ...o, buyer_name: nameMap.get(o.buyer_id) ?? `#${o.buyer_id}` })));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [storeId]);

  const formatPickupTime = (order: SaleOrder) => {
    if (order.pickup_expected_at) return order.pickup_expected_at;
    const d = new Date(order.created_at);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-full">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shadow-sm shrink-0">
        <button onClick={() => onNavigate('my')} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
        <span className="font-bold text-lg flex-1 text-center pr-8">판매 내역</span>
      </header>

      <div className="p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl animate-spin">⏳</span>
            <span className="font-bold">판매 내역 불러오는 중...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl mb-2">📭</span>
            <span className="font-bold">완료된 판매 내역이 없어요.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-gray-400 tracking-widest">{order.order_number}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">픽업 완료</span>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500 font-bold shrink-0 mr-3">물품</span>
                    <span className="font-bold text-gray-900 text-right">
                      {order.items.map(i => `${i.product_name}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-bold">가격</span>
                    <span className="font-extrabold text-gray-900">{order.total_price.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-bold">픽업 시간</span>
                    <span className="font-bold text-gray-900">{formatPickupTime(order)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-1">
                    <span className="text-gray-500 font-bold">픽업한 손님</span>
                    <span className="font-extrabold text-gray-900">{order.buyer_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
