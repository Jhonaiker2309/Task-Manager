import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ListDetails from './pages/ListDetails';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/list/:slug" element={<ListDetails />} />
    </Routes>
  );
}

export default App;