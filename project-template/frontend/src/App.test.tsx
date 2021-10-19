import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Check if Login is found', () => {
  render(<App />);
  const linkElement = screen.getByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
});
