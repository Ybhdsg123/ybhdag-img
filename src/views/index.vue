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
          class="my-img"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useWaterfall } from "@/utils/tool";
let clientW = ref(); // 屏幕宽度
let clientH = ref(); // 屏幕高度
let imgs = ref([]);
let arrImgs = ref([]); // 获取的图片数据
let columnNums = ref(2); // 要几列展示
const gap = 13; // 图片之间的间隔
// 监听屏幕宽度
watchEffect(() => {
  clientW.value = document.documentElement.clientWidth;
});
// 屏幕变化时动态获取屏幕宽度
onMounted(() => {
  window.onresize = () => {
    clientW.value = document.documentElement.clientWidth;
    // getImgs();
    // 计算图片的大小和定位 瀑布流
    arrImgs.value = useWaterfall(
      imgs.value,
      clientW.value,
      columnNums.value,
      gap
    );
  };
});
// 获取所有图片
const getImgs = () => {
  const objImgs = import.meta.glob("@/assets/hunli/**", {
    eager: true,
  });
  for (let key in objImgs) {
    imgs.value.push({ img: "../../" + objImgs[key].default });
  }
  // 计算图片的大小和定位 瀑布流
  arrImgs.value = useWaterfall(
    imgs.value,
    clientW.value,
    columnNums.value,
    gap
  );
};
getImgs();
</script>

<style scoped>
/* .img-box {
  width: 100%;
  height: 100%;
  padding: 13px;
  box-sizing: border-box;
} */
#list {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.my-img {
  border-radius: 13px;
}
</style>
