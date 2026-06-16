'use client';

import { useEffect, useState, useCallback } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Drawer from '../../../components/ui/Drawer';
import Badge from '../../../components/ui/Badge';
import { KPICard } from '../../../components/ui/Card';
import { ConfirmModal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';

const LEVELS = [
  { value: 'first', label: 'الأول' },
  { value: 'second', label: 'الثاني' },
  { value: 'third', label: 'الثالث' },
];

const PROGRAMS = [
  'AI Programming',
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Mobile App Development',
  'UI/UX Design',
  'Data Science',
  'Cyber Security',
];

const DELIVERY_METHODS = [
  { value: 'email', label: 'البريد الإلكتروني', icon: 'mail' },
  { value: 'whatsapp', label: 'واتساب', icon: 'chat' },
  { value: 'printed', label: 'نسخة مطبوعة', icon: 'print' },
];

const STATUSES = [
  { value: 'pending', label: 'قيد الانتظار', color: 'warning' },
  { value: 'issued', label: 'صدرت', color: 'info' },
  { value: 'delivered', label: 'تم التسليم', color: 'success' },
  { value: 'cancelled', label: 'ملغاة', color: 'danger' },
];

const COUNTRY_CODES = [
  { code: '+20', name: 'مصر' },
  { code: '+966', name: 'السعودية' },
  { code: '+971', name: 'الإمارات' },
  { code: '+965', name: 'الكويت' },
  { code: '+974', name: 'قطر' },
  { code: '+962', name: 'الأردن' },
  { code: '+218', name: 'ليبيا' },
  { code: '+212', name: 'المغرب' },
  { code: '+213', name: 'الجزائر' },
  { code: '+216', name: 'تونس' },
  { code: '+90', name: 'تركيا' },
  { code: '+44', name: 'بريطانيا' },
  { code: '+1', name: 'أمريكا/كندا' },
  { code: '+249', name: 'السودان' },
  { code: '+970', name: 'فلسطين' },
  { code: '+961', name: 'لبنان' },
];

const TABS = [
  { id: 'student', label: 'شهادة طالب', icon: 'school' },
  { id: 'experience', label: 'شهادة خبرة', icon: 'work' },
];

export default function CertificatesPage() {
  const { success, error: toastError } = useToast();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [totalIssued, setTotalIssued] = useState(0);
  const [tab, setTab] = useState('student');

  const loadCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      if (filterType) params.set('type', filterType);
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/certificates?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCertificates(data.certificates || []);
        setTotalIssued(data.total_issued || 0);
      }
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterType, search]);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const openNewDrawer = (type) => {
    setTab(type);
    setForm({
      certificate_type: type,
      program: 'AI Programming',
      level: 'first',
      delivery_method: 'email',
      country_code: '+20',
    });
    setDrawer('new');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (form.national_id && !/^\d{14}$/.test(form.national_id)) {
        toastError('الرقم القومي يجب أن يكون 14 رقم');
        setSaving(false);
        return;
      }
      if (!form.student_name_en || form.student_name_en.trim().length < 3) {
        toastError('اسم الطالب بالإنجليزية مطلوب');
        setSaving(false);
        return;
      }
      if (form.delivery_method === 'email' && form.delivery_contact && !/\S+@\S+\.\S+/.test(form.delivery_contact)) {
        toastError('البريد الإلكتروني غير صحيح');
        setSaving(false);
        return;
      }

      const payload = {
        ...form,
        delivery_contact: form.delivery_method === 'email' ? form.delivery_contact
          : form.delivery_method === 'whatsapp' ? `${form.country_code}${form.delivery_contact}`
          : form.delivery_contact,
      };

      const url = form.id ? `/api/admin/certificates` : '/api/admin/certificates';
      const res = await fetch(url, {
        method: form.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setDrawer(null);
        loadCertificates();
        success(form.id ? 'تم تحديث الشهادة' : 'تم إصدار الشهادة بنجاح');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    const res = await fetch('/api/admin/certificates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) {
      loadCertificates();
      success(`تم تحديث الحالة إلى: ${STATUSES.find(s => s.value === newStatus)?.label}`);
    } else {
      const data = await res.json();
      toastError(data.error || 'حدث خطأ');
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/certificates?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(null);
      loadCertificates();
      success('تم حذف الشهادة');
    } else {
      toastError('حدث خطأ أثناء الحذف');
    }
  };

  const generateSerial = (type) => {
    const prefix = type === 'experience' ? 'EXP' : 'TKA';
    return `${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;
  };

  const statuses = {
    pending: { label: 'قيد الانتظار', color: 'warning' },
    issued: { label: 'صدرت', color: 'info' },
    delivered: { label: 'تم التسليم', color: 'success' },
    cancelled: { label: 'ملغاة', color: 'danger' },
  };

  return (
    <div className="space-y-md">
      <div className="flex items-center justify-between flex-wrap gap-base">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-[var(--color-on-surface)]">إدارة الشهادات</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">إصدار وإدارة شهادات الطلاب وشهادات الخبرة</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => openNewDrawer('student')} icon="school">
            شهادة طالب
          </Button>
          <Button onClick={() => openNewDrawer('experience')} variant="secondary" icon="work">
            شهادة خبرة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-base">
        <KPICard title="إجمالي الشهادات" value={certificates.length} icon="description" color="var(--color-primary)" />
        <KPICard title="صدرت" value={totalIssued} icon="check_circle" color="var(--color-success)" />
        <KPICard title="قيد الانتظار" value={certificates.filter(c => c.status === 'pending').length} icon="hourglass_empty" color="var(--color-warning)" />
        <KPICard title="ملغاة" value={certificates.filter(c => c.status === 'cancelled').length} icon="cancel" color="var(--color-danger)" />
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="بحث بالاسم، الرقم القومي، أو الرقم التسلسلي..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="search"
          />
        </div>
        <div className="w-40">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[{ value: '', label: 'كل الحالات' }, ...STATUSES]}
          />
        </div>
        <div className="w-40">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[{ value: '', label: 'كل الأنواع' }, { value: 'student', label: 'شهادة طالب' }, { value: 'experience', label: 'شهادة خبرة' }]}
          />
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline-variant)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-[var(--color-on-surface-variant)] mb-xs">description</span>
            <p className="text-[var(--color-on-surface-variant)]">لا توجد شهادات</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container)]">
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الاسم بالإنجليزية</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الرقم القومي</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">البرنامج</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">المستوى</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">النوع</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">طريقة التسليم</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الرقم التسلسلي</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الحالة</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert) => (
                  <tr key={cert.id} className="border-b border-[var(--color-outline-variant)]/50 hover:bg-[var(--color-surface-container-low)] transition-colors">
                    <td className="px-4 py-3 font-medium">{cert.student_name_en}</td>
                    <td className="px-4 py-3 font-mono text-xs">{cert.national_id}</td>
                    <td className="px-4 py-3">{cert.program}</td>
                    <td className="px-4 py-3">{LEVELS.find(l => l.value === cert.level)?.label}</td>
                    <td className="px-4 py-3">
                      <Badge color={cert.certificate_type === 'experience' ? 'info' : 'primary'}>
                        {cert.certificate_type === 'experience' ? 'خبرة' : 'طالب'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {DELIVERY_METHODS.find(d => d.value === cert.delivery_method)?.label}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{cert.serial_number}</td>
                    <td className="px-4 py-3">
                      <Badge color={statuses[cert.status]?.color}>{statuses[cert.status]?.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setForm(cert); setDrawer('edit'); }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors" title="تعديل">
                          <span className="material-symbols-outlined text-lg text-[var(--color-on-surface-variant)]">edit</span>
                        </button>
                        {cert.status === 'pending' && (
                          <button onClick={() => handleStatusChange(cert.id, 'issued')} className="p-1.5 rounded-lg hover:bg-[var(--color-success-container)] transition-colors" title="إصدار">
                            <span className="material-symbols-outlined text-lg text-[var(--color-success)]">check_circle</span>
                          </button>
                        )}
                        {cert.status === 'issued' && (
                          <button onClick={() => handleStatusChange(cert.id, 'delivered')} className="p-1.5 rounded-lg hover:bg-[var(--color-info-container)] transition-colors" title="تسليم">
                            <span className="material-symbols-outlined text-lg text-[var(--color-info)]">local_shipping</span>
                          </button>
                        )}
                        {cert.status !== 'cancelled' && cert.status !== 'delivered' && (
                          <button onClick={() => handleStatusChange(cert.id, 'cancelled')} className="p-1.5 rounded-lg hover:bg-[var(--color-error-container)] transition-colors" title="إلغاء">
                            <span className="material-symbols-outlined text-lg text-[var(--color-danger)]">cancel</span>
                          </button>
                        )}
                        <button onClick={() => setConfirmDelete(cert)} className="p-1.5 rounded-lg hover:bg-[var(--color-error-container)] transition-colors" title="حذف">
                          <span className="material-symbols-outlined text-lg text-[var(--color-danger)]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Drawer
        title={drawer === 'new' ? `إضافة ${tab === 'student' ? 'شهادة طالب' : 'شهادة خبرة'}` : 'تعديل الشهادة'}
        isOpen={!!drawer}
        onClose={() => setDrawer(null)}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDrawer(null)}>إلغاء</Button>
            <Button onClick={handleSave} loading={saving} icon="save">{drawer === 'new' ? 'إصدار الشهادة' : 'حفظ التعديلات'}</Button>
          </div>
        }
      >
        <div className="space-y-4">
          {drawer === 'new' && (
            <div className="flex gap-2 p-1 bg-[var(--color-surface-container)] rounded-xl">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setForm({ ...form, certificate_type: t.id }); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                    tab === t.id
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-md'
                      : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          )}

          <Input
            label="الاسم بالإنجليزية *"
            placeholder="Student Full Name"
            value={form.student_name_en || ''}
            onChange={(e) => setForm({ ...form, student_name_en: e.target.value })}
            required
          />

          <Input
            label="الرقم القومي *"
            placeholder="14 رقم"
            value={form.national_id || ''}
            onChange={(e) => setForm({ ...form, national_id: e.target.value.replace(/\D/g, '').slice(0, 14) })}
            maxLength={14}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-on-surface)]">البرنامج *</label>
            <select
              value={form.program || 'AI Programming'}
              onChange={(e) => setForm({ ...form, program: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl text-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none"
            >
              {PROGRAMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <Select
            label="المستوى *"
            value={form.level || 'first'}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            options={LEVELS}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-on-surface)]">طريقة التسليم *</label>
            <div className="grid grid-cols-3 gap-2">
              {DELIVERY_METHODS.map((method) => (
                <button
                  key={method.value}
                  onClick={() => setForm({ ...form, delivery_method: method.value })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    form.delivery_method === method.value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]'
                      : 'border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">{method.icon}</span>
                  <span className="text-xs font-medium">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {form.delivery_method === 'email' && (
            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="student@email.com"
              value={form.delivery_contact || ''}
              onChange={(e) => setForm({ ...form, delivery_contact: e.target.value })}
            />
          )}

          {form.delivery_method === 'whatsapp' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-on-surface)]">رقم الواتساب</label>
              <div className="flex gap-2">
                <select
                  value={form.country_code || '+20'}
                  onChange={(e) => setForm({ ...form, country_code: e.target.value })}
                  className="w-32 px-3 py-3 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl text-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none"
                >
                  {COUNTRY_CODES.map((c, i) => (
                    <option key={i} value={c.code}>{c.code} {c.name}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="رقم الواتساب"
                  className="flex-1 px-4 py-3 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl text-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none"
                  value={form.delivery_contact || ''}
                  onChange={(e) => setForm({ ...form, delivery_contact: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>
          )}

          {form.delivery_method === 'printed' && (
            <Input
              label="العنوان للتسليم"
              placeholder="المدينة، العنوان التفصيلي"
              value={form.delivery_address || ''}
              onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
            />
          )}

          <Input
            label="ملاحظات"
            placeholder="ملاحظات إضافية (اختياري)"
            value={form.notes || ''}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          {form.serial_number && (
            <div className="p-3 bg-[var(--color-surface-container)] rounded-xl border border-[var(--color-outline-variant)]">
              <span className="text-xs text-[var(--color-on-surface-variant)]">الرقم التسلسلي:</span>
              <span className="block font-mono text-sm font-bold text-[var(--color-primary)]">{form.serial_number}</span>
            </div>
          )}
        </div>
      </Drawer>

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete?.id)}
        title="حذف الشهادة"
        message={`هل أنت متأكد من حذف شهادة "${confirmDelete?.student_name_en}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        danger
      />
    </div>
  );
}
