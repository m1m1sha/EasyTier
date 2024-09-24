export async function tauriCloseWindow() {
  const { exit } = await import('@tauri-apps/plugin-process')
  await exit()
}
