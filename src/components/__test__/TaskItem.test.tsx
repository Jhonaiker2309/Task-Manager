import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../TaskItem';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockTask = {
  message: 'Test Task Message',
  done: false,
  createdAt: new Date(),
  onToggle: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe('Componente TaskItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza correctamente', () => {
    render(
      <TaskItem
        message={mockTask.message}
        done={mockTask.done}
        createdAt={mockTask.createdAt}
        onToggle={mockTask.onToggle}
        onEdit={mockTask.onEdit}
        onDelete={mockTask.onDelete}
      />
    );

    // Verifica que el mensaje de la tarea se muestre
    expect(screen.getByText(mockTask.message)).toBeInTheDocument();

    // Verifica que la fecha de creación se muestre
    expect(screen.getByText(/creada:/i)).toBeInTheDocument();

    // Verifica que los botones "Completar", "Editar" y "Eliminar" se muestren
    expect(screen.getByText('Completar')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });

  it('renderiza correctamente cuando la tarea está completada', () => {
    render(
      <TaskItem
        message={mockTask.message}
        done={true}
        createdAt={mockTask.createdAt}
        onToggle={mockTask.onToggle}
        onEdit={mockTask.onEdit}
        onDelete={mockTask.onDelete}
      />
    );

    // Verifica que el mensaje tenga la clase de tachado
    expect(screen.getByText(mockTask.message)).toHaveClass('line-through');

    // Verifica que el botón "Desmarcar" se muestre
    expect(screen.getByText('Desmarcar')).toBeInTheDocument();
  });

  it('llama a onToggle al hacer click en "Completar"', () => {
    render(
      <TaskItem
        message={mockTask.message}
        done={mockTask.done}
        createdAt={mockTask.createdAt}
        onToggle={mockTask.onToggle}
        onEdit={mockTask.onEdit}
        onDelete={mockTask.onDelete}
      />
    );

    fireEvent.click(screen.getByText('Completar'));
    expect(mockTask.onToggle).toHaveBeenCalled();
  });

  it('llama a onEdit al hacer click en "Editar"', () => {
    render(
      <TaskItem
        message={mockTask.message}
        done={mockTask.done}
        createdAt={mockTask.createdAt}
        onToggle={mockTask.onToggle}
        onEdit={mockTask.onEdit}
        onDelete={mockTask.onDelete}
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    expect(mockTask.onEdit).toHaveBeenCalled();
  });

  it('llama a onDelete al hacer click en "Eliminar"', () => {
    render(
      <TaskItem
        message={mockTask.message}
        done={mockTask.done}
        createdAt={mockTask.createdAt}
        onToggle={mockTask.onToggle}
        onEdit={mockTask.onEdit}
        onDelete={mockTask.onDelete}
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));
    expect(mockTask.onDelete).toHaveBeenCalled();
  });
});