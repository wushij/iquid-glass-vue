import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import LiquidGlass from '../components/LiquidGlass.vue'

describe('LiquidGlass', () => {
  it('renders slot content', () => {
    const wrapper = mount(LiquidGlass, {
      slots: {
        default: '<p class="test-content">Hello Glass</p>',
      },
    })

    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.find('.test-content').text()).toBe('Hello Glass')
  })

  it('renders glass container', () => {
    const wrapper = mount(LiquidGlass, {
      slots: { default: 'Content' },
    })

    expect(wrapper.find('.glass').exists()).toBe(true)
  })

  it('applies corner radius from props', () => {
    const wrapper = mount(LiquidGlass, {
      props: { cornerRadius: 16 },
      slots: { default: 'Content' },
    })

    const glass = wrapper.find('.glass')
    expect(glass.attributes('style')).toContain('border-radius: 16px')
  })

  it('emits click when clickable', async () => {
    const Host = defineComponent({
      components: { LiquidGlass },
      setup() {
        return () => h(LiquidGlass, { onClick: () => undefined }, () => 'Click me')
      },
    })

    const wrapper = mount(Host)
    const liquid = wrapper.findComponent(LiquidGlass)
    await liquid.find('.relative').trigger('click')
    expect(liquid.emitted('click')).toHaveLength(1)
  })

  it('shows hover layers when click handler is present', () => {
    const Host = defineComponent({
      components: { LiquidGlass },
      setup() {
        return () => h(LiquidGlass, { onClick: () => undefined }, () => 'Button')
      },
    })

    const wrapper = mount(Host)
    expect(wrapper.findAll('div').length).toBeGreaterThan(3)
  })
})
