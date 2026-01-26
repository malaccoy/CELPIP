import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Task1 } from './pages/Task1';
import { Task2 } from './pages/Task2';
import { Library } from './pages/Library';
import { Settings } from './pages/Settings';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="task-1" element={<Task1 />} />
          <Route path="task-2" element={<Task2 />} />
          <Route path="library" element={<Library />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;