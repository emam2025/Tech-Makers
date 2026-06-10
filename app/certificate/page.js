'use client'

import { useState } from 'react'
import Link from 'next/link'

const certificates = {
  '10000000000000': {
    name: 'Tala Nasser Abdelfatah',
    course: 'Level One - Junior Tech Explorers',
    number: '400179 AU',
    date: '2026',
    level: 'Distinction'
  },
  '10000000000001': {
    name: 'Ahmed Mohamed Foudad',
    course: 'Level One - Junior Tech Explorers',
    number: '400122 AU',
    date: '2026',
    level: 'Distinction'
  },
  '10000000000002': {
    name: 'Seif Hesham Mohamed',
    course: 'Level One - Junior Tech Explorers',
    number: '400126 AU',
    date: '2026',
    level: 'Distinction'
  }
}

export default function CertificatePage() {
  const [activeTab, setActiveTab] = useState('view')
  const [nationalId, setNationalId] = useState('')
  const [certData, setCertData] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [verifyNumber, setVerifyNumber] = useState('')
  const [verifyResult, setVerifyResult] = useState(null)

  const handleViewSubmit = (e) => {
    e.preventDefault()
    const cert = certificates[nationalId]
    if (cert) {
      setCertData(cert)
      setShowPreview(true)
    } else {
      alert('لم يتم العثور على شهادة لهذا الرقم القومي. يرجى التحقق من الرقم والمحاولة مرة أخرى.')
    }
  }

  const handleVerifySubmit = (e) => {
    e.preventDefault()
    const trimmedNumber = verifyNumber.trim()
    const cert = Object.values(certificates).find(c => c.number === trimmedNumber)

    if (cert) {
      setVerifyResult({
        type: 'success',
        title: 'شهادة صحيحة وموثقة',
        message: 'هذه الشهادة صادرة من Tech Makers Egypt وهي شهادة أصلية وموثقة.',
        details: cert
      })
    } else {
      setVerifyResult({
        type: 'error',
        title: 'شهادة غير موجودة',
        message: 'لم يتم العثور على شهادة بهذا الرقم. يرجى التحقق من الرقم والمحاولة مرة أخرى.',
        details: null
      })
    }
  }

  const downloadCert = () => {
    alert('جاري تحميل الشهادة... (في التطبيق الحقيقي سيتم تحميل ملف PDF)')
  }

  return (
    <>
      {/* CERTIFICATE HERO */}
      <section className="cert-hero">
        <div className="container">
          <span className="section-eyebrow">التحقق من الشهادة</span>
          <h1 className="cert-hero-title">تحقق من صحة شهادتك</h1>
          <p className="cert-hero-sub">يمكنك عرض وتحميل شهادتك أو التحقق من صحتها باستخدام الرقم القومي أو رقم الشهادة</p>
        </div>
      </section>

      {/* CERTIFICATE TABS */}
      <section className="cert-section">
        <div className="container">

          {/* TABS */}
          <div className="cert-tabs">
            <button
              className={`cert-tab${activeTab === 'view' ? ' active' : ''}`}
              onClick={() => setActiveTab('view')}
            >
              📜 عرض الشهادة
            </button>
            <button
              className={`cert-tab${activeTab === 'verify' ? ' active' : ''}`}
              onClick={() => setActiveTab('verify')}
            >
              🔍 التحقق من الشهادة
            </button>
          </div>

          {/* VIEW TAB */}
          <div className={`cert-panel${activeTab === 'view' ? ' active' : ''}`}>
            <div className="cert-form-card">
              <div className="cert-form-header">
                <h3>عرض وتحميل الشهادة</h3>
                <p>أدخل الرقم القومي للطالب لعرض شهادته وتحميلها</p>
              </div>
              <form className="cert-form" onSubmit={handleViewSubmit}>
                <div className="cert-input-group">
                  <label htmlFor="view-national-id">الرقم القومي *</label>
                  <input
                    type="text"
                    id="view-national-id"
                    placeholder="أدخل الرقم القومي (14 رقم)"
                    maxLength="14"
                    required
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                  />
                </div>
                <button type="submit" className="cert-submit">عرض الشهادة</button>
              </form>
            </div>

            {/* Certificate Preview */}
            <div className="cert-preview" style={{ display: showPreview ? 'block' : 'none' }}>
              <div className="certificate">
                <div className="cert-border">
                  <div className="cert-logo">
                    <img src="logo.png" alt="Tech Makers" />
                  </div>
                  <div className="cert-title">شهادة إتمام</div>
                  <div className="cert-subtitle">Certificate of Completion</div>
                  <div className="cert-line"></div>
                  <div className="cert-text">تشهد Tech Makers Egypt بأن</div>
                  <div className="cert-student-name">{certData?.name || 'اسم الطالب'}</div>
                  <div className="cert-text">لقد أتم بنجاح</div>
                  <div className="cert-course">{certData?.course || 'المسار التعليمي'}</div>
                  <div className="cert-details">
                    <div className="cert-detail">
                      <span className="cert-label">رقم الشهادة:</span>
                      <span className="cert-value">{certData?.number || 'XXXXX'}</span>
                    </div>
                    <div className="cert-detail">
                      <span className="cert-label">التاريخ:</span>
                      <span className="cert-value">{certData?.date || '2026'}</span>
                    </div>
                  </div>
                  <div className="cert-signatures">
                    <div className="cert-signature">
                      <div className="sig-line"></div>
                      <span>المدير التعليمي</span>
                    </div>
                    <div className="cert-signature">
                      <div className="sig-line"></div>
                      <span>م/ إمام عبد العزيز</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cert-actions">
                <button className="cert-download-btn" onClick={downloadCert}>📥 تحميل الشهادة</button>
                <button className="cert-print-btn" onClick={() => window.print()}>🖨️ طباعة</button>
              </div>
            </div>
          </div>

          {/* VERIFY TAB */}
          <div className={`cert-panel${activeTab === 'verify' ? ' active' : ''}`}>
            <div className="cert-form-card">
              <div className="cert-form-header">
                <h3>التحقق من صحة الشهادة</h3>
                <p>أدخل رقم الشهادة للتحقق من صحتها وسلامتها</p>
              </div>
              <form className="cert-form" onSubmit={handleVerifySubmit}>
                <div className="cert-input-group">
                  <label htmlFor="verify-cert-number">رقم الشهادة *</label>
                  <input
                    type="text"
                    id="verify-cert-number"
                    placeholder="أدخل رقم الشهادة (مثلاً: 400179 AU)"
                    required
                    value={verifyNumber}
                    onChange={(e) => setVerifyNumber(e.target.value)}
                  />
                </div>
                <button type="submit" className="cert-submit">التحقق من الشهادة</button>
              </form>
            </div>

            {/* Verify Result */}
            <div className="verify-result" style={{ display: verifyResult ? 'block' : 'none' }}>
              <div className={`verify-card ${verifyResult?.type === 'success' ? 'verify-success' : 'verify-error'}`}>
                <div className="verify-icon">
                  {verifyResult?.type === 'success' ? '✅' : '❌'}
                </div>
                <h3>{verifyResult?.title}</h3>
                <p>{verifyResult?.message}</p>
                {verifyResult?.details && (
                  <div className="verify-details">
                    <div className="verify-detail-item">
                      <span>اسم الطالب:</span>
                      <strong>{verifyResult.details.name}</strong>
                    </div>
                    <div className="verify-detail-item">
                      <span>المسار:</span>
                      <strong>{verifyResult.details.course}</strong>
                    </div>
                    <div className="verify-detail-item">
                      <span>التقدير:</span>
                      <strong>{verifyResult.details.level}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
