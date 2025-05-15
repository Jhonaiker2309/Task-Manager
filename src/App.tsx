import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ListDetails from './pages/ListDetails';

/**
 * Main application component that sets up client-side routing.
 *
 * - "/" renders the Home page.
 * - "/list/:slug" renders the ListDetails page, where `:slug` is a dynamic parameter.
 *
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/list/:slug" element={<ListDetails />} />
    </Routes>
  );
}

export default App;