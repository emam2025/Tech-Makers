'use client'

import { useState } from 'react'

const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwil60umtWD1EXqdw7S6MycmHKSgzBGHWwrGw-sKdVFXGF1yfqpWM5KBqnyOUp6rDk/exec'
const WHATSAPP_NUMBER = '201062540164'
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
]

export default function CertificatePage() {
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [selectedCert, setSelectedCert] = useState(null)
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [whatsappForm, setWhatsappForm] = useState({ name: '', code: '20', number: '', reason: '', otherReason: '' })

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    return `${months[d.getMonth()]} ${d.getFullYear()}`
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    const input = searchInput.trim()
    if (!input) return

    setLoading(true)
    setError(null)
    setResult(null)
    setSelectedCert(null)

    let searchType = input.length > 10 ? 'SN' : 'ID'
    if (input.includes(' ')) searchType = 'SN'

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)
      const res = await fetch(`${API_ENDPOINT}?search=${encodeURIComponent(input)}&type=${searchType}`, { signal: controller.signal })
      clearTimeout(timeoutId)
      if (!res.ok) throw new Error('HTTP error ' + res.status)
      const data = await res.json()
      if (!data.success) {
        setError('لم يتم العثور على شهادات للبيانات المدخلة')
        return
      }
      setResult(data)
    } catch (err) {
      if (err.name === 'AbortError') setError('انتهت مهلة الاتصال، حاول مرة أخرى')
      else setError('حدث خطأ في الاتصال، تحقق من اتصالك بالإنترنت وحاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  const openCert = (cert) => {
    let fileId = ''
    const match = cert.pdfUrl?.match(/id=([a-zA-Z0-9_-]+)/)
    if (match) fileId = match[1]
    setSelectedCert({ ...cert, fileId })
  }

  const getDownloadUrl = () => {
    if (!selectedCert) return '#'
    const match = selectedCert.pdfUrl?.match(/id=([a-zA-Z0-9_-]+)/)
    if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`
    return selectedCert.pdfUrl
  }

  const getShareUrl = () => {
    if (!selectedCert) return ''
    const match = selectedCert.pdfUrl?.match(/id=([a-zA-Z0-9_-]+)/)
    if (match) return `https://drive.google.com/file/d/${match[1]}/view`
    return selectedCert.pdfUrl
  }

  const shareCert = () => {
    const url = getShareUrl()
    if (navigator.share) {
      navigator.share({ title: `شهادة ${selectedCert.program}`, url })
    } else {
      navigator.clipboard.writeText(url)
      alert('تم نسخ رابط الشهادة')
    }
  }

  const startWhatsApp = (e) => {
    e.preventDefault()
    const { name, code, number, reason, otherReason } = whatsappForm
    if (!name || !code || !number || !reason) { alert('يرجى تعبئة جميع الحقول المطلوبة'); return }
    const reasonText = reason === 'اخرى' ? otherReason : reason
    if (reason === 'اخرى' && !otherReason.trim()) { alert('يرجى كتابة سبب التواصل'); return }
    const msg = `مرحبا أنا ${name}%0Aرقم الواتس الخاص بي هو: +${code}${number}%0Aأحتاج إلى ${reasonText}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
    setShowWhatsAppModal(false)
  }

  return (
    <>
      <section className="relative py-16 md:py-24 px-margin-mobile md:px-margin-desktop text-center flex flex-col items-center overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-secondary-container rounded-full mb-6 shadow-lg">
            <span className="material-symbols-outlined text-on-secondary-container text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-primary mb-4">تحقق من شهادتك المعتمدة</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            ادخل الرقم القومي للطالب أو الرقم التسلسلي للشهادة
          </p>
        </div>
      </section>

      <section className="pb-24 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-4xl mx-auto">
          {/* SEARCH FORM */}
          <div className="bg-white p-8 md:p-12 rounded-32 shadow-card mb-10">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label htmlFor="search-input" className="block font-label-md text-label-md text-primary mb-2">
                  الرقم القومي للطالب او الرقم التسلسلي للشهادة
                </label>
                <input
                  id="search-input"
                  type="text"
                  className="w-full bg-bg-off-white border-2 border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-5 py-4 font-body-md text-body-md text-on-surface transition-all"
                  placeholder="اكتب الرقم هنا..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value.replace(/\D/g, '').slice(0, 14))}
                  maxLength={14}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary-light to-primary text-on-primary rounded-full font-headline-lg text-headline-lg shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined align-middle ml-2">search</span>
                {loading ? 'جارٍ البحث...' : 'تحقق الآن'}
              </button>
            </form>

            {loading && (
              <div className="flex items-center justify-center gap-3 mt-8 text-on-surface-variant">
                <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                جارٍ التحميل...
              </div>
            )}

            {error && (
              <div className="mt-8 p-4 bg-red-50 border-r-4 border-red-500 rounded-xl text-red-700 font-body-md text-body-md flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500">error</span>
                {error}
              </div>
            )}
          </div>

          {/* RESULT */}
          {result && (
            <div className="bg-white p-8 md:p-12 rounded-32 shadow-card">
              <div className="mb-8 p-6 bg-surface-container-low rounded-2xl border-r-4 border-primary">
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md text-on-surface-variant">بيانات الطالب ::</span>
                  <span className="font-headline-lg text-headline-lg text-primary">{result.student.name}</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-outline-variant/20">
                  <span className="font-label-md text-label-md text-on-surface-variant">الرقم القومي:</span>
                  <span className="font-body-md text-body-md font-mono tracking-wider">{result.student.encryptedID}</span>
                </div>
              </div>

              <h3 className="font-headline-lg text-headline-lg text-primary mb-6">بيانات الشهادات :: لقد حصل الطالب على شهادات:</h3>

              <div className="grid gap-4">
                {result.certificates.map((cert, i) => (
                  <div
                    key={i}
                    className="bg-white border-2 border-outline-variant/20 rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => openCert(cert)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-headline-lg text-headline-lg text-primary mb-1">{i + 1}. {cert.program}</div>
                        <div className="font-body-md text-body-md text-on-surface-variant">SN: {cert.sn}{cert.mk || ''}</div>
                        <div className="font-body-md text-body-md text-on-surface-variant">{formatDate(cert.date)}</div>
                      </div>
                      <div className="text-on-surface-variant/40 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-3xl">chevron_left</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WHATSAPP SUPPORT */}
          <div className="text-center mt-12">
            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="inline-flex items-center gap-3 bg-gradient-to-l from-[#25D366] to-[#128C7E] text-white px-8 py-4 rounded-full font-headline-lg text-headline-lg shadow-lg hover:shadow-[#25D366]/30 hover:scale-105 transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              تواصل مع خدمة العملاء
            </button>
          </div>
        </div>
      </section>

      {/* CERTIFICATE MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedCert(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col" style={{ height: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 bg-primary text-on-primary rounded-t-2xl shrink-0">
              <h2 className="font-headline-lg text-headline-lg">شهادة: {selectedCert.program}</h2>
              <button onClick={() => setSelectedCert(null)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>
            <div className="flex-1 min-h-0">
              {selectedCert.fileId ? (
                <iframe
                  src={`https://drive.google.com/file/d/${selectedCert.fileId}/preview`}
                  className="w-full h-full border-0"
                  allow="autoplay"
                  title={`شهادة ${selectedCert.program}`}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-center text-on-surface-variant py-12">
                  <div>
                    <span className="material-symbols-outlined text-7xl mb-4">description</span>
                    <p className="font-body-lg">لا يمكن تحميل الشهادة</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-3 px-6 py-4 bg-gray-100 rounded-b-2xl shrink-0 border-t">
              <button onClick={() => setSelectedCert(null)} className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition-all">
                <span className="material-symbols-outlined">close</span>
                إغلاق
              </button>
              <a href={getDownloadUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-success text-white rounded-full font-bold hover:opacity-90 transition-all no-underline">
                <span className="material-symbols-outlined">download</span>
                تحميل PDF
              </a>
              <button onClick={shareCert} className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:opacity-90 transition-all">
                <span className="material-symbols-outlined">share</span>
                مشاركة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP MODAL */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowWhatsAppModal(false)}>
          <div className="bg-[#dcf8c6] rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} style={{ direction: 'rtl' }}>
            <div className="bg-[#075e54] text-white px-6 py-4 rounded-t-3xl flex items-center justify-between">
              <h2 className="font-headline-lg text-headline-lg">سعداء بتواصلك مع خدمة العملاء</h2>
              <button onClick={() => setShowWhatsAppModal(false)} className="p-1 hover:bg-white/20 rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={startWhatsApp} className="space-y-4">
                <input
                  type="text"
                  placeholder="الاسم بالكامل"
                  className="w-full px-4 py-3 rounded-xl border-0 shadow-sm font-body-md"
                  value={whatsappForm.name}
                  onChange={(e) => setWhatsappForm({ ...whatsappForm, name: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <select
                    className="w-32 px-3 py-3 rounded-xl border-0 shadow-sm font-body-md bg-white"
                    value={whatsappForm.code}
                    onChange={(e) => setWhatsappForm({ ...whatsappForm, code: e.target.value })}
                  >
                    {COUNTRY_CODES.map((c, i) => (
                      <option key={i} value={c.code.replace('+', '')}>{c.code}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="رقم الواتساب"
                    className="flex-1 px-4 py-3 rounded-xl border-0 shadow-sm font-body-md"
                    value={whatsappForm.number}
                    onChange={(e) => setWhatsappForm({ ...whatsappForm, number: e.target.value.replace(/\D/g, '') })}
                    required
                  />
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-[#075e54] mb-2">أخبرنا كيف يمكننا مساعدتك</h4>
                  <select
                    className="w-full px-4 py-3 rounded-xl border-0 shadow-sm font-body-md bg-white"
                    value={whatsappForm.reason}
                    onChange={(e) => setWhatsappForm({ ...whatsappForm, reason: e.target.value })}
                    required
                  >
                    <option value="">-- اختر سبب التواصل --</option>
                    <option value="اسم الطالب بالشهادة غير صحيح">اسم الطالب بالشهادة غير صحيح</option>
                    <option value="لم تظهر شهادة الطالب">لم تظهر شهادة الطالب</option>
                    <option value="تريد التسجيل ببرنامج دراسى">تريد التسجيل ببرنامج دراسى</option>
                    <option value="اخرى">أخرى</option>
                  </select>
                  {whatsappForm.reason === 'اخرى' && (
                    <textarea
                      placeholder="اكتب استفسارك بالتفصيل..."
                      className="w-full mt-3 px-4 py-3 rounded-xl border-0 shadow-sm font-body-md"
                      rows={3}
                      value={whatsappForm.otherReason}
                      onChange={(e) => setWhatsappForm({ ...whatsappForm, otherReason: e.target.value })}
                    />
                  )}
                </div>
                <button type="submit" className="w-full py-4 bg-[#075e54] text-white rounded-full font-headline-lg hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  ابدأ المحادثة
                </button>
                <p className="text-xs text-gray-500 text-center">(بالضغط على 'ابدأ المحادثة'، سيتم توجيهك إلى تطبيق الواتساب.)</p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
