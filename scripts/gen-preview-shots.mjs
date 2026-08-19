// Regenerate the README screenshot images from example.md.
//
// The deck now contributes the main preview images plus the adaptive
// timeline/steps samples used later in the README. Each target is located by a
// marker unique to its slide rather than by page number, so editing or
// reordering the deck still finds the slide or fails loudly.
//
// Usage: pnpm screenshot:preview

import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findSlideNo, readSlides } from './deck-slides.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ENTRY = join(ROOT, 'example.md')
const OUT_DIR = join(ROOT, 'assets')

/** `file` is the name under assets/; `match` must appear on exactly one slide. */
const PREVIEWS = [
  { file: '01-cover.png', match: '# 数据平台重构<br>中期进展与下一阶段计划' },
  { file: '02-metrics.png', match: '## 重构半年后的三个变化' },
  { file: '03-sankey.png', match: '## 血缘图谱把排查时间压到 10 分钟内' },
  { file: '04-diagram.png', match: 'title: 端到端数据链路' },
  { file: '05-chart-bar.png', match: '## 四条业务线的成本变化' },
  { file: '06-steps.png', match: '## 团队接入流程' },
  { file: '07-code-cols.png', match: '## 指标定义变成可审查的代码' },
  { file: '08-timeline.png', match: '## 项目演进阶段' },
  { file: '09-timeline-3.png', match: '## 项目演进的三个阶段' },
  { file: '10-timeline-5.png', match: '## 项目演进的五个阶段' },
  { file: '11-timeline-6.png', match: '## 项目演进的六个阶段' },
  { file: '12-steps-5.png', match: '## 团队接入需要五步' },
  { file: '13-steps-6.png', match: '## 团队接入需要六步' },
]

const slides = readSlides(ENTRY)
const targets = PREVIEWS.map(preview => ({
  ...preview,
  no: findSlideNo(slides, preview.match, 'example.md'),
}))

const tmp = mkdtempSync(join(tmpdir(), 'cd-preview-shots-'))
try {
  const range = targets.map(t => t.no).join(',')
  console.log(`[preview] exporting pages ${range} from example.md…`)
  execFileSync(
    process.execPath,
    [
      join(ROOT, 'node_modules/@slidev/cli/bin/slidev.mjs'),
      'export',
      ENTRY,
      '--format', 'png',
      '--output', tmp,
      '--range', range,
      '--scale', '1',
      '--dark',
      '--per-slide',
      '--wait', '1200',
      '--wait-until', 'networkidle',
    ],
    { cwd: ROOT, stdio: 'inherit' },
  )

  // `--per-slide` names each file after its own page number, zero-padded to 2.
  const exported = new Set(readdirSync(tmp).filter(f => f.endsWith('.png')))
  mkdirSync(OUT_DIR, { recursive: true })
  for (const { file, no } of targets) {
    const page = `${String(no).padStart(2, '0')}.png`
    if (!exported.has(page))
      throw new Error(`page ${no} was not exported (got: ${[...exported].sort().join(', ')})`)
    copyFileSync(join(tmp, page), join(OUT_DIR, file))
    console.log(`[preview] ${page} → assets/${file}`)
  }
  console.log(`[preview] done — ${targets.length} images in assets/`)
}
finally {
  rmSync(tmp, { recursive: true, force: true })
}
