import { render } from '@testing-library/react';
import { SongDetailsPanel } from '../song-details-panel';
import { ThemeProvider } from '@/app/utils/theme-context';
import { SidebarProvider } from '@/app/utils/sidebar-context';
import { MusicProvider } from '@/app/utils/music-context';
import { EntityProvider } from '@/app/utils/entity-context';

const song = {
  id: '1',
  title: 'Test Song',
  filename: 'test.mp3',
  artist: 'Test Artist',
  album: 'Test Album',
  path: '/music/test.mp3',
  metadata: {},
};

describe('SongDetailsPanel', () => {
  it('renders without crashing', () => {
    render(
      <EntityProvider>
        <MusicProvider>
          <SidebarProvider>
            <ThemeProvider>
              <SongDetailsPanel song={song} />
            </ThemeProvider>
          </SidebarProvider>
        </MusicProvider>
      </EntityProvider>
    );
  });
});

