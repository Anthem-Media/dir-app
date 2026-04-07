/**
 * App.jsx — root component
 *
 * Currently renders BoxProfilePage directly.
 * When routing is added (React Router), this becomes the router shell
 * and each page gets its own URL path.
 */

import { BoxProfilePage } from './pages/BoxProfilePage';
import './App.css';

function App() {
  return <BoxProfilePage />;
}

export default App;
