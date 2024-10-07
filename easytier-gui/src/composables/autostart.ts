import { useToast } from '~/components/ui/toast/use-toast'

export async function checkAutostart() {
  if (isTauri && !platformIsMobile.value) {
    const appStore = useAppStore()
    const instanceStore = useInstanceStore()

    const { autostart } = storeToRefs(appStore)
    const { instances } = storeToRefs(instanceStore)

    try {
      const { enable, isEnabled, disable } = await import('@tauri-apps/plugin-autostart')

      if (autostart.value.start) {
        await enable()
      }
      else {
        await disable()
      }

      autostart.value.start = await isEnabled()
    }
    catch (e: any) {
      const { toast } = useToast()
      console.error('autostart:', e)
      toast({
        title: 'Autostart',
        variant: 'destructive',
        description: e,
      })
    }
    if (await isAutostart() && autostart.value.id) {
      if (instances.value.findIndex(instance => instance.id === autostart.value.id) !== -1) {
        await instanceStore.toggleInstanceStatus(autostart.value.id)
      }
      else {
        autostart.value.id = ''
      }
    }
  }
}
