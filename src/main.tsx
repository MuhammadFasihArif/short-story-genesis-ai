
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize frontend
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
