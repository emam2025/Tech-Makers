'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Drawer from '../../../../components/ui/Drawer';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useToast } from '../../../../components/ui/Toast';

const PAGE_TYPES = [
  { value: 'page', label: 'صفحة', icon: 'article' },
  { value: 'banner', label: 'بانر', icon: 'web_asset' },
  { value: 'section', label: 'قسم', icon: 'view_agenda' },
  { value: 'slider', label: 'سلايدر', icon: 'view_carousel' },
  { value: 'footer', label: 'الفوتر', icon: 'bottom_panel' },
  { value: 'header', label: 'الهيدر', icon: 'top_panel' },
];

const BLOCK_TYPES = [
  { type: 'hero', label: 'قسم رئيسي', icon: 'web', color: '#005ea1' },
  { type: 'text', label: 'نص', icon: 'text_fields', color: '#666' },
  { type: 'image', label: 'صورة', icon: 'image', color: '#e91e63' },
  { type: 'gallery', label: 'معرض صور', icon: 'grid_view', color: '#9c27b0' },
  { type: 'video', label: 'فيديو', icon: 'play_circle', color: '#f44336' },
  { type: 'features', label: 'مميزات', icon: 'star', color: '#ff9800' },
  { type: 'testimonials', label: 'شهادات', icon: 'format_quote', color: '#4caf50' },
  { type: 'pricing', label: 'قائمة أسعار', icon: 'payments', color: '#2196f3' },
  { type: 'faq', label: 'أسئلة شائعة', icon: 'help', color: '#795548' },
  { type: 'cta', label: 'دعوة للإجراء', icon: 'campaign', color: '#ff5722' },
  { type: 'divider', label: 'فاصل', icon: 'horizontal_rule', color: '#9e9e9e' },
  { type: 'spacer', label: 'مسافة', icon: 'height', color: '#9e9e9e' },
  { type: 'html', label: 'HTML مخصص', icon: 'code', color: '#607d8b' },
];

function createBlock(type) {
  const base = { id: crypto.randomUUID(), type };
  switch (type) {
    case 'hero': return { ...base, title: 'عنوان رئيسي', subtitle: 'نص فرعي', bgImage: '', bgColor: '#005ea1', textColor: '#ffffff', buttonText: '', buttonLink: '', height: 'large' };
    case 'text': return { ...base, content: 'أدخل النص هنا...', alignment: 'right', fontSize: 'base', bgColor: '', textColor: '' };
    case 'image': return { ...base, src: '', alt: 'صورة', caption: '', width: 'full', borderRadius: 'md' };
    case 'gallery': return { ...base, images: [{ id: crypto.randomUUID(), src: '', alt: '' }], columns: 3, gap: 'md' };
    case 'video': return { ...base, url: '', title: 'فيديو', autoplay: false };
    case 'features': return { ...base, title: 'المميزات', items: [{ id: crypto.randomUUID(), icon: 'star', title: 'مميزة', description: 'وصف الميزة' }], columns: 3, bgColor: '' };
    case 'testimonials': return { ...base, title: 'ماذا يقول طلابنا', items: [{ id: crypto.randomUUID(), name: 'اسم الطالب', role: 'طالب', quote: 'تجربة رائعة!', avatar: '' }] };
    case 'pricing': return { ...base, title: 'خطط الاشتراك', items: [{ id: crypto.randomUUID(), name: 'الأساسي', price: '299', period: 'شهرياً', features: ['ميزة 1', 'ميزة 2'], highlighted: false, buttonText: 'اشترك الآن' }] };
    case 'faq': return { ...base, title: 'الأسئلة الشائعة', items: [{ id: crypto.randomUUID(), question: 'السؤال؟', answer: 'الإجابة...' }] };
    case 'cta': return { ...base, title: 'جاهز للبدء؟', description: 'انضم الآن', bgColor: '#005ea1', textColor: '#ffffff', buttonText: 'سجّل الآن', buttonLink: '' };
    case 'divider': return { ...base, style: 'solid', color: '#e0e0e0', thickness: 1, spacing: 'md' };
    case 'spacer': return { ...base, height: 48 };
    case 'html': return { ...base, code: '<div>Custom HTML</div>' };
    default: return base;
  }
}

