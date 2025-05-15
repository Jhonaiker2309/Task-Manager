import { render, screen, waitFor } from '../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import CreateListModal from '../CreateListModal';

describe('CreateListModal', () => {
  it('valida el formulario correctamente', async () => {
    const user = userEvent.setup();
    const mockClose = vi.fn();

    render(<CreateListModal isOpen={true} onClose={mockClose} />);

    // 1) Verificar que el botón está deshabilitado inicialmente
    const submitButton = screen.getByRole('button', { name: /crear lista/i });
    expect(submitButton).toBeDisabled();

    // 2) Simular interacción completa con el campo
    const titleInput = screen.getByLabelText(/título/i);
    
    // Escribir y borrar para activar validación
    await user.type(titleInput, 'a');
    await user.clear(titleInput);

    // 3) Verificar mensaje de error
    expect(await screen.findByText(/el título es obligatorio/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // 4) Probar título largo
    await user.type(titleInput, 'a'.repeat(51));
    expect(await screen.findByText(/máximo 50 caracteres/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // 5) Titulo válido
    await user.clear(titleInput);
    await user.type(titleInput, 'Lista válida');
    
    // Esperar validación async
    await waitFor(() => expect(submitButton).toBeEnabled());
    
    await user.click(submitButton);

    // Verificar que se cerró el modal
    await waitFor(() => expect(mockClose).toHaveBeenCalled());
  });
});