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
import { ref, watchEffect, onMounted, nextTick } from "vue";
import { useWaterfall } from "@/utils/tool";
import COS from "cos-js-sdk-v5";
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
  let img = [];
  for (let key in objImgs) {
    imgs.value.push({ img: "../../" + objImgs[key].default });
    console.log(objImgs[key].default);
    // img.push(pic);
    // let a = upload(img);
    // console.log(a);
  }

  // console.log(imgs.value, "imgs.value");
  // 计算图片的大小和定位 瀑布流排法
  arrImgs.value = useWaterfall(
    imgs.value,
    clientW.value,
    columnNums.value,
    gap
  );
};
getImgs();
// 覆盖默认的上传行为
function upload(url) {
  let imgList = [];
  // 腾讯云上传动作
  //  1. 创建一个 cos 对象
  let cos = new COS({
    SecretId: "AKIDlLfiUzECtKUNzLQFn44nFQKxJODm33nF",
    SecretKey: "D9oBI8hyzjBMGtGdjZ8PP9cnhKhma7NM",
  });
  // 执行上传操作
  cos.putObject(
    {
      Bucket: "ybhdsg-1310166944", // 存储桶
      Region: "ap-shanghai", // 地域
      Key: url, // 文件名
      // Body: params.file, // 要上传的文件对象
      StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
      Body: url, // 将本地的文件赋值给腾讯云配置
    },
    (err, data) => {
      // data返回数据之后 应该如何处理
      console.log(err || data);
      // data中有一个statusCode === 200 的时候说明上传成功
      if (!err && data.statusCode === 200) {
        let imgObj = { img: `http://${data.Location}` };
        imgList.push(imgObj);
      }
    }
  );
  return imgList;
}
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
