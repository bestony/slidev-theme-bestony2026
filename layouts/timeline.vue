<script setup lang="ts">
// Timeline — an adaptive horizontal timeline that packs 3-6 items into one or
// two centered rows. Each rail lane keeps the square marker, monospaced time,
// stage title and description together. Solid crimson marks a finished stage;
// an outlined muted marker marks a stage still ahead.
// Frontmatter: title? (or write the heading as markdown `##`), items[].
// Slot: <h2> heading (+ optional lead <p>).
import { computed } from 'vue'
import { useSlideTitle } from '../composables/useSlideTitle'
import { packRows } from '../composables/layoutPacking'

interface TimelineItem {
  time: string
  title: string
  desc?: string
  done?: boolean
}

const props = withDefaults(
  defineProps<{
    title?: string
    /** Slidev reserves `title:` — useSlideTitle reads it back from here. */
    frontmatter?: Record<string, any>
    items?: TimelineItem[]
  }>(),
  {
    items: () => [
      { time: '2025 Q4', title: '立项与架构评审', desc: '确定流式方案与迁移边界', done: true },
      { time: '2026 Q1', title: '首条链路上线', desc: '订单 GMV 双跑两个月', done: true },
      { time: '2026 Q2', title: '语义层与质量规则', desc: '口径收敛，告警接入值班', done: true },
      { time: '2026 Q3', title: '全量迁移收尾', desc: '下线遗留脚本与旧集群', done: false },
    ],
  },
)

const heading = useSlideTitle(props)
const rows = computed(() => packRows(props.items ?? []))

const rowStyle = (row: TimelineItem[]) => ({
  '--cd-timeline-columns': String(row.length),
  '--cd-timeline-width': row.length < 3 ? `${(row.length / 3) * 100}%` : '100%',
}) as Record<string, string>
</script>

<template>
  <div class="slidev-layout cd-timeline">
    <div class="cd-timeline__head">
      <h2 v-if="heading" class="cd-timeline__title">{{ heading }}</h2>
      <slot />
    </div>

    <div v-if="rows.length" class="cd-timeline__track">
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="cd-timeline__row"
        :style="rowStyle(row)"
      >
        <div class="cd-timeline__rail" />
        <div
          v-for="(item, i) in row"
          :key="i"
          class="cd-timeline__node"
          :class="{ 'is-done': item.done }"
        >
          <span class="cd-timeline__dot" />
          <span class="cd-timeline__time">{{ item.time }}</span>
          <span class="cd-timeline__label">{{ item.title }}</span>
          <span v-if="item.desc" class="cd-timeline__desc">{{ item.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cd-timeline {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}

/* ---- heading: markdown `##` slot, or the `title` prop ------------------- */
.cd-timeline__head {
  margin-bottom: 96px;
}
.cd-timeline__title,
.cd-timeline :deep(h1),
.cd-timeline :deep(h2) {
  margin: 0;
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.cd-timeline :deep(p) {
  margin: 24px 0 0;
  font-size: var(--cd-type-body);
  font-weight: 300;
  line-height: 1.6;
  color: var(--cd-muted);
  max-width: 1150px;
}
.cd-timeline :deep(ul) {
  margin: 24px 0 0;
  padding-left: 1.4em;
  font-size: var(--cd-type-body);
  color: var(--cd-muted);
}

/* ---- horizontal track: stacked rows with one rail per row -------------- */
.cd-timeline__track {
  display: flex;
  flex-direction: column;
  gap: 64px;
}
.cd-timeline__row {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--cd-timeline-columns), minmax(0, 1fr));
  gap: 48px;
  width: var(--cd-timeline-width);
  margin: 0 auto;
}
.cd-timeline__rail {
  position: absolute;
  left: 0;
  right: 0;
  top: 9px;
  height: 2px;
  background: linear-gradient(90deg, var(--cd-accent) 0%, var(--cd-accent) 70%, var(--cd-line) 70%);
}
.cd-timeline__node {
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
}

/* ---- node marker: outlined by default, solid crimson once done --------- */
.cd-timeline__dot {
  display: block;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  background: var(--cd-surface-2);
  border: 2px solid var(--cd-line);
}
.cd-timeline__node.is-done .cd-timeline__dot {
  background: var(--cd-accent);
  border: none;
}

/* ---- node text --------------------------------------------------------- */
.cd-timeline__time {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-body);
  color: var(--cd-muted);
}
.cd-timeline__node.is-done .cd-timeline__time {
  color: var(--cd-accent);
}
.cd-timeline__label {
  font-size: var(--cd-type-small);
  line-height: 1.45;
}
.cd-timeline__desc {
  font-size: var(--cd-type-micro);
  line-height: 1.5;
  color: var(--cd-muted);
}
</style>
