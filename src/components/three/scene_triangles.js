import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const rotationToRadian = (r) => {
  return (r / 180) * Math.PI;
};

export const SceneTriangle = () => {
  let scene;
  let camera;
  let hemiLight;
  let renderer;
  let orbitControls;

  let datas = [];
  let objs = [];
  // let pointsConfig = [];
  // let material = null;

  // const setCameraPosition = (n) => {
  //   const radian = (n * 0.1 * Math.PI) / 180;
  //   const _x = 100 * Math.sin(radian);
  //   const _z = 100 * Math.cos(radian);
  //   camera.position.set(_x, 0, _z);
  //   camera.up.set(0, 0, 0);
  // };

  const init = ({ canvasId, width, height }) => {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setPixelRatio(
      window.devicePixelRatio ? window.devicePixelRatio : 1
    );
    renderer.setClearColor(new THREE.Color(0xeeeeee));
    document.getElementById(canvasId).appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(83, width / height, 0.1, 2000);
    camera.position.set(10, -60, 60);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    hemiLight = new THREE.HemisphereLight(0xff0000, 0xffffff, 1);
    scene.add(hemiLight);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 500, 0);

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);
    axis.position.set(0, 0, 0);

    console.log("init");

    // レンダリング
    const nrender = () => {
      requestAnimationFrame(nrender);
      renderer.render(scene, camera);
    };
    nrender();
  };

  const setOrbitCont = () => {
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true; // 視点操作のイージングをONにする
    orbitControls.dampingFactor = 0.2; // 視点操作のイージングの値
    orbitControls.rotateSpeed = 0.3; // 視点変更の速さ
    orbitControls.noZoom = true; // ズーム禁止
    orbitControls.enableZoom = true;
    orbitControls.noPan = false; // パン操作禁止
    orbitControls.enablePan = false;
  };

  const initTriangle = ({ r, center, color, lineColor, subdivide, speed }) => {
    const material = new THREE.LineBasicMaterial({
      color,
      linewidth: 1
    });

    const materialLine = new THREE.LineBasicMaterial({
      color: lineColor,
      linewidth: 1
    });

    const pointsConfig = new Array(subdivide).fill().map((v, index) => {
      const deg_x = (360 / subdivide) * index;
      const deg_y = (360 / subdivide) * index;
      const deg_z = (360 / subdivide) * index;
      return { r, deg_x, deg_y, deg_z, center, speed };
    });
    datas.push({ pointsConfig, material, materialLine });

    console.log("pointsConfig", pointsConfig);
  };

  const drawTriangle = (_deg) => {
    const deg = _deg;
    let vertices = [];

    //　座標
    const getPosition = ({ r, deg_x, deg_y, deg_z, center, speed }) => {
      const x =
        r * Math.cos((deg_x + deg * speed) * (Math.PI / 180)) + center.x;
      const y =
        r * Math.sin((deg_y + deg * speed) * (Math.PI / 180)) + center.y;
      const z = r * 0.01 * Math.tan((deg_z + deg) * (Math.PI / 180)) + center.z;
      return { x, y, z: center.z };
    };

    // 頂点から3角ポリゴンに変換
    datas.forEach(({ pointsConfig, material, materialLine }) => {
      const tris = new Array(pointsConfig.length - 2).fill().map((t, i) => {
        const indexs = [0, i + 1, i + 2];
        return indexs.map((index) => {
          return getPosition(pointsConfig[index]);
        });
      });
      vertices = [...tris.flat()];
      const _points = vertices.map((point) => {
        return new THREE.Vector3(point.x, point.y, point.z);
      });
      const geometry = new THREE.BufferGeometry().setFromPoints(_points);
      geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

      const obj = new THREE.Mesh(geometry, material);
      objs.push(obj);
      scene.add(obj);

      const lines = new THREE.Line(geometry, materialLine);
      objs.push(lines);
      scene.add(lines);
    });
  };

  /**
   *
   * 中心点を指定し、ランダムな半径で三角形を描画、
   * スクロールで回転する
   */

  const clear = () => {
    objs.forEach((obj) => {
      scene.remove(obj);
      obj.material.dispose();
      obj.geometry.dispose();
    });
  };

  return {
    init,
    setOrbitCont,
    initTriangle,
    drawTriangle,
    clear
  };
};
