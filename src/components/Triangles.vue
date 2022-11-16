<template>
  <div>
    <div id="three_triangles" />
  </div>
</template>
<script>
import { SceneTriangle } from "./three/scene_triangles";

export default {
  name: "Triangles",
  data: () => {
    return {
      scene: null,
      GenLines: null,
    };
  },
  props: {
    scroll: {
      type: Number,
    },
  },
  async mounted() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const s = SceneTriangle();
    await s.init({ canvasId: "three_triangles", width, height });
    // s.setOrbitCont();
    s.initTriangle({
      r: 20,
      center: { x: 0, y: 0, z: 0 },
      color: 0x888888,
      lineColor: 0x000000,
      subdivide: 8,
      speed: 6,
    });

    s.initTriangle({
      r: 20,
      center: { x: 0, y: 0, z: 10 },
      color: 0xaaaaaa,
      lineColor: 0x000000,
      subdivide: 5,
      speed: 1,
    });

    s.initTriangle({
      r: 22,
      center: { x: 0, y: 0, z: 20 },
      color: 0xcccccc,
      lineColor: 0x000000,
      subdivide: 3,
      speed: 4,
    });

    s.initTriangle({
      r: 22,
      center: { x: 0, y: 0, z: -10 },
      color: 0xcccccc,
      lineColor: 0x000000,
      subdivide: 4,
      speed: 0.5,
    });

    this.scene = s;

    this.$watch(
      () => this.scroll,
      (val) => {
        s.clear();
        s.drawTriangle(val * 0.3);
      }
    );
  },
  methods: {
    scrollOnAnimation() {
      const onPlay = () => {};
      onPlay();
    },
  },
};
</script>
<style scoped>
#three_lines {
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
