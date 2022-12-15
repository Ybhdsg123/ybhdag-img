<template>
  <div class="img-box">
    <div id="list">
      <div
        :style="{
          position: 'absolute',
          width: `${obj.w}px`,
          height: `${obj.h}px`,
          left: `${obj.left}px`,
          top: `${obj.top}px`,
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
const gap = 8; // 图片之间的间隔
// 监听屏幕宽度
watchEffect(() => {
  clientW.value = document.documentElement.clientWidth;
});
// 屏幕变化时动态获取屏幕宽度
onMounted(() => {
  window.onresize = () => {
    clientW.value = document.documentElement.clientWidth;
    getImgs();
  };
});
// 获取所有图片
const getImgs = () => {
  let arrimg = [];
  const objImgs = import.meta.glob("../../public/hunli/**", {
    eager: true,
  });
  for (let key in objImgs) {
    arrimg.push({ img: objImgs[key].default });
  }
  arrImgs.value = waterfall(arrimg, columnNums.value);
};
getImgs();
// 瀑布流 等宽不等高
function waterfall(data, columnNums) {
  let pW = clientW.value - gap * (columnNums - 1); // 总宽度
  const columnHeights = []; // 列的高度
  let newList = JSON.parse(JSON.stringify(data)); // 深拷贝数据
  newList.length > 0 &&
    newList.forEach((obj, i) => {
      let index = i % columnNums; // 遍历的图片和列数取余
      obj.w = pW / columnNums; // 图片宽度
      // 创建图片对象获取图片的宽高
      let img = new Image();
      img.src = obj.img;
      obj.h = Number((img.height * (obj.w / img.width)).toFixed(0));
      obj.left = index * (obj.w + gap); //左边距离 2列的话，1/3/5距离左边距离为0，2/4/6距离左边距离为图片的宽度+间隔距离
      // obj.top = columnHeights[index] + gap || 0; // 定位高度
      // 第一张和第二张距离顶部的高度为0
      if (isNaN(columnHeights[index])) {
        columnHeights[index] = obj.h;
      } else {
        // 第二张往后 找出前面的高度最小的索引
        index = columnHeights.indexOf(Math.min(...columnHeights));
        console.log(index);
        obj.left = index * (pW / columnNums + gap); // 改变每一张距离左边的距离
        obj.top = columnHeights[index] + gap || 0; // 距离上面的距离
        columnHeights[index] = obj.h + columnHeights[index] + gap; // 累加高度
      }
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
