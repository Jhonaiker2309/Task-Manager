import { render, screen, waitFor } from '../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { useLists, ListProvider } from '../ListContext';

// Componente de prueba que consume el contexto y permite crear una lista
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
    // Prepara el entorno de usuario y renderiza el proveedor de contexto con el componente de prueba
    const user = userEvent.setup();
    render(
      <ListProvider>
        <TestComponent />
      </ListProvider>
    );

    // Simula el click en el botón para crear una nueva lista
    await user.click(screen.getByRole('button', { name: /crear/i }));

    // Espera a que la lista se actualice y verifica que el título sea el esperado
    await waitFor(() => {
      const lists = JSON.parse(screen.getByTestId('lists').textContent || '[]');
      expect(lists[0].title).toBe('Test List');
    });
  });
});