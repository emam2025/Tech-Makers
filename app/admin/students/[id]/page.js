'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../../../components/ui/Button';
import Drawer from '../../../../components/ui/Drawer';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useToast } from '../../../../components/ui/Toast';

export default function StudentProfilePage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [student, setStudent] = useState(null);
  const [groups, setGroups] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);
  const { success: toastSuccess, error: toastError } = useToast();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const authRes = await fetch('/api/admin/auth');
        if (!authRes.ok) { router.push('/login'); return; }

        const [studentRes, groupsRes, attendanceRes, paymentsRes, tasksRes] = await Promise.all([
          fetch(`/api/admin/students?id=${id}`),
          fetch('/api/admin/groups'),
          fetch(`/api/admin/attendance?student_id=${id}`),
          fetch(`/api/admin/payments?student_id=${id}`),
          fetch(`/api/admin/tasks?student_id=${id}`),
        ]);

        const studentData = studentRes.ok ? await studentRes.json() : {};
        const groupsData = groupsRes.ok ? await groupsRes.json() : {};
        const attendanceData = attendanceRes.ok ? await attendanceRes.json() : {};
        const paymentsData = paymentsRes.ok ? await paymentsRes.json() : {};
        const tasksData = tasksRes.ok ? await tasksRes.json() : {};

        const s = (studentData.students || []).find(s => s.id === id);
        setStudent(s);
        setGroups(groupsData.groups || []);
        setAttendance(attendanceData.attendance || []);
        setPayments(paymentsData.payments || []);
        setTasks(tasksData.tasks || []);
        if (s) setEditForm({
          full_name: s.full_name || '',
          phone: s.phone || '',
          email: s.email || '',
          parent_name: s.parent_name || '',
          parent_phone: s.parent_phone || '',
          address: s.address || '',
          notes: s.notes || '',
        });
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    }
    load();
  }, [id, router]);

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: 'visibility' },
    { id: 'attendance', label: 'الحضور', icon: 'event_available' },
    { id: 'progress', label: 'التقدم الدراسي', icon: 'trending_up' },
    { id: 'payments', label: 'المدفوعات', icon: 'payments' },
  ];

  const studentGroups = groups.filter(g => g.student_ids?.includes(id));
  const attended = attendance.filter(a => a.status === 'present').length;
  const totalSessions = attendance.length;
  const attendanceRate = totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0;
  const totalPaid = payments.filter(p => p.status === 'confirmed').reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);

  const evaluationScores = [
    { label: 'ال SESSIONS', score: attended, total: totalSessions },
  ];

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/students`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm }),
      });
      if (res.ok) {
        setStudent(prev => ({ ...prev, ...editForm }));
        setShowEditDrawer(false);
        toastSuccess('تم حفظ التعديلات بنجاح');
      } else {
        toastError('حدث خطأ أثناء الحفظ');
      }
    } catch {
      toastError('خطأ في الاتصال بالخادم');
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/admin/students`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toastSuccess('تم حذف الطالب بنجاح');
        setTimeout(() => router.push('/admin/students'), 1500);
      } else {
        toastError('حدث خطأ أثناء الحذف');
      }
    } catch {
      toastError('خطأ في الاتصال بالخادم');
    }
    setShowConfirm(null);
  }

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-md py-lg mb-24">
        <div className="animate-pulse space-y-md">
          <div className="h-40 bg-surface-container rounded-xl" />
          <div className="h-12 bg-surface-container rounded-xl w-1/3" />
          <div className="grid grid-cols-3 gap-md">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-surface-container rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-container-max mx-auto px-md py-lg mb-24 text-center">
        <span className="material-symbols-outlined text-[64px] text-outline mb-md block">person_off</span>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">الطالب غير موجود</h2>
        <Link href="/admin/students" className="text-primary underline font-label-md">العودة لقائمة الطلاب</Link>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-green-100 text-green-700 border-green-200',
    accepted: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
    inactive: 'bg-surface-container-high text-on-surface-variant border-outline-variant',
  };
  const statusLabels = {
    active: 'نشط', accepted: 'مقبول', pending: 'قيد المراجعة', suspended: 'معلق', inactive: 'غير نشط',
  };

  const progressSkills = [
    { label: 'ال SESSIONS المنجزة', pct: totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0 },
    { label: 'الواجبات المسلّمة', pct: tasks.filter(t => t.status === 'completed').length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / Math.max(tasks.length, 1)) * 100) : 0 },
    { label: 'الاختبارات', pct: 0 },
  ];

  const latestPayments = payments.slice(0, 3);

  return (
    <div className="max-w-container-max mx-auto px-md py-lg mb-24">
      {/* Student Header Profile Section */}
      <section className="mb-lg">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md lg:p-lg flex flex-col md:flex-row items-center md:items-end gap-md shadow-sm">
          <div className="relative group">
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-xl overflow-hidden border-4 border-white shadow-xl bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[64px] text-primary">person</span>
            </div>
            <button
              onClick={() => { setEditForm({ full_name: student.full_name || '', phone: student.phone || '', email: student.email || '', parent_name: student.parent_name || '', parent_phone: student.parent_phone || '', address: student.address || '', notes: student.notes || '' }); setShowEditDrawer(true); }}
              className="absolute -bottom-2 -left-2 p-2 bg-secondary rounded-full text-white shadow-lg border-2 border-white hover:scale-110 transition-transform"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div className="flex-1 text-center md:text-right space-y-base">
            <div className="flex flex-col md:flex-row items-center md:items-baseline gap-sm">
              <h2 className="font-headline-lg text-headline-lg text-primary font-bold">{student.full_name || 'بدون اسم'}</h2>
              <span className={`px-md py-1 rounded-full font-label-md text-label-md border ${statusColors[student.status] || 'bg-surface-container-high text-on-surface-variant'}`}>
                {statusLabels[student.status] || student.status}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center justify-center md:justify-start gap-xs">
              <span className="material-symbols-outlined text-sm">id_card</span>
              رقم الهاتف: {student.phone || 'غير محدد'}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-base pt-base">
              <Link href={`/admin/messages?student=${id}`} className="px-md py-2 bg-primary text-white rounded-lg font-label-md text-label-md flex items-center gap-xs hover:bg-primary-container transition-colors shadow-sm">
                <span className="material-symbols-outlined text-sm">mail</span>
                مراسلة
              </Link>
              <button
                onClick={() => { setEditForm({ full_name: student.full_name || '', phone: student.phone || '', email: student.email || '', parent_name: student.parent_name || '', parent_phone: student.parent_phone || '', address: student.address || '', notes: student.notes || '' }); setShowEditDrawer(true); }}
                className="px-md py-2 border border-primary text-primary rounded-lg font-label-md text-label-md flex items-center gap-xs hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-sm">settings</span>
                تعديل الملف
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="flex overflow-x-auto gap-md mb-lg border-b border-outline-variant pb-xs no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-md py-sm font-label-md text-label-md whitespace-nowrap transition-colors flex items-center gap-xs ${
              activeTab === tab.id
                ? 'text-primary font-bold border-b-4 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left Content (8 cols) */}
        <div className="md:col-span-8 flex flex-col gap-gutter">
          {activeTab === 'overview' && (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
                <div className="bg-white dark:bg-surface border border-outline-variant p-md rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-sm mb-base text-primary">
                    <span className="material-symbols-outlined p-2 bg-primary-fixed-dim/20 rounded-lg">group</span>
                    <span className="font-label-md text-label-md">المجموعة</span>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface">{studentGroups[0]?.name || 'غير محدد'}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">{studentGroups[0]?.track || ''}</p>
                </div>
                <div className="bg-white dark:bg-surface border border-outline-variant p-md rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-sm mb-base text-secondary">
                    <span className="material-symbols-outlined p-2 bg-secondary-fixed/20 rounded-lg">calendar_today</span>
                    <span className="font-label-md text-label-md">تاريخ التسجيل</span>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface">{student.created_at ? new Date(student.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}</h4>
                </div>
                <div className="bg-white dark:bg-surface border border-outline-variant p-md rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-sm mb-base text-primary">
                    <span className="material-symbols-outlined p-2 bg-primary-fixed-dim/20 rounded-lg">payments</span>
                    <span className="font-label-md text-label-md">الإجمالي المدفوع</span>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface">{totalPaid.toLocaleString()} ج.م</h4>
                </div>
              </div>

              {/* Progress Section */}
              <div className="bg-white dark:bg-surface border border-outline-variant p-md lg:p-lg rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-lg">
                  <h3 className="font-headline-md text-headline-md text-primary font-bold">التقدم الدراسي</h3>
                  <span className="material-symbols-outlined text-on-surface-variant">trending_up</span>
                </div>
                <div className="space-y-lg">
                  {progressSkills.map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-xs">
                        <span className="font-label-md text-label-md text-on-surface">{skill.label}</span>
                        <span className="font-label-md text-label-md text-primary font-bold">{skill.pct}%</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-3">
                        <div className="bg-primary h-3 rounded-full shadow-inner transition-all" style={{ width: `${skill.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                {tasks.length > 0 && (
                  <div className="mt-lg pt-lg border-t border-outline-variant">
                    <h4 className="font-label-md text-label-md text-on-surface-variant mb-md">آخر الواجبات</h4>
                    <div className="flex gap-md">
                      {tasks.slice(0, 3).map((t, i) => (
                        <div key={i} className="flex-1 bg-surface-container-low p-sm rounded-lg text-center">
                          <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{t.title || 'واجب'}</p>
                          <p className={`font-headline-md text-headline-md font-bold ${t.status === 'completed' ? 'text-success' : 'text-primary'}`}>
                            {t.status === 'completed' ? '✓' : '—'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'attendance' && (
            <div className="bg-white dark:bg-surface border border-outline-variant p-md rounded-xl shadow-sm">
              <h3 className="font-headline-md text-headline-md text-primary font-bold mb-md">سجل الحضور</h3>
              {attendance.length === 0 ? (
                <p className="text-on-surface-variant text-center py-8">لا يوجد سجل حضور</p>
              ) : (
                <div className="space-y-sm">
                  {attendance.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-sm bg-surface-container-low rounded-lg">
                      <div className="flex items-center gap-md">
                        <span className={`w-3 h-3 rounded-full ${a.status === 'present' ? 'bg-success' : a.status === 'absent' ? 'bg-error' : 'bg-yellow-500'}`} />
                        <div>
                          <p className="font-label-md text-label-md">{a.session_title || 'جلسة'}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{a.date || ''}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${a.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {a.status === 'present' ? 'حاضر' : 'غائب'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="bg-white dark:bg-surface border border-outline-variant p-md rounded-xl shadow-sm">
              <h3 className="font-headline-md text-headline-md text-primary font-bold mb-md">التقدم الدراسي</h3>
              <div className="space-y-lg">
                {progressSkills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-xs">
                      <span className="font-label-md text-label-md text-on-surface">{skill.label}</span>
                      <span className="font-label-md text-label-md text-primary font-bold">{skill.pct}%</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full shadow-inner" style={{ width: `${skill.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white dark:bg-surface border border-outline-variant p-md rounded-xl shadow-sm">
              <h3 className="font-headline-md text-headline-md text-primary font-bold mb-md">سجل المدفوعات</h3>
              {payments.length === 0 ? (
                <p className="text-on-surface-variant text-center py-8">لا يوجد مدفوعات</p>
              ) : (
                <div className="space-y-sm">
                  {payments.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-sm bg-surface-container-low rounded-lg">
                      <div>
                        <p className="font-label-md text-label-md">{p.description || 'اشتراك'}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{p.payment_date ? new Date(p.payment_date).toLocaleDateString('ar-EG') : ''}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-headline-md text-headline-md text-primary font-bold">{parseFloat(p.amount || 0).toLocaleString()} ج.م</p>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {p.status === 'confirmed' ? 'مكتمل' : 'معلق'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-gutter">
          {/* Attendance Stats */}
          <div className="bg-white dark:bg-surface border border-outline-variant p-md rounded-xl shadow-sm">
            <h3 className="font-headline-md text-headline-md text-primary font-bold mb-md">إحصائيات الحضور</h3>
            <div className="flex items-center gap-md mb-lg">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="text-surface-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3" />
                  <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${attendanceRate}, 100`} strokeLinecap="round" strokeWidth="3" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline-md text-headline-md text-primary font-bold">{attendanceRate}%</span>
                </div>
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface">إجمالي الجلسات</p>
                <p className="font-headline-md text-headline-md text-primary font-bold">{attended}/{totalSessions}</p>
                <p className={`font-body-sm text-body-sm font-medium ${attendanceRate >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                  {attendanceRate >= 80 ? 'مواظبة ممتازة' : 'يحتاج تحسين'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-primary-container p-md rounded-xl shadow-lg text-white">
            <div className="flex justify-between items-start mb-lg">
              <div>
                <p className="font-label-md text-label-md text-on-primary-container">الرصيد المستحق</p>
                <h3 className="font-headline-lg text-headline-lg font-bold text-secondary-fixed">{pendingAmount.toLocaleString()} ج.م</h3>
              </div>
              <span className="material-symbols-outlined text-secondary-fixed text-4xl">account_balance_wallet</span>
            </div>
            {latestPayments.length > 0 && (
              <div className="space-y-sm">
                <p className="font-label-md text-label-md opacity-80 border-b border-white/10 pb-xs">آخر المعاملات</p>
                {latestPayments.map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span>{p.description || 'اشتراك'}</span>
                    <span className="font-bold">{parseFloat(p.amount || 0).toLocaleString()} ج.م</span>
                  </div>
                ))}
              </div>
            )}
            <Link href="/admin/payments" className="w-full mt-md py-2 bg-secondary text-primary font-bold rounded-lg hover:brightness-105 transition-all text-center block text-sm">سجل المدفوعات</Link>
          </div>

          {/* Contact Info */}
          <div className="bg-white dark:bg-surface border border-outline-variant p-md rounded-xl shadow-sm">
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-md">معلومات التواصل</h3>
            <div className="space-y-md">
              <div className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary text-xl">phone</span>
                <div>
                  <p className="font-label-md text-label-md">{student.phone || 'غير محدد'}</p>
                  <p className="text-[10px] text-on-surface-variant">رقم الطالب</p>
                </div>
              </div>
              <div className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary text-xl">call_received</span>
                <div>
                  <p className="font-label-md text-label-md">{student.parent_phone || 'غير محدد'}</p>
                  <p className="text-[10px] text-on-surface-variant">رقم ولي الأمر</p>
                </div>
              </div>
              <div className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                <div>
                  <p className="font-label-md text-label-md">{student.address || 'غير محدد'}</p>
                  <p className="text-[10px] text-on-surface-variant">العنوان</p>
                </div>
              </div>
              {student.email && (
                <div className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-primary text-xl">email</span>
                  <div>
                    <p className="font-label-md text-label-md">{student.email}</p>
                    <p className="text-[10px] text-on-surface-variant">البريد الإلكتروني</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Drawer */}
      <Drawer
        title="تعديل ملف الطالب"
        isOpen={showEditDrawer}
        onClose={() => setShowEditDrawer(false)}
        footer={
          <div className="flex gap-3">
            <Button onClick={handleSave} loading={saving} className="flex-1">حفظ التعديلات</Button>
            <Button onClick={() => setShowEditDrawer(false)} variant="outlined" className="flex-1">إلغاء</Button>
          </div>
        }
      >
        <div className="space-y-4">
          {[
            { key: 'full_name', label: 'الاسم الكامل', type: 'text' },
            { key: 'phone', label: 'رقم الهاتف', type: 'tel' },
            { key: 'email', label: 'البريد الإلكتروني', type: 'email' },
            { key: 'parent_name', label: 'اسم ولي الأمر', type: 'text' },
            { key: 'parent_phone', label: 'رقم ولي الأمر', type: 'tel' },
            { key: 'address', label: 'العنوان', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1">{f.label}</label>
              <input
                type={f.type}
                value={editForm[f.key] || ''}
                onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full px-3 py-2 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none text-sm"
              />
            </div>
          ))}
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">ملاحظات</label>
            <textarea
              value={editForm.notes || ''}
              onChange={e => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none text-sm resize-none"
            />
          </div>
        </div>
      </Drawer>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!showConfirm}
        onClose={() => setShowConfirm(null)}
        onConfirm={handleDelete}
        title="حذف الطالب"
        message="هل أنت متأكد من حذف هذا الطالب؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        cancelText="إلغاء"
        type="danger"
      />
    </div>
  );
}
