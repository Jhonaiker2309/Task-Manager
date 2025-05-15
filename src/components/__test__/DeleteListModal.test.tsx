import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteListModal from '../DeleteListModal';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock del contexto de listas
const mockDeleteList = vi.fn();
vi.mock('../../contexts/ListContext', () => ({
  useLists: () => ({
    deleteList: mockDeleteList,
  }),
}));

describe('Componente DeleteListModal', () => {
  const mockOnClose = vi.fn();
  const mockListSlug = 'test-list';
  const mockListTitle = 'Test List';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza correctamente cuando está abierto', () => {
    render(
      <DeleteListModal
        isOpen={true}
        onClose={mockOnClose}
        listSlug={mockListSlug}
        listTitle={mockListTitle}
      />
    );

    expect(screen.getByText('Confirmar Eliminación')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar Lista')).toBeInTheDocument();
  });

  it('no renderiza nada cuando no está abierto', () => {
    const { container } = render(
      <DeleteListModal
        isOpen={false}
        onClose={mockOnClose}
        listSlug={mockListSlug}
        listTitle={mockListTitle}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('llama a onClose al hacer click en el botón Cancelar', () => {
    render(
      <DeleteListModal
        isOpen={true}
        onClose={mockOnClose}
        listSlug={mockListSlug}
        listTitle={mockListTitle}
      />
    );
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('llama a deleteList y onClose al hacer click en el botón Eliminar Lista', async () => {
    render(
      <DeleteListModal
        isOpen={true}
        onClose={mockOnClose}
        listSlug={mockListSlug}
        listTitle={mockListTitle}
      />
    );

    fireEvent.click(screen.getByText('Eliminar Lista'));

    await waitFor(() => {
      expect(mockDeleteList).toHaveBeenCalledWith(mockListSlug);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('llama a onClose al hacer click en el fondo del modal', () => {
    render(
      <DeleteListModal
        isOpen={true}
        onClose={mockOnClose}
        listSlug={mockListSlug}
        listTitle={mockListTitle}
      />
    );
    fireEvent.click(screen.getByTestId('modal-background'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});