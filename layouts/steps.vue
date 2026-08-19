<script setup lang="ts">
// Steps — an adaptive band of process cards that packs 3-6 items into one or
// two rows. Each card stacks a lucide icon, a monospaced step label, a title
// and an optional description on a surface panel. Structured card data is a
// frontmatter array; the slide title comes from the `title` prop or a markdown
// <h2> in the default slot (choose one).
// Frontmatter: title, items[]. Default slot: <h2> title.
import { computed } from 'vue'
import { useSlideTitle } from '../composables/useSlideTitle'
import { packRows } from '../composables/layoutPacking'

interface StepItem {
  /** lucide icon name, e.g. "git-branch" → renders <div class="i-lucide-git-branch"> */
  icon: string
  /** monospaced accent label, e.g. "Step 01" */
  step: string
  /** card title (subtitle size, medium weight) */
  title: string
  /** optional supporting line (micro, muted) */
  desc?: string
}

const props = withDefaults(
  defineProps<{
    title?: string
    /** Slidev reserves `title:` — useSlideTitle reads it back from here. */
    frontmatter?: Record<string, any>
    items: StepItem[]
  }>(),
  {
    // Sensible fallback so a bare `layout: steps` still renders a full demo.
    items: () => [
      { icon: 'git-branch', step: 'Step 01', title: '提交指标定义', desc: '在仓库里新增一个 yml，走常规 Code Review' },
      { icon: 'shield-check', step: 'Step 02', title: '流水线校验', desc: '自动跑口径测试与血缘影响分析' },
      { icon: 'line-chart', step: 'Step 03', title: '看板直接引用', desc: 'BI 侧无需重复建模，指标全局唯一' },
    ],
  },
)

const heading = useSlideTitle(props)
const rows = computed(() => packRows(props.items ?? []))

const rowStyle = (row: StepItem[]) => ({
  '--cd-steps-columns': String(row.length),
  '--cd-steps-width': row.length < 3 ? `${(row.length / 3) * 100}%` : '100%',
}) as Record<string, string>
</script>

<template>
  <div class="slidev-layout cd-steps">
    <h2 v-if="heading" class="cd-steps__title">{{ heading }}</h2>
    <slot />
    <div v-if="rows.length" class="cd-steps__rows" :class="{ 'is-stacked': rows.length > 1 }">
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="cd-steps__row"
        :style="rowStyle(row)"
      >
        <div v-for="(item, i) in row" :key="i" class="cd-steps__card">
          <div :class="`i-lucide-${item.icon}`" style="width:44px;height:44px;color:var(--cd-accent)" />
          <span class="cd-steps__step">{{ item.step }}</span>
          <span class="cd-steps__name">{{ item.title }}</span>
          <span v-if="item.desc" class="cd-steps__desc">{{ item.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cd-steps {
  display: flex;
  flex-direction: column;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}

/* Slide title — authored via the `title` prop or a markdown <h2>/<h1> in the
   default slot; both share the original section heading treatment. */
.cd-steps__title,
.cd-steps :deep(h2),
.cd-steps :deep(h1) {
  margin: 0 0 var(--cd-gap-title);
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
/* Optional lead paragraph in the slot (muted body). */
.cd-steps :deep(p) {
  margin: 0 0 var(--cd-gap-title);
  font-size: var(--cd-type-body);
  line-height: 1.55;
  color: var(--cd-muted);
  max-width: 1200px;
}

.cd-steps__rows {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.cd-steps__rows.is-stacked {
  gap: 28px;
}
.cd-steps__row {
  display: grid;
  grid-template-columns: repeat(var(--cd-steps-columns), minmax(0, 1fr));
  gap: 32px;
  width: var(--cd-steps-width);
  margin: 0 auto;
}
.cd-steps__card {
  display: flex;
  flex-direction: column;
  gap: var(--cd-gap-item);
  padding: 52px 44px;
  background: var(--cd-surface);
  min-width: 0;
}
.cd-steps__rows.is-stacked .cd-steps__card {
  padding: 44px 40px;
  gap: 22px;
}
.cd-steps__step {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-micro);
  color: var(--cd-accent);
}
.cd-steps__name {
  font-size: var(--cd-type-subtitle);
  font-weight: 500;
  line-height: 1.25;
  min-width: 0;
}
.cd-steps__desc {
  font-size: var(--cd-type-micro);
  line-height: 1.55;
  color: var(--cd-muted);
}
</style>
