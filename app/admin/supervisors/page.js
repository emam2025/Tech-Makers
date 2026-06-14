'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badge';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';

export default function SupervisorsPage() {
  const { success, error: toastError } = useToast();
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const BRANCHES = ['القاهرة', 'الجيزة', 'الإسكندرية', 'المنصورة', 'أسيوط', 'طنطا', 'الزقازيق', 'الإسماعيلية', 'سوهاج', 'قنا', 'أسوان', 'بني سويف', 'الفيوم'];

  const loadSupervisors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setSupervisors((data.users || []).filter(u => u.role === 'supervisor'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSupervisors(); }, [loadSupervisors]);

  const handleEdit = (sup) => {
    setEditForm({ ...sup, supervised_groups: sup.supervised_groups || [] });
    setDrawer('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editForm.id,
          full_name: editForm.full_name,
          phone: editForm.phone,
          branch: editForm.branch,
          supervised_groups: editForm.supervised_groups,
        }),
      });
      if (res.ok) {
        success('تم الحفظ');
        setDrawer(null);
        loadSupervisors();
      } else {
        toastError('فشل الحفظ');
      }
    } catch {
      toastError('خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        success('تم الحذف');
        loadSupervisors();
      } else {
        toastError('فشل الحذف');
      }
    } catch {
      toastError('خطأ في الاتصال');
    }
  };

  const columns = [
    { key: 'full_name', label: 'الاسم', render: (r) => <span className="font-medium">{r.full_name || '-'}</span> },
    { key: 'email', label: 'البريد', render: (r) => <span dir="ltr" className="text-xs">{r.email}</span> },
    { key: 'phone', label: 'الهاتف', render: (r) => r.phone || '-' },
    { key: 'branch', label: 'الفرع', render: (r) => r.branch || '-' },
    { key: 'supervised_groups', label: 'المجموعات', render: (r) => (
      <div className="flex flex-wrap gap-1">
        {(r.supervised_groups || []).map(g => <Badge key={g} variant="info">{g}</Badge>)}
        {(!r.supervised_groups || r.supervised_groups.length === 0) && <span className="text-xs text-[var(--color-text-tertiary)]">-</span>}
      </div>
    )},
    { key: 'created_at', label: 'التاريخ', render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString('ar-EG') : '-' },
  ];

  const actions = [
    { icon: 'edit', label: 'تعديل', onClick: handleEdit },
    { icon: 'delete', label: 'حذف', onClick: (r) => handleDelete(r.id, r.full_name || r.email), danger: true },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>المشرفين</h1><p>إدارة المشرفين والمجموعات المُشرَف عليها</p></div>
      </div>

      <DataTable columns={columns} data={supervisors} loading={loading} actions={actions} emptyText="لا يوجد مشرفون" />

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="تعديل المشرف" size="md"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        {drawer === 'edit' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1">الاسم</label>
              <input value={editForm.full_name || ''} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1">الهاتف</label>
              <input value={editForm.phone || ''} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="admin-input w-full" dir="ltr" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1">الفرع</label>
              <select value={editForm.branch || ''} onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })} className="admin-input w-full">
                <option value="">اختر الفرع</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-2">المجموعات المُشرَف عليها</label>
              <div className="flex flex-wrap gap-2">
                {['Track A', 'Track B', 'Track C', 'Techno Math', 'Tech English'].map(g => (
                  <label key={g} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${(editForm.supervised_groups || []).includes(g) ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-dim)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'}`}>
                    <input type="checkbox" className="sr-only" checked={(editForm.supervised_groups || []).includes(g)} onChange={(e) => {
                      const groups = e.target.checked ? [...(editForm.supervised_groups || []), g] : (editForm.supervised_groups || []).filter(x => x !== g);
                      setEditForm({ ...editForm, supervised_groups: groups });
                    }} />
                    {(editForm.supervised_groups || []).includes(g) && <span className="material-symbols-outlined text-sm">check</span>}
                    {g}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
