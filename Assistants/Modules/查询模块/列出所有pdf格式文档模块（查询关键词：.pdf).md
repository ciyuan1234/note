---
fileName: 列出所有pdf格式文档模块
tags:
  - 格式
  - pdf
  - 模块
multiFile:
---

```dataviewjs
// 定义要输出的字符串
let str = "";

// 指定要查询的文件类型
let fileType = '.pdf';

// 获取 vault 中的所有文件
let files = this.app.vault.getAllLoadedFiles("");

// 遍历所有文件，判断是否是 PDF，把 PDF 文件链接拼接进字符串
files.forEach(file => {
if (file.path.endsWith(fileType)) {
str = str + "- [[" + file.name + "]]" + "\n";
}
});

// 输出字符串
dv.paragraph(str);

```


%%
📃使用说明：
可以在其他markdown文件中输入/粘贴以下代码块以使用本模块；
````右上角复制
```meta-bind-embed
[[列出所有pdf格式文档模块（查询关键词：.pdf)]]
```
````
输入快捷操作：alt+1
复制粘贴快捷操作：右上角图标复制，然后粘贴
📌解释：
该模块查询的是所有pdf格式文档；
本模板被嵌套到其他文档中后；
- 根据需求修改`路径`
- 点击模块右上角的</>符号修改本模板；
- 点击此处👉[视频课](https://img-1319209135.cos.ap-chongqing.myqcloud.com/202406211223554.png)咨询、学习进阶课程；
🚨提示：
- 注1：当修改了本模板后，被嵌入在其他文档的内容也会跟随调整；
- 注2：本使用说明中的注释内容不会被嵌套到其他文件中；
%%