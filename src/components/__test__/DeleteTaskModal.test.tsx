import { render, screen, fireEvent } from '@testing-library/react';
import DeleteTaskModal from '../DeleteTaskModal';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DeleteTaskModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();
  const mockTaskMessage = 'Test Task Message';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <DeleteTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        taskMessage={mockTaskMessage}
      />
    );

    // Check if the modal title is rendered
    expect(screen.getByText('Confirmar Eliminación de Tarea')).toBeInTheDocument();

    // Check if the confirmation message is rendered with the task message
    expect(screen.getByText(`"${mockTaskMessage}"`)).toBeInTheDocument();

    // Check if the Cancel and Delete buttons are rendered
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar Tarea')).toBeInTheDocument();
  });

  it('does not render when not open', () => {
    const { container } = render(
      <DeleteTaskModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        taskMessage={mockTaskMessage}
      />
    );

    // Check if the modal is not rendered
    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when the Cancel button is clicked', () => {
    render(
      <DeleteTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        taskMessage={mockTaskMessage}
      />
    );

    // Simulate clicking the Cancel button
    fireEvent.click(screen.getByText('Cancelar'));

    // Check if onClose is called
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when the modal background is clicked', () => {
    render(
      <DeleteTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        taskMessage={mockTaskMessage}
      />
    );

    // Simulate clicking the modal background
    fireEvent.click(screen.getByTestId('modal-background'));

    // Check if onClose is called
    expect(mockOnClose).toHaveBeenCalled();
  });
});