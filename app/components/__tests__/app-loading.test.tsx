import { render } from '@testing-library/react';
import AppLoading from '../app-loading';

describe('AppLoading', () => {
  it('renders loading indicator (spinner)', () => {
    const { container } = render(<AppLoading />);
    // The component renders a spinner with the 'animate-spin' class; assert it exists
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
