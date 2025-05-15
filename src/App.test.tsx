import { render, screen } from './tests/test-utils';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App - Flujo principal', () => {
  it('crea una nueva lista y navega a sus detalles', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Paso 1: abrir el modal de creación
    await user.click(
      await screen.findByRole('button', { name: /crear nueva lista/i })
    );

    // Paso 2: rellenar formulario
    const titleInput = await screen.findByLabelText(/título de la lista/i);
    await user.type(titleInput, 'Mi Super Lista');

    // Paso 3: enviar formulario
    await user.click(screen.getByRole('button', { name: /crear lista/i }));

    // Verificación 1: debe aparecer la tarjeta con el título
    const cardTitle = await screen.findByRole(
      'heading',
      { level: 2, name: /mi super lista/i },
      { timeout: 2000 }
    );
    expect(cardTitle).toBeInTheDocument();

    // Verificación 2: debe persistir en WebSQL (debug)
    const lists = JSON.parse(
      (await screen.findByTestId('debug-websql')).textContent || '[]'
    );
    expect(lists).toHaveLength(1);
    expect(lists[0].title).toBe('Mi Super Lista');

    // Paso 4: navegar a detalles
    await user.click(screen.getByRole('link', { name: /ver detalles/i }));

    // Verificación final: debe mostrar el <h2> de detalles
    const detailHeading = await screen.findByRole('heading', {
      level: 1,
      name: /mi super lista/i
    });
    expect(detailHeading).toBeInTheDocument();
  });
});