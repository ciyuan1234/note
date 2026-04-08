module.exports = async (params) => {     
    const inputPath = await params.app.plugins.plugins.quickadd.api.inputPrompt(         
        "请输入文件夹路径",         
        "示例：E:\\资源\\图片 或 /Users/documents/images"     
    );      
    
    if (!inputPath) {         
        return;     
    }      

    const includeSubfolders = await params.app.plugins.plugins.quickadd.api.suggester(
        ["是否嵌入子文件夹：是", "是否嵌入子文件夹：否"],
        ["true", "false"],
        "是否包含子文件夹中的文件？"
    );
    
    if (includeSubfolders === undefined) {
        return;
    }
    
    try {         
        const fs = require('fs');         
        const path = require('path');          
        
        // 处理文件路径的函数
        function processPath(filePath) {
            // 首先标准化路径（将反斜杠转换为正斜杠）
            let normalizedPath = filePath.replace(/\\/g, '/');
            
            // 对整个路径进行编码处理
            // 使用 encodeURI 而不是 encodeURIComponent，因为我们想保留路径中的 '/'
            return `file:///${encodeURI(normalizedPath)}`;
        }
        
        // 生成文件夹链接的函数
        function createFolderLink(folderPath) {
            const folderName = path.basename(folderPath);
            return `📁[${folderName}](${processPath(folderPath)})`;
        }

        // 修改后的获取所有文件的函数，包含层级信息
        function getAllFilesAndFolders(dirPath, arrayOfItems, level = 0) {             
            let files = fs.readdirSync(dirPath);             
            arrayOfItems = arrayOfItems || [];
            
            // 添加当前文件夹的链接
            arrayOfItems.push({
                type: 'folder',
                path: dirPath,
                level: level
            });
                         
            files.forEach(function(file) {                 
                const fullPath = path.join(dirPath, file);                 
                if (fs.statSync(fullPath).isDirectory()) {    
                    if (includeSubfolders === "true") {                 
                        arrayOfItems = getAllFilesAndFolders(fullPath, arrayOfItems, level + 1);                 
                    }
                } else {                     
                    arrayOfItems.push({
                        type: 'file',
                        path: fullPath,
                        level: level + 1
                    });                 
                }             
            });              
            
            return arrayOfItems;         
        }          
        
        // 获取所有项目
        const allItems = getAllFilesAndFolders(inputPath);
        
        // 生成带缩进的 Markdown 链接
        const markdownLinks = allItems.map(item => {
            const indent = '  '.repeat(item.level); // 使用两个空格作为缩进单位
            
            if (item.type === 'folder') {
                return `${indent}- ${createFolderLink(item.path)}`;
            } else {
                // 使用完整文件名，并对路径进行编码
                const fileName = path.basename(item.path);
                return `${indent}- [${fileName}](${processPath(item.path)})`;
            }
        });          
        
        if (markdownLinks.length === 0) {             
            return;         
        }          
        
        const activeView = params.app.workspace.activeEditor;         
        if (!activeView) {             
            return;         
        }          
        
        const editor = activeView.editor;         
        const cursor = editor.getCursor();         
        editor.replaceRange(markdownLinks.join('\n'), cursor);          
        
    } catch (error) {         
        console.error('执行过程中出错:', error);     
    } 
};