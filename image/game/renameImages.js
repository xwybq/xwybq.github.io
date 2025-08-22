const fs = require('fs');
const path = require('path');

// 配置：指定图片文件夹路径和需要处理的图片扩展名
const config = {
  folderPath: './战神', // 图片文件夹路径，可修改为实际路径
  imageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'] // 支持的图片格式
};

// 检查文件夹是否存在
if (!fs.existsSync(config.folderPath)) {
  console.error(`错误：文件夹 "${config.folderPath}" 不存在`);
  process.exit(1);
}

// 读取文件夹中的所有文件
fs.readdir(config.folderPath, (err, files) => {
  if (err) {
    console.error('读取文件夹时出错：', err);
    return;
  }

  // 筛选出图片文件
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return config.imageExtensions.includes(ext);
  });

  if (imageFiles.length === 0) {
      console.log('文件夹中没有找到图片文件');
    return;
  }

  console.log(`找到 ${imageFiles.length} 个图片文件，准备重命名...`);

  // 按文件创建时间排序（也可以按其他方式排序）
  imageFiles.sort((a, b) => {
    const statA = fs.statSync(path.join(config.folderPath, a));
    const statB = fs.statSync(path.join(config.folderPath, b));
    return statA.birthtimeMs - statB.birthtimeMs;
  });

  // 重命名文件
  imageFiles.forEach((file, index) => {
    const oldPath = path.join(config.folderPath, file);
    const ext = path.extname(file);
    const newName = `${index + 1}${ext}`; // 从1开始编号
    const newPath = path.join(config.folderPath, newName);

    // 检查新文件名是否已存在
    if (fs.existsSync(newPath) && oldPath !== newPath) {
      console.error(`跳过 ${file}：新文件名 "${newName}" 已存在`);
      return;
    }

    // 执行重命名
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(`重命名 ${file} 失败：`, err);
      } else {
        console.log(`已重命名：${file} -> ${newName}`);
      }
    });
  });
});
