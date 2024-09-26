<script setup lang="ts">
import type { EditorConfiguration } from 'codemirror'
import type { CmComponentRef } from 'codemirror-editor-vue3'
// import { yaml } from '@codemirror/lang-yaml'
// import { oneDark } from '@codemirror/theme-one-dark'
import CodeMirror from 'codemirror-editor-vue3'
import { parse, stringify } from 'smol-toml'
// import CodeMirror from 'vue-codemirror6'
import 'codemirror/mode/toml/toml.js'
import 'codemirror/theme/ayu-dark.css'
import '~/styles/codeMirror.css'

const props = defineProps<{
  code: string
}>()

// const emits = defineEmits<{
//   update: [code: string]
// }>()

// const t = ref<NodeJS.Timeout | null>()

// const code = computed({
//   get() {
//     return props.code
//   },
//   async set(value) {
//     if (t.value !== null) {
//       clearTimeout(t.value)
//     }
//     t.value = setTimeout(() => {
//       emits('update', value)
//     }, 500)
//   },
// })

const cmRef = ref<CmComponentRef>()
const cmOptions: EditorConfiguration = {
  mode: 'text/x-toml',
  theme: 'easytier-dark',
}

onMounted(() => {
  setTimeout(() => {
    cmRef.value?.refresh()
  }, 100)
})

onUnmounted(() => {
  cmRef.value?.destroy()
})
</script>

<template>
  <CodeMirror ref="cmRef" :value="props.code" :options="cmOptions" class="border rounded-md flex-1" />
  <!-- <CodeMirror
    v-model="code"
    basic
    :lang="yaml()"
    :extensions="[oneDark]"
  /> -->
</template>

<style lang="postcss" scoped></style>
