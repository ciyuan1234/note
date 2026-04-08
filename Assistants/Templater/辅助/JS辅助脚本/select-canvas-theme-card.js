/*
** Script Name: 主题索引卡选择器（增强版）
** Author: 鱼先生的模块化Obsidian
** Bilibili: https://space.bilibili.com/2035394961?spm_id_from=333.1007.0.0
** 小红书：https://www.xiaohongshu.com/user/profile/63cfeb720000000026010489
** Version: 1.1.0
** 新增功能: 选择主题索引卡后自动将当前笔记嵌入到canvas白板中
*/

module.exports = async (params) => {
  const { app, quickAddApi } = params;

  const canvasConfig = {
    startX: 100,
    startY: 100,
    nodeWidth: 440,
    nodeHeight: 500,
    horizontalSpacing: 50,
    verticalSpacing: 100,
    columns: 5,
    debug: true
  };

  function log(message, data) {
    if (canvasConfig.debug) {
      if (data) {
        console.log(`[主题索引卡选择器] ${message}`, data);
      } else {
        console.log(`[主题索引卡选择器] ${message}`);
      }
    }
  }

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
          .filter(file => file.extension === 'canvas')
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
    new Notice("未找到Canvas文件");
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

  const linkToAdd = `[[${selectedFile.path}|${selectedFile.basename}]]`;
  
  let currentThemes = [];
  let hasFrontmatter = fileContent.startsWith('---');
  let updatedContent;
  
  if (hasFrontmatter) {
    const endOfFrontmatter = fileContent.indexOf('---', 3);
    
    if (endOfFrontmatter !== -1) {
      const frontmatter = fileContent.substring(0, endOfFrontmatter);
      
      // 更精确的正则表达式，匹配完整的YAML属性
      const yamlListRegex = /卡片盒笔记主题:\s*\n((?:\s*-\s*"[^"]*"\s*\n)*)/;
      const jsonArrayRegex = /卡片盒笔记主题:\s*(\[.*?\]|\[".*?"\]|".*?"|\S+)(?=\s*\n|$)/s;
      // 检查是否存在空的卡片盒笔记主题属性
      const emptyThemeRegex = /卡片盒笔记主题:\s*\n(?=\w+:|$)/;
      
      const yamlListMatch = frontmatter.match(yamlListRegex);
      const jsonArrayMatch = !yamlListMatch && frontmatter.match(jsonArrayRegex);
      const emptyThemeMatch = !yamlListMatch && !jsonArrayMatch && frontmatter.match(emptyThemeRegex);
      
      if (yamlListMatch) {
        const listItems = yamlListMatch[1];
        if (listItems.trim()) {
          const items = listItems.match(/-\s*"([^"]*)"/g);
          if (items) {
            currentThemes = items.map(item => item.replace(/^-\s*"([^"]*)"$/, '$1'));
          }
        }
      } else if (jsonArrayMatch) {
        let themeValue = jsonArrayMatch[1].trim();
        
        if (themeValue.startsWith('[') && themeValue.endsWith(']')) {
          try {
            currentThemes = JSON.parse(themeValue.replace(/\[\[(.*?)\]\]/g, '"[[$1]]"'));
          } catch (e) {
            currentThemes = themeValue
              .substring(1, themeValue.length - 1)
              .split(',')
              .map(item => item.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1'));
          }
        } else if (themeValue.startsWith('"') && themeValue.endsWith('"')) {
          currentThemes = [themeValue.substring(1, themeValue.length - 1)];
        } else {
          currentThemes = [themeValue];
        }
      } else if (emptyThemeMatch) {
        // 空的卡片盒笔记主题属性
        currentThemes = [];
      }
      
      currentThemes = currentThemes.map(theme => {
        if (!theme.includes('[[')) {
          if (!theme.includes('/') && theme.endsWith('.canvas')) {
            const matchingFile = canvasFiles.find(file => 
              file.basename + '.canvas' === theme ||
              file.basename === theme.replace(/\.canvas$/, '')
            );
            
            if (matchingFile) {
              return `[[${matchingFile.path}|${matchingFile.basename}]]`;
            }
          }
          const themeBasename = theme.replace(/\.canvas$/, '');
          return `[[${theme}|${themeBasename}]]`.replace(/\.canvas\.canvas$/, '.canvas');
        }
        
        const linkContent = theme.match(/\[\[(.*?)(?:\|(.*?))?\]\]/);
        if (linkContent) {
          const fullPath = linkContent[1];
          const existingAlias = linkContent[2];
          
          if (!fullPath.includes('/') && fullPath.endsWith('.canvas')) {
            const matchingFile = canvasFiles.find(file => 
              file.basename + '.canvas' === fullPath ||
              file.basename === fullPath.replace(/\.canvas$/, '')
            );
            
            if (matchingFile) {
              const alias = existingAlias || matchingFile.basename;
              return `[[${matchingFile.path}|${alias}]]`;
            }
          }
          
          if (!existingAlias && fullPath.includes('.canvas')) {
            const basename = fullPath.split('/').pop().replace(/\.canvas$/, '');
            return `[[${fullPath}|${basename}]]`;
          }
        }
        
        return theme;
      });
      
      if (!currentThemes.includes(linkToAdd)) {
        currentThemes.push(linkToAdd);
        
        const updatedThemeValue = 
          `\n  - "${currentThemes[0]}"` + 
          currentThemes.slice(1).map(theme => `\n  - "${theme}"`).join('');
        
        if (yamlListMatch) {
          // 精确替换YAML列表格式
          updatedContent = fileContent.replace(
            /卡片盒笔记主题:\s*\n((?:\s*-\s*"[^"]*"\s*\n)*)/s,
            `卡片盒笔记主题:${updatedThemeValue}\n`
          );
        } else if (jsonArrayMatch) {
          // 精确替换JSON数组格式
          updatedContent = fileContent.replace(
            /卡片盒笔记主题:\s*(\[.*?\]|\[".*?"\]|".*?"|\S+)(?=\s*\n|$)/s,
            `卡片盒笔记主题:${updatedThemeValue}\n`
          );
        } else if (emptyThemeMatch) {
          // 替换空的卡片盒笔记主题属性
          updatedContent = fileContent.replace(
            /卡片盒笔记主题:\s*\n(?=\w+:|$)/,
            `卡片盒笔记主题:${updatedThemeValue}\n`
          );
        } else {
          // 如果不存在卡片盒笔记主题属性，则在frontmatter末尾添加
          updatedContent = fileContent.substring(0, endOfFrontmatter) +
            `卡片盒笔记主题:${updatedThemeValue}\n` +
            fileContent.substring(endOfFrontmatter);
        }
      } else {
        new Notice(`卡片盒笔记主题中已存在: ${selectedFile.basename}`);
        return `卡片盒笔记主题中已存在: ${selectedFile.basename}`;
      }
    } else {
      updatedContent = `---\n卡片盒笔记主题:\n  - "${linkToAdd}"\n---\n\n${fileContent.substring(3)}`;
    }
  } else {
    updatedContent = `---\n卡片盒笔记主题:\n  - "${linkToAdd}"\n---\n\n${fileContent}`;
  }
  
  await app.vault.modify(activeFile, updatedContent);
  
  new Notice(`已添加卡片盒笔记主题: ${selectedFile.basename}`);
  

  try {
    log("开始将当前笔记嵌入到canvas中");
    
    const canvasFile = app.vault.getAbstractFileByPath(selectedFile.path);
    if (!canvasFile) {
      log("无法找到canvas文件:", selectedFile.path);
      return;
    }

    const canvasContent = await app.vault.read(canvasFile);
    const canvasJson = JSON.parse(canvasContent);
    
    if (!canvasJson.nodes) {
      canvasJson.nodes = [];
    }

    const currentNoteExists = canvasJson.nodes.some(node => 
      node.type === 'file' && node.file === activeFile.path
    );
    
    if (currentNoteExists) {
      log("当前笔记已存在于canvas中");
      return `已将 "${selectedFile.basename}" 添加为卡片盒笔记主题`;
    }
    
    const existingNodes = canvasJson.nodes.length;
    const column = existingNodes % canvasConfig.columns;
    const row = Math.floor(existingNodes / canvasConfig.columns);
    
    const xPosition = canvasConfig.startX + column * (canvasConfig.nodeWidth + canvasConfig.horizontalSpacing);
    const yPosition = canvasConfig.startY + row * (canvasConfig.nodeHeight + canvasConfig.verticalSpacing);

    const newNode = {
      id: "note-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
      type: "file",
      file: activeFile.path,
      x: xPosition,
      y: yPosition,
      width: canvasConfig.nodeWidth,
      height: canvasConfig.nodeHeight
    };
    
    canvasJson.nodes.push(newNode);
  
    await app.vault.modify(canvasFile, JSON.stringify(canvasJson, null, 2));
    
    log(`成功将笔记嵌入到canvas中: ${activeFile.path}`);
    new Notice(`已将当前笔记嵌入到 "${selectedFile.basename}" canvas中`);
    
  } catch (error) {
    log("嵌入canvas过程中出错:", error);
    console.error("嵌入canvas过程中出错:", error);
    new Notice("嵌入canvas失败: " + error.message);
  }
  
  return `已将 "${selectedFile.basename}" 添加为卡片盒笔记主题并嵌入当前笔记`;
};