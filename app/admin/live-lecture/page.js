'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function LiveLecturePage() {
  const [activeTab, setActiveTab] = useState('chat');
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'سارة أحمد', text: 'هل يمكن إعادة شرح الجزء الخاص بـ الـ Clean Code؟ 🤔', type: 'other' },
    { id: 2, sender: 'النظام', text: 'انضم أحمد للمحاضرة', type: 'system' },
    { id: 3, sender: 'أنت', text: 'نعم سارة، أعتقد أن الدكتور سيتطرق لها في نهاية الجلسة 👍', type: 'me' },
    { id: 4, sender: 'عمر خالد', text: 'المحاضرة رائعة جداً، شكراً لك دكتور!', type: 'other' },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'أنت', text: newMessage, type: 'me' }]);
    setNewMessage('');
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-ibm-plex-arabic" dir="rtl">
      {/* TopAppBar */}
      <header className="bg-primary text-secondary shadow-sm flex justify-between items-center px-6 w-full h-16 sticky top-0 z-50 border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
          <h1 className="text-lg md:text-xl font-bold">AI Academy: خارطة الطريق</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-on-primary-container font-medium">مجموعة البرمجة أ</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-error">مباشر الآن</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-secondary overflow-hidden relative">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpFc8y3y2s_FZsLOB4E54BSsLFbDMFAUMWaW5FOnRzIviYxR8QUv2TGsrY5lO5fSkoWMB8YcblUnKM5Nj4HfmIZbtAPPnRKZ5fWnA1cDQaSVvd2S3-YX3RwfAEyXLNDc58wS748R_qxKLgUIhgr7XRCbGmfgVW7xiewbd-1hAj2rnzyaQovbi61sfru3NJs1-z1AhTrwYlZWia8ECRUQja8JXPJ8zVl_Be5X_S_oB02kPsPNCdTvg3T1qz43nWWBs3LWJFR6Au5zY"
              alt="Instructor"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row max-w-container-max mx-auto w-full lg:p-6 gap-6 mb-16 lg:mb-0">
        {/* Video Player Section */}
        <section className="flex-1 flex flex-col">
          <div className="relative aspect-video bg-black rounded-none lg:rounded-xl overflow-hidden shadow-lg group">
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-tertiary-container">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv-H4KTtTWtjYxfeTvl_gvslq56peZ4PzF-BOKjm0WkGKOFi9N99Uri9nf-OzgFdRAFRVnEkdOASblp_L4XmFhMLicy8P1aqd9OmF0yRqy90YmeywegoQhyZ5ph4Wf1CzOs-9nSPRAJCLSQlh9FRdwkH0UPKxpyuW4yM-y_0uVfDNQYwVge_SNCzswr4XXLa5EQaA213Qk_J9kFpQrgSxNO8DDtyqOhG6pPlr72KdGx6yBmTH3qH67avwJFaQoXzPiOMcf13XdyuE"
                alt="Classroom"
                fill
                className="object-cover opacity-40 blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
              <div className="z-10 text-center text-white px-6">
                <span className="material-symbols-outlined text-6xl mb-4 text-secondary-container">school</span>
                <h2 className="text-2xl font-bold">هندسة البرمجيات المتقدمة</h2>
                <p className="text-sm mt-2">المحاضر: د. أحمد المحمدي</p>
              </div>
            </div>
            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined cursor-pointer hover:text-secondary">play_arrow</span>
                  <span className="material-symbols-outlined cursor-pointer hover:text-secondary">volume_up</span>
                  <span className="text-xs font-mono">24:15 / 1:30:00</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined cursor-pointer hover:text-secondary">settings</span>
                  <span className="material-symbols-outlined cursor-pointer hover:text-secondary">fullscreen</span>
                </div>
              </div>
            </div>
            {/* Floating Interaction Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-3">
              <button className="w-12 h-12 rounded-full bg-secondary text-primary shadow-lg flex items-center justify-center hover:scale-110 transition-transform" title="ارفع يدك">
                <span className="material-symbols-outlined">back_hand</span>
              </button>
              <button className="w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform" title="انضم للصوت">
                <span className="material-symbols-outlined">headset</span>
              </button>
            </div>
          </div>
          {/* Mobile Group Info */}
          <div className="p-4 lg:hidden bg-white dark:bg-surface border-b border-outline-variant">
            <h3 className="text-lg font-bold text-primary">مجموعة البرمجة أ</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-error"></span>
              <span className="text-xs font-bold text-error">بث مباشر الآن</span>
            </div>
          </div>
        </section>

        {/* Interactions Sidebar */}
        <aside className="w-full lg:w-[400px] flex flex-col bg-white dark:bg-surface border-r border-outline-variant lg:rounded-xl shadow-md overflow-hidden h-[600px] lg:h-auto">
          {/* Tabs Header */}
          <div className="flex border-b border-outline-variant bg-surface-container-low">
            {['chat', 'participants', 'resources'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab 
                  ? 'border-secondary text-secondary bg-white dark:bg-surface' 
                  : 'border-transparent text-on-surface-variant hover:bg-surface-container'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'chat' ? 'المحادثة' : tab === 'participants' ? 'المشاركون (42)' : 'المصادر'}
              </button>
            ))}
          </div>

          {/* Tab Content: Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.type === 'me' ? 'items-end' : msg.type === 'system' ? 'items-center' : 'items-start'}`}>
                    {msg.type !== 'system' && (
                      <span className="text-[10px] font-bold text-on-surface-variant mb-1 mx-2">{msg.sender}</span>
                    )}
                    <div className={`${
                      msg.type === 'me' ? 'bg-primary text-white rounded-tr-none' : 
                      msg.type === 'system' ? 'bg-surface-container-low text-on-surface-variant border border-outline-variant text-[10px] font-bold py-1 px-3 rounded-full' :
                      'bg-surface-container-high text-on-surface rounded-tl-none'
                    } p-3 rounded-xl shadow-sm max-w-[85%]`}>
                      <p className="text-xs">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-surface-container-lowest border-t border-outline-variant">
                <div className="flex items-center gap-2 bg-surface-container p-2 rounded-xl">
                  <button type="button" className="p-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">sentiment_satisfied</span>
                  </button>
                  <input 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs" 
                    placeholder="اكتب رسالة..." 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-container transition-colors shadow-sm">
                    <span className="material-symbols-outlined rotate-180">send</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab Content: Participants */}
          {activeTab === 'participants' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 hover:bg-surface-container rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-outline-variant overflow-hidden relative">
                      <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-_X8_R6cCHHVRforYrBUrl80qjsiN3Vval0GhZJfL_Au2oVsp6MmaunNBY7DzKAX47HYZIdONtgb_1P7iOgXIdJADXbh4tjrHzTu-VGK4YVjtR7Uqup2k2vHP51-RSb64i4zvmJraI1BIpwWd7vwtNNGI_FczYHjZg82uV2s9UYT2-5xvDSBAbswcBjywmImj67ShkFYefDcRHyoV9Y5J_qJmFtvlH7N4rL81dyiFiLYRGyjlTmCjZHQKLfDYAth-DivtgCEUQu8" alt="Instructor" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">د. أحمد المحمدي</p>
                      <p className="text-[10px] text-secondary font-bold">محاضر</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
                </div>
                {/* More participants... */}
                <div className="flex items-center justify-between p-2 hover:bg-surface-container rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary font-bold">ل</div>
                    <div>
                      <p className="text-sm font-bold">ليلى مراد</p>
                      <p className="text-[10px] text-on-surface-variant">طالب</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary animate-bounce">back_hand</span>
                    <span className="material-symbols-outlined text-outline">mic_off</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Resources */}
          {activeTab === 'resources' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                <h4 className="text-sm font-bold text-primary mb-3">ملفات الجلسة الحالية</h4>
                <div className="space-y-2">
                  <a className="flex items-center gap-3 p-3 bg-white dark:bg-surface rounded-lg border border-outline-variant hover:border-secondary transition-all" href="#">
                    <span className="material-symbols-outlined text-error">picture_as_pdf</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold">مقدمة في هندسة البرمجيات.pdf</p>
                      <p className="text-[10px] text-on-surface-variant">2.4 MB</p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant">download</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
