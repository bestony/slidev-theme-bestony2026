export function packRows<T>(items: readonly T[]): T[][] {
  if (items.length === 0)
    return []

  if (items.length <= 4)
    return [items.slice()]

  const rows: T[][] = []
  let cursor = 0

  while (items.length - cursor > 3) {
    rows.push(items.slice(cursor, cursor + 3))
    cursor += 3
  }

  const tail = items.slice(cursor)
  if (tail.length === 1 && rows.length) {
    const previous = rows[rows.length - 1]
    if (previous.length > 2)
      tail.unshift(previous.pop()!)
  }

  rows.push(tail)
  return rows
}
