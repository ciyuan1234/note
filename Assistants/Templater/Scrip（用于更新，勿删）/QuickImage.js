/*
** Script Name: Quick Image
** Author: 鱼先生的模块化Obsidian
** Bilibili: https://space.bilibili.com/2035394961?spm_id_from=333.1007.0.0
** 小红书：https://www.xiaohongshu.com/user/profile/63cfeb720000000026010489
** Version: 1.0.2
*/
class QuickImage {
    constructor(tp, tR, settings) {
        this.tp = tp;
        this.tR = typeof tR === 'string' ? tR.trim() : '';
        this.settings = settings;
        this.API_KEY = 'nabSsG9YG194PgMRxSRP6ivmNJiYsYAybOEVRr4GMXxn0PBe2y268YZL';
    }

    async fetchWithTimeout(url, options = {}, timeout = 5000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }

    async translateToEnglish(text, maxRetries = 3) {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                
                const translateUrl = new URL('https://api.mymemory.translated.net/get');
                translateUrl.searchParams.append('q', text);
                translateUrl.searchParams.append('langpair', 'zh|en');

                
                if (attempt > 0) {
                    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
                }

                const response = await this.fetchWithTimeout(translateUrl.toString(), {}, 5000);
                
                if (!response.ok) {
                    console.warn(`翻译尝试 ${attempt + 1}/${maxRetries} 失败，状态码: ${response.status}`);
                    continue;
                }

                const data = await response.json();
                
                if (!data || !data.responseData || !data.responseData.translatedText) {
                    throw new Error('Invalid translation response format');
                }

                const result = data.responseData.translatedText.trim();
                console.log('翻译成功:', `${text} => ${result}`);
                return result;
            } catch (error) {
                console.error(`翻译尝试 ${attempt + 1}/${maxRetries} 错误:`, error);
                if (attempt === maxRetries - 1) {
                    console.warn('所有翻译尝试都失败了，返回原文');
                    return text;
                }
            }
        }

        return text;
    }

    containsChinese(text) {
        return /[\u4e00-\u9fa5]/.test(text);
    }

    async makeImage() {
        const isActivated = await this.checkActivation();
        if (!isActivated) {
            return this.tR + "error_cp";
        }
    
        let { size, useMask } = this.settings;
    
        const sizeChoice = await this.tp.system.suggester(size, size, false, "请选择图片尺寸");
        if (!sizeChoice) return this.tR;
    
        const [width, height] = sizeChoice.split("x").map(Number);
    
        let maskClass = "";
        if (useMask) {
            const maskChoices = ["不用遮罩-居左", "圆角遮罩-居左", "圆形遮罩-居左", "窗格效果-居左", "不用遮罩-居右", "圆角遮罩-居右", "圆形遮罩-居右", "窗格效果-居右"];
            const maskOptions = ["default", "rounded", "circle", "blinds", "default-R", "rounded-R", "circle-R", "blinds-R"];
            const option = await this.tp.system.suggester(maskChoices, maskOptions, false, "选择遮罩类型和嵌入位置");
            maskClass = option ? `image-mask-${option}` : "";
        }
    
        const keywords = await this.tp.system.prompt("请输入图片关键词（支持中英文）");
        if (!keywords) return this.tR;
    
        let searchKeywords = keywords;
        if (this.containsChinese(keywords)) {
            searchKeywords = await this.translateToEnglish(keywords);
        }
    
        try {
            const apiUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchKeywords)}&per_page=20`;

            const response = await this.fetchWithTimeout(apiUrl, {
                headers: {
                    'Authorization': this.API_KEY
                }
            }, 10000);
            
            if (!response.ok) {
                throw new Error(`API请求失败，状态码：${response.status}`);
            }

            const data = await response.json();
            
            if (!data.photos || data.photos.length === 0) {
                return this.tR + `未找到符合的图片，搜索关键词: "${searchKeywords}"`;
            }

            const randomIndex = Math.floor(Math.random() * data.photos.length);
            const photo = data.photos[randomIndex];
            const imageUrl = photo.src.large;
            
            const prefix = this.tR ? ' ' : '';
            
            if (maskClass) {
                return this.tR + prefix + `<span class="${maskClass}" style="width: ${width}px; height: ${height}px;"><img src="${imageUrl}" alt="${keywords}" style="width: 100%; height: 100%; object-fit: cover;"></span>\u200B`;
            } else {
                return this.tR + prefix + `<img src="${imageUrl}" alt="${keywords}" width="${width}" height="${height}" style="object-fit: cover;">`;
            }
    
        } catch (error) {
            console.error("图片加载错误:", error);
            return this.tR + "图片加载失败，请稍后重试。";
        }
    }

    async checkActivation() {
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
}

module.exports = QuickImage;