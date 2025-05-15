import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useLists } from "../../contexts/ListContext";
import EditListModal from "../EditListModal";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock del contexto
vi.mock("../../contexts/ListContext", () => ({
  useLists: vi.fn(() => ({
    lists: [],
    updateListTitle: vi.fn(),
  })),
}));

describe("EditListModal Component", () => {
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

  it("renders correctly when open", () => {
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

  it("does not render when not open", () => {
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

  it("calls onClose when the Cancel button is clicked", () => {
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

  it("calls updateListTitle and onClose when saving valid title", async () => {
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

    // Simular interacción completa
    fireEvent.change(input, { target: { value: newTitle } });
    fireEvent.blur(input);

    // Esperar validación y habilitación del botón
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });

    // Disparar el envío del formulario
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateListTitle).toHaveBeenCalledWith(
        mockListSlug,
        newTitle.trim() // El componente usa trim() en el onSubmit
      );

      expect(mockOnClose).toHaveBeenCalled();

      expect(input).toHaveValue(newTitle);
    });
  });
  it("shows validation errors correctly", async () => {
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

    // Test empty title
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(screen.getByText("El título es obligatorio.")).toBeInTheDocument();
    });

    // Test same title
    fireEvent.change(input, { target: { value: mockCurrentTitle } });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(
        screen.getByText("No hay cambios que guardar.")
      ).toBeInTheDocument();
    });

    // Test existing title
    fireEvent.change(input, { target: { value: "Existing Title" } });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(
        screen.getByText("Ya existe una lista con ese nombre.")
      ).toBeInTheDocument();
    });
  });

  it("calls onClose when clicking background", () => {
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
