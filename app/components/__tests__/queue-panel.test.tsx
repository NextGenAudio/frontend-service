import { render } from '@testing-library/react';
import { QueuePanel } from '../queue-panel';
import { ThemeProvider } from '@/app/utils/theme-context';
import { SidebarProvider } from '@/app/utils/sidebar-context';
import { MusicProvider } from '@/app/utils/music-context';

describe('QueuePanel', () => {
  it('renders without crashing', () => {
    render(
      <MusicProvider>
        <SidebarProvider>
          <ThemeProvider>
            <QueuePanel />
          </ThemeProvider>
        </SidebarProvider>
      </MusicProvider>
    );
  });
});
