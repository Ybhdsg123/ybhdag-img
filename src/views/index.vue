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
        @click="priviewImgHandler(obj)"
      >
        <img
          style="width: 100%; height: 100%"
          :src="obj.img"
          mode="widthFix"
          class="my-img"
        />
      </div>
    </div>
    <!-- 预览图片 单张 -->
    <div
      v-show="isShowPriviewImg"
      class="modal"
      @click.self="isShowPriviewImg = false"
    >
      <img
        ref="preImgRef"
        :style="{ width: `${preW}px`, height: `${preH}px` }"
        :src="previewIMg"
        alt="预览图片"
        @pointerdown="pointerdownHandler"
        @pointerup="pointerupHandler"
        @pointermove="pointermoveHandler"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted, nextTick, computed } from "vue";
import { useWaterfall } from "@/utils/tool";
import COS from "cos-js-sdk-v5";
// 预览图片
let previewIMg = ref(); // 预览的图片
let isShowPriviewImg = ref(false); // 预览图片的弹层
let preW = ref(); // 预览的图片宽度
let preH = ref(); // 预览的图片高度
let scaleNum = ref(1); // 缩放倍数
// 计算属性依赖scaleNum，不然无法缩放
let transformTheme = computed(
  () => `scale(${scaleNum.value})translate(-50%, -50%) translateZ(0)`
);
let startPoint = ref({ x: 0, y: 0 }); // 记录初始触摸点位
let isTouching = ref(false); // 标记是否正在移动
let isMove = ref(false); // 正在移动中，与点击做区别
let imgLeft = ref("50%");
let imgTop = ref("50%");
let preImgRef = ref();
// 屏幕宽高
const { innerWidth: winWidth, innerHeight: winHeight } = window;
let clientW = ref(winWidth); // 屏幕宽度
let clientH = ref(winHeight); // 屏幕高度
let imgs = ref([]);
let arrImgs = ref([]); // 获取的图片数据
let columnNums = ref(2); // 要几列展示
const gap = 13; // 图片之间的间隔
clientW.value = document.documentElement.clientWidth;
// 监听屏幕宽度
watchEffect(() => {
  clientW.value = document.documentElement.clientWidth;
});

// 鼠标滚轮事件
function zoom(event) {
  if (!event.deltaY) {
    return;
  }
  // console.log(event.deltaY); // event.deltaY 的正负判断滚轮是朝上还是朝下：
  event.preventDefault(); // 阻止默认行为的话，mousewheel 事件第三个参数需为 passive：false，阻止默认行为是配合passive使用
  if (event.deltaY < 0) {
    scaleNum.value += 0.1; // 放大
  } else if (event.deltaY > 0) {
    scaleNum.value >= 0.2 && (scaleNum.value -= 0.1); // 缩小
  }
}
// 鼠标/手指按下
function pointerdownHandler(e) {
  e.preventDefault(); // 禁用其默认行为
  isTouching.value = true; // 标记其正在移动
  startPoint.value = { x: e.clientX, y: e.clientY };
}
// 鼠标/手指抬起
function pointerupHandler(e) {
  isTouching.value = false; // 标记其移动结束
  setTimeout(() => {
    isMove.value = false;
  }, 300);
}
// 鼠标/手指移动
function pointermoveHandler(e) {
  if (isTouching.value) {
    isMove.value = true;
    // 单指滑动/鼠标移动
    imgLeft.value = e.clientX + "px";
    imgTop.value = e.clientY + "px";
    // 注意移动完也要更新初始点位，否则图片会加速逃逸可视区域
    // startPoint.value = { x: e.clientX, y: e.clientY };
  }
}
// 屏幕变化时动态获取屏幕宽度
onMounted(() => {
  // 给图片添加 滚轮事件
  preImgRef.value.addEventListener("mousewheel", zoom, { passive: false });
  window.onresize = () => {
    clientW.value = document.documentElement.clientWidth;
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
  // import.meta.glob 获取文件夹下的文件
  const objImgs = import.meta.glob("@/assets/hunli/**", {
    eager: true,
  });
  let img = [];
  for (let key in objImgs) {
    imgs.value.push({ img: "../../" + objImgs[key].default, isShow: true });
  }
  // 计算图片的大小和定位 瀑布流排法
  arrImgs.value = useWaterfall(
    imgs.value,
    clientW.value,
    columnNums.value,
    gap
  );
};
getImgs();

// 查看图片
function priviewImgHandler(obj) {
  isShowPriviewImg.value = true;
  previewIMg.value = obj.img;
  preW.value = obj.w;
  preH.value = obj.h;
  obj.isShow = false;
}

// 上传行为
function upload(url) {
  let imgList = [];
  // 腾讯云上传动作
  //  1. 创建一个 cos 对象
  let cos = new COS({
    SecretId: "",
    SecretKey: "",
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
#list {
  /* 禁用元素上的所有手势,使用自己的拖放和缩放api  touch-action:manipulation;解决缩放手势引起的点击事件延迟 */
  touch-action: none;
  /* 用于设置用户是否能够选中文本, 可用于除替换元素外的所有元素,img标签时可替换元素 */
  user-select: none;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.my-img {
  border-radius: 13px;
}

/* 预览图片 */
.modal {
  touch-action: none;
  user-select: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  transition: transform 0.3s;
}
.modal > img {
  position: absolute;
  left: v-bind("imgLeft");
  top: v-bind("imgTop");
  padding: 0;
  margin: 0;
  transform: v-bind("transformTheme");
  transform-origin: 0 0;
}
</style>
