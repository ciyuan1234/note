---
author: {{author}}
description: {{desc}}
imageData: {{imageData.url}}
score: 
status: null
tags: 
- 电子书
- 模块
发行日期: {{datePublished}}
书名: {{title}}
评价: {{scoreStar}}
---

``````ad-flex 
color: 33,146,61
`````col
````col-md
flexGrow=0.5
===
`VIEW[{imageData}][image]`
````

````col-md
flexGrow=1
===
📓 书名：`INPUT[text(class(text-40)):书名]` 
👨‍💼 作者：`INPUT[inlineList:author]`
📚 类型：`INPUT[inlineSelect(option(论文), option(电子书), option(合同), option(其他文档)):tags]` 
🏷️ 阅读进度：`INPUT[inlineSelect(option(在读), option(已读), option(未读)):status]` `INPUT[slider(addLabels):progress]`
📅 发行日期：`INPUT[datePicker:发行日期]` 
⭐ 评分：`INPUT[inlineSelect(option(⭐), option(⭐⭐), option(⭐⭐⭐), option(⭐⭐⭐⭐), option(⭐⭐⭐⭐⭐), option(⭐⭐⭐⭐⭐⭐), option(⭐⭐⭐⭐⭐⭐⭐), option(⭐⭐⭐⭐⭐⭐⭐⭐), option(⭐⭐⭐⭐⭐⭐⭐⭐⭐), option(⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐)):评价]`
📃 书籍简介：
`INPUT[textArea(class(textArea-180)):description]`
````
``````
