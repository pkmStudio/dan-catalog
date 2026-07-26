<script setup lang="ts">
import type { ProductImage } from '../model'
import { ImageFallback } from '~/shared/ui/image-fallback'

const props = defineProps<{ images: ProductImage[]; productName: string }>()
const selected = ref(0)
const current = computed(() => props.images[selected.value] ?? props.images[0])

watch(
  () => props.images,
  () => {
    selected.value = 0
  }
)
</script>

<template>
  <section class="gallery" aria-label="Изображения товара">
    <ImageFallback
      class="gallery-main"
      :src="current?.src"
      :alt="current?.alt || productName"
      loading="eager"
    />
    <div v-if="images.length > 1" class="thumbnails">
      <button
        v-for="(image, index) in images"
        :key="`${image.src}-${index}`"
        type="button"
        :class="{ active: selected === index }"
        :aria-label="`Показать изображение ${index + 1}`"
        :aria-pressed="selected === index"
        @click="selected = index"
      >
        <ImageFallback :src="image.thumbnailSrc || image.src" alt="" />
      </button>
    </div>
  </section>
</template>
