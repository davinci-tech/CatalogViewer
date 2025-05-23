// Registers the service worker for PWA support on the client
'use client';
import { useEffect } from 'react';
import { registerServiceWorker } from './register-sw';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);
  return null;
}
