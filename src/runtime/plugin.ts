import { defineNuxtPlugin } from 'nuxt/app'
import { notiv } from '../notiv'

export default defineNuxtPlugin(() => {
  return {
    provide: { notiv },
  }
})
