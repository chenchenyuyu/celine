import { Object3D, Vector3, Matrix4, Scene } from 'three';

type Camera = THREE.OrthographicCamera | THREE.PerspectiveCamera;

class CSS2DObject extends Object3D {
  public isCSS2DObject: Boolean;
  public element: HTMLDivElement;

  constructor(element = document.createElement('div')) {
    super();
    this.isCSS2DObject = true;
    this.element = element;

    this.element.style.position = 'absolute';
    this.element.style.userSelect = 'none';
    this.element.setAttribute('draggable', 'false');

    this.addEventListener('removed', () => {
      this.traverse((object: any) => {
        if(object.element instanceof Element && object.element.parentNode !== null) {
          object.element.parentNode.removeChild(object.element);
        }
      });
    });
  }

   copy(source: any, recursive: boolean) {
    super.copy( source, recursive );

		this.element = source.element.cloneNode( true );

		return this;
  }

};

// 1. label dom mount
// 2. label position
// 3. label z-index
// 4. label render
// 5. label setSize
// labelRenderer = new CSS2DRenderer();
// labelRenderer.setSize( window.innerWidth, window.innerHeight );
// labelRenderer.domElement.style.position = 'absolute';
// labelRenderer.domElement.style.top = '0px';
// document.body.appendChild( labelRenderer.domElement );
// labelRenderer.render( scene, camera );

const _vector = new Vector3();
const _viewMatrix = new Matrix4();
const _viewProjectionMatrix = new Matrix4();
const _a = new Vector3();
const _b = new Vector3();

class CSS2DRenderer {

  // API
  public domElement: HTMLDivElement;

  public getSize: () => Object;

  public render: (scene: any, camera: any) => void;

  public setSize: (width: number, height: number) => void;

  constructor(parameters = {} as any) {
    const _this = this as any;

    // width, height
    let _width: number, _height: number;
    let _halfWidth: number, _halfHeight: number;

    // cache 
    const cache = {
			objects: new WeakMap(),
		};
    
    // dom element
    let domElement = parameters.element !== undefined ? parameters.element : document.createElement('div');
    
    domElement.style.overflow = 'hidden';

    this.domElement = domElement;

     this.getSize = () => {
      return {
        width: _width,
        height: _height,
      }
    };
    
    // render
    // auto update matrix
    this.render = (scene: any, camera: any) => {
      if ( scene.autoUpdate === true ) scene.updateMatrixWorld();
			if ( camera.parent === null ) camera.updateMatrixWorld();
      _viewMatrix.copy(camera.matrixWorldInverse);
      _viewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, _viewMatrix);

      // render objects
      renderObject(scene, scene, camera);
      // render z-index
      zOrder(scene);
    }

    // set domElement width, height
    this.setSize = (width: number, height: number) => {
      _width = width;
      _height = height;

      _halfWidth = _width / 2;
      _halfHeight = _height / 2;
      
      domElement.style.width = `${width}px`;
      domElement.style.height = `${height}px`;
    }

    const renderObject = (object: CSS2DObject, scene: Scene, camera: Camera) => {
      // scene.add(object)?
      // rotate camera position
      if(object.isCSS2DObject) {
        _vector.setFromMatrixPosition(object.matrixWorld);
        _vector.applyMatrix4(_viewProjectionMatrix);
   
        const visible = ( object.visible === true ) && ( _vector.z >= - 1 && _vector.z <= 1 ) && ( object.layers.test( camera.layers ) === true );
        object.element.style.display = (visible === true) ? '' : 'none';
  
        if(visible === true) {
          object.onBeforeRender(_this, scene, camera, undefined as any, undefined as any, undefined as any);
          const element = object.element;
          element.style.transform = 'translate(-50%,-50%) translate(' + ( _vector.x * _halfWidth + _halfWidth ) + 'px,' + ( - _vector.y * _halfHeight + _halfHeight ) + 'px)';
          
          if(element.parentNode !== domElement) {
            domElement.appendChild(element);
          }

          object.onAfterRender(_this, scene, camera, undefined as any, undefined as any, undefined as any);
        }

        const objectData = {
					distanceToCameraSquared: getDistanceToSquared(camera, object), // camera, object distance
				};

				cache.objects.set( object, objectData );
      }

      for (let i = 0, l = object.children.length; i < l; i ++) {
        renderObject(object.children[i] as CSS2DObject, scene, camera);
      }
    };

    const getDistanceToSquared = (object1: any, object2: any) => {
      _a.setFromMatrixPosition(object1);
      _b.setFromMatrixPosition(object2);
      return _a.distanceToSquared(_b);
    }

    const filterAndFlatten = (scene: Scene) => {
      const result = [] as any[];

      scene.traverse((object: any) => {
        if(object.isCSS2DObject) {
          result.push(object);
        }
      });

      return result;
    };
  
    const zOrder = (scene: Scene) => {
      // set every css2dobject z-index
      const sorts = filterAndFlatten(scene).sort((a: any, b: any) => {
        if(a.renderOrder !== b.renderOrder) {
          return b.renderOrder - a.renderOrder; // 大 -> 小?
        }
        const distanceA = cache.objects.get( a ).distanceToCameraSquared;
				const distanceB = cache.objects.get( b ).distanceToCameraSquared;
				return distanceA - distanceB; // 小 -> 大(距离小，离照相机近)
      });

      const zMax = sorts.length;
      for(let i = 0; i < sorts.length; i++) {
        sorts[i].element.style.zIndex = zMax - i;
      }
    };
  }

}

export {
  CSS2DObject,
  CSS2DRenderer,
};