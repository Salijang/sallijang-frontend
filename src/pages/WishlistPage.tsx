import { useState, useEffect } from 'react';

interface WishlistItem {
  id: number;
  store_id: number;
}

interface StoreDetail {
  id: number;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  avg_rating: number;
}

type EnrichedItem = WishlistItem & { store?: StoreDetail };

type TargetStore = { lat: number; lng: number; storeId: number };

export function WishlistPage({
  userId,
  onNavigateToMap,
  onBack,
}: {
  userId?: number | null;
  onNavigateToMap: (target: TargetStore) => void;
  onBack: () => void;
}) {
  const [items, setItems] = useState<EnrichedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setIsLoading(false); return; }

    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/service/user/api/v1/wishlists/?user_id=${userId}`);
        const wishlistData: WishlistItem[] = await res.json();

        const enriched = await Promise.all(
          wishlistData.map(async (item) => {
            try {
              const storeRes = await fetch(`/service/product/api/v1/stores/${item.store_id}`);
              const store: StoreDetail = await storeRes.json();
              return { ...item, store };
            } catch {
              return { ...item };
            }
          })
        );
        setItems(enriched);
      } catch (err) {
        console.error('Failed to fetch wishlists:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [userId]);

  const handleRemove = async (e: React.MouseEvent, wishlistId: number) => {
    e.stopPropagation();
    const res = await fetch(`/service/user/api/v1/wishlists/${wishlistId}`, { method: 'DELETE' });
    if (res.ok) {
      setItems(prev => prev.filter(i => i.id !== wishlistId));
    }
  };

  const handleStoreClick = (item: EnrichedItem) => {
    if (item.store?.latitude && item.store?.longitude) {
      onNavigateToMap({ lat: item.store.latitude, lng: item.store.longitude, storeId: item.store_id });
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-full">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0 shadow-sm">
        <button onClick={onBack} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
        <h1 className="font-bold text-lg text-center flex-1 pr-8">찜한 가게</h1>
      </header>
      <div className="flex-1 p-4 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl animate-spin">⏳</span>
            <span className="font-bold">불러오는 중...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl mb-2">💔</span>
            <span className="font-bold">찜한 가게가 없어요</span>
            <span className="text-xs">상품 상세 페이지에서 가게를 찜해보세요!</span>
          </div>
        ) : items.map(item => (
          <div
            key={item.id}
            onClick={() => handleStoreClick(item)}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-[#FFE400] transition-colors active:scale-[0.99]"
          >
            <div className="w-14 h-14 bg-[#FFFBE6] rounded-full flex items-center justify-center text-3xl border border-yellow-100 shrink-0">🏪</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-base truncate">{item.store?.name ?? `가게 #${item.store_id}`}</div>
              {item.store?.address && (
                <div className="text-gray-500 text-xs mt-0.5 truncate">{item.store.address}</div>
              )}
              {item.store?.avg_rating ? (
                <div className="text-yellow-500 text-xs font-bold mt-0.5">★ {item.store.avg_rating.toFixed(1)}</div>
              ) : null}
              {item.store?.latitude && (
                <div className="text-blue-500 text-xs font-bold mt-1">지도에서 보기 →</div>
              )}
            </div>
            <button
              onClick={(e) => handleRemove(e, item.id)}
              className="text-red-500 text-2xl font-bold p-2 active:scale-95 transition-transform drop-shadow-sm shrink-0"
            >
              ❤️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
