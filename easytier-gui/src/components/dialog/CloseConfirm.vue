<script setup lang="ts">
const { t } = useI18n()

const appStore = useAppStore()
const { appCloseConfirmDialogVisible } = storeToRefs(appStore)
</script>

<template>
  <AlertDialog v-model:open="appCloseConfirmDialogVisible">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ t('component.dialogList.appCloseConfirm.title') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ t('component.dialogList.appCloseConfirm.content') }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="tauriCloseWindow()">
          {{ t('component.dialogList.appCloseConfirm.confirm') }}
        </AlertDialogCancel>
        <AlertDialogAction>{{ t('component.dialogList.appCloseConfirm.cancel') }}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped lang="postcss"></style>
