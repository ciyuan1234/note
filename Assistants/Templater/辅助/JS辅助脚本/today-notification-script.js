/*
** Script Name: today-notification
** Author: 鱼先生的模块化Obsidian
** Bilibili: https://space.bilibili.com/2035394961?spm_id_from=333.1007.0.0
** 小红书：https://www.xiaohongshu.com/user/profile/63cfeb720000000026010489
** Version: 1.0.1
*/

module.exports = async function(params) {
  
    async function checkActivation() {
        try {
            const pluginDataPath = '.obsidian/plugins/obsidian-content-protection/data.json';
            const dataFile = await app.vault.adapter.read(pluginDataPath);
            const data = JSON.parse(dataFile);
            return data.isActivated === true;
        } catch (error) {
            console.error("检查激活状态失败:", error);
            return false;
        }
    }
  
    const isActivated = await checkActivation();
    if (!isActivated) {
        new Notice("error_cp");
        return "error_cp";
    }
  
    const dv = app.plugins.plugins.dataview.api;
    
    if (!dv) {
        new Notice("Dataview 插件未找到或未启用");
        return;
    }
    
    try {
        const pages = dv.pages('"Documents"')
                        .where(p => p["阐述日期"] && p["阐述日期"].toString() === dv.date("today").toString());
        
        let noticeText;
        
        if (!pages || pages.length === 0) {
            noticeText = "今天没有需要详述的笔记\n请设置详述计划\n\n👉 点击查看详述列表";
        } else {
            noticeText = "今日需要进一步详述的笔记:\n";
            let count = 0;
            
            for (const page of pages.values) {
                noticeText += `• ${page.file.name}\n`;
                count++;
                
                if (count >= 10) {
                    noticeText += `... 还有 ${pages.length - 10} 个文档\n`;
                    break;
                }
            }
            
            noticeText += "\n👉 点击查看详细列表";
        }
        
        // 无论是否有任务，都创建可点击通知
        const notice = new Notice(noticeText, 10000); // 显示10秒
        
        if (notice.noticeEl) {
            notice.noticeEl.style.cursor = "pointer";
            notice.noticeEl.addEventListener("click", () => {
                const targetPath = "Assistants/Modules/任务模块/今日需处理的笔记.md";
                const targetFile = app.vault.getAbstractFileByPath(targetPath);
                
                if (targetFile) {
                    app.workspace.getLeaf().openFile(targetFile);
                } else {
                    new Notice(`文件未找到: ${targetPath}`);
                    
                    app.commands.executeCommandById('command-palette:open');
                    setTimeout(() => {
                        const inputEl = document.querySelector('.prompt-input');
                        if (inputEl) {
                            inputEl.value = '今日需处理的笔记';
                            inputEl.dispatchEvent(new Event('input'));
                        }
                    }, 100);
                }
            });
        }
        
        return pages ? pages.values : []; 
    } catch (error) {
        console.error("Dataview查询失败:", error);
        new Notice("查询失败: " + error.message);
        return null;
    }
  }