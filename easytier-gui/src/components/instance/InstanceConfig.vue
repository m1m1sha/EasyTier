<script setup lang="ts">
import { DEFAULT_CONFIG_SCHEMA } from '~/composables/config'
</script>

<template>
  <AutoForm class="space-y-4" :schema="DEFAULT_CONFIG_SCHEMA" :field-config="DEFAULT_FIELD_CONFIG" />
</template>

<style scoped lang="postcss">

</style>
