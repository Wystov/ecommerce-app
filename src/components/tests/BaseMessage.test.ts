import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseMessage from '../shared/BaseMessage.vue';

describe('BaseMessage', () => {
  it('render with danger alert type', () => {
    const wrapper = mount(BaseMessage, {
      props: {
        alert: 'danger',
      },
    });
    expect(wrapper.find('.danger').exists()).toBeTruthy();
  });

  it('render with rounded style', () => {
    const wrapper = mount(BaseMessage, {
      props: {
        rounded: true,
      },
    });
    expect(wrapper.find('.rounded').exists()).toBeTruthy();
  });

  it('render title and message slot content', () => {
    const title = 'Error';
    const message = 'Error message for promise team';
    const wrapper = mount(BaseMessage, {
      props: {
        title,
      },
      slots: {
        default: message,
      },
    });
    expect(wrapper.find('.title').text()).toBe(title);
    expect(wrapper.find('.message').text()).toBe(message);
  });
});
