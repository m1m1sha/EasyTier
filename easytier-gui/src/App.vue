<script setup lang="ts">
import { useToast } from '~/components/ui/toast/use-toast'

const { toast } = useToast()
const { t } = useI18n()
onBeforeMount(async () => {
  await listen()
  try {
    await checkAutostart()
  }
  catch (e) {
    toast({
      title: t('toast.error.operateInstance'),
      variant: 'destructive',
      description: h('div', { class: 'whitespace-pre-wrap', innerHTML: e }),
    })
  }
})

onUnmounted(async () => {
  await unlisten()
})
</script>

<template>
  <TooltipProvider :delay-duration="150">
    <div vaul-drawer-wrapper class="h-full">
      <RouterView />
    </div>
  </TooltipProvider>
  <Toaster />
  <DialogList />
  <DrawerList />
</template>
