---
fileName: 典型dataview查询模块
tags:
  - 查询
  - 路径
  - key
  - value
  - 模块
multiFile:
---

```dataview
table without id 
title,multiFile as 链接
from "Assistants/Modules"
where contains(tags, "查询")
```


%%
📃使用说明：
可以在其他markdown文件中输入/粘贴以下代码块嵌入以使用本模块；
````右上角复制
```meta-bind-embed
[[典型dataview查询模块（查询关键词：path、key、value、contains}]]
```
````
输入快捷操作：alt+1
复制粘贴快捷操作：右上角图标复制，然后粘贴
📌解释：
该模块查询的是“Assistants/Modules”路径下，元数据`key`为title、multiFile的`value`值（过滤条件：`tags`须包含`查询`字段）
本模板被嵌套到其他文档中后；
- 根据需求修改`key`以及过滤条件；
- 点击模块右上角的</>符号修改本模板；
- 点击此处👉[视频课](https://img-1319209135.cos.ap-chongqing.myqcloud.com/202406211223554.png)咨询、学习进阶课程；
🚨提示：
- 注1：当修改了本模板后，被嵌入在其他文档的内容也会跟随调整；
- 注2：本使用说明中的注释内容不会被嵌套到其他文件中；
%%