import { useState, useEffect, useCallback } from 'react'

/* ══════════════════════════════════════
   usePWA — hook untuk fitur PWA
   ⚠️ Service Worker DISABLED untuk debugging
══════════════════════════════════════ */
export default function usePWA() {
  const [isOnline, setIsOnline]               = useState(navigator.onLine)
  const [installPrompt, setInstallPrompt]     = useState(null)
  const [isInstalled, setIsInstalled]         = useState(false)

  // ── DISABLED: Service Worker ──
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    // Unregister semua Service Worker untuk clear cache
    const unregisterAll = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations()
        console.log('[PWA] Found', registrations.length, 'SW registrations')
        for (const registration of registrations) {
          const result = await registration.unregister()
          console.log('[PWA] Unregister SW:', result)
        }
      } catch (e) {
        console.error('[PWA] Unregister error:', e)
      }
    }
    unregisterAll()
  }, [])

  // ── Deteksi Install Prompt ──
  useEffect(() => {
    const handlePrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handlePrompt)
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt)
  }, [])

  // ── Deteksi sudah terinstall ──
  useEffect(() => {
    const handleInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }
    window.addEventListener('appinstalled', handleInstalled)

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    return () => window.removeEventListener('appinstalled', handleInstalled)
  }, [])

  // ── Monitor Status Online / Offline ──
  useEffect(() => {
    const goOnline  = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online',  goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online',  goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // ── Trigger Install ──
  const triggerInstall = useCallback(async () => {
    if (!installPrompt) return false
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
      return true
    }
    return false
  }, [installPrompt])

  // ── Apply Update ──
  const applyUpdate = useCallback(() => {
    window.location.reload()
  }, [])

  return {
    isOnline,
    isInstalled,
    canInstall:     !!installPrompt && !isInstalled,
    updateAvailable: false,
    triggerInstall,
    applyUpdate,
  }
}