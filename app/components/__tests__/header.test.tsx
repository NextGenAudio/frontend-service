import { render } from '@testing-library/react';
import Header from '../header';

describe('Header', () => {
  it('renders without crashing', () => {
    render(<Header />);
  });
});
