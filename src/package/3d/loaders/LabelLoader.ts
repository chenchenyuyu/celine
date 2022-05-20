import * as THREE from "three";
import vtkXMLPolyDataReader from "vtk.js/Sources/IO/XML/XMLPolyDataReader";
import parseDCP from 'parsedcp';

// single label loader
const SingleLabelLoader = async(url: string) => {
 const resp = await fetch(url);
 const binary = await resp.arrayBuffer();

 const vtpReader = vtkXMLPolyDataReader.newInstance();

 // 0. buffer
 let parsed: any;
 try {
   parsed = vtpReader.parseAsArrayBuffer(parseDCP(binary));
 } catch (e) {
   parsed = vtpReader.parseAsArrayBuffer(binary);
 }

 if (!parsed) {
   throw Error('parse error');
 }

 const geometry = new THREE.BufferGeometry();

 const source = vtpReader.getOutputData(0);
 // 1. vertices
 const vertices = source.getPoints().getData();
 geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
 geometry.attributes.position.needsUpdate = true;

 // 2. labels
 const scalars =
   source.getCellData().getArrayByName("Scalars_") &&
   source.getCellData().getArrayByName("Scalars_").getData();
     
 if (scalars) {
   geometry.setAttribute('label', new THREE.BufferAttribute(scalars, 1));
   geometry.attributes.label.needsUpdate = true;
 }

 // 3. index
 const tris = source.getPolys().getData();
 const indices = new Uint32Array(source.getPolys().getNumberOfCells() * 3);
 let i = 0,
   j = 0;
 while (j < indices.length) {
   indices[j++] = tris[++i];
   indices[j++] = tris[++i];
   indices[j++] = tris[++i];
   ++i;
 }
 geometry.setIndex(new THREE.BufferAttribute(indices, 1));
 geometry.index!.needsUpdate = true;

 // 4. normals
  const normals =
  source.getPointData().getNormals() &&
  source
    .getPointData()
    .getNormals()
    .getData();
  if (normals) {
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.attributes.normal.needsUpdate = true;
  } else {
    geometry.computeVertexNormals();
  }

 return geometry;
};

// multiple label loader
const MultiLabelLoader = async(url: string) => {
 const resp = await fetch(url);
 const binary = await resp.arrayBuffer();

 const vtpReader = vtkXMLPolyDataReader.newInstance();

 // 0. buffer
 let parsed: any;
 try {
   parsed = vtpReader.parseAsArrayBuffer(parseDCP(binary));
 } catch (e) {
   parsed = vtpReader.parseAsArrayBuffer(binary);
 }

 if (!parsed) {
   throw Error('parse error');
 }
 const source = vtpReader.getOutputData(0);
 source.buildCells();

 const allVertices = source.getPoints().getData();
 const allScalars = source.getCellData().getScalars().getData();

 const calcCount = (data: any) => {
  return data.reduce(function (time: any, name: any) {
    if (name in time) {
      time[name]++;
    } else {
      time[name] = 1;
    }
    return time;
  }, {});
 };

 const space = calcCount(allScalars);
 let verticesMap = new Map();
 let indicesMap = new Map();

 let geometriesMap = new Map();

 const allocSize = (obj: any) => {
  Object.entries(obj).forEach(([key, value]) => {
    verticesMap.set(~~key, []);
    indicesMap.set(~~key, []);
  });
};

 allocSize(space);

 const _appendVertices = (scalars:any, cellPointIds: any, allVertices: any) => {
  let data = verticesMap.get(scalars);

  cellPointIds.forEach((id: any) => {
    data.push(allVertices[id * 3]);
    data.push(allVertices[id * 3 + 1]);
    data.push(allVertices[id * 3 + 2]);
  });

  verticesMap.set(scalars, data);
}

const _appendIndices = (scalars: any) => {
  let data = indicesMap.get(scalars);
  const length = data.length;
  data.push(length);
  data.push(length + 1);
  data.push(length + 2);
  indicesMap.set(scalars, data);
}

 // console.time('build scalars.');
 allScalars.forEach((value: any, index: number) => {
  const { cellPointIds } = source.getCellPoints(index);
  _appendVertices(value, cellPointIds, allVertices);
  _appendIndices(value);
});
// console.timeEnd('build scalars.');

// console.time('build geometry.');
for await (const [key, value] of indicesMap.entries()) {
  let geometry = new THREE.BufferGeometry();
  const vertices = verticesMap.get(key);
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(value), 1));
  geometry.computeVertexNormals();
  geometry.userData.id = key;
  geometry.computeBoundingSphere();
  geometriesMap.set(key, geometry);
}

// console.timeEnd('build geometry.');
 verticesMap.clear();
 indicesMap.clear();

 return geometriesMap.values();
};

export {
  SingleLabelLoader,
  MultiLabelLoader,
}