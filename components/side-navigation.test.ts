import { beforeEach, describe, expect, it } from 'vitest';
import type { mount, DOMWrapper } from '@vue/test-utils';
import { mockComponent, mountSuspended } from '@nuxt/test-utils/runtime';
import SideNavigation from '~/components/side-navigation.vue';

mockComponent('ThemeSelector', {
  render: () => '<div>ThemeSelector</div>',
});

describe('SideNavigation', () => {
  let wrapper: ReturnType<typeof mount<typeof SideNavigation>>;

  beforeEach(async () => {
    wrapper = await mountSuspended(SideNavigation, {
      global: {},
    });
  });

  it('renders the LinkedIn link correctly', () => {
    const linkedInItem: DOMWrapper<HTMLAnchorElement> = wrapper.find('[data-testid="linkedin"]');

    expect(linkedInItem.exists()).toBe(true);
    expect(linkedInItem.element.href).toEqual('https://www.linkedin.com/in/luka-varga-6ab348123/');
    expect(linkedInItem.html()).toContain('LinkedIn');
  });

  it('renders the GitHub link correctly', () => {
    const githubItem: DOMWrapper<HTMLAnchorElement> = wrapper.find('[data-testid="github"]');

    expect(githubItem.exists()).toBe(true);
    expect(githubItem.element.href).toEqual('https://github.com/lukaVarga');
    expect(githubItem.html()).toContain('Github');
  });

  it('renders the ThemeSelector component', () => {
    const themeSelector = wrapper.findComponent({ name: 'ThemeSelector' });
    expect(themeSelector.exists()).toBe(true);
  });

  it('renders the testing scenarios navigation item correctly', () => {
    const navItem = wrapper.find('a[href="/"]');
    expect(navItem.exists()).toBe(true);
    expect(navItem.html()).toContain('Testing scenarios');
  });
});
