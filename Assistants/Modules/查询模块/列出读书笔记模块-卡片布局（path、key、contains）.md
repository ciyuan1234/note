---
fileName: 列出读书笔记模块-卡片布局
tags:
  - 卡片布局
  - 路径
  - key
  - 模块
multiFile: 
cssclasses:
  - cards
  - cards-cols-4
---
#### 电子书
```dataview
TABLE without id
file.link as 书名,author as 作者,status as 进度
from "Books"
where contains(tags,"")
sort tags asc
```
---
#### 论文文献
```dataview
TABLE without id
file.link as 书名,author as 作者,status as 进度
from "Books"
where contains(tags,"论文")
sort tags asc
```
---
#### 合同文档
```dataview
TABLE without id
file.link as 书名,author as 作者,status as 进度
from "Books"
where contains(tags,"合同")
sort tags asc
```
---
#### 其他文档
```dataview
TABLE without id
file.link as 书名,author as 作者,status as 进度
from "Books"
where contains(tags,"其他文档")
sort tags asc
```

%%
📃使用说明：
可以在其他markdown文件中输入/粘贴以下代码块以使用本模板；
````右上角复制
```meta-bind-embed
[[列出读书笔记模块-卡片布局（path、key、contains）]]
```
````
输入快捷操作：alt+1
复制粘贴快捷操作：右上角图标复制，然后粘贴
📌解释：
该模块查询的是路径`Books`下,key为`author,title,status`的笔记
本模板被嵌套到其他文档中后；
- 卡片样式需要在frontmatter中加入`cssclasses:cards`
- 根据需求修改`路径`、`key`、`标签`
- 点击模块右上角的</>符号修改本模板；
- 点击此处👉[视频课](https://img-1319209135.cos.ap-chongqing.myqcloud.com/202406211223554.png)咨询、学习进阶课程；
🚨提示：
- 注1：当修改了本模板后，被嵌入在其他文档的内容也会跟随调整；
- 注2：本使用说明中的注释内容不会被嵌套到其他文件中；
%%