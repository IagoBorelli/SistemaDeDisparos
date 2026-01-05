// src/App.tsx
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Mensagem } from './pages/Mensagem';
import { Relatorio } from './pages/Relatorio';
import { Toaster } from 'react-hot-toast';

export function App() {
  return (
   
    <MemoryRouter initialEntries={['/']}>
      <div className="flex h-screen w-screen bg-app-bg text-text-primary overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 bg-app-bg">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mensagem" element={<Mensagem />} />
            <Route path="/relatorio" element={<Relatorio />} /> 
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right"/>
        </main>
      </div>
    </MemoryRouter>
  );
}