import * as React from 'react';
import { Mesh } from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

// Contants
// export enum SplitStrategy {}
// export let CENTER: SplitStrategy;
// export let AVERAGE: SplitStrategy;
// export let SAH: SplitStrategy;

export interface BVHOptions {
  strategy?: 'CENTER' | 'AVERAGE' | 'SAH';
  maxDepth?: number;
  maxLeafTris?: number;
  setBoundingBox?: boolean;
  useSharedArrayBuffer?: boolean;
  verbose?: boolean;
  onProgress?: ( progress: number ) => void;
}

const useBVH = (mesh: React.MutableRefObject<Mesh | undefined>, options?: BVHOptions) => {
  React.useEffect(() => {
    if(mesh && mesh.current) {
      const geometry: any = mesh.current.geometry;
      geometry.computeBoundsTree = computeBoundsTree;
      geometry.disposeBoundsTree = disposeBoundsTree;

      mesh.current.raycast = acceleratedRaycast;
      console.time( 'computing bounds tree' );
      geometry.computeBoundsTree(options);
      console.timeEnd( 'computing bounds tree' );
      return() => {
        geometry.disposeBoundsTree();
      }
    }
  }, [mesh, options]);
};

export default useBVH;
