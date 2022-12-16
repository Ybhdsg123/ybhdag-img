const fs = require('fs')
const path = require('path')
const sizeOf = require('image-size')

const basePath = path.resolve('view/src/assets/hunli')
const jsonPath = path.resolve('view/src/assets/data/datalist.json')
const picsData = []

fs.readdir(basePath, async function (err, files) {
  //遍历读取到的文件列表
  for (let i = 0; i < files.length; i++) {
    const filename = files[i]
    const filedir = path.join(basePath, filename)
    //根据文件路径获取文件信息，返回一个fs.Stats对象
    const stats = await fs.statSync(filedir)
    if (stats.isFile()) {
      let dimensions = { url: filename, ...sizeOf(filedir) }
      if (dimensions.width) {
        cp(filedir, path.resolve(`view/public/${filename}`)) // 复制图片
        picsData.push({ ...dimensions })
      }
    }
  }
  // 解析完毕，生成json
  fs.writeFileSync(jsonPath, JSON.stringify(picsData))
})

// 复制文件
function cp(from, to) {
  fs.writeFileSync(to, fs.readFileSync(from))
}
