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

describe("ListCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("renders correctly", () => {
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

  it('calls onEdit when the "Editar Nombre" button is clicked', () => {
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

  it('calls onDelete when the "Eliminar" button is clicked', () => {
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
 
  it("has correct link for details navigation", () => {
    render(
      <MemoryRouter>
        <ListCard list={mockList} onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    const detailsLink = screen.getByText("Ver Detalles");
    expect(detailsLink).toHaveAttribute("href", `/list/${mockList.slug}`);
  });
});
