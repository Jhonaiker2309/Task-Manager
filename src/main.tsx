import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { ListProvider } from './contexts/ListContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ListProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ListProvider>
  </StrictMode>,
)
