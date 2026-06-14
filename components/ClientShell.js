'use client';

import dynamic from 'next/dynamic';

const RevealObserverClient = dynamic(() => import('@/components/RevealObserverClient'), { ssr: false });
const PromoPopup = dynamic(() => import('@/components/PromoPopup'), { ssr: false });

export default function ClientShell() {
  return (
    <>
      <RevealObserverClient />
      <PromoPopup />
    </>
  );
}
