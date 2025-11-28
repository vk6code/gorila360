<template>
  <transition name="modal-fade" appear>
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-start justify-center pt-20"
      aria-modal="true"
      role="dialog"
      @keydown.tab.prevent="onTabKey"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50"
        @click="onBackdropClick"
      ></div>

      <!-- Modal panel -->
      <div
        ref="panel"
        class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full mx-auto transform transition-all ring-1 ring-black/10"
        @click.stop
        tabindex="-1"
        @keydown.esc.prevent="close"
        aria-labelledby="modal-title"
      >
        <header class="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <h3 id="modal-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h3>
          <button
            type="button"
            @click="close"
            aria-label="Cerrar"
            class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700 dark:text-gray-200" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </header>

        <div class="p-4">
          <slot />
        </div>

        <footer class="p-4 border-t dark:border-gray-800 flex justify-end gap-2">
          <slot name="footer">
            <button type="button" @click="close" class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800">Cerrar</button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' },
  closeOnBackdrop: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'close'])

const panel = ref(null)
let previouslyFocused = null

function close() {
  emit('update:modelValue', false)
  emit('close')
  if (previouslyFocused) previouslyFocused.focus()
}

function onBackdropClick() {
  if (props.closeOnBackdrop) close()
}

// Basic focus management & trapping
function focusFirstFocusable() {
  const focusables = getFocusableElements()
  if (focusables.length) focusables[0].focus()
  else panel.value?.focus()
}

function getFocusableElements() {
  if (!panel.value) return []
  return Array.from(
    panel.value.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  )
}

function onTabKey(e) {
  const focusables = getFocusableElements()
  if (!focusables.length) {
    e.preventDefault()
    return
  }

  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  const active = document.activeElement

  if (e.shiftKey && active === first) {
    last.focus()
    e.preventDefault()
  } else if (!e.shiftKey && active === last) {
    first.focus()
    e.preventDefault()
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    previouslyFocused = document.activeElement
    // wait a frame
    requestAnimationFrame(() => focusFirstFocusable())
  }
})

// cleanup
onBeforeUnmount(() => {
  previouslyFocused = null
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.995);
}
</style>