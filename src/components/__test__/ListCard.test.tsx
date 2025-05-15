import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ListCard from "../ListCard";
import { describe, it, expect, beforeEach, vi } from "vitest";

const mockList = {
  slug: "test-list",
  title: "Test List",
  created_at: new Date(),
  items: [],
};

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();

describe("Componente ListCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("renderiza correctamente", () => {
    render(
      <MemoryRouter>
        <ListCard list={mockList} onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    expect(screen.getByText(mockList.title)).toBeInTheDocument();
    expect(screen.getByText(/creada:/i)).toBeInTheDocument();
    expect(screen.getByText(/tareas: 0/i)).toBeInTheDocument();
    expect(screen.getByText("Ver Detalles")).toBeInTheDocument();
    expect(screen.getByText("Editar Nombre")).toBeInTheDocument();
    expect(screen.getByText("Descargar JSON")).toBeInTheDocument();
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
  });

  it('llama a onEdit al hacer click en "Editar Nombre"', () => {
    render(
      <MemoryRouter>
        <ListCard list={mockList} onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Editar Nombre"));
    expect(mockOnEdit).toHaveBeenCalledWith({
      slug: mockList.slug,
      title: mockList.title,
    });
  });

  it('llama a onDelete al hacer click en "Eliminar"', () => {
    render(
      <MemoryRouter>
        <ListCard list={mockList} onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Eliminar"));
    expect(mockOnDelete).toHaveBeenCalledWith({
      slug: mockList.slug,
      title: mockList.title,
    });
  });

  it("tiene el link correcto para navegar a detalles", () => {
    render(
      <MemoryRouter>
        <ListCard list={mockList} onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    const detailsLink = screen.getByText("Ver Detalles");
    expect(detailsLink).toHaveAttribute("href", `/list/${mockList.slug}`);
  });
});