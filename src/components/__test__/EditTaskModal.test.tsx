import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditTaskModal from '../EditTaskModal';

describe('EditTaskModal - Validación de formulario', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();
  const currentMessage = 'Mensaje original';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (existingMessages: string[] = []) =>
    render(
      <EditTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        currentMessage={currentMessage}
        existingMessages={existingMessages}
      />
    );

  it('muestra error al guardar sin cambios', async () => {
    const user = userEvent.setup();
    renderComponent([currentMessage]);

    const textarea = screen.getByLabelText('Nuevo Mensaje de la Tarea');
    const saveButton = screen.getByRole('button', { name: 'Guardar Cambios' });

    // Hacer el campo "dirty" sin cambiar el valor
    await user.click(textarea); // Enfocar el campo
    await user.keyboard(' ');   // Agregar un espacio
    await user.keyboard('{Backspace}'); // Eliminar el espacio

    await user.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText('No hay cambios que guardar.')
      ).toBeInTheDocument();
    });
  });

  it('muestra error al usar mensaje existente', async () => {
    const user = userEvent.setup();
    const existingMessages = ['Mensaje existente'];
    renderComponent(existingMessages);

    const textarea = screen.getByLabelText('Nuevo Mensaje de la Tarea');

    // Simular edición completa
    await user.clear(textarea);
    await user.type(textarea, 'Mensaje existente');
    await user.tab(); // Cambiar foco para disparar validación

    await waitFor(() => {
      expect(
        screen.getByText('Ya existe una tarea con ese mensaje.')
      ).toBeInTheDocument();
    });
  });
});