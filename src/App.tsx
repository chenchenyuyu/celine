import React from 'react';
import { Routes, Route } from 'react-router-dom';

// import VRViewport from './examples/vr/heart-react';
import Heart from 'examples/vr/heart-fiber';
// import Cube from './examples/cube/cube-react';
import Cube1 from 'examples/cube/cube-fiber';
import NotFound from './examples/notFound/index';
import Demo1 from 'examples/webgl/Demo1';
import Demo2 from 'examples/webgl/Demo2';
import Demo3 from 'examples/webgl/Demo3';
import Demo4 from 'examples/webgl/Demo4';

import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Cube1 />} />
        <Route path="heart" element={<Heart />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/gl1" element={<Demo1 />}/>
        <Route path="/gl2" element={<Demo2 />}/>
        <Route path="/gl3" element={<Demo3 />}/>
        <Route path="/gl4" element={<Demo4 />}/>
      </Routes>
    </div>
  );
}

export default App;
