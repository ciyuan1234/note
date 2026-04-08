
```ad-warning
collapse:open
title:注意
- 更新功能通过拉取多维表的数据获取内容，不点击按钮，你的仓库不会有任何变化
- 请勿频繁更新，每台设备ID每日更新限制为1次，更新异常（例如频繁更新等）会被剔出白名单
- 老用户更新时，可能会提示<font color="#ff0000">Failed to fetchVika configuration</font>,请隔几分钟多试几次即可
- 如有更新问题，请联系[鱼先生](https://img-1319209135.cos.ap-chongqing.myqcloud.com/202406211223554.png)
```

# 半自动更新
- 更新步骤：①**备份仓库**→②`BUTTON[replaceguide]` →③[[0-更新日志|查看更新日志]]→④按需`BUTTON[replacemodule]`  →⑤按更新日志完成其他操作→⑥重启OB
- 更新范围：Assistants文件夹中的文档，不包含OB软件设置、插件设置、css代码等内容；
- 复杂程度：**相对繁琐的更新步骤**；
- 自由程度：自由程度相对**更高**，由于更新时不含软件设置、插件设置，因此将拥有更大的自定义空间；
- 注意事项：
	- 更新前，请确保已经知晓了[[1-预制仓库移植使用❗❗❗重要#哪些文件能修改（❗❗❗重要，牢记❗❗❗）|哪些文件能修改]]，避免更新覆盖掉你自己自定义的模块、或模板；

# 全自动更新
- 更新步骤：①**备份仓库**→②`BUTTON[oneClickUpdate]` →③重启OB
- 更新范围：含OB软件设置、插件设置、css代码、Assistants文件夹中的文档），但不包含Books、Connections、Documents、Extras路径下的文档；
- 复杂程度：跳过手动环节，**一键更新**（*适合不想折腾、或者不善于折腾的用户*）；
- 自由程度：由于更新内容包含OB软件设置、插件设置、css代码等，意味着插件、模块被修改后，点击全自动更新后，将恢复到原有设置，因此自由度相对**更低**；
- 注意事项：
	- 如需[[0-更新日志|查看更新日志]]，需再次点击`BUTTON[replaceguide]`按钮；
	- 意味着你已经主动**放弃仓库自定义**，无条件接受【鱼先生】预设的设置、模块、模板等；
	- 点击此按钮，会覆盖你之前自定义的软件设置、插件设置、模块、模板等内容；

# 其他事项
==⚠️注意：更新完成后，请检查以下css代码片段是否已经开启(设置→外观→css代码片段)，若未开启，请开启他们==
- 其他排版美化.css
- custom-admonitions.c9c6cb.css
- meta-bind.css
- minimalcards.css
- Shiba Inu主题.css
- sidenotes.css
- note-cssclasses.css
- 默认、Nord、Things等主题（适用于未提供style-settings插件的主题).css