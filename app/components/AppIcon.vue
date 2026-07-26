<script setup lang="ts">const props = defineProps<{ name: string }>();
const symbols: Record<string, string> = {
  'circle-stop': '◉',
  waypoints: '⌁',
  nut: '⬡',
  'move-vertical': '↕',
  'refresh-cw': '↻',
  link: 'ↄ',
  'circle-dot': '⊙',
  settings: '⚙',
  box: '◇',
  snowflake: '❄',
  fuel: '▣',
  zap: 'ϟ',
  'battery-charging': '▤',
  gauge: '◴',
  lightbulb: '♧',
  wind: '≋'
};
const symbol = computed(() => symbols[props.name] || '•')</script>
<template><span class="app-icon" aria-hidden="true">{{ symbol }}</span></template>
