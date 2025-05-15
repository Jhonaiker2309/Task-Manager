import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ListProvider, useLists } from '../contexts/ListContext';

function DebugWebSQL() {
  const { lists } = useLists();
  return (
    <div data-testid="debug-websql">
      {JSON.stringify(lists)}
    </div>
  );
}

function render(ui: React.ReactElement, options?: RenderOptions) {
  return rtlRender(
    <MemoryRouter initialEntries={['/']}>
      <ListProvider>
        {ui}
        <DebugWebSQL />
      </ListProvider>
    </MemoryRouter>,
    options
  );
}

export * from '@testing-library/react';
export { render };