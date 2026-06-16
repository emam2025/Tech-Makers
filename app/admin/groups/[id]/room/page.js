'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Button from '../../../../../components/ui/Button';
import Badge from '../../../../../components/ui/Badge';
import Input from '../../../../../components/ui/Input';
import Select from '../../../../../components/ui/Select';
import Drawer from '../../../../../components/ui/Drawer';
import { KPICard } from '../../../../../components/ui/Card';
import { ConfirmModal } from '../../../../../components/ui/Modal';
import { useToast } from '../../../../../components/ui/Toast';

const LEVELS = [
  { value: 'beginner', label: 'مبتدئ' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'advanced', label: 'متقدم' },
];

const STATUS_MAP = {
  upcoming: { label: 'القادمة', variant: 'info', icon: 'schedule' },
  completed: { label: 'تمت', variant: 'success', icon: 'check_circle' },
  postponed: { label: 'مؤجلة', variant: 'warning', icon: 'pause_circle' },
  cancelled: { label: 'ملغية', variant: 'danger', icon: 'cancel' },
};

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target - now;
      if (diff <= 0) { setTimeLeft('الآن'); return; }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setIsUrgent(days === 0 && hours < 3);
      const parts = [];
      if (days > 0) parts.push(`${days} يوم`);
      if (hours > 0) parts.push(`${hours} ساعة`);
      if (mins > 0) parts.push(`${mins} دقيقة`);
      if (days === 0) parts.push(`${secs} ثانية`);
      setTimeLeft(parts.join(' : '));
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <span className={`text-sm font-mono font-bold ${isUrgent ? 'text-error' : 'text-primary'}`}>
      {timeLeft}
    </span>
  );
}

