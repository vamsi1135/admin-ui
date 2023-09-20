import { render, screen } from '@testing-library/react';
import Table from './Table/table.jsx';

test('renders learn react link', () => {
   render(<Table />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
