/**
 * @description: 瀑布流排法 等宽不等高  
 * @param {*} data 图片数组 [{img:imgurl}]
 * @param {*} clientW 图片的宽度
 * @param {*} columnNums columnNums 列数
 * @param {*} gap gap 间隔 
 * @return {*}
 */
export function useWaterfall(data,clientW, columnNums,gap) {
  let pW = clientW - gap * (columnNums - 1); // 总宽度
  const columnHeights = []; // 列的高度
  let newList = JSON.parse(JSON.stringify(data)); // 深拷贝数据
  newList.length > 0 &&
    newList.forEach(async (obj, i) => {
      let index = i % columnNums; // 遍历的图片和列数取余
      obj.w = pW / columnNums; // 图片宽度
      // 创建图片对象获取图片的宽高
      let img = new Image();
      img.src = obj.img;
      obj.h = Number((img.height * (obj.w / img.width)).toFixed(0)) ;
      obj.left = index * (obj.w + gap); //左边距离 2列的话，1/3/5距离左边距离为0，2/4/6距离左边距离为图片的宽度+间隔距离
      obj.top = columnHeights[index] + gap || 0; // 定位高度
      // 第一张和第二张距离顶部的高度为0
      if (isNaN(columnHeights[index])) {
        columnHeights[index] = obj.h;
      } else {
        // 第二张往后 找出前面的高度最小的索引
        index = columnHeights.indexOf(Math.min(...columnHeights));
        obj.left = index * (pW / columnNums + gap); // 改变每一张距离左边的距离
        obj.top = columnHeights[index] + gap || 0; // 距离上面的距离
        columnHeights[index] = obj.h + columnHeights[index] + gap; // 累加高度
      }
    });
  return newList;
}


// 异步得到图片大小
export const getImgSize = (url)=>{
  return new Promise((resolve,reject)=>{
    let img = new Image()
    img.onload=()=>{
      resolve({
        width: img.width,
        height: img.height
    });
    },
    img.onerror=()=>{
      reject(new Error('error'));
    }
    img.src = url;
  })
}