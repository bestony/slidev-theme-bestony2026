<script setup lang="ts">
// Roadmap — a large h2 title + optional h3 lead over a 4-column milestone grid.
// Active phases get a crimson 3px top border with an accent label; the rest
// get a 1px hairline border with a muted label. Structured milestones come
// from `items`, the heading from either the `title` prop or a markdown `## …`
// slot, and the supporting line from a markdown `### …` / paragraph.
import { useSlideTitle } from '../composables/useSlideTitle'

interface RoadmapItem {
  /** Mono phase tag, e.g. "Q3 · 8月" */
  phase: string
  /** Milestone headline */
  title: string
  /** Optional supporting note */
  desc?: string
  /** Highlight this milestone (accent border + accent phase) */
  active?: boolean
}

interface Props {
  title?: string
  /** Slidev reserves `title:` — useSlideTitle reads it back from here. */
  frontmatter?: Record<string, any>
  items?: RoadmapItem[]
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { phase: 'Q3 · 8月', title: '语义层接入全部 BI 看板', desc: '下线 4 套遗留脚本', active: true },
    { phase: 'Q3 · 9月', title: '质量规则覆盖核心 80 张表', desc: '告警分级与值班表联动', active: true },
    { phase: 'Q4 · 10月', title: '财务对账链路改造', desc: '与财务系统联调两轮' },
    { phase: 'Q4 · 12月', title: '成本按团队自动分账', desc: '进入季度预算流程' },
  ],
})

const heading = useSlideTitle(props)
</script>

<template>
  <div class="slidev-layout cd-roadmap">
    <div class="cd-roadmap__head">
      <h2 v-if="heading" class="cd-roadmap__title">{{ heading }}</h2>
      <slot />
    </div>
    <div class="cd-roadmap__grid">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="cd-roadmap__item"
        :class="{ 'is-active': item.active }"
      >
        <span class="cd-roadmap__phase">{{ item.phase }}</span>
        <span class="cd-roadmap__name">{{ item.title }}</span>
        <span v-if="item.desc" class="cd-roadmap__desc">{{ item.desc }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cd-roadmap {
  display: flex;
  flex-direction: column;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}
.cd-roadmap__head {
  margin-bottom: var(--cd-gap-title);
}
.cd-roadmap__title {
  margin: 0;
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.cd-roadmap :deep(h3),
.cd-roadmap :deep(p) {
  margin: 18px 0 0;
  max-width: 1180px;
  font-size: var(--cd-type-body);
  font-weight: 300;
  line-height: 1.55;
  color: var(--cd-muted);
  text-wrap: pretty;
}
.cd-roadmap__grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 36px;
  align-content: start;
}
.cd-roadmap__item {
  display: flex;
  flex-direction: column;
  gap: 22px;
  border-top: 1px solid var(--cd-line);
  padding-top: 28px;
}
.cd-roadmap__item.is-active {
  border-top: 3px solid var(--cd-accent);
}
.cd-roadmap__phase {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-body);
  color: var(--cd-muted);
}
.cd-roadmap__item.is-active .cd-roadmap__phase {
  color: var(--cd-accent);
}
.cd-roadmap__name {
  font-size: var(--cd-type-subtitle);
  font-weight: 500;
  line-height: 1.25;
}
.cd-roadmap__desc {
  font-size: var(--cd-type-micro);
  color: var(--cd-muted);
  line-height: 1.5;
}

/* Heading via markdown slot (`## …`) and lead (`### …` / paragraph). */
.cd-roadmap :deep(h2) {
  margin: 0;
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
</style>
