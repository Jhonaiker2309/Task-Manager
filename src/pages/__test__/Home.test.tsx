import { render, screen } from '../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import Home from '../Home';

describe('Home Component', () => {
  it('muestra el header y mensaje cuando no hay listas', () => {
    render(<Home />);
    // Header principal
    expect(
      screen.getByRole('heading', { name: /mis listas de tareas/i })
    ).toBeInTheDocument();
    // Mensaje de estado vacío
    expect(
      screen.getByText(/no hay listas aún\. ¡crea una!/i)
    ).toBeInTheDocument();
  });

  it('abre el modal de creación al hacer click en "Crear Nueva Lista"', async () => {
    render(<Home />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole('button', { name: /crear nueva lista/i })
    );
    // El modal debe mostrarse
    expect(
      screen.getByRole('heading', { name: /crear nueva lista/i })
    ).toBeInTheDocument();
  });

  it('permite crear una lista y luego muestra su tarjeta', async () => {
    render(<Home />);
    const user = userEvent.setup();

    // 1) abrir modal
    await user.click(
      screen.getByRole('button', { name: /crear nueva lista/i })
    );

    // 2) rellenar y enviar
    await user.type(
      await screen.findByLabelText(/título de la lista/i),
      'Lista de Prueba'
    );
    await user.click(
      screen.getByRole('button', { name: /crear lista/i })
    );

    // 3) esperar a que aparezca la tarjeta
    const cardTitle = await screen.findByRole('heading', {
      level: 2,
      name: /lista de prueba/i
    });
    expect(cardTitle).toBeInTheDocument();
  });
});