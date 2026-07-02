import type { ComponentInternalInstance } from 'vue'

export function hasClickListener(
  attrs: Record<string, unknown>,
  instance: ComponentInternalInstance | null,
): boolean {
  if ('onClick' in attrs) {
    return true
  }

  const props = instance?.vnode.props
  if (!props) {
    return false
  }

  return 'onClick' in props || 'onclick' in props
}
