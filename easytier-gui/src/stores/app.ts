export const useAppStore = defineStore('appStore', () => {
  const addInstanceDialogVisible = ref(false)
  const addInstanceFromFileDrawerVisible = ref(false)

  const appCloseConfirmDialogVisible = ref(false)

  return {
    addInstanceDialogVisible,
    addInstanceFromFileDrawerVisible,
    appCloseConfirmDialogVisible,

    setAddInstanceDialogVisible(visible: boolean) {
      addInstanceDialogVisible.value = visible
    },
    setAddInstanceFromFileDrawerVisible(visible: boolean) {
      addInstanceFromFileDrawerVisible.value = visible
    },
    hideAllDialog() {
      appCloseConfirmDialogVisible.value = false
      addInstanceDialogVisible.value = false
    },
    setAppCloseConfirmDialogVisible(visible: boolean) {
      appCloseConfirmDialogVisible.value = visible
    },
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
