/*
** Script Name: topicCardFilter
** Author: 鱼先生的模块化Obsidian
** Bilibili: https://space.bilibili.com/2035394961?spm_id_from=333.1007.0.0
** 小红书：https://www.xiaohongshu.com/user/profile/63cfeb720000000026010489
** Version: 1.0.0
*/

module.exports = async (params) => {
  const { app, quickAddApi } = params;

  const pathsToSearch = [
    "Documents/I.P.A.R.A/生活领域/归档/卡片盒笔记主题索引卡",
    "Documents/I.P.A.R.A/学习领域/归档/卡片盒笔记主题索引卡",
    "Documents/I.P.A.R.A/工作领域/归档/卡片盒笔记主题索引卡"
  ];

  const canvasFiles = [];
  
  const getDomainTag = (domain) => {
    const tags = {
      "生活领域": "🏠",
      "学习领域": "📚",
      "工作领域": "💼"
    };
    
    return tags[domain] || "📌";
  };
  
  for (const path of pathsToSearch) {
    try {
      const folder = app.vault.getAbstractFileByPath(path);
      
      if (folder && folder.children) {
        const canvasFilesInFolder = folder.children
          .filter(file => file.extension === 'canvas' || file.extension === 'md')
          .map(file => {
            const domain = path.split('/')[2];
            return {
              path: file.path,
              basename: file.basename,
              domain: domain,
              domainTag: getDomainTag(domain)
            };
          });
        
        canvasFiles.push(...canvasFilesInFolder);
      }
    } catch (error) {
      console.log(`无法访问路径: ${path}`, error);
    }
  }

  if (canvasFiles.length === 0) {
    new Notice("未找到主题索引卡，请先创建主题索引卡");
    return;
  }
  
  const createDisplayFormat = (file) => {
    return `${file.domainTag} ${file.basename}`;
  };

  const displayList = canvasFiles.map(file => createDisplayFormat(file));

  const selectedIndex = await quickAddApi.suggester(
    displayList,
    canvasFiles.map((_, index) => index)
  );

  if (selectedIndex === undefined) return;
  
  const selectedFile = canvasFiles[selectedIndex];

  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) {
    new Notice("请先打开一个笔记文件");
    return;
  }

  let fileContent = await app.vault.read(activeFile);

  const pathToAdd = selectedFile.path;
  
  let hasFrontmatter = fileContent.startsWith('---');
  let updatedContent;
  
  if (hasFrontmatter) {
    const endOfFrontmatter = fileContent.indexOf('---', 3);
    
    if (endOfFrontmatter !== -1) {
      const frontmatter = fileContent.substring(0, endOfFrontmatter);
      
      const topicCardFilterRegex = /topicCardFilter:\s*(.*?)(?:\n|$)/;
      const topicCardFilterMatch = frontmatter.match(topicCardFilterRegex);
      
      if (topicCardFilterMatch) {
        updatedContent = fileContent.replace(
          topicCardFilterRegex,
          `topicCardFilter: ${pathToAdd}\n`
        );
      } else {
        updatedContent = fileContent.substring(0, endOfFrontmatter) +
          `topicCardFilter: ${pathToAdd}\n` +
          fileContent.substring(endOfFrontmatter);
      }
    } else {
      updatedContent = `---\ntopicCardFilter: ${pathToAdd}\n---\n\n${fileContent.substring(3)}`;
    }
  } else {
    updatedContent = `---\ntopicCardFilter: ${pathToAdd}\n---\n\n${fileContent}`;
  }
  
  await app.vault.modify(activeFile, updatedContent);
  
  new Notice(`已设置主题索引卡: ${selectedFile.basename}`);
  
  return `已将 "${selectedFile.basename}" 设置为主题索引卡`;
};