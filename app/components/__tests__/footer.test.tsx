import { render } from '@testing-library/react';
import { AppFooter } from '../footer';

describe('AppFooter', () => {
  it('renders without crashing', () => {
    render(<AppFooter />);
  });
});
