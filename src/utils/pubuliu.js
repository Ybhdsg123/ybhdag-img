let columnNums = 2 // 有多少列
const gap = 8 // 图片之间的间隔
const columnHeights = [] // 列的高度

function waterfall(data) { // data为图片数组
  const columnHeights= [] // 列的高度
  let { offsetWidth: pW } = document.getElementById('list').parentNode.offsetWidth
  pW -= gap * (columnNums - 1) // 总体宽度数值等于减去间隔
  const newList = JSON.parse(JSON.stringify(data))
  for (let i = 0; i < newList.length; i++) {
    let index = i % columnNums
    const item = newList[i]
    item.w = pW / columnNums // 图片宽度
    item.h = item.height * (pW / columnNums / item.width) // 图片高度
    item.left = index * (pW / columnNums + gap) // 定位
    item.top = columnHeights[index] + gap || 0 // 定位
    columnHeights[index] = isNaN(columnHeights[index]) ? item.h : item.h + columnHeights[index] + gap // 记录列高度
  }
  return newList
}
