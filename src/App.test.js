import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Kończenie/i);
  expect(linkElement).toBeInTheDocument();
});

test('none console.error', () => {
  const consoleErrorSpy = jest.spyOn(global.console, 'error');
  render(<App />);
  expect(consoleErrorSpy).not.toHaveBeenCalled();
});
