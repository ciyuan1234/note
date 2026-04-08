/*
** Script Name: Search And Replace
** Author: 鱼先生的模块化Obsidian
** 小红书: https://www.xiaohongshu.com/user/profile/63cfeb720000000026010489
** bilibili: https://space.bilibili.com/2035394961?spm_id_from=333.1007.0.0
** Version: 1.0.2
*/

async function searchAndReplaceEnhanced(tp) {
    const isActivated = await checkActivation();
    if (!isActivated) {
        new tp.obsidian.Notice("error_cp");
        return;
    }
    const searchText = await new Promise(resolve => {
        const modal = new tp.obsidian.Modal(app);
        modal.titleEl.setText("输入搜索内容");
        
        const inputContainer = modal.contentEl.createDiv();
        const input = inputContainer.createEl("input", {
            type: "text",
            placeholder: "输入要搜索的文本"
        });
        input.style.width = "100%";
        input.style.marginBottom = "10px";
        
        const buttonContainer = modal.contentEl.createDiv({
            cls: "modal-button-container"
        });
        
        const confirmButton = buttonContainer.createEl("button", {
            text: "确认"
        });
        const cancelButton = buttonContainer.createEl("button", {
            text: "取消"
        });
        
        confirmButton.addEventListener("click", () => {
            const value = input.value.trim();
            if (value) {
                modal.close();
                resolve(value);
            }
        });
        
        cancelButton.addEventListener("click", () => {
            modal.close();
            resolve(null);
        });
        
        input.focus();
        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                confirmButton.click();
            }
        });
        
        modal.open();
    });
    
    if (!searchText) return;
    
    const replaceText = await new Promise(resolve => {
        const modal = new tp.obsidian.Modal(app);
        modal.titleEl.setText("输入替换内容");
        
        const inputContainer = modal.contentEl.createDiv();
        const input = inputContainer.createEl("input", {
            type: "text",
            placeholder: "输入要替换成的文本"
        });
        input.style.width = "100%";
        input.style.marginBottom = "10px";
        
        const buttonContainer = modal.contentEl.createDiv({
            cls: "modal-button-container"
        });
        
        const confirmButton = buttonContainer.createEl("button", {
            text: "确认"
        });
        const cancelButton = buttonContainer.createEl("button", {
            text: "取消"
        });
        
        confirmButton.addEventListener("click", () => {
            modal.close();
            resolve(input.value);
        });
        
        cancelButton.addEventListener("click", () => {
            modal.close();
            resolve(null);
        });
        
        input.focus();
        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                confirmButton.click();
            }
        });
        
        modal.open();
    });
    
    if (replaceText === null) return;

    const files = app.vault.getMarkdownFiles();
    let totalMatches = 0;
    const searchResults = [];

    for (const file of files) {
        const content = await app.vault.read(file);
        let searchStartIndex = 0;  
        
        while (true) {
            
            const matchIndex = content.indexOf(searchText, searchStartIndex);
            if (matchIndex === -1) break;  
            
            
            const previewStart = Math.max(0, matchIndex - 60);
            const previewEnd = Math.min(content.length, matchIndex + searchText.length + 60);
            
            
            let previewText = content.slice(previewStart, previewEnd);
            let highlightStart = matchIndex - previewStart;  
            
            
            let finalPreview = '';  
            if (previewStart > 0) {
                previewText = '...' + previewText;
                highlightStart += 3;
            }
            
            
            const beforeMatch = previewText.slice(0, highlightStart);
            const matchedText = previewText.slice(highlightStart, highlightStart + searchText.length);
            const afterMatch = previewText.slice(highlightStart + searchText.length);
            
            finalPreview = beforeMatch + 
                          '<strong>' + matchedText + '</strong>' + 
                          afterMatch;
                          
            if (previewEnd < content.length) {
                finalPreview += '...';
            }
            
            
            finalPreview = finalPreview.replace(/\n/g, ' ');
            
            
            totalMatches++;
            searchResults.push({
                number: totalMatches,
                path: file.path,
                preview: finalPreview,
                position: matchIndex,
                excluded: false
            });
            
            
            searchStartIndex = matchIndex + searchText.length;
        }
    }

    if (searchResults.length === 0) {
        new tp.obsidian.Notice("未找到匹配内容");
        return;
    }
    const confirmed = await new Promise(resolve => {
        const modal = new tp.obsidian.Modal(app);
        modal.modalEl.style.width = '850px';
        const url = "https://www.xiaohongshu.com/user/profile/63cfeb720000000026010489";
        const alias = "预览搜索结果 | 模块化Obsidian";
        modal.titleEl.createEl("a", {
            text: alias,
            href: url,
        });
        
        const contentContainer = modal.contentEl.createDiv({
            cls: "search-results-container"
        });
        contentContainer.style.maxHeight = "600px";
        contentContainer.style.overflow = "auto";
        contentContainer.style.marginBottom = "10px";
        
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .hover-popup {
                z-index: 100 !important;
            }
            .modal-container {
                z-index: auto !important;
            }
            .hover-popup {
                z-index: 999999 !important;
            }
            .search-results-container {
                padding: 0;
                font-size: 16px;
                width: 100%;
            }
            .search-results-table {
                width: 100%;
                border-collapse: collapse;
                margin: 1em 0;
            }
            .search-results-table th,
            .search-results-table td {
                padding: 8px;
                border: 1px solid var(--background-modifier-border);
                text-align: left;
            }
            .search-results-table th {
                background-color: var(--background-secondary);
                font-weight: bold;
            }
            .search-results-table td {
                vertical-align: top;
                word-break: break-word;
            }
            .search-results-table tr:nth-child(even) {
                background-color: var(--background-secondary);
            }
            .search-results-table .number-col {
                width: 60px;
                text-align: center;
            }
            .search-results-table .file-col {
                width: 20%;
            }
            .search-results-table .preview-col {
                width: auto;
            }
            .search-results-table .action-col {
                width: 100px;
                text-align: center;
            }
            .exclude-button {
                padding: 2px 8px;
                margin: 0 4px;
                border-radius: 4px;
                border: 1px solid var(--background-modifier-border);
                background-color: var(--background-primary);
                cursor: pointer;
            }
            .excluded {
                background-color: var(--background-modifier-error);
                color: var(--text-on-accent);
            }
            .internal-link {
                color: var(--link-color);
                text-decoration: none;
                cursor: pointer;
            }
            .internal-link:hover {
                text-decoration: underline;
            }
            .batch-operations {
                margin-bottom: 10px;
                display: flex;
                gap: 10px;
            }
            .batch-button {
                padding: 4px 12px;
                border-radius: 4px;
                border: 1px solid var(--background-modifier-border);
                background-color: var(--background-primary);
                cursor: pointer;
            }
            .batch-button:hover {
                background-color: var(--background-modifier-hover);
            }
            .search-summary {
                margin-bottom: 10px;
                padding: 8px;
                background-color: var(--background-secondary);
                border-radius: 4px;
            }
        `;
        modal.containerEl.appendChild(styleEl);
        
        const tableContainer = contentContainer.createDiv();
        
        
        const batchOperations = tableContainer.createDiv({
            cls: "batch-operations"
        });
        
        const excludeAllButton = batchOperations.createEl("button", {
            text: "一键排除全部",
            cls: "batch-button"
        });
        
        const includeAllButton = batchOperations.createEl("button", {
            text: "一键选择全部",
            cls: "batch-button"
        });

        
        const summaryDiv = tableContainer.createDiv({
            cls: "search-summary"
        });
        summaryDiv.innerHTML = `找到 ${totalMatches} 处匹配 | 查询范围：包含md文档所有内容（属性、代码、文本内容等）`;

        
        const table = tableContainer.createEl("table", {
            cls: "search-results-table"
        });

        
        const thead = table.createEl("thead");
        const headerRow = thead.createEl("tr");
        ["序号", "文档", "预览", "操作"].forEach(text => {
            const th = headerRow.createEl("th");
            th.textContent = text;
        });

        
        const tbody = table.createEl("tbody");
        searchResults.forEach(result => {
            const row = tbody.createEl("tr");
            
            
            const numCell = row.createEl("td", { cls: "number-col" });
            numCell.textContent = result.number;
            
            
            const fileCell = row.createEl("td", { cls: "file-col" });
            const fileName = result.path.split('/').pop().replace(/\.md$/, '');
            const fileLink = fileCell.createEl("a", {
                cls: "internal-link",
                text: fileName
            });
            fileLink.dataset.path = result.path;
            
            
            const previewCell = row.createEl("td", { cls: "preview-col" });
            previewCell.innerHTML = result.preview;
            
            
            const actionCell = row.createEl("td", { cls: "action-col" });
            const excludeButton = actionCell.createEl("button", {
                cls: "exclude-button",
                text: "排除"
            });
            excludeButton.dataset.number = result.number;
        });
        
        excludeAllButton.addEventListener('click', () => {
            searchResults.forEach(result => {
                result.excluded = true;
            });
            tableContainer.querySelectorAll('.exclude-button').forEach(button => {
                button.classList.add('excluded');
                button.textContent = '❌已排除';
            });
        });
        
        includeAllButton.addEventListener('click', () => {
            searchResults.forEach(result => {
                result.excluded = false;
            });
            tableContainer.querySelectorAll('.exclude-button').forEach(button => {
                button.classList.remove('excluded');
                button.textContent = '排除';
            });
        });

        
        tableContainer.querySelectorAll('.exclude-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const number = parseInt(event.target.dataset.number);
                const result = searchResults.find(r => r.number === number);
                if (result) {
                    result.excluded = !result.excluded;
                    event.target.classList.toggle('excluded');
                    event.target.textContent = result.excluded ? '❌已排除' : '排除';
                }
                event.preventDefault();
                event.stopPropagation();
            });
        });

        
        tableContainer.querySelectorAll('.internal-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });

            let isHovering = false;
            let activePopup = false;

            const handleMouseover = async (event) => {
                if ((event.ctrlKey || event.metaKey) && !activePopup) {
                    const targetFile = app.vault.getAbstractFileByPath(link.dataset.path);
                    if (targetFile) {
                        activePopup = true;
                        app.workspace.trigger('hover-link', {
                            event,
                            source: 'search-preview',
                            hoverParent: document.body,
                            targetEl: event.target,
                            linktext: targetFile.path,
                            sourcePath: targetFile.path
                        });
                    }
                }
            };

            link.addEventListener('mouseenter', (event) => {
                isHovering = true;
                if (event.ctrlKey || event.metaKey) {
                    handleMouseover(event);
                }
            });

            link.addEventListener('mouseleave', () => {
                isHovering = false;
                app.workspace.trigger('hover-link:close');
                activePopup = false;
            });

            document.addEventListener('keydown', (event) => {
                if ((event.key === 'Control' || event.key === 'Meta') && isHovering) {
                    handleMouseover(event);
                }
            });

            document.addEventListener('keyup', (event) => {
                if (event.key === 'Control' || event.key === 'Meta') {
                    app.workspace.trigger('hover-link:close');
                    activePopup = false;
                }
            });
        });
        
        const buttonContainer = modal.contentEl.createDiv({
            cls: "modal-button-container"
        });

        const warningText = buttonContainer.createSpan({
            text: "❗❗❗警告：危险操作，替换不可逆，必要时请备份仓库❗且已排除不需要替换的选项",
            cls: "replace-warning-text"
        });
        warningText.style.color = "var(--text-error)";
        warningText.style.marginRight = "20px";

        const confirmButton = buttonContainer.createEl("button", {
            text: "确认替换"
        });
        const cancelButton = buttonContainer.createEl("button", {
            text: "取消"
        });
        
        confirmButton.addEventListener("click", () => {
            modal.close();
            resolve(true);
        });
        
        cancelButton.addEventListener("click", () => {
            modal.close();
            resolve(false);
        });
        
        modal.open();
    });
    
    if (confirmed) {
        const fileGroups = {};
        searchResults.forEach(result => {
            if (!result.excluded) {
                if (!fileGroups[result.path]) {
                    fileGroups[result.path] = [];
                }
                fileGroups[result.path].push(result);
            }
        });
    
        let replacedFiles = 0;
        for (const [path, results] of Object.entries(fileGroups)) {
            const file = app.vault.getAbstractFileByPath(path);
            if (file) {
                let content = await app.vault.read(file);
                
                
                results.sort((a, b) => b.position - a.position);
                
                for (const result of results) {
                    const before = content.slice(0, result.position);
                    const after = content.slice(result.position + searchText.length);
                    content = before + replaceText + after;
                }
                
                await app.vault.modify(file, content);
                replacedFiles++;
            }
        }
        
        const excludedCount = searchResults.filter(r => r.excluded).length;
        new tp.obsidian.Notice(`已完成替换，共处理 ${replacedFiles} 个文件，排除 ${excludedCount} 处匹配`);
        return;
    }
    return;
}

async function checkActivation() {
    try {
        const pluginDataPath = '.obsidian/plugins/obsidian-content-protection/data.json';
        const dataFile = await app.vault.adapter.read(pluginDataPath);
        const data = JSON.parse(dataFile);
        return data.isActivated === true;
    } catch (error) {
        console.error("检测:", error);
        return false;
    }
}

module.exports = searchAndReplaceEnhanced;