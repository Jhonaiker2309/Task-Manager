import { render, screen, waitFor } from '../../tests/test-utils';
import userEvent from '@testing-library/user-event'; // ← add this import
import { useLists, ListProvider } from '../ListContext';

const TestComponent = () => {
  const { lists, createList } = useLists();
  return (
    <div>
      <button onClick={() => createList('Test List')}>Crear</button>
      <div data-testid="lists">{JSON.stringify(lists)}</div>
    </div>
  );
};

describe('ListContext', () => {
  it('crea una nueva lista correctamente', async () => {
    const user = userEvent.setup();
    render(
      <ListProvider>
        <TestComponent />
      </ListProvider>
    );

    await user.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      const lists = JSON.parse(screen.getByTestId('lists').textContent || '[]');
      expect(lists[0].title).toBe('Test List');
    });
  });
});