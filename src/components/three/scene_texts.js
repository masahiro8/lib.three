import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const rotationToRadian = (r) => {
  return (r / 180) * Math.PI;
};

export const SceneTexts = () => {
  let scene;
  let camera;
  let hemiLight;
  let renderer;
  let orbitControls;

  let items = [];
  let _font = null;

  const fontLoad = () => {
    return new Promise((resolve) => {
      const loader = new THREE.FontLoader();
      loader.load("/fonts/helvetiker_regular.typeface.json", function (font) {
        _font = font;
        resolve();
      });
    });
  };

  const initAsync = async ({ canvasId, width, height }) => {
    return new Promise(async (resolve) => {
      await fontLoad();

      scene = new THREE.Scene();
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      renderer.setPixelRatio(
        window.devicePixelRatio ? window.devicePixelRatio : 1
      );
      renderer.setClearColor(new THREE.Color(0xeeeeee));
      document.getElementById(canvasId).appendChild(renderer.domElement);

      camera = new THREE.PerspectiveCamera(83, width / height, 0.1, 2000);
      camera.position.set(0, -200, 0);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      hemiLight = new THREE.HemisphereLight(0xff0000, 0xffffff, 1);
      scene.add(hemiLight);
      hemiLight.color.setHSL(0.6, 1, 0.6);
      hemiLight.groundColor.setHSL(0.095, 1, 0.75);
      hemiLight.position.set(0, 500, 0);

      // const axis = new THREE.AxesHelper(100);
      // scene.add(axis);
      // axis.position.set(0, 0, 0);

      console.log("init");
      // レンダリング
      const nrender = () => {
        requestAnimationFrame(nrender);
        renderer.render(scene, camera);
      };
      nrender();
      resolve();
    });
  };

  const setOrbitCont = () => {
    console.log("setOrbitCont");
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true; // 視点操作のイージングをONにする
    orbitControls.dampingFactor = 0.2; // 視点操作のイージングの値
    orbitControls.rotateSpeed = 0.3; // 視点変更の速さ
    orbitControls.noZoom = true; // ズーム禁止
    orbitControls.enableZoom = true;
    orbitControls.noPan = false; // パン操作禁止
    orbitControls.enablePan = false;
  };

  const addText = ({ message, size, point, color }) => {
    const matLite = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });

    const shapes = _font.generateShapes(message, size);
    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    //センター寄せ
    const xMid =
      -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
    const text = new THREE.Mesh(geometry, matLite);
    text.rotation.x = Math.PI / 2;
    text.position.set(point.x, point.y, point.z);
    items.push(text);
    scene.add(text);
    // const loader = new THREE.FontLoader();
    // loader.load("/fonts/helvetiker_regular.typeface.json", function (font) {
    //   const matLite = new THREE.MeshBasicMaterial({
    //     color,
    //     transparent: true,
    //     opacity: 0.7,
    //     side: THREE.DoubleSide
    //   });

    //   const shapes = font.generateShapes(message, size);
    //   const geometry = new THREE.ShapeGeometry(shapes);
    //   geometry.computeBoundingBox();
    //   //センター寄せ
    //   const xMid =
    //     -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    //   geometry.translate(xMid, 0, 0);
    //   const text = new THREE.Mesh(geometry, matLite);
    //   text.rotation.x = Math.PI / 2;
    //   text.position.set(point.x, point.y, point.z);
    //   items.push(text);
    //   scene.add(text);
    // });
  };

  const clearItems = () => {
    items.forEach((item) => {
      scene.remove(item);
      item.material.dispose();
      item.geometry.dispose();
    });
    items = [];
  };

  return {
    initAsync,
    setOrbitCont,
    addText,
    clearItems
  };
};
