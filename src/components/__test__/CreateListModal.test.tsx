import { render, screen, waitFor } from '../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import CreateListModal from '../CreateListModal';

describe('CreateListModal', () => {
  it('valida el formulario correctamente', async () => {
    const user = userEvent.setup();
    const mockClose = vi.fn();

    render(<CreateListModal isOpen={true} onClose={mockClose} />);

    // Verifica que el botón de crear está deshabilitado al inicio
    const submitButton = screen.getByRole('button', { name: /crear lista/i });
    expect(submitButton).toBeDisabled();

    // Simula interacción: escribe y borra para activar validación
    const titleInput = screen.getByLabelText(/título/i);
    await user.type(titleInput, 'a');
    await user.clear(titleInput);

    // Verifica mensaje de error por campo vacío
    expect(await screen.findByText(/el título es obligatorio/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Prueba con un título demasiado largo
    await user.type(titleInput, 'a'.repeat(51));
    expect(await screen.findByText(/máximo 50 caracteres/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Ingresa un título válido
    await user.clear(titleInput);
    await user.type(titleInput, 'Lista válida');

    // Espera a que el botón se habilite y envía el formulario
    await waitFor(() => expect(submitButton).toBeEnabled());
    await user.click(submitButton);

    // Verifica que se haya llamado al cierre del modal
    await waitFor(() => expect(mockClose).toHaveBeenCalled());
  });
});