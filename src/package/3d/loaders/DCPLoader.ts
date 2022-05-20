import * as THREE from 'three';
import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';
import parseDCP from 'parsedcp';

const DCPLoader = async (url: string) => {
 const geometry = new THREE.BufferGeometry();
 const resp = await fetch(url);
 const binary = await resp.arrayBuffer();

 const vtpReader = vtkXMLPolyDataReader.newInstance();

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

 const vertices = source.getPoints().getData();
 geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
 geometry.attributes.position.needsUpdate = true;

 const scalars =
   source.getPointData().getScalars() &&
   source
     .getPointData()
     .getScalars()
     .getData();
 if (scalars) {
   geometry.setAttribute('scalar', new THREE.BufferAttribute(scalars, 1));
   geometry.attributes.scalar.needsUpdate = true;
 }

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

export { DCPLoader };

export default DCPLoader;
