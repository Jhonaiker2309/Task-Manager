import { render, screen } from './tests/test-utils';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App - Flujo principal', () => {
  it('crea una nueva lista y navega a sus detalles', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Abre el modal para crear una nueva lista
    await user.click(
      await screen.findByRole('button', { name: /crear nueva lista/i })
    );

    // Escribe el título de la nueva lista
    const titleInput = await screen.findByLabelText(/título de la lista/i);
    await user.type(titleInput, 'Mi Super Lista');

    // Envía el formulario para crear la lista
    await user.click(screen.getByRole('button', { name: /crear lista/i }));

    // Verifica que la tarjeta de la lista se muestre con el título correcto
    const cardTitle = await screen.findByRole(
      'heading',
      { level: 2, name: /mi super lista/i },
      { timeout: 2000 }
    );
    expect(cardTitle).toBeInTheDocument();

    // Verifica que la lista se haya guardado en WebSQL (usando el debug)
    const lists = JSON.parse(
      (await screen.findByTestId('debug-websql')).textContent || '[]'
    );
    expect(lists).toHaveLength(1);
    expect(lists[0].title).toBe('Mi Super Lista');

    // Navega a la vista de detalles de la lista
    await user.click(screen.getByRole('link', { name: /ver detalles/i }));

    // Verifica que el encabezado de detalles muestre el título de la lista
    const detailHeading = await screen.findByRole('heading', {
      level: 1,
      name: /mi super lista/i
    });
    expect(detailHeading).toBeInTheDocument();
  });
});