import { render, screen } from '@testing-library/react';
import AppLoading from '../app-loading';

describe('AppLoading', () => {
  it('renders loading text', () => {
    render(<AppLoading />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
