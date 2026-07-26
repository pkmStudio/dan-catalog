<script setup lang="ts">
import {
  BatteryCharging,
  Box,
  CircleDot,
  CircleStop,
  Fuel,
  Gauge,
  Lightbulb,
  Link,
  MoveVertical,
  Nut,
  RefreshCw,
  Settings,
  Snowflake,
  Waypoints,
  Wind,
  Zap
} from '@lucide/vue'
import type { Component } from 'vue'

const props = defineProps<{ name: string }>()
const icons: Record<string, Component> = {
  'circle-stop': CircleStop,
  waypoints: Waypoints,
  nut: Nut,
  'move-vertical': MoveVertical,
  'refresh-cw': RefreshCw,
  link: Link,
  'circle-dot': CircleDot,
  settings: Settings,
  box: Box,
  snowflake: Snowflake,
  fuel: Fuel,
  zap: Zap,
  'battery-charging': BatteryCharging,
  gauge: Gauge,
  lightbulb: Lightbulb,
  wind: Wind
}
const icon = computed(() => icons[props.name] ?? CircleDot)
</script>
<template>
  <component :is="icon" class="app-icon" :size="24" :stroke-width="1.8" aria-hidden="true" />
</template>