function SessionCard({ session, user, onEdit, onToggleJoin, onDelete }) {
  const status = STATUS_MAP[session.status] || STATUS_MAP.upcoming;
  const isUpcoming = session.status === 'upcoming';
  const isTrainerOrAdmin = ['admin', 'supervisor', 'trainer'].includes(user?.role);
  const requirements = (() => { try { return typeof session.requirements === 'string' ? JSON.parse(session.requirements) : (session.requirements || []); } catch { return []; } })();
  const tasks = (() => { try { return typeof session.tasks === 'string' ? JSON.parse(session.tasks) : (session.tasks || []); } catch { return []; } })();
  const projects = (() => { try { return typeof session.projects === 'string' ? JSON.parse(session.projects) : (session.projects || []); } catch { return []; } })();

  return (
    <div className={`bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-all ${isUpcoming && session.is_join_active ? 'ring-2 ring-success' : ''}`}>
      {/* Header */}
      <div className="p-md border-b border-outline-variant">
        <div className="flex items-center justify-between mb-xs">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isUpcoming ? 'bg-primary-fixed/20' : 'bg-surface-container'}`}>
              <span className={`material-symbols-outlined text-[20px] ${isUpcoming ? 'text-primary' : 'text-on-surface-variant'}`}>
                {status.icon}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">{session.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-on-surface-variant">
                  {session.scheduled_date ? new Date(session.scheduled_date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                </span>
                {session.scheduled_date && (
                  <span className="text-[10px] text-on-surface-variant">
                    {new Date(session.scheduled_date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            session.status === 'completed' ? 'bg-green-100 text-green-700' :
            session.status === 'upcoming' ? 'bg-secondary-fixed/20 text-secondary' :
            session.status === 'postponed' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>{status.label}</span>
        </div>

        {/* Countdown for next session */}
        {isUpcoming && session.scheduled_date && new Date(session.scheduled_date) > new Date() && (
          <div className="flex items-center gap-2 p-3 bg-primary-fixed/10 rounded-lg mt-2">
            <span className="material-symbols-outlined text-[18px] text-primary">timer</span>
            <span className="text-xs text-on-surface-variant">الوقت المتبقي:</span>
            <CountdownTimer targetDate={session.scheduled_date} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-md space-y-sm">
        {/* Description */}
        {session.description && (
          <div>
            <h4 className="text-xs font-bold text-on-surface-variant mb-xs">التفاصيل</h4>
            <p className="text-sm text-on-surface leading-relaxed">{session.description}</p>
          </div>
        )}

        {/* Details */}
        {session.details && (
          <div className="p-sm bg-surface-container rounded-lg">
            <h4 className="text-xs font-bold text-on-surface-variant mb-xs">ملاحظات المدرب</h4>
            <p className="text-sm text-on-surface">{session.details}</p>
          </div>
        )}

        {/* Hours */}
        {(session.theoretical_hours > 0 || session.practical_hours > 0) && (
          <div className="flex gap-3">
            {session.theoretical_hours > 0 && (
              <div className="flex items-center gap-2 px-sm py-2 bg-primary-fixed/10 rounded-lg">
                <span className="material-symbols-outlined text-[16px] text-primary">menu_book</span>
                <span className="text-xs font-medium text-primary">{session.theoretical_hours} ساعة نظري</span>
              </div>
            )}
            {session.practical_hours > 0 && (
              <div className="flex items-center gap-2 px-sm py-2 bg-success/10 rounded-lg">
                <span className="material-symbols-outlined text-[16px] text-success">code</span>
                <span className="text-xs font-medium text-success">{session.practical_hours} ساعة عملي</span>
              </div>
            )}
          </div>
        )}

        {/* Requirements */}
        {requirements.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-on-surface-variant mb-xs">المتطلبات</h4>
            <div className="space-y-1">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                  <span className="text-sm text-on-surface">{typeof req === 'string' ? req : req.text || req.title || ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks */}
        {tasks.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-on-surface-variant mb-xs">المهام</h4>
            <div className="space-y-1">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-primary">assignment</span>
                  <span className="text-sm text-on-surface">{typeof task === 'string' ? task : task.text || task.title || ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-on-surface-variant mb-xs">المشروعات</h4>
            <div className="space-y-1">
              {projects.map((proj, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-secondary">rocket_launch</span>
                  <span className="text-sm text-on-surface">{typeof proj === 'string' ? proj : proj.text || proj.title || ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-md border-t border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Join Button — student view */}
          {isUpcoming && session.is_join_active && session.join_url && user?.role === 'student' && (
            <Button icon="video_call" onClick={() => window.open(session.join_url, '_blank')} className="bg-success text-white">
              انضم للمحاضرة
            </Button>
          )}
          {/* Join status indicator — trainer/admin view */}
          {isTrainerOrAdmin && isUpcoming && (
            <div className="flex items-center gap-2">
              {session.is_join_active ? (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">الانضمام مفعل</span>
              ) : (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-bold">الانضمام معطل</span>
              )}
            </div>
          )}
        </div>
        {isTrainerOrAdmin && (
          <div className="flex gap-2">
            {isUpcoming && (
              <Button size="sm" variant={session.is_join_active ? 'outlined' : 'primary'} icon={session.is_join_active ? 'link_off' : 'link'} onClick={() => onToggleJoin(session)}>
                {session.is_join_active ? 'تعطيل الانضمام' : 'تفعيل الانضمام'}
              </Button>
            )}
            <Button size="sm" variant="ghost" icon="edit" onClick={() => onEdit(session)}>تعديل</Button>
            {user?.role === 'admin' && (
              <Button size="sm" variant="ghost" icon="delete" className="text-error" onClick={() => onDelete(session)}>حذف</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GroupRoomPage() {
  const { id: groupId } = useParams();
  const { success, error: toastError } = useToast();
  const [group, setGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [nextSession, setNextSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [editSession, setEditSession] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmJoin, setConfirmJoin] = useState(null);

  const loadRoom = useCallback(async () => {
    setLoading(true);
    try {
      const [roomRes, authRes] = await Promise.all([
        fetch(`/api/admin/group-room/${groupId}`),
        fetch('/api/admin/auth'),
      ]);
      if (roomRes.ok) {
        const data = await roomRes.json();
        setGroup(data.group);
        setStudents(data.students || []);
        setTrainers(data.trainers || []);
        setSessions(data.sessions || []);
        setNextSession(data.nextSession || null);
      }
      if (authRes.ok) {
        const authData = await authRes.json();
        setUser(authData.user);
      }
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => { loadRoom(); }, [loadRoom]);

  const handleToggleJoin = async (session) => {
    try {
      const res = await fetch(`/api/admin/group-room/${groupId}/sessions/${session.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_join_active: !session.is_join_active }),
      });
      if (res.ok) {
        loadRoom();
        success(session.is_join_active ? 'تم تعطيل الانضمام' : 'تم تفعيل الانضمام');
      } else {
        toastError('فشل التحديث');
      }
    } catch { toastError('خطأ في الشبكة'); }
  };

  const handleEditSession = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/group-room/${groupId}/sessions/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditSession(null);
        loadRoom();
        success('تم تحديث المحاضرة');
      } else {
        toastError('فشل التحديث');
      }
    } finally { setSaving(false); }
  };

  const handleDeleteSession = async (id) => {
    try {
      const res = await fetch(`/api/admin/group-room/${groupId}/sessions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConfirmDelete(null);
        loadRoom();
        success('تم حذف المحاضرة');
      } else {
        toastError('فشل الحذف');
      }
    } catch { toastError('خطأ في الشبكة'); }
  };

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-md py-lg mb-24">
        <div className="flex items-center justify-center py-lg">
          <span className="material-symbols-outlined text-primary animate-spin text-[40px]">progress_activity</span>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-container-max mx-auto px-md py-lg mb-24">
        <div className="text-center py-lg">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant block mb-sm">group_off</span>
          <p className="text-lg text-on-surface-variant">المجموعة غير موجودة</p>
        </div>
      </div>
    );
  }

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const postponedSessions = sessions.filter(s => s.status === 'postponed');
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled');

  const allSessions = [
    ...upcomingSessions,
    ...postponedSessions,
    ...completedSessions,
    ...cancelledSessions,
  ];

  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div className="max-w-container-max mx-auto px-md py-base lg:py-md mb-24">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
        <div>
          <nav className="flex items-center gap-xs text-on-surface-variant text-sm mb-base">
            <a href="/admin/groups" className="hover:underline cursor-pointer">المجموعات</a>
            <span className="material-symbols-outlined text-xs">chevron_left</span>
            <span className="text-primary font-medium">{group.name}</span>
          </nav>
          <h1 className="font-headline-xl text-headline-xl text-primary flex items-center gap-sm">
            {group.name}
            <span className="bg-secondary-container text-on-secondary-container text-xs px-2 py-1 rounded-full">نشط</span>
          </h1>
        </div>
        <div className="flex gap-base">
          {nextSession && (
            <button className="bg-primary text-on-primary px-md py-sm rounded-lg flex items-center gap-base hover:opacity-90 transition-all shadow-md group">
              <span className="material-symbols-outlined group-hover:animate-pulse">video_call</span>
              <span className="font-label-md text-label-md">دخول القاعة الافتراضية</span>
            </button>
          )}
          <a href="/admin/groups" className="bg-surface-container-lowest text-primary border border-outline-variant px-sm py-sm rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </a>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-lg">
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm flex items-center gap-md">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">group</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-xs">عدد الطلاب</p>
            <p className="font-headline-md text-headline-md text-primary">{students.length}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm flex items-center gap-md">
          <div className="w-12 h-12 rounded-lg bg-secondary-fixed/30 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined">calendar_today</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-xs">الجلسات المتبقية</p>
            <p className="font-headline-md text-headline-md text-primary">{upcomingSessions.length} / {sessions.length}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm flex items-center gap-md">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
            <span className="material-symbols-outlined">analytics</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-xs">متوسط الحضور</p>
            <p className="font-headline-md text-headline-md text-primary">{completedSessions.length > 0 ? Math.round((completedSessions.length / sessions.length) * 100) || 0 : 0}%</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm flex items-center gap-md">
          <div className="w-12 h-12 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined">avg_pace</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-xs">المؤجلة</p>
            <p className="font-headline-md text-headline-md text-primary">{postponedSessions.length}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-outline-variant mb-md flex gap-md">
        <button onClick={() => setActiveTab('schedule')} className={`py-base px-md font-label-md text-label-md transition-all ${activeTab === 'schedule' ? 'tab-active text-primary font-bold' : 'text-on-surface-variant'}`}>
          جدول الجلسات
        </button>
        <button onClick={() => setActiveTab('students')} className={`py-base px-md font-label-md text-label-md transition-all ${activeTab === 'students' ? 'tab-active text-primary font-bold' : 'text-on-surface-variant'}`}>
          قائمة الطلاب
        </button>
        <button onClick={() => setActiveTab('evaluations')} className={`py-base px-md font-label-md text-label-md transition-all ${activeTab === 'evaluations' ? 'tab-active text-primary font-bold' : 'text-on-surface-variant'}`}>
          التقييمات
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'schedule' && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <div className="lg:col-span-2 flex flex-col gap-md">
            <h3 className="font-headline-md text-headline-md text-primary">الجلسات القادمة</h3>
            <div className="flex flex-col gap-base">
              {upcomingSessions.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant p-md text-center rounded-xl">
                  <span className="material-symbols-outlined text-[40px] text-on-surface-variant block mb-xs">event_busy</span>
                  <p className="text-sm text-on-surface-variant">لا توجد جلسات قادمة</p>
                </div>
              ) : upcomingSessions.map(session => (
                <div key={session.id} className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl hover:shadow-md transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-md">
                    <div className="flex flex-col items-center bg-surface-container-high rounded-lg p-base min-w-[60px]">
                      <span className="text-xs text-on-surface-variant">{new Date(session.scheduled_date).toLocaleDateString('ar-EG', { month: 'short' })}</span>
                      <span className="text-lg font-bold text-primary">{new Date(session.scheduled_date).getDate()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-primary">{session.title}</span>
                      <span className="text-xs text-on-surface-variant flex items-center gap-xs">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {new Date(session.scheduled_date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-base">
                    <span className="bg-secondary-fixed/20 text-on-secondary-container text-[10px] px-2 py-1 rounded-full">قادمة</span>
                    <button onClick={() => { setEditForm({ ...session }); setEditSession(session); }} className="text-primary hover:bg-primary/10 p-base rounded-full transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {completedSessions.length > 0 && (
              <>
                <h3 className="font-headline-md text-headline-md text-primary mt-md">الجلسات المسجلة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-base">
                  {completedSessions.slice(0, 4).map(session => (
                    <div key={session.id} className="relative rounded-xl overflow-hidden aspect-video group cursor-pointer border border-outline-variant">
                      <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant text-4xl">play_circle</span>
                      </div>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-4xl">play_circle</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-base bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white text-xs font-bold">{session.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Side Info Panel */}
          <div className="flex flex-col gap-gutter">
            <div className="bg-surface-container-highest/50 p-md rounded-xl border border-outline-variant">
              <h4 className="font-label-md text-label-md text-primary mb-md">معلومات المجموعة</h4>
              <div className="space-y-md">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">المحاضر:</span>
                  <span className="text-xs font-bold text-primary">{group.trainer?.full_name || '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">تاريخ البدء:</span>
                  <span className="text-xs font-bold text-primary">{group.start_date || '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">أيام الدراسة:</span>
                  <span className="text-xs font-bold text-primary">{group.schedule_days || '—'}</span>
                </div>
                <div className="w-full h-px bg-outline-variant" />
                <div className="flex items-center gap-base">
                  <span className="material-symbols-outlined text-primary text-sm">link</span>
                  <span className="text-xs text-primary underline truncate cursor-pointer">رابط خارجي للملفات التعليمية</span>
                </div>
              </div>
            </div>
            <div className="bg-primary-container p-md rounded-xl border border-outline-variant">
              <h4 className="font-label-md text-label-md text-on-primary-fixed mb-sm">تنبيهات هامة</h4>
              <ul className="text-[10px] text-primary-fixed-dim space-y-base list-disc list-inside">
                <li>تسليم التكليف الثالث قبل موعد جلسة الأحد.</li>
                <li>تغيير موعد جلسة الثلاثاء القادم لتبدأ 07:00 مساءً.</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'students' && (
        <section>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            <div className="p-md border-b border-outline-variant flex items-center justify-between gap-md bg-surface-container-low">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute right-3 top-2 text-on-surface-variant text-sm">search</span>
                <input className="w-full pr-10 pl-md py-base bg-surface-bright border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="بحث عن طالب..." type="text" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-surface-container-high border-b border-outline-variant">
                  <tr>
                    <th className="px-md py-sm font-label-md text-xs text-on-surface-variant uppercase">الطالب</th>
                    <th className="px-md py-sm font-label-md text-xs text-on-surface-variant uppercase">الحضور</th>
                    <th className="px-md py-sm font-label-md text-xs text-on-surface-variant uppercase">آخر نشاط</th>
                    <th className="px-md py-sm font-label-md text-xs text-on-surface-variant uppercase text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {students.map(gs => (
                    <tr key={gs.student_id} className="hover:bg-primary-fixed/5 transition-colors">
                      <td className="px-md py-md flex items-center gap-base">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed/20 flex items-center justify-center text-primary text-[10px] font-bold">
                          {(gs.student?.full_name || '—').split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-primary">{gs.student?.full_name || '—'}</span>
                          <span className="text-[10px] text-on-surface-variant">{gs.student?.phone || '—'}</span>
                        </div>
                      </td>
                      <td className="px-md py-md">
                        <div className="flex items-center gap-base">
                          <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${gs.attendance_rate || 0}%` }} />
                          </div>
                          <span className="text-[10px] font-bold">{gs.attendance_rate || 0}%</span>
                        </div>
                      </td>
                      <td className="px-md py-md text-xs text-on-surface">{gs.last_activity || '—'}</td>
                      <td className="px-md py-md text-left">
                        <button className="text-primary hover:text-secondary transition-colors"><span className="material-symbols-outlined text-sm">more_vert</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'evaluations' && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-md">
                <h3 className="font-headline-md text-headline-md text-primary">توزيع الدرجات</h3>
                <span className="material-symbols-outlined text-on-surface-variant">bar_chart</span>
              </div>
              <div className="h-48 bg-surface-container-low rounded-lg flex items-end justify-between px-md pb-md gap-base">
                {[40, 70, 90, 60, 85].map((h, i) => (
                  <div key={i} className={`w-8 rounded-t-sm ${i === 2 ? 'bg-secondary' : 'bg-primary'}`} style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex justify-between mt-sm text-[10px] text-on-surface-variant font-bold">
                <span>ت1</span><span>ت2</span><span>مشروع</span><span>ت3</span><span>ميد</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm">
              <h3 className="font-headline-md text-headline-md text-primary mb-md">أحدث التقييمات</h3>
              <div className="flex flex-col gap-md">
                <div className="flex items-start gap-base">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-primary">تم رصد درجات الاختبار النصفي</p>
                    <p className="text-xs text-on-surface-variant">منذ 3 ساعات</p>
                  </div>
                </div>
                <div className="flex items-start gap-base">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-primary">تقييم الأداء الأسبوعي</p>
                    <p className="text-xs text-on-surface-variant">اليوم 10:00 صباحاً</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Edit Session Drawer */}
      <Drawer isOpen={!!editSession} onClose={() => setEditSession(null)} title="تعديل المحاضرة" size="lg"
        footer={<div className="flex gap-3"><Button onClick={handleEditSession} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setEditSession(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="عنوان المحاضرة" value={editForm.title || ''} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required />
          <Input label="الوصف" value={editForm.description || ''} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} multiline rows={2} />
          <Input label="ملاحظات المدرب" value={editForm.details || ''} onChange={(e) => setEditForm({ ...editForm, details: e.target.value })} multiline rows={2} placeholder="تفاصيل إضافية يضيفها المدرب" />
          <Input label="تاريخ ووقت المحاضرة" type="datetime-local" value={editForm.scheduled_date ? new Date(editForm.scheduled_date).toISOString().slice(0, 16) : ''} onChange={(e) => setEditForm({ ...editForm, scheduled_date: new Date(e.target.value).toISOString() })} />
          <Input label="المدة (دقيقة)" type="number" value={editForm.duration_minutes || 120} onChange={(e) => setEditForm({ ...editForm, duration_minutes: parseInt(e.target.value) || 120 })} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="ساعات نظري" type="number" value={editForm.theoretical_hours || 0} onChange={(e) => setEditForm({ ...editForm, theoretical_hours: parseFloat(e.target.value) || 0 })} />
            <Input label="ساعات عملي" type="number" value={editForm.practical_hours || 0} onChange={(e) => setEditForm({ ...editForm, practical_hours: parseFloat(e.target.value) || 0 })} />
          </div>

          <Input label="رابط الانضمام (Zoom/Meet)" value={editForm.join_url || ''} onChange={(e) => setEditForm({ ...editForm, join_url: e.target.value })} placeholder="https://..." />

          <Select label="الحالة" options={Object.entries(STATUS_MAP).map(([k, v]) => ({ value: k, label: v.label }))} value={editForm.status || 'upcoming'} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} />

          <Input label="المتطلبات (JSON array)" value={typeof editForm.requirements === 'string' ? editForm.requirements : JSON.stringify(editForm.requirements || [], null, 2)} onChange={(e) => { try { setEditForm({ ...editForm, requirements: JSON.parse(e.target.value) }); } catch {} }} multiline rows={3} placeholder='["ميكروويف", "كيس نايلون"]' />

          <Input label="المهام (JSON array)" value={typeof editForm.tasks === 'string' ? editForm.tasks : JSON.stringify(editForm.tasks || [], null, 2)} onChange={(e) => { try { setEditForm({ ...editForm, tasks: JSON.parse(e.target.value) }); } catch {} }} multiline rows={3} placeholder='["حل تمارين الفصل 3", " prepares عرض"]' />

          <Input label="المشروعات (JSON array)" value={typeof editForm.projects === 'string' ? editForm.projects : JSON.stringify(editForm.projects || [], null, 2)} onChange={(e) => { try { setEditForm({ ...editForm, projects: JSON.parse(e.target.value) }); } catch {} }} multiline rows={3} placeholder='["مشروع تخرج - تطبيق ويب"]' />
        </div>
      </Drawer>

      {/* Confirm Delete */}
      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDeleteSession(confirmDelete?.id)} title="حذف المحاضرة" message={`هل أنت متأكد من حذف "${confirmDelete?.title}"؟`} confirmText="حذف" confirmVariant="danger" />
    </div>
  );
}
