---
createTime: <% tp.file.creation_date() %>
笔记ID: <% tp.date.now("YYYYMMDDmmss") %>
multiFile: 
multiMedia: 
tags: 
title: <% tp.file.title %>
卡片盒笔记主题: "[[Documents/I.P.A.R.A/学习领域/归档/卡片盒笔记主题索引卡/英语单词学习.md|英语单词学习]]"
---

``````ad-flex
collapse:close
title:卡片盒笔记
color:
icon: pen
🔅笔记类型`INPUT[inlineSelect(option(闪念笔记),  option(项目笔记),option(永久笔记), option(null)):笔记类型]`  
🗓️详述计划`INPUT[datePicker:阐述日期]` `BUTTON[ITP]` 

🏷️文档标签`INPUT[inlineList:tags]`

`BUTTON[cardnotetopic-4col]` 
🔰选择主题`INPUT[suggester(optionQuery(#卡片盒笔记主题), useLinks(true)):卡片盒笔记主题]` 
`````col
````col-md
flexGrow=1
===
<details>
<summary> 📂工作领域  </summary>

`BUTTON[g-g,g-s,g-x,g-z]` 

</details>
````
````col-md
flexGrow=1
===
<details>
<summary> 📂学习领域 </summary>

`BUTTON[x-g,x-s,x-x,x-z]` 
</details>
````
````col-md
flexGrow=1
===
<details>
<summary> 📂生活领域 </summary>

`BUTTON[s-g,s-s,s-x,s-z]` 
</details>
````
````col-md
flexGrow=1
===
<details>
<summary> 📂其他领域 </summary>

`BUTTON[otherfolder]` 
</details>
````
`````
```````

%%
📃使用说明：
可以在其他markdown文件中输入/粘贴以下代码块以使用本模块；
````右上角复制
```meta-bind-embed
[[笔记抬头模块]]
```
````
输入快捷操作：alt+1
粘贴快捷操作：右上角图标复制，然后粘贴
本模块被嵌套到其他文档中后；
- 点击`输入框`输入内容；添加的内容会绑定到前页frontmatter（文档属性/元数据/metadata）中，如果未显示，可以在`设置-编辑器-文档属性`开启它；
- 点击📂按钮，可以将创建的笔记移动至相应I.P.A.R.A文件夹，这可以让你忘记文件列表（文件夹太多时，可以帮助你快速移动文件）；
- 笔记类型选择后，该笔记会索引至[[查询卡片盒笔记法看板]]、[[查询卡片盒笔记法看板-list]]、以及[[homepage-主页-卡片盒笔记]]
- 阐述计划，用于提醒你哪天该进一步详细阐述笔记（因为闪念笔记往往不是一蹴而就的，需要多次反复的详细阐述，让笔记更有价值）
- 主题索引卡按钮，当笔记的数量、质量达到一定程度，创建主题索引卡，然后点击下面的选择主题选项，将相关联的笔记关联起来，有助于形成知识脑图，你可以在关系图谱中查看这些笔记关联性。
- 点击模块右上角的</>符号修改本模块（颜色、字体、长宽、布局等）；
- 点击此处👉[视频课](https://img-1319209135.cos.ap-chongqing.myqcloud.com/202406211223554.png)咨询、学习进阶课程；
🚨提示：
- 注1：当修改了本模块样式后，被嵌入在其他文档的样式（不含输入内容）也会跟随调整；
- 注2：本使用说明中的注释内容不会被嵌套到其他文件中；
%%