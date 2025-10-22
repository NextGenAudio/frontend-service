import { render } from '@testing-library/react';
import { FolderCreate } from '../folder-create';
import { ThemeProvider } from '@/app/utils/theme-context';
import { EntityHandlingProvider } from '@/app/utils/entity-handling-context';
import { SidebarProvider } from '@/app/utils/sidebar-context';

describe('FolderCreate', () => {
  it('renders without crashing', () => {
    render(
        <EntityHandlingProvider>
          <ThemeProvider>
            <SidebarProvider>
              <FolderCreate />
            </SidebarProvider>
          </ThemeProvider>
        </EntityHandlingProvider>
    );
  });
});
