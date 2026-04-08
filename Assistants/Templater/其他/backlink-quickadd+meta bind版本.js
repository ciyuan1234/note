module.exports = async function insertBacklinks(params) {
    // 获取当前活动文件
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
        new Notice("没有打开的文件");
        return;
    }
    // 获取所有反向链接
    const backlinksMap = this.app.metadataCache.getBacklinksForFile(activeFile);
    if (!backlinksMap || backlinksMap.size === 0) {
        new Notice("当前文件没有反向链接");
        return;
    }
    // 获取当前编辑器
    const editor = this.app.workspace.activeEditor?.editor;
    if (!editor) {
        new Notice("无法获取编辑器实例");
        return;
    }
    // 构建要插入的文本
    let insertText = "\n## 反向链接笔记\n\n";
    
    try {
        // 使用 Array.from 将 Map 转换为数组以便遍历
        const backlinks = Array.from(backlinksMap.keys());
        
        // 遍历所有反向链接文件并构建嵌入语法
        for (const filepath of backlinks) {
            const file = this.app.vault.getAbstractFileByPath(filepath);
            if (file) {
                insertText += "```meta-bind-embed\n" +
                            `[[${file.basename}]]\n` +
                            "```\n\n";
            }
        }
        // 在当前光标位置插入文本
        const cursor = editor.getCursor();
        editor.replaceRange(insertText, cursor);
        new Notice(`成功插入 ${backlinks.length} 个反向链接`);
    } catch (error) {
        console.error("处理反向链接时出错:", error);
        new Notice("处理反向链接时出错，请检查控制台");
    }
}