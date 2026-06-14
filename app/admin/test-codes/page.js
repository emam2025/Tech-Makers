'use client';

import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';

const TRACKS = { a: 'مسار A', b: 'مسار B', c: 'مسار C', technomath: 'Techno Math', techenglish: 'Tech English' };

const EXPIRY_OPTIONS = [
  { value: '', label: 'بلا حد' },
  { value: '1', label: 'يوم واحد' },
  { value: '3', label: '3 أيام' },
  { value: '7', label: 'أسبوع' },
  { value: '14', label: 'أسبوعان' },
  { value: '30', label: 'شهر' },
];

export default function AdminTestCodesPage() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [genTrack, setGenTrack] = useState('');
  const [genExpiry, setGenExpiry] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [qrModal, setQrModal] = useState(null);
  const [qrImages, setQrImages] = useState({});
  const qrCanvasRef = useRef(null);

  async function fetchCodes() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/test-codes');
      if (res.ok) {
        const data = await res.json();
        setCodes(data.codes || []);
      }
    } catch (err) {
      console.error('Fetch codes error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      const authRes = await fetch('/api/admin/auth');
      if (authRes.ok) {
        const authData = await authRes.json();
        setUser(authData.user);
      }
      fetchCodes();
    }
    init();
  }, []);

  useEffect(() => {
    codes.forEach(async (c) => {
      if (!qrImages[c.code]) {
        try {
          const url = `${window.location.origin}/english-test?code=${c.code}`;
          const dataUrl = await QRCode.toDataURL(url, {
            width: 256,
            margin: 2,
            color: { dark: '#1a3fa0', light: '#ffffff' },
          });
          setQrImages(prev => ({ ...prev, [c.code]: dataUrl }));
        } catch {}
      }
    });
  }, [codes]);

  async function handleGenerate() {
    if (!studentName.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/test-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: studentName.trim(),
          track: genTrack || undefined,
          expires_days: genExpiry ? Number(genExpiry) : undefined,
        }),
      });

      if (res.ok) {
        setStudentName('');
        fetchCodes();
      }
    } catch (err) {
      console.error('Generate code error:', err);
    } finally {
      setGenerating(false);
    }
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(code);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  function copyLink(code) {
    const url = `${window.location.origin}/english-test?code=${code}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(`link-${code}`);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function isExpired(expires_at) {
    if (!expires_at) return false;
    return new Date(expires_at) < new Date();
  }

  const unusedCount = codes.filter(c => !c.used && !isExpired(c.expires_at)).length;
  const usedCount = codes.filter(c => c.used).length;
  const expiredCount = codes.filter(c => !c.used && isExpired(c.expires_at)).length;

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-1">أكواد اختبار التحديد</h1>
        <p className="text-on-surface-variant font-body-md text-sm">إنشاء أكواد للطلاب مع QR code للدخول للاختبار</p>
      </div>

      {/* Generate form - admin only */}
      {user?.role === 'admin' && (
        <div className="bg-white rounded-24 p-4 md:p-6 border border-outline-variant/20">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">add_circle</span>
            إنشاء كود جديد لطالب
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-bold text-on-surface-variant mb-1">اسم الطالب *</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="أدخل اسم الطالب"
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">المسار (اختياري)</label>
              <select
                value={genTrack}
                onChange={(e) => setGenTrack(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
              >
                <option value="">كل المسارات</option>
                {Object.entries(TRACKS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">مدة الصلاحية</label>
              <select
                value={genExpiry}
                onChange={(e) => setGenExpiry(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
              >
                {EXPIRY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating || !studentName.trim()}
              className="btn-primary flex items-center justify-center gap-2 text-sm h-[42px] disabled:opacity-60"
            >
              {generating ? (
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-lg">add</span>
              )}
              {generating ? 'جاري الإنشاء...' : 'إنشاء كود'}
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-24 p-4 border border-outline-variant/20 text-center">
          <div className="text-2xl font-bold text-on-surface">{codes.length}</div>
          <div className="text-xs text-on-surface-variant">إجمالي الأكواد</div>
        </div>
        <div className="bg-white rounded-24 p-4 border border-outline-variant/20 text-center">
          <div className="text-2xl font-bold text-success">{unusedCount}</div>
          <div className="text-xs text-on-surface-variant">أكواد متاحة</div>
        </div>
        <div className="bg-white rounded-24 p-4 border border-outline-variant/20 text-center">
          <div className="text-2xl font-bold text-on-surface-variant">{usedCount + expiredCount}</div>
          <div className="text-xs text-on-surface-variant">مستخدمة / منتهية</div>
        </div>
      </div>

      {/* Codes list */}
      <div className="bg-white rounded-24 border border-outline-variant/20 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
          </div>
        ) : codes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3">vpn_key</span>
            <p className="font-body-md">لا توجد أكواد بعد</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {codes.map((c) => (
              <div key={c.id} className="p-4 hover:bg-surface-container-lowest transition-colors">
                <div className="flex items-start gap-4">
                  {/* QR Code thumbnail */}
                  <div className="hidden sm:block flex-shrink-0">
                    {qrImages[c.code] ? (
                      <img
                        src={qrImages[c.code]}
                        alt={`QR ${c.code}`}
                        className="w-16 h-16 rounded-lg border border-outline-variant/20 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setQrModal(c)}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 animate-pulse" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-on-surface text-base tracking-wider" dir="ltr">{c.code}</span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.used ? 'bg-surface-container-high text-on-surface-variant' :
                        isExpired(c.expires_at) ? 'bg-red-50 text-red-600' :
                        'bg-success/10 text-success'
                      }`}>
                        {c.used ? 'مستخدم' : isExpired(c.expires_at) ? 'منتهي' : 'متاح'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">person</span>
                        {c.student_name || '—'}
                      </span>
                      {c.track && (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{TRACKS[c.track] || c.track}</span>
                      )}
                      <span className="hidden md:inline">{formatDate(c.created_at)}</span>
                      {c.expires_at && (
                        <span className={`hidden md:inline ${isExpired(c.expires_at) ? 'text-red-500' : ''}`}>
                          الصلاحية: {formatDate(c.expires_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => copyCode(c.code)}
                      className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                      title="نسخ الكود"
                    >
                      <span className="material-symbols-outlined text-primary text-lg">
                        {copiedId === c.code ? 'check' : 'content_copy'}
                      </span>
                    </button>
                    <button
                      onClick={() => copyLink(c.code)}
                      className="p-2 hover:bg-secondary/10 rounded-lg transition-colors"
                      title="نسخ رابط الاختبار"
                    >
                      <span className="material-symbols-outlined text-secondary text-lg">
                        {copiedId === `link-${c.code}` ? 'check' : 'link'}
                      </span>
                    </button>
                    <button
                      onClick={() => setQrModal(c)}
                      className="p-2 hover:bg-tertiary/10 rounded-lg transition-colors"
                      title="عرض QR Code"
                    >
                      <span className="material-symbols-outlined text-tertiary text-lg">qr_code_2</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setQrModal(null)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">QR Code</h3>
              <button onClick={() => setQrModal(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-on-surface font-bold text-lg mb-1">{qrModal.student_name || 'طالب'}</p>
              <p className="text-on-surface-variant text-sm font-mono" dir="ltr">{qrModal.code}</p>
              {qrModal.track && (
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{TRACKS[qrModal.track]}</span>
              )}
            </div>

            <div className="flex justify-center mb-6">
              {qrImages[qrModal.code] ? (
                <img src={qrImages[qrModal.code]} alt="QR Code" className="w-56 h-56" />
              ) : (
                <div className="w-56 h-56 bg-gray-100 animate-pulse rounded-2xl" />
              )}
            </div>

            <div className="text-center text-xs text-on-surface-variant mb-4">
              <p>امسح الكود للدخول مباشرة للاختبار</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const url = `${window.location.origin}/english-test?code=${qrModal.code}`;
                  const link = document.createElement('a');
                  link.href = qrImages[qrModal.code];
                  link.download = `QR-${qrModal.code}.png`;
                  link.click();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                تحميل الصورة
              </button>
              <button
                onClick={() => copyLink(qrModal.code)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary/10 text-secondary font-bold text-sm hover:bg-secondary/20 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">link</span>
                {copiedId === `link-${qrModal.code}` ? 'تم النسخ!' : 'نسخ الرابط'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