/* ─── Block Preview Renderer ─── */
function BlockPreview({ block, isEditing, onClick }) {
  if (!block) return null;
  const wrap = (children, label) => (
    <div onClick={onClick} className={`relative group cursor-pointer transition-all ${isEditing ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : 'hover:ring-2 hover:ring-[var(--color-primary)] hover:ring-offset-1'}`}>
      {isEditing && <div className="absolute top-0 left-0 bg-[var(--color-primary)] text-white text-[10px] px-2 py-0.5 rounded-br-md z-10">{label}</div>}
      {children}
    </div>
  );

  switch (block.type) {
    case 'hero':
      return wrap(
        <div className="relative overflow-hidden" style={{ backgroundColor: block.bgColor || '#005ea1', color: block.textColor || '#fff', minHeight: block.height === 'large' ? '320px' : block.height === 'medium' ? '240px' : '160px' }}>
          {block.bgImage && <img src={block.bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />}
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 min-h-[inherit]">
            <h1 className="text-2xl font-bold mb-2">{block.title}</h1>
            <p className="text-sm opacity-80 mb-4">{block.subtitle}</p>
            {block.buttonText && <button className="px-6 py-2 bg-white/20 rounded-lg text-sm font-medium border border-white/30">{block.buttonText}</button>}
          </div>
        </div>, 'قسم رئيسي'
      );
    case 'text':
      return wrap(
        <div className="p-6" style={{ backgroundColor: block.bgColor || undefined, color: block.textColor || undefined, textAlign: block.alignment || 'right' }}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{block.content}</p>
        </div>, 'نص'
      );
    case 'image':
      return wrap(
        <div className="p-4">
          {block.src ? <img src={block.src} alt={block.alt} className={`w-full ${block.borderRadius === 'full' ? 'rounded-full' : block.borderRadius === 'lg' ? 'rounded-lg' : block.borderRadius === 'md' ? 'rounded-md' : ''}`} /> : <div className="w-full h-40 bg-[var(--color-surface-dim)] rounded-lg flex items-center justify-center"><span className="material-symbols-outlined text-[40px] text-[var(--color-text-tertiary)]">image</span></div>}
          {block.caption && <p className="text-xs text-center text-[var(--color-text-tertiary)] mt-2">{block.caption}</p>}
        </div>, 'صورة'
      );
    case 'gallery':
      return wrap(
        <div className="p-4">
          <div className={`grid gap-${block.gap === 'lg' ? '4' : '2'}`} style={{ gridTemplateColumns: `repeat(${block.columns || 3}, 1fr)` }}>
            {(block.images || []).map((img, i) => (
              <div key={img.id || i} className="aspect-square bg-[var(--color-surface-dim)] rounded-lg flex items-center justify-center overflow-hidden">
                {img.src ? <img src={img.src} alt={img.alt} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-[24px] text-[var(--color-text-tertiary)]">image</span>}
              </div>
            ))}
          </div>
        </div>, 'معرض صور'
      );
    case 'video':
      return wrap(
        <div className="p-4">
          {block.url ? (
            <div className="aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
              <iframe src={block.url} className="w-full h-full" allowFullScreen title={block.title} />
            </div>
          ) : (
            <div className="aspect-video bg-[var(--color-surface-dim)] rounded-lg flex items-center justify-center"><span className="material-symbols-outlined text-[48px] text-[var(--color-text-tertiary)]">play_circle</span></div>
          )}
        </div>, 'فيديو'
      );
    case 'features':
      return wrap(
        <div className="p-6" style={{ backgroundColor: block.bgColor || undefined }}>
          {block.title && <h2 className="text-lg font-bold text-center mb-4">{block.title}</h2>}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${block.columns || 3}, 1fr)` }}>
            {(block.items || []).map((item, i) => (
              <div key={item.id || i} className="text-center p-4 rounded-lg bg-[var(--color-surface-dim)]">
                <span className="material-symbols-outlined text-[32px] text-[var(--color-primary)]">{item.icon}</span>
                <h3 className="text-sm font-bold mt-2">{item.title}</h3>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>, 'مميزات'
      );
    case 'testimonials':
      return wrap(
        <div className="p-6">
          {block.title && <h2 className="text-lg font-bold text-center mb-4">{block.title}</h2>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(block.items || []).map((item, i) => (
              <div key={item.id || i} className="p-4 rounded-lg bg-[var(--color-surface-dim)]">
                <p className="text-sm italic mb-3">"{item.quote}"</p>
                <div className="flex items-center gap-3">
                  {item.avatar ? <img src={item.avatar} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center"><span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">person</span></div>}
                  <div><div className="text-sm font-bold">{item.name}</div><div className="text-[10px] text-[var(--color-text-tertiary)]">{item.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>, 'شهادات'
      );
    case 'pricing':
      return wrap(
        <div className="p-6">
          {block.title && <h2 className="text-lg font-bold text-center mb-4">{block.title}</h2>}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min((block.items || []).length, 3)}, 1fr)` }}>
            {(block.items || []).map((item, i) => (
              <div key={item.id || i} className={`p-4 rounded-lg border ${item.highlighted ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-[var(--color-border)] bg-[var(--color-surface)]'}`}>
                <h3 className="text-sm font-bold">{item.name}</h3>
                <div className="text-2xl font-bold my-2">{item.price}<span className="text-xs font-normal opacity-60"> {item.period}</span></div>
                <ul className="space-y-1 mb-4">{(item.features || []).map((f, j) => <li key={j} className="text-xs flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-[var(--color-success)]">check</span>{f}</li>)}</ul>
                <button className={`w-full py-2 rounded text-xs font-medium ${item.highlighted ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-dim)]'}`}>{item.buttonText}</button>
              </div>
            ))}
          </div>
        </div>, 'قائمة أسعار'
      );
    case 'faq':
      return wrap(
        <div className="p-6">
          {block.title && <h2 className="text-lg font-bold text-center mb-4">{block.title}</h2>}
          <div className="space-y-2 max-w-2xl mx-auto">
            {(block.items || []).map((item, i) => (
              <div key={item.id || i} className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                <div className="p-3 bg-[var(--color-surface-dim)] flex items-center justify-between">
                  <span className="text-sm font-medium">{item.question}</span>
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </div>
                <div className="p-3 text-xs text-[var(--color-text-secondary)]">{item.answer}</div>
              </div>
            ))}
          </div>
        </div>, 'أسئلة شائعة'
      );
    case 'cta':
      return wrap(
        <div className="p-8 text-center" style={{ backgroundColor: block.bgColor || '#005ea1', color: block.textColor || '#fff' }}>
          <h2 className="text-xl font-bold mb-2">{block.title}</h2>
          <p className="text-sm opacity-80 mb-4">{block.description}</p>
          {block.buttonText && <button className="px-6 py-2 bg-white/20 rounded-lg text-sm font-medium border border-white/30">{block.buttonText}</button>}
        </div>, 'دعوة للإجراء'
      );
    case 'divider':
      return wrap(<div className="px-4"><hr style={{ borderStyle: block.style || 'solid', borderColor: block.color || '#e0e0e0', borderWidth: `${block.thickness || 1}px` }} /></div>, 'فاصل');
    case 'spacer':
      return wrap(<div style={{ height: `${block.height || 48}px` }} className="flex items-center justify-center"><span className="text-[10px] text-[var(--color-text-tertiary)] opacity-50">{block.height}px</span></div>, 'مسافة');
    case 'html':
      return wrap(<div className="p-4"><div dangerouslySetInnerHTML={{ __html: block.code || '' }} /></div>, 'HTML');
    default:
      return wrap(<div className="p-4 text-sm text-[var(--color-text-tertiary)]">نوع غير معروف: {block.type}</div>, '؟');
  }
}

