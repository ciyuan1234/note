/*
** Script Name: Get File or Link From Folder
** Author: 鱼先生的模块化Obsidian
** Bilibili: https://space.bilibili.com/2035394961?spm_id_from=333.1007.0.0
** 小红书：https://www.xiaohongshu.com/user/profile/63cfeb720000000026010489
** Version: 1.0.2
*/

async function checkActivation() {
    try {
        
        const pluginDataPath = '.obsidian/plugins/obsidian-content-protection/data.json';
        
        
        const dataFile = await app.vault.adapter.read(pluginDataPath);
        const data = JSON.parse(dataFile);
        
        
        return data.isActivated === true;
    } catch (error) {
        console.error("", error);
        return false;
    }
}

async function GetFileOrLinkFromFolder(tp, path, link = false) {
    
    const isActivated = await checkActivation();
    if (!isActivated) {
        return "error_cp";
    }

    const files = app.vault.getMarkdownFiles().filter(t => t.parent.path === path || t.parent.name === path);

    let choices = [];
    let options = [];

    files.forEach((t, index) => {
        const option = index + 1;
        const choice = "【" + option + "】" + t.basename;
        choices.push(choice);
        options.push(index)
    });

    const templateIndex = await tp.system.suggester(choices, options);

    if (null !== templateIndex ) {
        if(!link) {
            return files[templateIndex];
        } else {
            return `[[${app.metadataCache.fileToLinktext(files[templateIndex], app.vault.getName())}]]`;
        }
    } else {
        return null;
    }
}

module.exports = GetFileOrLinkFromFolder;