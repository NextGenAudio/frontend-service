import { render } from '@testing-library/react';
import { SearchBar } from '../search-bar';
import { SidebarProvider } from '@/app/utils/sidebar-context';
import { MusicProvider } from '@/app/utils/music-context';

describe('SearchBar', () => {
  it('renders without crashing', () => {
    render(
      <MusicProvider>
        <SidebarProvider>
          <SearchBar />
        </SidebarProvider>
      </MusicProvider>
    );
  });
});
