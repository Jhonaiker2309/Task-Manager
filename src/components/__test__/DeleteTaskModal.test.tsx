import { render, screen, fireEvent } from '@testing-library/react';
import DeleteTaskModal from '../DeleteTaskModal';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Componente DeleteTaskModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();
  const mockTaskMessage = 'Test Task Message';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza correctamente cuando está abierto', () => {
    render(
      <DeleteTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        taskMessage={mockTaskMessage}
      />
    );

    // Verifica que el título del modal se muestre
    expect(screen.getByText('Confirmar Eliminación de Tarea')).toBeInTheDocument();

    // Verifica que el mensaje de confirmación muestre el mensaje de la tarea
    expect(screen.getByText(`"${mockTaskMessage}"`)).toBeInTheDocument();

    // Verifica que los botones Cancelar y Eliminar Tarea se muestren
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar Tarea')).toBeInTheDocument();
  });

  it('no renderiza nada cuando no está abierto', () => {
    const { container } = render(
      <DeleteTaskModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        taskMessage={mockTaskMessage}
      />
    );

    // Verifica que el modal no se renderiza
    expect(container.firstChild).toBeNull();
  });

  it('llama a onClose al hacer click en el botón Cancelar', () => {
    render(
      <DeleteTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        taskMessage={mockTaskMessage}
      />
    );

    // Simula click en Cancelar
    fireEvent.click(screen.getByText('Cancelar'));

    // Verifica que se llamó a onClose
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('llama a onClose al hacer click en el fondo del modal', () => {
    render(
      <DeleteTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        taskMessage={mockTaskMessage}
      />
    );

    // Simula click en el fondo del modal
    fireEvent.click(screen.getByTestId('modal-background'));

    // Verifica que se llamó a onClose
    expect(mockOnClose).toHaveBeenCalled();
  });
});