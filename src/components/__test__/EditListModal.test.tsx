import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useLists } from "../../contexts/ListContext";
import EditListModal from "../EditListModal";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock del contexto de listas
vi.mock("../../contexts/ListContext", () => ({
  useLists: vi.fn(() => ({
    lists: [],
    updateListTitle: vi.fn(),
  })),
}));

describe("Componente EditListModal", () => {
  const mockOnClose = vi.fn();
  const mockCurrentTitle = "Original Title";
  const mockListSlug = "test-list-slug";
  const mockUpdateListTitle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLists as any).mockImplementation(() => ({
      lists: [],
      updateListTitle: mockUpdateListTitle,
    }));
  });

  it("renderiza correctamente cuando está abierto", () => {
    render(
      <EditListModal
        isOpen={true}
        onClose={mockOnClose}
        currentTitle={mockCurrentTitle}
        listSlug={mockListSlug}
      />
    );

    expect(screen.getByText("Editar Nombre de la Lista")).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockCurrentTitle)).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Guardar Cambios")).toBeInTheDocument();
  });

  it("no renderiza nada cuando no está abierto", () => {
    const { container } = render(
      <EditListModal
        isOpen={false}
        onClose={mockOnClose}
        currentTitle={mockCurrentTitle}
        listSlug={mockListSlug}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("llama a onClose al hacer click en el botón Cancelar", () => {
    render(
      <EditListModal
        isOpen={true}
        onClose={mockOnClose}
        currentTitle={mockCurrentTitle}
        listSlug={mockListSlug}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("llama a updateListTitle y onClose al guardar un título válido", async () => {
    render(
      <EditListModal
        isOpen={true}
        onClose={mockOnClose}
        currentTitle={mockCurrentTitle}
        listSlug={mockListSlug}
      />
    );

    const newTitle = "New Valid Title";
    const input = screen.getByLabelText("Nuevo Título");
    const saveButton = screen.getByText("Guardar Cambios");

    // Simula interacción completa
    fireEvent.change(input, { target: { value: newTitle } });
    fireEvent.blur(input);

    // Espera validación y habilitación del botón
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });

    // Dispara el envío del formulario
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateListTitle).toHaveBeenCalledWith(
        mockListSlug,
        newTitle.trim()
      );
      expect(mockOnClose).toHaveBeenCalled();
      expect(input).toHaveValue(newTitle);
    });
  });

  it("muestra los mensajes de validación correctamente", async () => {
    (useLists as any).mockImplementation(() => ({
      lists: [{ slug: "other-list", title: "Existing Title" }],
      updateListTitle: mockUpdateListTitle,
    }));

    render(
      <EditListModal
        isOpen={true}
        onClose={mockOnClose}
        currentTitle={mockCurrentTitle}
        listSlug={mockListSlug}
      />
    );

    const input = screen.getByLabelText("Nuevo Título");

    // Campo vacío
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(screen.getByText("El título es obligatorio.")).toBeInTheDocument();
    });

    // Mismo título
    fireEvent.change(input, { target: { value: mockCurrentTitle } });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(
        screen.getByText("No hay cambios que guardar.")
      ).toBeInTheDocument();
    });

    // Título existente
    fireEvent.change(input, { target: { value: "Existing Title" } });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(
        screen.getByText("Ya existe una lista con ese nombre.")
      ).toBeInTheDocument();
    });
  });

  it("llama a onClose al hacer click en el fondo del modal", () => {
    render(
      <EditListModal
        isOpen={true}
        onClose={mockOnClose}
        currentTitle={mockCurrentTitle}
        listSlug={mockListSlug}
      />
    );

    fireEvent.click(screen.getByTestId("modal-background"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});