/* ─── Block Editor Panel ─── */
function BlockEditor({ block, onChange }) {
  if (!block) return <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-tertiary)]"><span className="material-symbols-outlined text-[40px] mb-2">touch_app</span><p className="text-xs">اختر كتلة للتعديل</p></div>;

  const update = (key, val) => onChange({ ...block, [key]: val });
  const updateItem = (idx, key, val) => {
    const items = [...(block.items || [])];
    items[idx] = { ...items[idx], [key]: val };
    onChange({ ...block, items });
  };
  const addItem = (defaults = {}) => onChange({ ...block, items: [...(block.items || []), { id: crypto.randomUUID(), ...defaults }] });
  const removeItem = (idx) => onChange({ ...block, items: (block.items || []).filter((_, i) => i !== idx) });

  const common = (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-[var(--color-text-secondary)] border-b border-[var(--color-border-subtle)] pb-2">التصميم</h4>
        <Input label="خلفية (لون أو URL)" value={block.bgColor || block.bgImage || ''} onChange={(e) => e.target.value.startsWith('http') ? update('bgImage', e.target.value) : update('bgColor', e.target.value)} placeholder="#005ea1 أو https://..." />
      <Input label="لون النص" value={block.textColor || ''} onChange={(e) => update('textColor', e.target.value)} placeholder="#ffffff" />
    </div>
  );

  switch (block.type) {
    case 'hero':
      return (
        <div className="space-y-3">
          <Input label="العنوان" value={block.title} onChange={(e) => update('title', e.target.value)} />
          <Input label="النص الفرعي" value={block.subtitle} onChange={(e) => update('subtitle', e.target.value)} />
          <Input label="نص الزر" value={block.buttonText} onChange={(e) => update('buttonText', e.target.value)} placeholder="CTA..." />
          <Input label="رابط الزر" value={block.buttonLink} onChange={(e) => update('buttonLink', e.target.value)} />
          <Select label="الارتفاع" options={[{ value: 'small', label: 'صغير' }, { value: 'medium', label: 'متوسط' }, { value: 'large', label: 'كبير' }]} value={block.height} onChange={(e) => update('height', e.target.value)} />
          {common}
        </div>
      );
    case 'text':
      return (
        <div className="space-y-3">
          <Input label="المحتوى" value={block.content} onChange={(e) => update('content', e.target.value)} multiline rows={6} />
          <Select label="المحاذاة" options={[{ value: 'right', label: 'يمين' }, { value: 'center', label: 'وسط' }, { value: 'left', label: 'يسار' }]} value={block.alignment} onChange={(e) => update('alignment', e.target.value)} />
          {common}
        </div>
      );
    case 'image':
      return (
        <div className="space-y-3">
          <Input label="رابط الصورة" value={block.src} onChange={(e) => update('src', e.target.value)} placeholder="https://..." />
          <Input label="النص البديل" value={block.alt} onChange={(e) => update('alt', e.target.value)} />
          <Input label="التعليق" value={block.caption} onChange={(e) => update('caption', e.target.value)} />
          <Select label="العرض" options={[{ value: 'full', label: 'كامل' }, { value: 'half', label: 'نصف' }, { value: 'quarter', label: 'ربع' }]} value={block.width} onChange={(e) => update('width', e.target.value)} />
          <Select label="الاستدارة" options={[{ value: 'none', label: 'بلا' }, { value: 'md', label: 'متوسطة' }, { value: 'lg', label: 'كبيرة' }, { value: 'full', label: 'دائري' }]} value={block.borderRadius} onChange={(e) => update('borderRadius', e.target.value)} />
        </div>
      );
    case 'gallery':
      return (
        <div className="space-y-3">
          <Input label="عدد الأعمدة" type="number" min="1" max="6" value={block.columns} onChange={(e) => update('columns', parseInt(e.target.value) || 3)} />
          {(block.images || []).map((img, i) => (
            <div key={img.id} className="flex gap-2 items-end">
              <Input label={`صورة ${i + 1}`} value={img.src} onChange={(e) => updateItem(i, 'src', e.target.value)} placeholder="https://..." className="flex-1" />
              <button onClick={() => removeItem(i)} className="p-2 text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded"><span className="material-symbols-outlined text-[18px]">delete</span></button>
            </div>
          ))}
          <Button size="sm" variant="outlined" icon="add" onClick={() => addItem({ src: '', alt: '' })}>إضافة صورة</Button>
        </div>
      );
    case 'video':
      return (
        <div className="space-y-3">
          <Input label="رابط الفيديو (YouTube/Vimeo embed)" value={block.url} onChange={(e) => update('url', e.target.value)} placeholder="https://www.youtube.com/embed/..." />
          <Input label="العنوان" value={block.title} onChange={(e) => update('title', e.target.value)} />
        </div>
      );
    case 'features':
      return (
        <div className="space-y-3">
          <Input label="العنوان" value={block.title} onChange={(e) => update('title', e.target.value)} />
          <Input label="عدد الأعمدة" type="number" min="1" max="4" value={block.columns} onChange={(e) => update('columns', parseInt(e.target.value) || 3)} />
          {(block.items || []).map((item, i) => (
            <div key={item.id} className="p-3 bg-[var(--color-surface-dim)] rounded-lg space-y-2">
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-[var(--color-text-secondary)]">ميزة {i + 1}</span><button onClick={() => removeItem(i)} className="text-[var(--color-danger)]"><span className="material-symbols-outlined text-[14px]">delete</span></button></div>
              <Input value={item.icon} onChange={(e) => updateItem(i, 'icon', e.target.value)} placeholder="icon name" />
              <Input value={item.title} onChange={(e) => updateItem(i, 'title', e.target.value)} placeholder="العنوان" />
              <Input value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="الوصف" multiline rows={2} />
            </div>
          ))}
          <Button size="sm" variant="outlined" icon="add" onClick={() => addItem({ icon: 'star', title: 'ميزة جديدة', description: '...' })}>إضافة ميزة</Button>
          {common}
        </div>
      );
    case 'testimonials':
      return (
        <div className="space-y-3">
          <Input label="العنوان" value={block.title} onChange={(e) => update('title', e.target.value)} />
          {(block.items || []).map((item, i) => (
            <div key={item.id} className="p-3 bg-[var(--color-surface-dim)] rounded-lg space-y-2">
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-[var(--color-text-secondary)]">شهادة {i + 1}</span><button onClick={() => removeItem(i)} className="text-[var(--color-danger)]"><span className="material-symbols-outlined text-[14px]">delete</span></button></div>
              <Input value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="الاسم" />
              <Input value={item.role} onChange={(e) => updateItem(i, 'role', e.target.value)} placeholder="الدور" />
              <Input value={item.quote} onChange={(e) => updateItem(i, 'quote', e.target.value)} placeholder="الشهادة" multiline rows={2} />
              <Input value={item.avatar} onChange={(e) => updateItem(i, 'avatar', e.target.value)} placeholder="رابط الصورة" />
            </div>
          ))}
          <Button size="sm" variant="outlined" icon="add" onClick={() => addItem({ name: 'طالب', role: 'طالب', quote: '...', avatar: '' })}>إضافة شهادة</Button>
        </div>
      );
    case 'pricing':
      return (
        <div className="space-y-3">
          <Input label="العنوان" value={block.title} onChange={(e) => update('title', e.target.value)} />
          {(block.items || []).map((item, i) => (
            <div key={item.id} className="p-3 bg-[var(--color-surface-dim)] rounded-lg space-y-2">
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-[var(--color-text-secondary)]">باقة {i + 1}</span><button onClick={() => removeItem(i)} className="text-[var(--color-danger)]"><span className="material-symbols-outlined text-[14px]">delete</span></button></div>
              <Input value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="الباقة" />
              <div className="grid grid-cols-2 gap-2"><Input value={item.price} onChange={(e) => updateItem(i, 'price', e.target.value)} placeholder="299" /><Input value={item.period} onChange={(e) => updateItem(i, 'period', e.target.value)} placeholder="شهرياً" /></div>
              <Input value={(item.features || []).join(', ')} onChange={(e) => updateItem(i, 'features', e.target.value.split(',').map(s => s.trim()))} placeholder="ميزة1, ميزة2" />
              <Input value={item.buttonText} onChange={(e) => updateItem(i, 'buttonText', e.target.value)} placeholder="نص الزر" />
              <label className="flex items-center gap-2"><input type="checkbox" checked={item.highlighted} onChange={(e) => updateItem(i, 'highlighted', e.target.checked)} className="w-3 h-3" /><span className="text-xs">مميز</span></label>
            </div>
          ))}
          <Button size="sm" variant="outlined" icon="add" onClick={() => addItem({ name: 'باقة جديدة', price: '0', period: 'شهرياً', features: [], highlighted: false, buttonText: 'اشترك' })}>إضافة باقة</Button>
        </div>
      );
    case 'faq':
      return (
        <div className="space-y-3">
          <Input label="العنوان" value={block.title} onChange={(e) => update('title', e.target.value)} />
          {(block.items || []).map((item, i) => (
            <div key={item.id} className="p-3 bg-[var(--color-surface-dim)] rounded-lg space-y-2">
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-[var(--color-text-secondary)]">سؤال {i + 1}</span><button onClick={() => removeItem(i)} className="text-[var(--color-danger)]"><span className="material-symbols-outlined text-[14px]">delete</span></button></div>
              <Input value={item.question} onChange={(e) => updateItem(i, 'question', e.target.value)} placeholder="السؤال" />
              <Input value={item.answer} onChange={(e) => updateItem(i, 'answer', e.target.value)} placeholder="الإجابة" multiline rows={2} />
            </div>
          ))}
          <Button size="sm" variant="outlined" icon="add" onClick={() => addItem({ question: 'سؤال جديد؟', answer: '...' })}>إضافة سؤال</Button>
        </div>
      );
    case 'cta':
      return (
        <div className="space-y-3">
          <Input label="العنوان" value={block.title} onChange={(e) => update('title', e.target.value)} />
          <Input label="الوصف" value={block.description} onChange={(e) => update('description', e.target.value)} />
          <Input label="نص الزر" value={block.buttonText} onChange={(e) => update('buttonText', e.target.value)} />
          <Input label="رابط الزر" value={block.buttonLink} onChange={(e) => update('buttonLink', e.target.value)} />
          {common}
        </div>
      );
    case 'divider':
      return (
        <div className="space-y-3">
          <Select label="النمط" options={[{ value: 'solid', label: 'خط مستمر' }, { value: 'dashed', label: 'متقطع' }, { value: 'dotted', label: 'نقطي' }]} value={block.style} onChange={(e) => update('style', e.target.value)} />
          <Input label="اللون" value={block.color} onChange={(e) => update('color', e.target.value)} />
          <Input label="السمك (px)" type="number" value={block.thickness} onChange={(e) => update('thickness', parseInt(e.target.value) || 1)} />
        </div>
      );
    case 'spacer':
      return <Input label="الارتفاع (px)" type="number" min="8" max="200" value={block.height} onChange={(e) => update('height', parseInt(e.target.value) || 48)} />;
    case 'html':
      return <Input label="الكود" value={block.code} onChange={(e) => update('code', e.target.value)} multiline rows={8} placeholder="<div>...</div>" />;
    default:
      return null;
  }
}

