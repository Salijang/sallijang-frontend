import { useState, useEffect, useCallback } from 'react';
import type { Page } from '../types';
import { authFetch } from '../utils/authFetch';

export function NotificationSettingsPage({ onNavigate, userRole, userId }: {
  onNavigate: (page: Page) => void;
  userRole?: 'USER' | 'SELLER';
  userId?: number | null;
}) {
  const isSeller = userRole === 'SELLER';

  const [slackEnabled, setSlackEnabled] = useState(true);
  const [orderEnabled, setOrderEnabled] = useState(true);
  const [reviewEnabled, setReviewEnabled] = useState(true);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('');
  const [webhookSaved, setWebhookSaved] = useState(false);

  useEffect(() => {
    if (!userId) return;
    authFetch(`https://api.sallijang.shop/api/v1/notifications/settings/${userId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setOrderEnabled(data.new_order);
          setReviewEnabled(data.review);
          setSlackEnabled(data.slack_enabled);
          setSlackWebhookUrl(data.slack_webhook_url || '');
        }
      })
      .catch(console.error);
  }, [isSeller, userId]);

  const saveSetting = useCallback((key: 'new_order' | 'review' | 'slack_enabled', value: boolean) => {
    if (!userId) return;
    const revert = () => {
      if (key === 'slack_enabled') setSlackEnabled(!value);
      if (key === 'new_order') setOrderEnabled(!value);
      if (key === 'review') setReviewEnabled(!value);
    };
    authFetch(`https://api.sallijang.shop/api/v1/notifications/settings/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value }),
    })
      .then(r => { if (!r.ok) revert(); })
      .catch(() => revert());
  }, [userId]);

  const saveWebhookUrl = useCallback(() => {
    if (!userId) return;
    authFetch(`https://api.sallijang.shop/api/v1/notifications/settings/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slack_webhook_url: slackWebhookUrl }),
    })
      .then(r => { if (r.ok) { setWebhookSaved(true); setTimeout(() => setWebhookSaved(false), 2000); } })
      .catch(console.error);
  }, [isSeller, userId, slackWebhookUrl]);

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${enabled ? 'bg-[#FFE400]' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="flex flex-col bg-white min-h-full">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0">
        <button onClick={() => onNavigate('my')} className="p-1 mr-2 text-xl">←</button>
        <h1 className="font-bold text-lg text-center flex-1 pr-8">{isSeller ? '가게 알림 설정' : '알림 설정'}</h1>
      </header>

      <div className="flex-1 p-5 space-y-8">
        <section>
          <h2 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">채널 연동 알림</h2>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-bold text-sm">슬랙(Slack) 알림</div>
              <p className="text-xs text-gray-500 mt-1">{isSeller ? '신규 주문 알림을 슬랙으로 받아보세요.' : '주문 및 공지사항을 슬랙으로 받아보세요.'}</p>
            </div>
            <Toggle enabled={slackEnabled} onToggle={() => {
              const next = !slackEnabled;
              setSlackEnabled(next);
              saveSetting('slack_enabled', next);
            }} />
          </div>
          {slackEnabled && (
            <div className="mt-2 flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-600">Slack Incoming Webhook URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={slackWebhookUrl}
                  onChange={e => setSlackWebhookUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#FFE400] focus:ring-2 focus:ring-yellow-100 transition-all"
                />
                <button
                  onClick={saveWebhookUrl}
                  className="shrink-0 px-4 py-2 bg-[#FFE400] text-black font-extrabold rounded-xl text-xs hover:bg-yellow-400 active:scale-95 transition-transform"
                >
                  {webhookSaved ? '저장됨 ✓' : '저장'}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 px-1">Slack 앱 설정에서 Incoming Webhook을 생성한 후 URL을 붙여넣으세요.</p>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">서비스 알림</h2>
          <div className="space-y-6">
            {isSeller ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">신규 주문 알림</div>
                    <p className="text-xs text-gray-500 mt-1">새로운 주문이 접수되면 즉시 알려드립니다.</p>
                  </div>
                  <Toggle enabled={orderEnabled} onToggle={() => {
                    const next = !orderEnabled;
                    setOrderEnabled(next);
                    saveSetting('new_order', next);
                  }} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">리뷰 등록 알림</div>
                    <p className="text-xs text-gray-500 mt-1">고객님이 소중한 리뷰를 남기면 알려드립니다.</p>
                  </div>
                  <Toggle enabled={reviewEnabled} onToggle={() => {
                    const next = !reviewEnabled;
                    setReviewEnabled(next);
                    saveSetting('review', next);
                  }} />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">주문 및 쇼핑 알림</div>
                    <p className="text-xs text-gray-500 mt-1">픽업 완료, 픽업 리마인더, 주문 취소 알림을 받습니다.</p>
                  </div>
                  <Toggle enabled={orderEnabled} onToggle={() => {
                    const next = !orderEnabled;
                    setOrderEnabled(next);
                    saveSetting('new_order', next);
                  }} />
                </div>
              </>
            )}
          </div>
        </section>

        {isSeller && (
          <div className="pt-10 border-t border-gray-50 text-center">
            <p className="text-[10px] text-gray-400">신규 주문 알림은 가게 운영 시간에만 발송됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
