---
fileName: 列出特定字段所在段落内容
tags:
  - 查询
  - 字段
  - 段落
  - 模块
multiFile:
---

```dataviewjs
//使用时修改关键词即可
const term ="排除"
let folderpath="Assistants/Modules"
//更改为限定文件夹即可，留空为遍历所有笔记
const files = app.vault.getMarkdownFiles().filter(file=>file.path.includes(folderpath))
const arr = files.map(async ( file) => {
const content = await app.vault.cachedRead(file)
const lines = content.split("\n").filter(line => line.contains(term))
return lines
})
Promise.all(arr).then(values => 
dv.list(values.flat()))
```

%%
📃使用说明：
可以在其他markdown文件中输入/粘贴以下代码块嵌入以使用本模块；
````右上角复制
```meta-bind-embed
[[列出标签所在段落内容（查询关键词：path、content）]]
```
````
输入快捷操作：alt+1
复制粘贴快捷操作：右上角图标复制，然后粘贴
📌解释：
该模块查询的是特定字段所在的段落内容（段落、笔记）；
本模板被嵌套到其他文档中后；
- 根据需求修改`路径`、`字段`，默认路径`Assistants/Modules`，默认字段`排除`
- 点击模块右上角的</>符号修改本模板；
- 点击此处👉[视频课](https://img-1319209135.cos.ap-chongqing.myqcloud.com/202406211223554.png)咨询、学习进阶课程；
🚨提示：
- 注1：当修改了本模板后，被嵌入在其他文档的内容也会跟随调整；
- 注2：本使用说明中的注释内容不会被嵌套到其他文件中；
%%