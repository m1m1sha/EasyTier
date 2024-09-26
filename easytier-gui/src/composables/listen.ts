const unlistenArr: any[] = []
export async function listen() {
  if (isTauri) {
    unlistenArr.push(await listenDragDrop())
    unlistenArr.push(await listenCloseRequest())
  }
}

export async function unlisten() {
  if (isTauri)
    unlistenArr.forEach(unlisten => unlisten())
}

async function listenDragDrop() {
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  const appWindow = getCurrentWindow()
  const appStore = useAppStore()
  const fileUnlisten = await appWindow.onDragDropEvent((event) => {
    switch (event.event) {
      case 'tauri://drag-enter':
        if (event.payload.type === 'enter' && event.payload.paths.length > 0) {
          appStore.hideAllDialog()
          appStore.setAddInstanceFromFileDrawerVisible(true)
        }
        break
      case 'tauri://drag-leave':
        appStore.setAddInstanceFromFileDrawerVisible(false)
        break
      case 'tauri://drag-drop':
        if (event.payload.type === 'drop' && event.payload.paths.length > 0) {
          appStore.setAddInstanceFromFileDrawerVisible(false)
          appStore.setAddInstanceDialogVisible(true)
        }
        break
      default:
        break
    }
  })
  return fileUnlisten
}

async function listenCloseRequest() {
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  const appWindow = getCurrentWindow()
  const appStore = useAppStore()
  const unlisten = await appWindow.listen<null>('easytier-gui://close', () => {
    appStore.setAppCloseConfirmDialogVisible(true)
  })
  return unlisten
}
