---
fileName: 卡片盒笔记法计划模块
tags:
  - 模块
multiFile: 
contact:
  - from: 07:00
    to: 08:00
    日计划: 读书
    是否完成: false
    日计划完成值: 0
  - from: 08:00
    to: 08:30
    日计划: 早餐
    日计划完成值: 0
  - from: 09:00
    to: 11:30
    日计划: 工作
    日计划完成值: 0
  - from: 12:00
    to: 13:00
    日计划: 午休
    日计划完成值: 0
  - from: 13:30
    to: 17:00
    日计划: 工作
    日计划完成值: 0
  - from: 17:30
    to: 18:30
    日计划: 运动
    日计划完成值: 0
  - from: 19:00
    to: 19:30
    日计划: 晚餐
    日计划完成值: 0
  - from: 20:00
    to: 22:00
    日计划: 工作
    日计划完成值: 0
  - from: 11:00
    to: 11:30
    日计划: 复盘
    日计划完成值: 0
hide: true
---

`BUTTON[cardnotetopic-2col-2]` `BUTTON[cardnotes-2col-2]`
###### 🟢闪念笔记
```dataview
list
阐述日期
From "Documents"
WHERE contains(笔记类型, "闪念笔记") 
sort 阐述日期 asc
```
###### 🟡项目笔记
```dataview
list
阐述日期
From "Documents"
WHERE contains(笔记类型, "项目笔记") 
sort 阐述日期 asc
```
###### 🔴永久笔记
```dataview
list
阐述日期
From "Documents"
WHERE contains(笔记类型, "永久笔记") 
sort 阐述日期 asc
```
###### 🟣主题列表
```dataview
list
status
From "Documents"
WHERE contains(tags, "卡片盒笔记主题") 
sort 卡片盒笔记主题 asc
```

%%
📃使用说明：
可以在其他markdown文件中输入/粘贴以下代码块以使用本模块；
````右上角复制
```meta-bind-embed
[[查询卡片盒笔记法看板-list]]
```
````
输入快捷操作：alt+1
粘贴快捷操作：右上角图标复制，然后粘贴
本模块被嵌套到其他文档中后；
- 该模块与[[笔记抬头模块]]、[[Assistants/Templater/笔记/卡片盒笔记模板]]输入的数据关联，关联的数据为“Documents”路径下笔记类型为“闪念笔记、项目笔记、永久笔记”的笔记；
- 主题列表中的status数值，可以通过已创建的`主题索引卡`frontmatter属性修改
- 点击模块右上角的</>符号修改本模块（颜色、字体、长宽、布局等）；
- 点击此处👉[视频课](https://img-1319209135.cos.ap-chongqing.myqcloud.com/202406211223554.png)咨询、学习进阶课程；
🚨提示：
- 注1：当修改了本模块样式后，被嵌入在其他文档的样式（不含输入内容）也会跟随调整；
- 注2：本使用说明中的注释内容不会被嵌套到其他文件中；
%%

