<script setup lang="ts">
import { configBaseConfig, configBaseSchema } from '~/composables/config'
</script>

<template>
  <AutoForm class="space-y-4" :schema="configBaseSchema" :field-config="configBaseConfig" />
</template>

<style scoped lang="postcss">

</style>
