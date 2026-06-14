'use client';

import { useEffect, useState } from 'react';

const TRACKS = { a: 'مسار A', b: 'مسار B', c: 'مسار C', technomath: 'Techno Math', techenglish: 'Tech English' };

export default function AdminTestCodesPage() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [genCount, setGenCount] = useState(1);
  const [genTrack, setGenTrack] = useState('');
  const [genExpiry, setGenExpiry] = useState('');
  const [copiedId, setCopiedId] = useState(null);

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

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/test-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: genCount,
          track: genTrack || undefined,
          expires_days: genExpiry ? Number(genExpiry) : undefined,
        }),
      });

      if (res.ok) {
        fetchCodes();
      }
    } catch (err) {
      console.error('Generate codes error:', err);
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

  function copyAllUnused() {
    const unused = codes.filter(c => !c.used).map(c => c.code).join('\n');
    navigator.clipboard.writeText(unused);
  }

  function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const unusedCount = codes.filter(c => !c.used).length;
  const usedCount = codes.filter(c => c.used).length;

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-1">أكواد اختبار التحديد</h1>
        <p className="text-on-surface-variant font-body-md text-sm">إنشاء وإدارة الأكواد المستخدمة في اختبارات التحديد</p>
      </div>

      {/* Generate form - admin only */}
      {user?.role === 'admin' && (
        <div className="bg-white rounded-24 p-4 md:p-6 border border-outline-variant/20">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">add_circle</span>
            إنشاء أكواد جديدة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">عدد الأكواد</label>
              <input
                type="number"
                min="1"
                max="50"
                value={genCount}
                onChange={(e) => setGenCount(Number(e.target.value))}
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
              <label className="block text-xs font-bold text-on-surface-variant mb-1">مدة الصلاحية (أيام)</label>
              <input
                type="number"
                min="1"
                max="365"
                value={genExpiry}
                onChange={(e) => setGenExpiry(e.target.value)}
                placeholder="بلا حد"
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary flex items-center justify-center gap-2 text-sm h-[42px] disabled:opacity-60"
            >
              {generating ? (
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-lg">add</span>
              )}
              {generating ? 'جاري الإنشاء...' : 'إنشاء'}
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
          <div className="text-xs text-on-surface-variant">أكواد غير مستخدمة</div>
        </div>
        <div className="bg-white rounded-24 p-4 border border-outline-variant/20 text-center">
          <div className="text-2xl font-bold text-on-surface-variant">{usedCount}</div>
          <div className="text-xs text-on-surface-variant">أكواد مستخدمة</div>
        </div>
      </div>

      {/* Copy all unused */}
      {unusedCount > 0 && (
        <div className="flex justify-end">
          <button
            onClick={copyAllUnused}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success hover:bg-success/20 transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-lg">content_copy</span>
            نسخ كل الأكواد غير المستخدمة ({unusedCount})
          </button>
        </div>
      )}

      {/* Codes table */}
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs">الكود</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs hidden sm:table-cell">المسار</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs">الحالة</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs hidden md:table-cell">الطالب</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs hidden lg:table-cell">تاريخ الإنشاء</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs hidden lg:table-cell">الصلاحية</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs">نسخ</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => (
                  <tr key={c.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-on-surface text-sm tracking-wider" dir="ltr" style={{ textAlign: 'right' }}>{c.code}</td>
                    <td className="px-4 py-3 text-xs hidden sm:table-cell">
                      {c.track ? (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium text-xs">{TRACKS[c.track] || c.track}</span>
                      ) : (
                        <span className="text-on-surface-variant">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        c.used ? 'bg-surface-container-high text-on-surface-variant' : 'bg-success/10 text-success'
                      }`}>
                        {c.used ? 'مستخدم' : 'متاح'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs hidden md:table-cell max-w-[150px] truncate">{c.student_name || '—'}</td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs hidden lg:table-cell">{formatDate(c.created_at)}</td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs hidden lg:table-cell">
                      {c.expires_at ? formatDate(c.expires_at) : 'بلا حد'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => copyCode(c.code)}
                        className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors relative"
                        title="نسخ الكود"
                      >
                        <span className="material-symbols-outlined text-primary text-sm">
                          {copiedId === c.code ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
