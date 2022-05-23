import { ReactThreeFiber } from '@react-three/fiber';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

export {};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      trackballControls: ReactThreeFiber.Node<TrackballControls, typeof TrackballControls>
    }
  }
}
