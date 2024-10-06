<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { parse, stringify } from 'smol-toml'
import { useForm } from 'vee-validate'
import z from 'zod'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'

const instanceStore = useInstanceStore()
const { currentInstance } = storeToRefs(instanceStore)

const { t } = useI18n()
const formSchema = toTypedSchema(z.object({
  network_name: z.string().max(50),
  network_secret: z.string().max(50).optional(),
  hostname: z.string().max(50).optional(),
  ipv4: z.string().max(50).optional(),
  dhcp: z.boolean().default(true).optional(),
  peers: z.array(z.string()).optional(),
}))

const form = useForm({
  validationSchema: formSchema,
  initialValues: {},
})

const onSubmit = form.handleSubmit((_values) => {
  // console.log('Form submitted!', values)
})

const configStr = computed({
  get() {
    const toml = parse(currentInstance.value!.config.str)
    toml.instance_id = currentInstance.value!.id
    toml.instance_name = currentInstance.value!.name
    return stringify(toml)
  },
  set(value) {
    const toml = parse(value)
    toml.instance_id = currentInstance.value!.id
    currentInstance.value!.name = toml.instance_name.toString()
    currentInstance.value!.config.str = stringify(toml)
  },
})
</script>

<template>
  <div class="flex h-full space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
    <form v-if="false" class="space-y-6" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="network_name">
        <FormItem>
          <FormLabel>{{ t('form.instance.network_name') }}</FormLabel>
          <FormControl>
            <Input type="text" placeholder="NetworkName" v-bind="componentField" />
          </FormControl>
          <FormDescription>
            This is your network group name.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="network_secret">
        <FormItem>
          <FormLabel>{{ t('form.instance.network_secret') }}</FormLabel>
          <FormControl>
            <Input type="text" placeholder="NetworkSecret" v-bind="componentField" />
          </FormControl>
          <FormDescription>
            This is your network group secret.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="ipv4">
        <FormItem>
          <FormLabel>{{ t('form.instance.ipv4') }}</FormLabel>
          <FormControl>
            <Input type="text" placeholder="ipv4" v-bind="componentField" />
          </FormControl>
          <FormDescription>
            This is your network group secret.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="dhcp">
        <FormItem>
          <FormItem class="flex flex-row items-center justify-between rounded-lg border py-2 px-3">
            <div class="space-y-0.5">
              <FormLabel class="text-base">
                {{ t('form.instance.dhcp') }}
              </FormLabel>
              <FormDescription>
                Receive emails about your account activity.
              </FormDescription>
            </div>
            <FormControl>
              <Switch v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormItem>
      </FormField>
      <FormField v-slot="{ value }" name="peers">
        <FormItem>
          <FormItem>
            <FormLabel>
              form.instance.peers
            </FormLabel>
            <FormDescription>
              Receive emails about your account activity.
            </FormDescription>
            <FormControl>
              <TagsInput :model-value="value">
                <TagsInputItem v-for="item in value" :key="item" :value="item">
                  <TagsInputItemText />
                  <TagsInputItemDelete />
                </TagsInputItem>
                <TagsInputInput placeholder="Peers..." />
              </TagsInput>
            </FormControl>
          </FormItem>
        </FormItem>
      </FormField>
      <Button type="submit">
        {{ t('form.instance.submit') }}
      </Button>
    </form>
    <CodeEdit v-if="currentInstance" v-model="configStr" class="flex-1" />
  </div>
</template>

<style scoped lang="postcss">

</style>
