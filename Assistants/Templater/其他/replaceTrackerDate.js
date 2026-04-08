module.exports = async (params) => {
    const QuickAdd = params.quickAddApi;
    
    const files = app.vault.getMarkdownFiles()
        .filter(file => file.path.startsWith("Assistants/Modules/图表模块"));
    
    if (files.length === 0) {
        new Notice("未找到路径下的MD文件");
        return;
    }

    let targetFiles = [];
    for (const file of files) {
        const content = await app.vault.read(file);
        if (content.includes('startDate:') || content.includes('endDate:') || content.includes('initMonth:')) {
            targetFiles.push(file);
        }
    }

    if (targetFiles.length === 0) {
        new Notice("未找到包含日期字段的文件");
        return;
    }

    const startDate = await QuickAdd.inputPrompt(
        "请输入新的开始日期 (YYYY-MM-DD)",
        new Date().toISOString().slice(0, 10)
    );
    if (!startDate) return;

    const endDate = await QuickAdd.inputPrompt(
        "请输入新的结束日期 (YYYY-MM-DD)",
        new Date().toISOString().slice(0, 10)
    );
    if (!endDate) return;

    const initMonth = await QuickAdd.inputPrompt(
        "请输入新的日历图表月份 (YYYY-MM)",
        new Date().toISOString().slice(0, 7)
    );
    if (!initMonth) return;

    // 验证日期格式
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const monthRegex = /^\d{4}-\d{2}$/;
    
    let hasError = false;
    let errorMsg = [];

    if (!dateRegex.test(startDate)) {
        errorMsg.push("开始日期格式不正确，请使用 YYYY-MM-DD 格式");
        hasError = true;
    }
    
    if (!dateRegex.test(endDate)) {
        errorMsg.push("结束日期格式不正确，请使用 YYYY-MM-DD 格式");
        hasError = true;
    }
    
    if (!monthRegex.test(initMonth)) {
        errorMsg.push("日历图表月份格式不正确，请使用 YYYY-MM 格式");
        hasError = true;
    }

    if (hasError) {
        new Notice(errorMsg.join('\n'));
        return;
    }

    for (const file of targetFiles) {
        let content = await app.vault.read(file);
        content = content.replace(/startDate:\s*[^\n]+/g, `startDate: ${startDate}`)
                        .replace(/endDate:\s*[^\n]+/g, `endDate: ${endDate}`)
                        .replace(/initMonth:\s*[^\n]+/g, `initMonth: ${initMonth}`);
        await app.vault.modify(file, content);
    }
    
    new Notice(`已更新 ${targetFiles.length} 个文件`);
};