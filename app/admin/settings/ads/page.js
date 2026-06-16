'use client';

import { useEffect, useState, useCallback } from 'react';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Drawer from '../../../../components/ui/Drawer';
import { KPICard } from '../../../../components/ui/Card';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useToast } from '../../../../components/ui/Toast';

const AD_TYPES = [
  { value: 'popup', label: 'منبثق', icon: 'picture_in_picture' },
  { value: 'banner', label: 'بانر', icon: 'web_asset' },
  { value: 'inline', label: 'داخل محتوى', icon: 'view_agenda' },
  { value: 'notification', label: 'إشعار', icon: 'notifications' },
];

const TARGETS = [
  { value: 'all', label: 'الجميع' },
  { value: 'students', label: 'الطلاب' },
  { value: 'trainers', label: 'المدربين' },
  { value: 'supervisors', label: 'المشرفين' },
  { value: 'group', label: 'مجموعة محددة' },
];

const POSITIONS = [
  { value: 'top', label: 'أعلى' },
  { value: 'bottom', label: 'أسفل' },
  { value: 'sidebar', label: 'شريط جانبي' },
  { value: 'center', label: 'وسط الصفحة' },
];

export default function AdsPage() {
  const { success, error: toastError } = useToast();
  const [ads, setAds] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterType, setFilterType] = useState('');

  const loadAds = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType) params.set('type', filterType);
      const res = await fetch(`/api/admin/ads?${params}`);
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
      }
    } finally { setLoading(false); }
  }, [filterType]);

  useEffect(() => {
    loadAds();
    fetch('/api/admin/groups').then(r => r.ok ? r.json() : {}).then(d => setGroups(d.groups || []));
  }, [loadAds]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id ? `/api/admin/ads` : '/api/admin/ads';
      const body = form.id ? form : form;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setDrawer(null);
        loadAds();
        success(form.id ? 'تم تحديث الإعلان' : 'تم إنشاء الإعلان');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(null);
      loadAds();
      success('تم حذف الإعلان');
    } else { toastError('فشل الحذف'); }
  };

  const toggleActive = async (ad) => {
    const res = await fetch('/api/admin/ads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ad.id, is_active: !ad.is_active }),
    });
    if (res.ok) { loadAds(); success(ad.is_active ? 'تم التعطيل' : 'تم التفعيل'); }
  };

  const activeCount = ads.filter(a => a.is_active).length;
  const popupCount = ads.filter(a => a.type === 'popup').length;
  const bannerCount = ads.filter(a => a.type === 'banner').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>الإعلانات</h1><p>إنشاء وإدارة إعلانات الموقع</p></div>
        <Button icon="add" onClick={() => { setForm({ type: 'popup', target: 'all', position: 'top', is_active: true, priority: 0 }); setDrawer('edit'); }}>إعلان جديد</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KPICard icon="campaign" iconColor="var(--color-danger)" iconBg="var(--color-danger-light)" value={ads.length} label="إجمالي الإعلانات" />
        <KPICard icon="check_circle" iconColor="var(--color-success)" iconBg="var(--color-success-light)" value={activeCount} label="نشط" />
        <KPICard icon="picture_in_picture" iconColor="var(--color-warning)" iconBg="var(--color-warning-light)" value={popupCount} label="منبثقة" />
        <KPICard icon="web_asset" iconColor="var(--color-primary)" iconBg="var(--color-primary-light)" value={bannerCount} label="بانرات" />
      </div>

      <div className="flex gap-3 mb-4">
        <Select options={[{ value: '', label: 'جميع الأنواع' }, ...AD_TYPES]} value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full sm:w-48" />
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <span className="material-symbols-outlined text-[var(--color-primary)] animate-spin text-[32px]">progress_activity</span>
          </div>
        ) : ads.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <span className="material-symbols-outlined text-[48px] text-[var(--color-text-tertiary)]">campaign</span>
            <p className="text-sm text-[var(--color-text-tertiary)] mt-2">لا توجد إعلانات</p>
          </div>
        ) : ads.map((ad) => {
          const typeInfo = AD_TYPES.find(t => t.value === ad.type) || AD_TYPES[0];
          return (
            <div key={ad.id} className={`card-admin overflow-hidden ${!ad.is_active ? 'opacity-60' : ''}`}>
              {ad.image_url && (
                <div className="h-32 bg-[var(--color-surface-dim)] flex items-center justify-center">
                  <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]" style={{ color: AD_TYPES.find(t => t.value === ad.type)?.color || 'inherit' }}>{typeInfo.icon}</span>
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">{ad.title}</span>
                  </div>
                  <Badge variant={ad.is_active ? 'success' : 'default'}>{ad.is_active ? 'نشط' : 'معطل'}</Badge>
                </div>
                {ad.content && <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-2">{ad.content}</p>}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge>{typeInfo.label}</Badge>
                  <Badge variant="info">{TARGETS.find(t => t.value === ad.target)?.label || ad.target}</Badge>
                  <Badge>{POSITIONS.find(p => p.value === ad.position)?.label || ad.position}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" icon="edit" onClick={() => { setForm(ad); setDrawer('edit'); }}>تعديل</Button>
                  <Button size="sm" variant="ghost" icon={ad.is_active ? 'toggle_off' : 'toggle_on'} onClick={() => toggleActive(ad)}>
                    {ad.is_active ? 'تعطيل' : 'تفعيل'}
                  </Button>
                  <Button size="sm" variant="ghost" icon="delete" className="text-[var(--color-danger)]" onClick={() => setConfirmDelete(ad)}>حذف</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Drawer */}
      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title={form.id ? 'تعديل الإعلان' : 'إعلان جديد'} size="lg"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="عنوان الإعلان" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="المحتوى" value={form.content || ''} onChange={(e) => setForm({ ...form, content: e.target.value })} multiline rows={3} />
          <Input label="رابط الصورة" value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
          <Input label="رابط الهدف (اختياري)" value={form.link_url || ''} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="https://..." />

          <div className="grid grid-cols-2 gap-3">
            <Select label="النوع" options={AD_TYPES} value={form.type || 'popup'} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            <Select label="الهدف" options={TARGETS} value={form.target || 'all'} onChange={(e) => setForm({ ...form, target: e.target.value })} />
          </div>

          {form.target === 'group' && (
            <Select label="المجموعة" options={groups.map(g => ({ value: g.id, label: g.name }))} value={form.target_group_id || ''} onChange={(e) => setForm({ ...form, target_group_id: e.target.value })} />
          )}

          <div className="grid grid-cols-2 gap-3">
            <Select label="الموضع" options={POSITIONS} value={form.position || 'top'} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            <Input label="الأولوية" type="number" value={form.priority || 0} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="تاريخ البدء" type="datetime-local" value={form.start_date ? new Date(form.start_date).toISOString().slice(0, 16) : ''} onChange={(e) => setForm({ ...form, start_date: e.target.value ? new Date(e.target.value).toISOString() : null })} />
            <Input label="تاريخ الانتهاء" type="datetime-local" value={form.end_date ? new Date(form.end_date).toISOString().slice(0, 16) : ''} onChange={(e) => setForm({ ...form, end_date: e.target.value ? new Date(e.target.value).toISOString() : null })} />
          </div>

          <label className="flex items-center gap-3 p-3 bg-[var(--color-surface-dim)] rounded-[var(--radius-md)] cursor-pointer">
            <input type="checkbox" checked={form.is_active !== false} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm font-medium text-[var(--color-text-primary)]">نشط</span>
          </label>
        </div>
      </Drawer>

      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDelete(confirmDelete?.id)} title="حذف الإعلان" message={`هل أنت متأكد من حذف "${confirmDelete?.title}"؟`} confirmText="حذف" confirmVariant="danger" />
    </div>
  );
}
