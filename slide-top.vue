<script setup lang="ts">
/**
 * Per-slide overlay layer.
 *
 * Slidev picks `slide-top.vue` up from every root it knows about — the theme's
 * included — and mounts it once per slide, immediately after the slide's own
 * component. That placement is what the footer needs on both counts: it paints
 * above layouts that fill the canvas (`section`, `image-full`), and it lives
 * inside `.slidev-page`, so it scales with the 1920×1080 canvas and lands in
 * every exported PNG / PDF page.
 *
 * A deck can still ship its own `slide-top.vue`; Slidev renders all of them.
 */
import { onMounted, onUnmounted } from 'vue'
import CDFooter from './components/CDFooter.vue'

let copyFallbackUsers = 0

function copyCodeWithoutClipboardApi(event: MouseEvent) {
  if ('clipboard' in navigator)
    return

  const target = event.target
  if (!(target instanceof Element))
    return

  const button = target.closest<HTMLButtonElement>('.slidev-code-copy')
  const code = button?.closest('.slidev-code-wrapper')?.querySelector('.slidev-code')?.textContent
  if (!button || code == null)
    return

  const textarea = document.createElement('textarea')
  textarea.value = code
  textarea.setAttribute('readonly', '')
  textarea.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0;'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()

  if (copied) {
    button.title = 'Copied'
    window.setTimeout(() => {
      if (button.isConnected)
        button.title = 'Copy'
    }, 1500)
  }
}

onMounted(() => {
  if (copyFallbackUsers++ === 0)
    document.addEventListener('click', copyCodeWithoutClipboardApi)
})
onUnmounted(() => {
  if (--copyFallbackUsers === 0)
    document.removeEventListener('click', copyCodeWithoutClipboardApi)
})
</script>

<template>
  <CDFooter />
</template>
