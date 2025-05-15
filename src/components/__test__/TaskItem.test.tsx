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

describe('TaskItem Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
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

    // Check if the task message is rendered
    expect(screen.getByText(mockTask.message)).toBeInTheDocument();

    // Check if the creation date is rendered
    expect(screen.getByText(/creada:/i)).toBeInTheDocument();

    // Check if the "Completar", "Editar", and "Eliminar" buttons are rendered
    expect(screen.getByText('Completar')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });

  it('renders correctly when the task is done', () => {
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

    // Check if the task message is rendered with line-through style
    expect(screen.getByText(mockTask.message)).toHaveClass('line-through');

    // Check if the "Desmarcar" button is rendered
    expect(screen.getByText('Desmarcar')).toBeInTheDocument();
  });

  it('calls onToggle when the "Completar" button is clicked', () => {
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

    // Simulate clicking the "Completar" button
    fireEvent.click(screen.getByText('Completar'));

    // Check if onToggle is called
    expect(mockTask.onToggle).toHaveBeenCalled();
  });

  it('calls onEdit when the "Editar" button is clicked', () => {
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

    // Simulate clicking the "Editar" button
    fireEvent.click(screen.getByText('Editar'));

    // Check if onEdit is called
    expect(mockTask.onEdit).toHaveBeenCalled();
  });

  it('calls onDelete when the "Eliminar" button is clicked', () => {
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

    // Simulate clicking the "Eliminar" button
    fireEvent.click(screen.getByText('Eliminar'));

    // Check if onDelete is called
    expect(mockTask.onDelete).toHaveBeenCalled();
  });
});