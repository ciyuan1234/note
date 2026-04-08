
``````ad-review
title: KISS复盘模块
color: 33,146,61
`````col
````col-md
flexGrow=1
===
<center>🟢Keep(保持)</center>

```dataview
list WITHOUT ID
link(file.link,keep) From "Documents/Dailynote" 
WHERE contains(Keep, "") and file.frontmatter.Keep != ""
```

````
````col-md
flexGrow=1
===
<center>🟡Improve（改进）</center>

```dataview
list WITHOUT ID
link(file.link,Improve) From "Documents/Dailynote"
WHERE contains(Improve, "") and file.frontmatter.Improve != ""
```

````

````col-md
flexGrow=1
===
<center>🔴Stop（停止）</center>

```dataview
list WITHOUT ID
link(file.link,Stop)  From "Documents/Dailynote"
WHERE contains(Stop, "") and file.frontmatter.Stop != ""
```


````

````col-md
flexGrow=1
===
<center>🔵Start（开始）</center>

```dataview
list WITHOUT ID
link(file.link,Start)  From "Documents/Dailynote"
WHERE contains(Start, "") and file.frontmatter.Start != ""
```

````

``````

%%
📃使用说明：
可以在其他markdown文件中输入/粘贴以下代码块嵌入以使用本模块；
````右上角复制
```meta-bind-embed
[[KISS复盘查询模块]]
```
````
📌解释：
该模块查询的是`Dailynote`下的kiss复盘笔记；
本模板被嵌套到其他文档中后；
- 点击模块右上角的</>符号修改本模板；
- 点击此处👉[视频课](https://img-1319209135.cos.ap-chongqing.myqcloud.com/202406211223554.png)咨询、学习进阶课程；
🚨提示：
- 注1：当修改了本模板后，被嵌入在其他文档的内容也会跟随调整；
- 注2：本使用说明中的注释内容不会被嵌套到其他文件中；
%%




