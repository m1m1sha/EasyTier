<script setup lang="ts">
onBeforeMount(async () => {
  await listen()
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
