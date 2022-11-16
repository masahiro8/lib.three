<template>
  <div id="app">
    <Triangles id="triangles" :scroll="sc" />
    <Texts id="texts" :scroll="sc" />
    <Lines id="lines" :scroll="sc" />
    <Dots id="dots" :scroll="sc" />
  </div>
</template>

<script>
import Dots from "./components/Dots";
import Lines from "./components/Lines";
import Texts from "./components/Texts";
import Triangles from "./components/Triangles";
import { ScrollCallback } from "./util/ScrollCallback";

export default {
  name: "App",
  components: {
    Dots,
    Lines,
    Texts,
    Triangles,
  },
  data: () => {
    return {
      sc: 0,
    };
  },
  mounted() {
    ScrollCallback((s) => {
      this.sc = s;
    });
  },
};
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
}

#dots {
  position: relative;
  height: 100vh;
  width: 100%;
  border-bottom: 1px solid #ebebeb;
}

#lines {
  position: relative;
  height: 100vh;
  width: 100%;
  border-bottom: 1px solid #ebebeb;
}

#texts {
  position: relative;
  height: 100vh;
  width: 100%;
  border-bottom: 1px solid #ebebeb;
}

#triangles {
  position: relative;
  height: 100vh;
  width: 100%;
  border-bottom: 1px solid #ebebeb;
}
</style>
