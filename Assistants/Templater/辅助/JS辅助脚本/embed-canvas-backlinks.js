/*
** Script Name: 在Canvas主题索引卡中嵌入所有反向链接笔记
** Author: 鱼先生的模块化Obsidian
** Bilibili: https://space.bilibili.com/2035394961?spm_id_from=333.1007.0.0
** 小红书：https://www.xiaohongshu.com/user/profile/63cfeb720000000026010489
** Version: 1.0.0
*/
module.exports = async (params) => {
  const config = {
    startX: 100,       // 起始X坐标
    startY: 100,       // 起始Y坐标
    nodeWidth: 440,    // 节点宽度 (调小以适应网格布局)
    nodeHeight: 500,   // 节点高度 (调小以适应网格布局)
    horizontalSpacing: 50, // 水平间距
    verticalSpacing: 100,   // 垂直间距
    columns: 5,        // 设置为5列布局
    debug: true        // 是否显示调试日志
  };
  
  function log(message, data) {
    if (config.debug) {
      if (data) {
        console.log(`[Canvas反向链接] ${message}`, data);
      } else {
        console.log(`[Canvas反向链接] ${message}`);
      }
    }
  }

  log("脚本开始执行");
  
  const activeFile = app.workspace.getActiveFile();
  
  if (!activeFile) {
    new Notice("没有打开的文件");
    log("没有打开的文件");
    return;
  }
  
  log("当前文件:", activeFile.path);
  
  if (activeFile.extension !== "canvas") {
    new Notice("当前文件不是Canvas白板文档");
    log("当前文件不是Canvas文档");
    return;
  }
  
  log("确认是Canvas文档");
  
  try {
    const activeLeaf = app.workspace.activeLeaf;
    if (!activeLeaf || !activeLeaf.view) {
      new Notice("无法获取活动视图");
      log("无法获取活动视图");
      return;
    }
    
    log("活动视图类型:", activeLeaf.view.getViewType());
    
    if (activeLeaf.view.getViewType() !== "canvas") {
      new Notice("当前活动视图不是Canvas");
      log("当前活动视图不是Canvas");
      return;
    }
    
    log("正在查找反向链接");
    const resolvedLinks = app.metadataCache.resolvedLinks;
    const backlinks = [];
    
    Object.entries(resolvedLinks).forEach(([sourcePath, targetLinks]) => {
      if (targetLinks[activeFile.path]) {
        backlinks.push(sourcePath);
      }
    });
    
    log(`找到 ${backlinks.length} 个反向链接:`, backlinks);
    
    if (backlinks.length === 0) {
      new Notice("没有找到反向链接");
      return;
    }
    
    try {
      log("尝试直接修改Canvas文件");
      
      const canvasContent = await app.vault.read(activeFile);
      
      const canvasJson = JSON.parse(canvasContent);
      
      if (!canvasJson.nodes) {
        canvasJson.nodes = [];
      }
      
      let addedCount = 0;
      
      for (const backlink of backlinks) {
        try {
          const file = app.vault.getAbstractFileByPath(backlink);
          if (!file) {
            log(`文件不存在: ${backlink}`);
            continue;
          }
          
          const column = addedCount % config.columns;
          const row = Math.floor(addedCount / config.columns);
          
          const xPosition = config.startX + column * (config.nodeWidth + config.horizontalSpacing);
          const yPosition = config.startY + row * (config.nodeHeight + config.verticalSpacing);
          
          canvasJson.nodes.push({
            id: "backlink-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
            type: "file",
            file: backlink,
            x: xPosition,
            y: yPosition,
            width: config.nodeWidth,
            height: config.nodeHeight
          });
          
          addedCount++;
          log(`添加了文件节点: ${backlink} 在位置 (${column}, ${row})`);
        } catch (e) {
          log(`为 ${backlink} 创建节点出错:`, e);
        }
      }
      
      await app.vault.modify(activeFile, JSON.stringify(canvasJson, null, 2));
      
      new Notice(`成功添加了 ${addedCount} 个反向链接到Canvas (${config.columns}列网格布局)`);
      return;
    } catch (e) {
      log("直接修改Canvas文件失败:", e);
      new Notice("添加反向链接失败: " + e.message);
    }
    
  } catch (e) {
    log("执行过程中出错:", e);
    console.error("执行过程中出错:", e);
    new Notice("执行出错: " + e.message);
  }
};