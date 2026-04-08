// 生成唯一文件名，处理文件冲突
async function generateUniqueFileName(app, targetFolder, originalName) {
    let newName = originalName;
    let counter = 1;

    // 获取基础文件名和扩展名
    const baseName = originalName.replace(/(\.[^/.]+)$/, ""); // 去掉扩展名
    const extension = originalName.match(/(\.[^/.]+)$/) ? originalName.match(/(\.[^/.]+)$/)[0] : ""; // 获取扩展名
    let targetPath = `${targetFolder}/${newName}`;

    // 如果目标文件夹中已经存在同名文件，则递增后缀
    while (app.vault.getAbstractFileByPath(targetPath)) {
        const suffix = String(counter).padStart(2, "0"); // 生成两位数的后缀
        newName = `${baseName}_${suffix}${extension}`;
        targetPath = `${targetFolder}/${newName}`;
        counter++;
    }

    return newName;
}

// 自定义的 contains 函数来替代 includes
function contains(source, value, isNested = false) {
    if (Array.isArray(source)) {
        return source.some((item) => isNested ? item.startsWith(value) : item === value);
    } else if (typeof source === "string") {
        return isNested ? source.startsWith(value) : source.includes(value);
    }
    return false;
}

module.exports = async function moveFilesWithTag(params) {
    const {
        app,
        quickAddApi: { suggester, yesNoPrompt },
    } = params;

    // 获取所有标签
    const allTags = Object.keys(app.metadataCache.getTags());
    const tag = await suggester(allTags, allTags); // 用户选择的标签
    if (!tag) return;

    // 用户是否希望移动嵌套标签
    const shouldMoveNested = await yesNoPrompt(
        "Should I move nested tags, too?",
        `If you say no, I'll only move tags that are strictly equal to what you've chosen. If you say yes, I'll move tags that are nested under ${tag}.`
    );

    const cache = app.metadataCache.getCachedFiles();
    let filesToMove = [];

    // 遍历所有缓存文件
    cache.forEach((key) => {
        // 跳过 Assistants 文件夹中的文件
        if (key.includes("Assistants/")) return;

        const fileCache = app.metadataCache.getCache(key);
        if (!fileCache) return; // 确保 fileCache 存在

        let hasFrontmatterCacheTag = false;
        let hasTag = false;

        // 如果不移动嵌套标签，则严格匹配选定标签
        if (!shouldMoveNested) {
            if (fileCache.frontmatter?.tags) {
                if (typeof fileCache.frontmatter.tags === 'string') {
                    hasFrontmatterCacheTag = contains(fileCache.frontmatter.tags.split(" "), tag.replace("#", ""), false);
                } else if (Array.isArray(fileCache.frontmatter.tags)) {
                    hasFrontmatterCacheTag = contains(fileCache.frontmatter.tags, tag.replace("#", ""), false);
                }
            }
            if (fileCache?.tags) {
                hasTag = fileCache.tags.some((t) => contains(t.tag, tag, false)); // 严格匹配标签
            }
        } else {
            // 如果移动嵌套标签，则允许匹配子标签
            if (fileCache.frontmatter?.tags) {
                if (typeof fileCache.frontmatter.tags === 'string') {
                    hasFrontmatterCacheTag = contains(fileCache.frontmatter.tags.split(" "), tag.replace("#", ""), true);
                } else if (Array.isArray(fileCache.frontmatter.tags)) {
                    hasFrontmatterCacheTag = fileCache.frontmatter.tags.some((t) => contains(t, tag.replace("#", ""), true));
                }
            }
            if (fileCache?.tags) {
                hasTag = fileCache.tags.some((t) => contains(t.tag, tag, true)); // 使用 contains 匹配子标签
            }
        }

        // 确定需要移动的文件
        if (hasFrontmatterCacheTag || hasTag) {
            filesToMove.push(key);
        }
    });

    // 获取所有文件夹路径
    const folders = app.vault
        .getAllLoadedFiles()
        .filter((f) => f.children)
        .map((f) => f.path);

    const targetFolder = await suggester(folders, folders);
    if (!targetFolder) return;

    // 移动文件到目标文件夹
    for (const file of filesToMove) {
        const tfile = app.vault.getAbstractFileByPath(file);
        if (tfile) {
            try {
                // 获取唯一的文件名，避免文件名冲突
                const uniqueFileName = await generateUniqueFileName(app, targetFolder, tfile.name);

                // 将文件移动到目标文件夹，并使用唯一文件名
                await app.fileManager.renameFile(
                    tfile,
                    `${targetFolder}/${uniqueFileName}`
                );
            } catch (error) {
                console.error(`Failed to move file ${file}:`, error);
                // 即使文件移动失败，继续尝试移动其他文件
            }
        }
    }
};
