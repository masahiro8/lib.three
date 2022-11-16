import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 半球
// https://threejs.org/docs/#api/en/geometries/SphereGeometry

const rotationToRadian = (r) => {
  return (r / 180) * Math.PI;
};

export const SceneDots = () => {
  let scene;
  let camera;
  let hemiLight;
  let renderer;
  let orbitControls;

  let dots = [];
  let dotsConfigs = [];

  const init = ({ canvasId, width, height }) => {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setPixelRatio(
      window.devicePixelRatio ? window.devicePixelRatio : 1
    );
    renderer.setClearColor(new THREE.Color(0xeeeeee));
    document.getElementById(canvasId).appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(83, width / height, 0.1, 1000);
    camera.position.set(50, -130, -40);
    camera.lookAt(new THREE.Vector3(-40, 0, -50));

    hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    scene.add(hemiLight);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 500, 0);

    // const axis = new THREE.AxesHelper(200);
    // scene.add(axis);
    // axis.position.set(0, 0, 0);

    console.log("init");

    // レンダリング
    const nrender = () => {
      requestAnimationFrame(nrender);
      renderer.render(scene, camera);
    };
    nrender();
  };

  // 色
  const rgb2hex = (rgb) => {
    return (
      "#" +
      rgb
        .map(function (value) {
          return ("0" + value.toString(16)).slice(-2);
        })
        .join("")
    );
  };

  const addPoint = ({
    radius,
    segments,
    position,
    color = [255, 255, 255]
  }) => {
    const mesh = new THREE.Mesh(
      // new THREE.CylinderGeometry(10, 10, 1, 32),
      new THREE.SphereGeometry(radius, segments, segments),
      new THREE.MeshBasicMaterial({
        color: rgb2hex(color)
      })
    );

    let obj = new THREE.Object3D();
    obj.add(mesh);
    obj.visible = true;
    obj.position.set(position.x, position.y, position.z);
    scene.add(obj);
    camera.lookAt(position);
  };

  const drawDots = (deg) => {
    const vertices = [];
    //　座標
    for (let i = 0; i < dotsConfigs.length; i++) {
      const { r, deg_x, deg_y, deg_z } = dotsConfigs[i];
      const x = r * Math.cos((deg_x + deg) * (Math.PI / 180));
      const y = r * Math.sin((deg_y + deg) * (Math.PI / 180));
      const z = r * Math.tan((deg_z + deg) * (Math.PI / 180));
      vertices.push(x, y, z);
    }

    // 形状データを作成
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    // マテリアルを作成
    const material = new THREE.PointsMaterial({
      size: 1,
      color: rgb2hex([200, 200, 200])
    });

    // 物体を作成
    const mesh = new THREE.Points(geometry, material);
    dots.push(mesh);
    scene.add(mesh);
  };

  const initDots = ({ size = 1000, length = 1000 }) => {
    const maxR = 300; //最大半径

    for (let i = 0; i < length; i++) {
      const r = Math.random() * maxR;
      const deg_x = Math.random() * 360;
      const deg_y = Math.random() * 360;
      const deg_z = Math.random() * 360;
      dotsConfigs.push({ r, deg_x, deg_y, deg_z });
    }

    drawDots(1);
  };

  const clearDots = () => {
    dots.forEach((dot) => {
      scene.remove(dot);
      dot.material.dispose();
      dot.geometry.dispose();
    });
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

  return {
    init,
    addPoint,
    initDots,
    drawDots,
    clearDots,
    setOrbitCont
  };
};
