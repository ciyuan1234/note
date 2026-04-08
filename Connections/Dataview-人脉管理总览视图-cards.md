---
cssclasses:
  - cards
  - cards-cover,
  - cards-1-1,
  - table-max,
  - cards-cols-8
---

 `BUTTON[gongsikapian-4col]`  `BUTTON[bumenkapian-4col]` `BUTTON[renwukapian-4col]` `BUTTON[wupinkapian-4col]` 

```dataview
Table without id embed(link(人物照片,"50"))  as 人物照片2,"![|20](" + 人物照片 + ")" as 人物照片,
file.link as 姓名,联系电话,邮箱,城市,在职公司,所在部门,现居职位
From "Connections/人物"
sort 在职公司 asc
```
