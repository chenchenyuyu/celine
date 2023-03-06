import React from 'react';
import { Routes, Route } from 'react-router-dom';

// import VRViewport from './examples/vr/heart-react';
import Heart from 'examples/vr/heart-fiber';
// import Cube from './examples/cube/cube-react';
import Cube1 from 'examples/cube/cube-fiber';
import Demo1 from 'examples/webgl/Demo1';
import Demo2 from 'examples/webgl/Demo2';
import Demo3 from 'examples/webgl/Demo3';
import Demo4 from 'examples/webgl/Demo4';
import Demo5 from 'examples/webgl/Demo5';
import Demo6 from 'examples/webgl/Demo6';
import Demo7 from 'examples/webgl/Demo7';
import Demo81 from 'examples/webgl/Demo8-1';
import Demo82 from 'examples/webgl/Demo8-2';
import Demo9 from 'examples/webgl/Demo9';
import Math1 from 'examples/math/transform1';
import Hook from 'examples/react_hook/state';

import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Heart/>} />
        <Route path="/Hook" element={<Hook/>}/>
        <Route path="heart" element={<Heart />} />
        <Route path="*" element={<div>sorry! not Found</div>}/>
        <Route path="/gl1" element={<Demo1 />}/>
        <Route path="/gl2" element={<Demo2 />}/>
        <Route path="/gl3" element={<Demo3 />}/>
        <Route path="/gl4" element={<Demo4 />}/>
        <Route path="/gl5" element={<Demo5 />}/>
        <Route path="/gl6" element={<Demo6 />}/>
        <Route path="/gl7" element={<Demo7 />}/>
        <Route path="/gl8-1" element={<Demo81 />}/>
        <Route path="/gl8-2" element={<Demo82 />}/>
        <Route path="/gl9" element={<Demo9 />}/>
        <Route path="/math1" element={<Math1 />}/>
      </Routes>
    </div>
  );
}

export default App;
