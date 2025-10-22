import { render } from '@testing-library/react';
import { ProfileDropdown } from '../profile-dropdown';
import { ThemeProvider } from '@/app/utils/theme-context';

describe('ProfileDropdown', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider>
        <ProfileDropdown />
      </ThemeProvider>
    );
  });
});
