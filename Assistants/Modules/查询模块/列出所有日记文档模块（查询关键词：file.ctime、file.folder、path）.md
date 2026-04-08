---
fileName: 列出所有日记文档模块
tags:
  - 日记
  - 查询
  - 路径
  - 模块
multiFile:
---

```dataview
TABLE file.ctime,file.folder
from "Documents/Dailynote"
sort file.ctime asc
```


%%
📃使用说明：
可以在其他markdown文件中输入/粘贴以下代码块以使用本模板；
````右上角复制
```meta-bind-embed
[[列出所有日记文档模块（查询关键词：file.ctime、file.folder、path）]]
```
````
输入快捷操作：alt+1
复制粘贴快捷操作：右上角图标复制，然后粘贴
📌解释：
该模块查询的是`Documents/Dailynote路径`下的所有日记；
本模板被嵌套到其他文档中后；
- 根据需求修改`路径`
- 点击模块右上角的</>符号修改本模板；
- 点击此处👉[视频课](https://img-1319209135.cos.ap-chongqing.myqcloud.com/202406211223554.png)咨询、学习进阶课程；
🚨提示：
- 注1：当修改了本模板后，被嵌入在其他文档的内容也会跟随调整；
- 注2：本使用说明中的注释内容不会被嵌套到其他文件中；
%%