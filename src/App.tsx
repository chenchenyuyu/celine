import React from 'react';
import { Routes, Route } from 'react-router-dom';

// import VRViewport from './examples/vr/heart-react';
import Heart from 'examples/vr/heart-fiber';
// import Cube from './examples/cube/cube-react';
import Cube1 from 'examples/cube/cube-fiber';
import NotFound from './examples/notFound/index';

import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Cube1 />} />
        <Route path="heart" element={<Heart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
