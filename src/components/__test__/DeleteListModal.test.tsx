import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteListModal from '../DeleteListModal';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock del contexto
const mockDeleteList = vi.fn();
vi.mock('../../contexts/ListContext', () => ({
  useLists: () => ({
    deleteList: mockDeleteList,
  }),
}));

describe('DeleteListModal Component', () => {
  const mockOnClose = vi.fn();
  const mockListSlug = 'test-list';
  const mockListTitle = 'Test List';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
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

  it('does not render when not open', () => {
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

  it('calls onClose when the Cancel button is clicked', () => {
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

  it('calls deleteList and onClose when the Delete button is clicked', async () => {
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

  it('calls onClose when clicking background', () => {
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