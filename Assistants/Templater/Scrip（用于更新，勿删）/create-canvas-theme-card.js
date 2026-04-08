
/*
** Script Name: 创建Canvas主题索引卡文档
** Author: 鱼先生的模块化Obsidian
** Bilibili: https://space.bilibili.com/2035394961?spm_id_from=333.1007.0.0
** 小红书：https://www.xiaohongshu.com/user/profile/63cfeb720000000026010489
** Version: 1.0.0
*/
module.exports = async (quickAdd) => {
  const app = quickAdd.app;
  const templatePath = "Assistants/Templater/笔记/主题索引卡模板-白板.canvas";
  
  const targetPaths = [
    "Documents/I.P.A.R.A/生活领域/归档/卡片盒笔记主题索引卡",
    "Documents/I.P.A.R.A/学习领域/归档/卡片盒笔记主题索引卡",
    "Documents/I.P.A.R.A/工作领域/归档/卡片盒笔记主题索引卡"
  ];

  const pathChoice = await quickAdd.quickAddApi.suggester(
    ["🏠生活领域", "📚学习领域", "💼工作领域"],
    targetPaths,
    "请选择下面其中1个路径保存文档"
  );
  
  if (!pathChoice) {
    console.log("❌ 未选择路径，操作取消");
    return;
  }

  const themeName = await quickAdd.quickAddApi.inputPrompt(
    "请输入主题索引卡名称："
  );
  
  if (!themeName) {
    console.log("❌ 未输入主题名称，操作取消");
    return;
  }

  try {
    const templateFile = app.vault.getAbstractFileByPath(templatePath);
    if (!templateFile) {
      console.log(`❌ 模板文件不存在: ${templatePath}`);
      return;
    }

    const templateContent = await app.vault.read(templateFile);
    
    const fileName = `${themeName}.canvas`;
    const fullPath = `${pathChoice}/${fileName}`;
    
    const folderPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
    if (!app.vault.getAbstractFileByPath(folderPath)) {
      await app.vault.createFolder(folderPath);
    }
    
    if (app.vault.getAbstractFileByPath(fullPath)) {
      console.log(`⚠️ 文件已存在: ${fullPath}`);
      return;
    }
    
    await app.vault.create(fullPath, templateContent);
    console.log(`✅ 已创建: ${fullPath}`);
    
    console.log("✅ 主题索引卡创建完成！");
    if (quickAdd.quickAddApi && typeof quickAdd.quickAddApi.notify === 'function') {
      quickAdd.quickAddApi.notify("✅ 主题索引卡创建完成！");
    }
  } catch (error) {
    console.error("创建文件时出错:", error);
    console.log(`❌ 发生错误: ${error.message}`);
  }
};