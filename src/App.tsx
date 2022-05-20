import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import VRViewport from './examples/vr/heart-react';
import Cube from './examples/cube/cube-react';
import NotFound from './examples/notFound/index';

import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Cube />} />
        <Route path="heart" element={<VRViewport />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
