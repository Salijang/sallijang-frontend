import { useEffect, useRef, useState } from 'react';
import type { Product } from '../types';

declare global {
  interface Window {
    kakao: any;
    __salijangNavigate: (page: string, id?: number) => void;
  }
}

type ProductWithCoords = Product & { latitude?: number; longitude?: number };

type StoreGroup = {
  storeId: number;
  shopName: string;
  latitude: number;
  longitude: number;
  distance: string;
  products: ProductWithCoords[];
};

type TargetStore = { lat: number; lng: number; storeId: number };

function groupByStore(products: ProductWithCoords[]): StoreGroup[] {
  const storeMap = new Map<number, StoreGroup>();
  for (const p of products) {
    if (!p.latitude || !p.longitude || !p.storeId) continue;
    if (!storeMap.has(p.storeId)) {
      storeMap.set(p.storeId, {
        storeId: p.storeId,
        shopName: p.shopName,
        latitude: p.latitude,
        longitude: p.longitude,
        distance: p.distance,
        products: [],
      });
    }
    storeMap.get(p.storeId)!.products.push(p);
  }
  return Array.from(storeMap.values());
}

export function MapPage({
  onNavigate,
  targetStore,
}: {
  onNavigate: (page: string, id?: number) => void;
  targetStore?: TargetStore | null;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    window.__salijangNavigate = onNavigate;
  }, [onNavigate]);

  useEffect(() => {
    const buildMap = (userLat: number, userLng: number, products: ProductWithCoords[]) => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const centerLat = targetStore?.lat ?? userLat;
        const centerLng = targetStore?.lng ?? userLng;
        const center = new window.kakao.maps.LatLng(centerLat, centerLng);
        const map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: targetStore ? 3 : 4,
        });

        // 내 위치 (파란 점)
        new window.kakao.maps.CustomOverlay({
          map,
          position: new window.kakao.maps.LatLng(userLat, userLng),
          content: `<div style="width:18px;height:18px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
          xAnchor: 0.5,
          yAnchor: 0.5,
          zIndex: 10,
        });

        const storeGroups = groupByStore(products);
        const allInfoWindows: any[] = [];
        const storeMarkerMap = new Map<number, { marker: any; infoWindow: any }>();

        storeGroups.forEach((store) => {
          const pos = new window.kakao.maps.LatLng(store.latitude, store.longitude);
          const marker = new window.kakao.maps.Marker({ position: pos, map });

          const productListHtml = store.products.map(p => {
            const rate = Math.round((p.originalPrice - p.discountPrice) / p.originalPrice * 100);
            return `<div onclick="window.__salijangNavigate('detail',${p.id})"
              style="border:1px solid #f0f0f0;border-radius:10px;padding:8px 10px;cursor:pointer;margin-bottom:6px;background:#fafafa;">
              <div style="font-weight:700;font-size:13px;color:#222;margin-bottom:3px;">${p.name}${p.weight ? ` (${p.weight})` : ''}</div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="font-size:11px;color:#aaa;text-decoration:line-through;">${p.originalPrice.toLocaleString()}원</span>
                <span style="font-size:11px;color:#FF4500;font-weight:700;">-${rate}%</span>
                <span style="font-size:14px;font-weight:800;color:#111;">${p.discountPrice.toLocaleString()}원</span>
              </div>
              <div style="font-size:11px;color:#888;margin-top:2px;">잔여 ${p.remaining}개 · 상세보기 →</div>
            </div>`;
          }).join('');

          const infoWindow = new window.kakao.maps.InfoWindow({
            content: `<div style="font-family:sans-serif;padding:12px;min-width:200px;max-width:260px;box-sizing:border-box;">
              <div style="font-weight:800;font-size:15px;color:#FF6B00;margin-bottom:4px;border-bottom:1px solid #f0f0f0;padding-bottom:6px;">🏪 ${store.shopName}</div>
              <div style="font-size:11px;color:#888;margin-bottom:8px;">📍 ${store.distance} · 판매 중 ${store.products.length}개</div>
              <div style="max-height:220px;overflow-y:auto;">${productListHtml}</div>
            </div>`,
            removable: true,
          });

          allInfoWindows.push(infoWindow);
          storeMarkerMap.set(store.storeId, { marker, infoWindow });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            allInfoWindows.forEach(iw => iw.close());
            infoWindow.open(map, marker);
          });
        });

        // 찜 목록에서 이동한 경우 해당 가게 핀 자동 오픈
        if (targetStore) {
          const entry = storeMarkerMap.get(targetStore.storeId);
          if (entry) {
            entry.infoWindow.open(map, entry.marker);
          }
        }
      });
    };

    const fetchAndBuild = (userLat: number, userLng: number) => {
      const fetchLat = targetStore?.lat ?? userLat;
      const fetchLng = targetStore?.lng ?? userLng;
      fetch(`http://localhost:8001/api/v1/products/?user_lat=${fetchLat}&user_lng=${fetchLng}`)
        .then(res => res.json())
        .then(data => {
          const products: ProductWithCoords[] = data.map((d: any) => ({
            id: d.id, name: d.name, originalPrice: d.original_price, discountPrice: d.discount_price,
            remaining: d.remaining, totalQuantity: d.total_quantity, expiryMinutes: d.expiry_minutes,
            category: d.category, imageUrl: d.image_url || '', weight: d.weight, description: d.description,
            shopName: d.shop_name || '알 수 없는 가게', distance: d.distance || '거리 알 수 없음',
            storeId: d.store_id, latitude: d.latitude, longitude: d.longitude,
          }));
          buildMap(userLat, userLng, products);
        })
        .catch(console.error);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => { setIsLocating(false); fetchAndBuild(pos.coords.latitude, pos.coords.longitude); },
        () => {
          setIsLocating(false);
          const fallbackLat = targetStore?.lat ?? 37.556;
          const fallbackLng = targetStore?.lng ?? 126.903;
          fetchAndBuild(fallbackLat, fallbackLng);
        }
      );
    } else {
      setIsLocating(false);
      const fallbackLat = targetStore?.lat ?? 37.556;
      const fallbackLng = targetStore?.lng ?? 126.903;
      fetchAndBuild(fallbackLat, fallbackLng);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '600px' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'white', padding: '14px 16px', borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontWeight: 800, fontSize: '17px' }}>📍 근처 지도</span>
        {isLocating && <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>위치 확인 중...</span>}
      </div>
      <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '600px' }} />
    </div>
  );
}
