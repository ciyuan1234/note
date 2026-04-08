<%* 
const path = "Assistants/Templater/片段";
const processContent = content => {
    return content
        .replace(/^---\n[\s\S]*?\n---\n?/gm, '')  // 合并 frontmatter 处理
        .replace(/%%[\s\S]*?%%/g, '')            // 删除注释
        .replace(/\n{3,}/g, '\n\n')              // 合并空行处理
        .trim();
};

try {
    const link = await tp.user.InsertTP(tp, path, true);
    const content = link ? await tp.file.include(link) : '';
    tR += '\n' + processContent(content);
    tp.file.cursor_append();
} catch (error) {
    console.error('Template processing error:', error);
}
-%>