/* ─── Main Page ─── */
export default function SiteEditorPage() {
  const { success, error: toastError } = useToast();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [drawer, setDrawer] = useState(null);
  const [pageForm, setPageForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [dragIdx, setDragIdx] = useState(null);
  const previewRef = useRef(null);

  const loadPages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType) params.set('type', filterType);
      const res = await fetch(`/api/admin/site-pages?${params}`);
      if (res.ok) { const data = await res.json(); setPages(data.pages || []); }
    } finally { setLoading(false); }
  }, [filterType]);

  useEffect(() => { loadPages(); }, [loadPages]);

  const openPage = (page) => {
    const content = typeof page.content === 'string' ? JSON.parse(page.content || '{}') : (page.content || {});
    setActivePage(page);
    setBlocks(content.blocks || []);
    setSelectedIdx(null);
  };

  const savePage = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activePage.id, content: { blocks } }),
      });
      if (res.ok) { success('تم الحفظ'); loadPages(); }
      else { toastError('فشل الحفظ'); }
    } finally { setSaving(false); }
  };

  const addBlock = (type) => {
    const newBlock = createBlock(type);
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    setSelectedIdx(newBlocks.length - 1);
  };

  const updateBlock = (idx, updated) => {
    const newBlocks = [...blocks];
    newBlocks[idx] = updated;
    setBlocks(newBlocks);
  };

  const removeBlock = (idx) => {
    setBlocks(blocks.filter((_, i) => i !== idx));
    setSelectedIdx(null);
  };

  const moveBlock = (from, to) => {
    if (to < 0 || to >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(from, 1);
    newBlocks.splice(to, 0, moved);
    setBlocks(newBlocks);
    setSelectedIdx(to);
  };

  const handleSaveNewPage = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageForm),
      });
      if (res.ok) { setDrawer(null); loadPages(); success('تم الإنشاء'); }
      else { const data = await res.json(); toastError(data.error || 'حدث خطأ'); }
    } finally { setSaving(false); }
  };

  const handleDeletePage = async (id) => {
    const res = await fetch(`/api/admin/site-pages?id=${id}`, { method: 'DELETE' });
    if (res.ok) { setConfirmDelete(null); if (activePage?.id === id) { setActivePage(null); setBlocks([]); } loadPages(); success('تم الحذف'); }
    else { toastError('فشل الحذف'); }
  };

  /* ─── If no page is selected, show pages list ─── */
  if (!activePage) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div><h1>محرر الموقع</h1><p>إنشاء وتعديل صفحات الموقع بصرياً</p></div>
          <Button icon="add" onClick={() => { setPageForm({ type: 'page', is_active: true, sort_order: 0, content: {}, meta: {} }); setDrawer('newPage'); }}>صفحة جديدة</Button>
        </div>
        <div className="flex gap-3 mb-4">
          <Select options={[{ value: '', label: 'جميع الأنواع' }, ...PAGE_TYPES]} value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full sm:w-48" />
        </div>
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-12"><span className="material-symbols-outlined text-[var(--color-primary)] animate-spin text-[32px]">progress_activity</span></div>
          ) : pages.length === 0 ? (
            <div className="card-admin text-center py-12"><span className="material-symbols-outlined text-[48px] text-[var(--color-text-tertiary)]">web</span><p className="text-sm text-[var(--color-text-tertiary)] mt-2">لا توجد صفحات</p></div>
          ) : pages.map((page) => {
            const typeInfo = PAGE_TYPES.find(t => t.value === page.type) || PAGE_TYPES[0];
            const content = typeof page.content === 'string' ? JSON.parse(page.content || '{}') : (page.content || {});
            const blockCount = (content.blocks || []).length;
            return (
              <div key={page.id} className={`card-admin p-4 ${!page.is_active ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px] text-[var(--color-primary)]">{typeInfo.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--color-text-primary)]">{page.title}</span>
                      <Badge>{typeInfo.label}</Badge>
                      <Badge variant={page.is_active ? 'success' : 'default'}>{page.is_active ? 'نشط' : 'معطل'}</Badge>
                      {blockCount > 0 && <Badge variant="info">{blockCount} كتلة</Badge>}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-[var(--color-text-tertiary)]">/{page.slug}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" icon="edit" onClick={() => openPage(page)}>فتح المحرر</Button>
                    <Button size="sm" variant="ghost" icon="delete" className="text-[var(--color-danger)]" onClick={() => setConfirmDelete(page)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* New Page Drawer */}
        <Drawer isOpen={drawer === 'newPage'} onClose={() => setDrawer(null)} title="صفحة جديدة" size="md"
          footer={<div className="flex gap-3"><Button onClick={handleSaveNewPage} loading={saving}>إنشاء</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
          <div className="space-y-4">
            <Input label="العنوان" value={pageForm.title || ''} onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })} required />
            <Input label="الرابط (slug)" value={pageForm.slug || ''} onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })} placeholder="my-page" required />
            <Select label="النوع" options={PAGE_TYPES} value={pageForm.type || 'page'} onChange={(e) => setPageForm({ ...pageForm, type: e.target.value })} />
            <Input label="الوصف (SEO)" value={pageForm.meta?.description || ''} onChange={(e) => setPageForm({ ...pageForm, meta: { ...pageForm.meta, description: e.target.value } })} />
          </div>
        </Drawer>
        <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDeletePage(confirmDelete?.id)} title="حذف الصفحة" message={`هل أنت متأكد من حذف "${confirmDelete?.title}"؟`} confirmText="حذف" confirmVariant="danger" />
      </div>
    );
  }

  /* ─── Visual Builder View ─── */
  const previewWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };
  const selectedBlock = selectedIdx !== null ? blocks[selectedIdx] : null;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setActivePage(null)} className="p-1.5 rounded hover:bg-[var(--color-surface-dim)]"><span className="material-symbols-outlined text-[20px]">arrow_back</span></button>
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">{activePage.title}</h2>
            <span className="text-[10px] text-[var(--color-text-tertiary)]">/{activePage.slug}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Preview Mode Toggle */}
          <div className="flex bg-[var(--color-surface-dim)] rounded-lg p-0.5">
            {['desktop', 'tablet', 'mobile'].map(mode => (
              <button key={mode} onClick={() => setPreviewMode(mode)} className={`p-1.5 rounded ${previewMode === mode ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-tertiary)]'}`} title={mode}>
                <span className="material-symbols-outlined text-[16px]">{mode === 'desktop' ? 'computer' : mode === 'tablet' ? 'tablet' : 'smartphone'}</span>
              </button>
            ))}
          </div>
          <Button size="sm" icon="save" loading={saving} onClick={savePage}>حفظ</Button>
        </div>
      </div>

      {/* Main Builder: Blocks | Preview | Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Block List */}
        <div className="w-64 border-l border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-[var(--color-border)]">
            <h3 className="text-xs font-bold text-[var(--color-text-secondary)] mb-2">الكتل ({blocks.length})</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {BLOCK_TYPES.map(bt => (
                <button key={bt.type} onClick={() => addBlock(bt.type)} className="flex items-center gap-1.5 p-2 rounded-lg text-[10px] font-medium hover:bg-[var(--color-surface-dim)] transition-colors text-right" title={bt.label}>
                  <span className="material-symbols-outlined text-[16px]" style={{ color: bt.color }}>{bt.icon}</span>
                  <span className="truncate text-[var(--color-text-secondary)]">{bt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-1">
            {blocks.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-text-tertiary)]"><span className="material-symbols-outlined text-[32px] block mb-1">add_box</span><p className="text-[10px]">أضف كتلة للبدء</p></div>
            ) : blocks.map((block, i) => {
              const bt = BLOCK_TYPES.find(b => b.type === block.type);
              return (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => { moveBlock(dragIdx, i); setDragIdx(null); }}
                  onClick={() => setSelectedIdx(i)}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-right transition-all ${selectedIdx === i ? 'bg-[var(--color-primary-light)] ring-1 ring-[var(--color-primary)]' : 'hover:bg-[var(--color-surface-dim)]'}`}
                >
                  <span className="material-symbols-outlined text-[16px] text-[var(--color-text-tertiary)] cursor-grab">drag_indicator</span>
                  <span className="material-symbols-outlined text-[16px]" style={{ color: bt?.color }}>{bt?.icon}</span>
                  <span className="flex-1 text-[11px] font-medium text-[var(--color-text-primary)] truncate">{bt?.label || block.type}</span>
                  <div className="flex gap-0.5">
                    <button onClick={(e) => { e.stopPropagation(); moveBlock(i, i - 1); }} className="p-0.5 hover:bg-[var(--color-surface-dim)] rounded"><span className="material-symbols-outlined text-[12px]">expand_less</span></button>
                    <button onClick={(e) => { e.stopPropagation(); moveBlock(i, i + 1); }} className="p-0.5 hover:bg-[var(--color-surface-dim)] rounded"><span className="material-symbols-outlined text-[12px]">expand_more</span></button>
                    <button onClick={(e) => { e.stopPropagation(); removeBlock(i); }} className="p-0.5 hover:bg-[var(--color-danger-light)] rounded text-[var(--color-danger)]"><span className="material-symbols-outlined text-[12px]">delete</span></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Live Preview */}
        <div className="flex-1 bg-[var(--color-surface-dim)] overflow-auto p-4 flex justify-center" ref={previewRef}>
          <div className="bg-white dark:bg-surface shadow-lg rounded-lg overflow-hidden transition-all" style={{ width: previewWidths[previewMode], maxWidth: '100%' }}>
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-tertiary)]">
                <span className="material-symbols-outlined text-[64px] mb-2">web</span>
                <p className="text-sm">أضف كتلة من اليسار لبدء البناء</p>
              </div>
            ) : blocks.map((block, i) => (
              <div key={block.id} className="border-b border-[var(--color-border-light)] last:border-b-0">
                <BlockPreview block={block} isEditing={selectedIdx === i} onClick={() => setSelectedIdx(i)} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Block Editor */}
        <div className="w-80 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-xs font-bold text-[var(--color-text-secondary)]">{selectedBlock ? `تعديل — ${BLOCK_TYPES.find(b => b.type === selectedBlock.type)?.label || selectedBlock.type}` : 'تعديل الكتلة'}</h3>
            {selectedBlock && (
              <button onClick={() => setSelectedIdx(null)} className="p-1 hover:bg-[var(--color-surface-dim)] rounded"><span className="material-symbols-outlined text-[16px]">close</span></button>
            )}
          </div>
          <div className="flex-1 overflow-auto p-3">
            <BlockEditor block={selectedBlock} onChange={(updated) => updateBlock(selectedIdx, updated)} />
          </div>
        </div>
      </div>
    </div>
  );
}
