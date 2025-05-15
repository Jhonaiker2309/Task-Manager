import { render, screen } from '../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import Home from '../Home';

describe('Home Component', () => {
  it('muestra el header y mensaje cuando no hay listas', () => {
    render(<Home />);
    // Verifica que el encabezado principal se muestre
    expect(
      screen.getByRole('heading', { name: /mis listas de tareas/i })
    ).toBeInTheDocument();
    // Verifica que se muestre el mensaje de estado vacío
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
    // Verifica que el modal de creación se muestre
    expect(
      screen.getByRole('heading', { name: /crear nueva lista/i })
    ).toBeInTheDocument();
  });

  it('permite crear una lista y luego muestra su tarjeta', async () => {
    render(<Home />);
    const user = userEvent.setup();

    // Abre el modal de creación
    await user.click(
      screen.getByRole('button', { name: /crear nueva lista/i })
    );

    // Rellena el formulario y envía
    await user.type(
      await screen.findByLabelText(/título de la lista/i),
      'Lista de Prueba'
    );
    await user.click(
      screen.getByRole('button', { name: /crear lista/i })
    );

    // Espera a que aparezca la tarjeta de la nueva lista
    const cardTitle = await screen.findByRole('heading', {
      level: 2,
      name: /lista de prueba/i
    });
    expect(cardTitle).toBeInTheDocument();
  });
});