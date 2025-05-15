import { render as rtlRender, screen } from '@testing-library/react';
import { render } from '../../tests/test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event';;
import { ListProvider } from '../../contexts/ListContext';
import ListDetails from '../ListDetails';
import App from '../../App';

describe('ListDetails — página no encontrada', () => {
  it('muestra mensaje y link de volver cuando el slug no existe', async () => {
    // No usar el helper render para evitar doble <Router>
    rtlRender(
      <MemoryRouter initialEntries={['/list/slug-invalido']}>
        <ListProvider>
          <Routes>
            <Route path="/list/:slug" element={<ListDetails />} />
          </Routes>
        </ListProvider>
      </MemoryRouter>
    );

    // Verifica el mensaje de error
    expect(
      await screen.findByRole('heading', { name: /lista no encontrada/i })
    ).toBeInTheDocument();

    // El link "Volver" apunta a "/"
    const volver = screen.getByRole('link', { name: /volver/i });
    expect(volver).toHaveAttribute('href', '/');
  });
});

describe('ListDetails — flujo de usuario', () => {
  it('crea una lista, navega a detalles y añade una tarea', async () => {
    const user = userEvent.setup();

    // Renderiza la aplicación completa (incluye router, contexto y DebugWebSQL)
    render(<App />);

    // 1) Crear nueva lista desde Home
    await user.click(
      await screen.findByRole('button', { name: /crear nueva lista/i })
    );
    await user.type(
      await screen.findByLabelText(/título de la lista/i),
      'Lista Flow'
    );
    await user.click(screen.getByRole('button', { name: /crear lista/i }));

    // 2) Navegar a detalles
    await user.click(await screen.findByRole('link', { name: /ver detalles/i }));

    // 3) Añadir una nueva tarea
    const taskInput = await screen.findByPlaceholderText(/ej: comprar leche/i);
    await user.type(taskInput, 'Tarea de prueba');
    await user.click(screen.getByRole('button', { name: /añadir tarea/i }));

    // 4) Verificar que la tarea aparece en la lista
    const taskSpan = await screen.findByText(/tarea de prueba/i, {
      selector: 'span.text-sm.text-slate-300'
    });
    expect(taskSpan).toBeInTheDocument();
    expect(taskSpan.tagName).toBe('SPAN');
    expect(taskSpan).toHaveClass('text-slate-300');
  });
});