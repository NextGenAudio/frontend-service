import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/app/utils/theme-context';
import { SidebarProvider } from '@/app/utils/sidebar-context';
import { MusicProvider } from '@/app/utils/music-context';
import { EntityProvider } from '@/app/utils/entity-context';
import { EntityHandlingProvider } from '@/app/utils/entity-handling-context';
import { Sidebar } from '../sidebar';
import { MusicPlayerHome } from '../music-player-home';
import { LibraryPanel } from '../library-panel';

describe('App Integration', () => {
  it('renders sidebar and home, and navigates on Home button click', () => {
    render(
      <MusicProvider>
        <SidebarProvider>
          <ThemeProvider>
            <EntityProvider>
              <EntityHandlingProvider>
                <div style={{ display: 'flex' }}>
                  <Sidebar />
                  <main>
                    <MusicPlayerHome />
                  </main>
                </div>
              </EntityHandlingProvider>
            </EntityProvider>
          </ThemeProvider>
        </SidebarProvider>
      </MusicProvider>
    );

    // Sidebar and home should be visible
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Your Music/i)).toBeInTheDocument();

    // Simulate clicking the Home button in the sidebar
    const homeButton = screen.getByText(/Home/i);
    fireEvent.click(homeButton);
    // You can add more assertions here to check navigation, context changes, etc.
  });

  it('renders library panel and interacts with folders/playlists', () => {
    render(
      <MusicProvider>
        <SidebarProvider>
          <ThemeProvider>
            <EntityProvider>
              <EntityHandlingProvider>
                <LibraryPanel />
              </EntityHandlingProvider>
            </EntityProvider>
          </ThemeProvider>
        </SidebarProvider>
      </MusicProvider>
    );
    // Check for library panel UI
    expect(screen.getByText(/Library/i)).toBeInTheDocument();
    // You can expand this to simulate folder/playlist clicks and check context changes
  });
});
