import { onMounted,watchEffect,ref } from "vue";

export const getClinentWidth = ()=>{
// 默认宽度
let clientWidth = ref(790)
// 屏幕变化时动态获取屏幕宽度
onMounted(() => {
  clientWidth.value = document.documentElement.clientWidth
  // window.onresize = () => {
  //   clientWidth.value = document.documentElement.clientWidth;
  // };
});
// 监听屏幕宽度
watchEffect(()=>{
  window.onresize = () => {
    clientWidth.value = document.documentElement.clientWidth;
  };
  // clientWidth.value = document.documentElement.clientWidth
})


return clientWidth.value
}