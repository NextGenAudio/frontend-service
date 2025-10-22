import { render } from '@testing-library/react';
import { Sidebar } from '../sidebar';
import { ThemeProvider } from '@/app/utils/theme-context';
import { SidebarProvider } from '@/app/utils/sidebar-context';

// Sidebar uses ThemeProvider and SidebarProvider

describe('Sidebar', () => {
  it('renders without crashing', () => {
    render(
      <SidebarProvider>
        <ThemeProvider>
          <Sidebar />
        </ThemeProvider>
      </SidebarProvider>
    );
  });
});
