'use client';

import { useEffect, useState, useCallback } from 'react';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import Select from '../../../../components/ui/Select';
import Drawer from '../../../../components/ui/Drawer';
import { useToast } from '../../../../components/ui/Toast';

const ROLES = [
  { value: 'admin', label: 'مدير', icon: 'shield', color: 'var(--color-danger)' },
  { value: 'supervisor', label: 'مشرف', icon: 'supervisor_account', color: 'var(--color-warning)' },
  { value: 'trainer', label: 'مدرب', icon: 'co_present', color: 'var(--color-success)' },
  { value: 'student', label: 'طالب', icon: 'school', color: 'var(--color-primary)' },
];

const RESOURCES = [
  { value: 'students', label: 'الطلاب' },
  { value: 'trainers', label: 'المدربين' },
  { value: 'groups', label: 'المجموعات' },
  { value: 'sessions', label: 'الجلسات' },
  { value: 'attendance', label: 'الحضور' },
  { value: 'tasks', label: 'المهام' },
  { value: 'payments', label: 'المدفوعات' },
  { value: 'evaluations', label: 'التقييمات' },
  { value: 'messages', label: 'الرسائل' },
  { value: 'notifications', label: 'الإشعارات' },
  { value: 'settings', label: 'الإعدادات' },
  { value: 'ads', label: 'الإعلانات' },
  { value: 'gateways', label: 'بوابات الدفع' },
  { value: 'pages', label: 'الصفحات' },
  { value: 'subscriptions', label: 'الاشتراكات' },
  { value: 'alerts', label: 'التنبيهات' },
];

export default function RolesPage() {
  const { success, error: toastError } = useToast();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const loadPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedRole) params.set('role', selectedRole);
      const res = await fetch(`/api/admin/role-permissions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPermissions(data.permissions || []);
      }
    } finally { setLoading(false); }
  }, [selectedRole]);

  useEffect(() => { loadPermissions(); }, [loadPermissions]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/role-permissions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDrawer(null);
        loadPermissions();
        success('تم الحفظ');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const permMap = {};
  permissions.forEach(p => { permMap[p.resource] = p; });

  const roleInfo = ROLES.find(r => r.value === selectedRole) || ROLES[0];

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>الأدوار والصلاحيات</h1><p>إدارة صلاحيات كل دور في النظام</p></div>
      </div>

      {/* Role Tabs */}
      <div className="flex gap-2 mb-6 overflow-auto pb-2">
        {ROLES.map((role) => (
          <button
            key={role.value}
            onClick={() => setSelectedRole(role.value)}
            className={`flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] text-sm font-medium transition-all whitespace-nowrap ${selectedRole === role.value ? 'bg-[var(--color-primary)] text-white shadow-md' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-dim)]'}`}
          >
            <span className="material-symbols-outlined text-[20px]">{role.icon}</span>
            {role.label}
          </button>
        ))}
      </div>

      {/* Permissions Table */}
      <div className="card-admin overflow-hidden">
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px]" style={{ color: roleInfo.color }}>{roleInfo.icon}</span>
            <div>
              <h2 className="text-sm font-bold text-[var(--color-text-primary)]">صلاحيات {roleInfo.label}</h2>
              <p className="text-[10px] text-[var(--color-text-tertiary)]">{RESOURCES.length} مورد</p>
            </div>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-right text-xs font-bold text-[var(--color-text-secondary)] p-4">المورد</th>
                <th className="text-center text-xs font-bold text-[var(--color-text-secondary)] p-4 w-24">قراءة</th>
                <th className="text-center text-xs font-bold text-[var(--color-text-secondary)] p-4 w-24">كتابة</th>
                <th className="text-center text-xs font-bold text-[var(--color-text-secondary)] p-4 w-24">حذف</th>
                <th className="text-center text-xs font-bold text-[var(--color-text-secondary)] p-4 w-24">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">
                  <span className="material-symbols-outlined text-[var(--color-primary)] animate-spin">progress_activity</span>
                </td></tr>
              ) : RESOURCES.map((res) => {
                const perm = permMap[res.value];
                const perms = perm?.permissions || { read: false, write: false, delete: false };
                return (
                  <tr key={res.value} className="border-b border-[var(--color-border-light)] hover:bg-[var(--color-surface-dim)]">
                    <td className="p-4 text-sm font-medium text-[var(--color-text-primary)]">{res.label}</td>
                    <td className="text-center p-4">
                      <span className={`material-symbols-outlined text-[20px] ${perms.read ? 'text-[var(--color-success)]' : 'text-[var(--color-text-tertiary)]'}`}>
                        {perms.read ? 'check_circle' : 'cancel'}
                      </span>
                    </td>
                    <td className="text-center p-4">
                      <span className={`material-symbols-outlined text-[20px] ${perms.write ? 'text-[var(--color-success)]' : 'text-[var(--color-text-tertiary)]'}`}>
                        {perms.write ? 'check_circle' : 'cancel'}
                      </span>
                    </td>
                    <td className="text-center p-4">
                      <span className={`material-symbols-outlined text-[20px] ${perms.delete ? 'text-[var(--color-success)]' : 'text-[var(--color-text-tertiary)]'}`}>
                        {perms.delete ? 'check_circle' : 'cancel'}
                      </span>
                    </td>
                    <td className="text-center p-4">
                      <Button size="sm" variant="ghost" icon="edit" onClick={() => {
                        setForm({
                          id: perm?.id || null,
                          role: selectedRole,
                          resource: res.value,
                          permissions: perms,
                        });
                        setDrawer('edit');
                      }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Drawer */}
      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title={`تعديل صلاحيات — ${RESOURCES.find(r => r.value === form.resource)?.label || ''}`}
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <div className="p-3 bg-[var(--color-surface-dim)] rounded-[var(--radius-md)]">
            <div className="text-xs text-[var(--color-text-tertiary)]">الدور</div>
            <div className="text-sm font-bold text-[var(--color-text-primary)]">{ROLES.find(r => r.value === form.role)?.label}</div>
          </div>
          <div className="p-3 bg-[var(--color-surface-dim)] rounded-[var(--radius-md)]">
            <div className="text-xs text-[var(--color-text-tertiary)]">المورد</div>
            <div className="text-sm font-bold text-[var(--color-text-primary)]">{RESOURCES.find(r => r.value === form.resource)?.label}</div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[var(--color-text-primary)]">الصلاحيات</h4>
            {['read', 'write', 'delete'].map((perm) => (
              <label key={perm} className="flex items-center gap-3 p-3 bg-[var(--color-surface-dim)] rounded-[var(--radius-md)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.permissions?.[perm] || false}
                  onChange={(e) => setForm({ ...form, permissions: { ...form.permissions, [perm]: e.target.checked } })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {perm === 'read' ? 'قراءة' : perm === 'write' ? 'كتابة' : 'حذف'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
