import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditTaskModal from '../EditTaskModal';

describe('Componente EditTaskModal - Validación de formulario', () => {
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

  it('muestra error al intentar guardar sin cambios', async () => {
    const user = userEvent.setup();
    renderComponent([currentMessage]);

    const textarea = screen.getByLabelText('Nuevo Mensaje de la Tarea');
    const saveButton = screen.getByRole('button', { name: 'Guardar Cambios' });

    // Marca el campo como "dirty" sin cambiar el valor real
    await user.click(textarea); // Enfoca el campo
    await user.keyboard(' ');   // Escribe un espacio
    await user.keyboard('{Backspace}'); // Borra el espacio

    await user.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText('No hay cambios que guardar.')
      ).toBeInTheDocument();
    });
  });

  it('muestra error si se usa un mensaje ya existente', async () => {
    const user = userEvent.setup();
    const existingMessages = ['Mensaje existente'];
    renderComponent(existingMessages);

    const textarea = screen.getByLabelText('Nuevo Mensaje de la Tarea');

    // Simula edición completa
    await user.clear(textarea);
    await user.type(textarea, 'Mensaje existente');
    await user.tab(); // Cambia el foco para disparar la validación

    await waitFor(() => {
      expect(
        screen.getByText('Ya existe una tarea con ese mensaje.')
      ).toBeInTheDocument();
    });
  });
});