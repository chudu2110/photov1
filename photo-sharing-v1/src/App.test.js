import { render, screen } from '@testing-library/react';
import App from './App';

test('renders photo sharing layout', () => {
  render(<App />);
  expect(screen.getByText(/Vu Huy Du/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Please Login/i).length).toBeGreaterThan(0);
});
