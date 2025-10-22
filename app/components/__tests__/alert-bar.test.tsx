import { render, screen } from '@testing-library/react';
import AlertBar from '../alert-bar';

describe('AlertBar', () => {
  it('renders without crashing', () => {
    render(<AlertBar message="test alert" setMessage={() => {}} />);
    expect(screen.getByText(/test alert/i)).toBeInTheDocument();
  });
});
