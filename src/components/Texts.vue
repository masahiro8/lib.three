<template>
  <div>
    <div id="three_texts" />
  </div>
</template>
<script>
import * as THREE from "three";
import { SceneTexts } from "./three/scene_texts";

export default {
  name: "Lines",
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

    const s = SceneTexts();
    await s.initAsync({ canvasId: "three_texts", width, height });
    // s.setOrbitCont();
    this.scene = s;

    // 数字表示サイズ
    const counter = this.count({
      h: 1,
      v: 5,
      scale: 0.2,
      fontSize: 8,
      msec: 30,
      color: 0xcccccc,
    });

    let prevScroll = 0;
    let rotateValue = 0;

    this.$watch(
      () => this.scroll,
      (val) => {
        //　差分
        const diff = val - prevScroll;
        rotateValue += diff;
        this.scrollOnAnimation({ scroll: rotateValue, diff });
        if (diff > 0) {
          counter.up();
        } else {
          counter.down();
        }
        prevScroll = val;
      }
    );
  },
  methods: {
    scrollOnAnimation({ scroll, diff }) {
      const onPlay = () => {};
      onPlay();
    },
    count({ h, v, scale, fontSize, msec, color }) {
      //レイアウト
      const width = window.innerWidth * scale;
      const height = window.innerHeight * scale;
      const x_rate = width / h;
      const z_rate = height / v;
      const less_x = x_rate * ((h - 1) / 2);
      const less_z = z_rate * ((v - 1) / 2);

      // h * v の配置データ
      let nMatrix = new Array(v).fill().map((n) => {
        return new Array(h).fill().map((n) => {
          return 0;
        });
      });

      let prev = new Date();
      const up = () => {
        // requestAnimationFrame(update);

        // 更新時間の計算
        const now = new Date();
        const diff = now.getTime() - prev.getTime();
        if (diff > msec) {
          this.scene.clearItems();
          nMatrix = nMatrix.map((ln, _z) => {
            return ln.map((n, _x) => {
              const x = _x * x_rate - less_x;
              const z = _z * z_rate - less_z;

              //テキスト描画
              this.scene.addText({
                message: `${n}`,
                size: fontSize,
                point: { x, y: 0, z },
                color: color,
              });
              return n + Math.floor(Math.random() * 999999);
            });
          });
          prev = new Date();
        }
      };
      const down = () => {
        // requestAnimationFrame(update);

        // 更新時間の計算
        const now = new Date();
        const diff = now.getTime() - prev.getTime();
        if (diff > msec) {
          this.scene.clearItems();
          nMatrix = nMatrix.map((ln, _z) => {
            return ln.map((n, _x) => {
              const x = _x * x_rate - less_x;
              const z = _z * z_rate - less_z;

              //テキスト描画
              this.scene.addText({
                message: `${n}`,
                size: fontSize,
                point: { x, y: 0, z },
                color: color,
              });
              return n > 0 ? n - Math.floor(Math.random() * 999999) : 0;
            });
          });
          prev = new Date();
        }
      };
      return {
        up,
        down,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
#three_lines {
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>