<template>
  <div @click="dianji">点击</div>
  <div @click="columnNums = 3">变换</div>
  <div class="img-box">
    <div id="list">
      <div
        :style="{
          width: `${obj.w}px`,
          height: `${obj.h}px`,
        }"
        v-for="(obj, i) in arrImgs"
        :key="i"
      >
        <img
          style="width: 100%; height: 100%"
          :src="obj.img"
          alt=""
          mode="widthFix"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted } from "vue";

let clientW = ref(); // 屏幕宽度
let clientH = ref(); // 屏幕高度
let arrImgs = ref([]); // 获取的图片数据
let columnNums = ref(2); // 要几列展示
const gap = 8; // 图片之间的间搁
watchEffect(() => {
  clientW.value = document.documentElement.clientWidth;
  // console.log(clientW.value);
});

onMounted(() => {
  var intersectionObserver = new IntersectionObserver(function (entries) {
    // 如果intersectionRatio为0，目标就在视野之外。不需要做什么
    if (entries[0].intersectionRatio <= 0) return;
    console.log("Loaded new items");
  });
  // 开始观察
  // intersectionObserver.observe(document.querySelector(".hhh"));
  return;
  window.onresize = () =>
    (clientW.value = document.documentElement.clientWidth);
});
const dianji = () => {
  let arrimg = [];
  const objImgs = import.meta.glob("../../public/hunli/*.jpg", {
    eager: true,
  });
  for (let key in objImgs) {
    arrimg.push({ img: objImgs[key].default });
  }
  arrImgs.value = waterfall(arrimg, columnNums.value);
  console.log(arrImgs.value);
};
dianji();
// 瀑布流 等宽不等高
function waterfall(data, columnNums) {
  let pW = clientW.value - gap * (columnNums - 1); // 总宽度
  let newList = JSON.parse(JSON.stringify(data)); // 深拷贝数据
  newList.length > 0 &&
    newList.forEach((obj, i) => {
      obj.w = pW / columnNums; // 图片宽度
      // 创建图片对象获取图片的宽高
      let img = new Image();
      img.src = obj.img;
      obj.h = Number((img.height * (obj.w / img.width)).toFixed(0));
    });
  return newList;
}
</script>

<style scoped>
.img-box {
  width: 100vw;
  height: 100vh;
}
#list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
