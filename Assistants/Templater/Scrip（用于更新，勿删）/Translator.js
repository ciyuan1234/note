/*
** Script Name: Translator
** Author: 鱼先生的模块化Obsidian
** Bilibili: https://space.bilibili.com/2035394961?spm_id_from=333.1007.0.0
** 小红书：https://www.xiaohongshu.com/user/profile/63cfeb720000000026010489
** Version: 1.0.0
*/

const LANGUAGE_CONFIG = {
    '中文': 'zh',
    '英文': 'en',
    '日文': 'ja',
    '韩文': 'ko',
    '德文': 'de',
    '法文': 'fr'
};


const TRANSLATION_TYPES = {
    'zh2en': '中译英',
    'en2zh': '英译中',
    'zh2ja': '中译日',
    'ja2zh': '日译中',
    'zh2ko': '中译韩',
    'ko2zh': '韩译中',
    'zh2de': '中译德',
    'de2zh': '德译中',
    'zh2fr': '中译法',
    'fr2zh': '法译中'
};


const PROPER_NOUNS = {
    'Obsidian': '黑曜石',

};


async function detectLanguage(text) {
    
    if (text.trim().split(/\s+/).length === 1 && PROPER_NOUNS[text.trim()]) {
        return 'en';
    }

    
    const features = {
        zh: {
            pattern: /[\u4e00-\u9fa5]/g,
            weight: 1
        },
        en: {
            pattern: /[a-zA-Z]/g,
            weight: 0.8,
            extra: /^[a-zA-Z0-9\s.,!?()'";\-_]+$/
        },
        ja: {
            pattern: /[\u3040-\u30ff]|[\u3400-\u4dbf]|[\u4e00-\u9fff]/g,
            weight: 1
        },
        ko: {
            pattern: /[\uAC00-\uD7AF]|[\u1100-\u11FF]|[\u3130-\u318F]/g,
            weight: 1
        },
        de: {
            pattern: /[a-zA-Z]/g,
            weight: 0.7,
            extra: /[äöüßÄÖÜß]/g,
            extraWeight: 2
        },
        fr: {
            pattern: /[a-zA-Z]/g,
            weight: 0.7,
            extra: /[éèêëîïôœæçàùûüÿÉÈÊËÎÏÔŒÆÇÀÙÛÜŸ]/g,
            extraWeight: 2
        }
    };

    const scores = {
        zh: 0, en: 0, ja: 0, ko: 0, de: 0, fr: 0
    };

    
    for (const [lang, feature] of Object.entries(features)) {
        const matches = text.match(feature.pattern);
        if (matches) {
            scores[lang] += matches.length * feature.weight;
        }

        
        if (feature.extra) {
            const extraMatches = text.match(feature.extra);
            if (extraMatches) {
                scores[lang] += extraMatches.length * (feature.extraWeight || 1);
            }
        }
    }

    
    const trimmedText = text.trim().toLowerCase();
    

    const frenchPhrases = [
        'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'hors', 'ligne',
        'être', 'avoir', 'faire', 'aller', 'voir', 'savoir', 'pouvoir',
        'ce', 'cette', 'ces', 'mon', 'ton', 'son', 'votre', 'notre'
    ];
    

    const germanPhrases = [
        'der', 'die', 'das', 'ein', 'eine', 'ist', 'sind', 'und', 'oder',
        'für', 'mit', 'bei', 'seit', 'von', 'aus', 'nach', 'zu', 'zur'
    ];

    const words = trimmedText.split(/\s+/);
    words.forEach(word => {
        if (frenchPhrases.includes(word)) scores.fr += 2;
        if (germanPhrases.includes(word)) scores.de += 2;
    });


    if (text.length < 5) {
        scores.en *= 1.2;
    }

   
    const detectedLang = Object.entries(scores).reduce((a, b) => b[1] > a[1] ? b : a)[0];
    
    console.log('Text to detect:', text);
    console.log('Language detection scores:', scores);
    console.log('Detected language:', detectedLang);
    
    return detectedLang;
}


function getTransType(sourceLang, targetLang) {
    if (sourceLang === targetLang) {
        throw new Error('源语言和目标语言不能相同');
    }
    return `${sourceLang}2${targetLang}`;
}
async function translate(text, transType, token) {
   
    if (text.trim().split(/\s+/).length === 1 && PROPER_NOUNS[text.trim()]) {
        return PROPER_NOUNS[text.trim()];
    }

    const url = 'http://api.interpreter.caiyunai.com/v1/translator';
    
    if (!token) {
        throw new Error('翻译 token 未提供');
    }
    
    try {
        console.log('准备翻译文本:', text);
        console.log('翻译类型:', transType);

        
        let processedText = text;
        const isShortPhrase = text.length < 10;
        
        
        if (isShortPhrase) {
            
            const technicalTerms = [
                'obsidian', 'git', 'markdown', 'plugin', 'template', 'sync', 'backup', 
                'workspace', 'folder', 'file', 'editor', 'preview', 'settings', 'config',
                'database', 'server', 'client', 'api', 'interface', 'function', 'method',
                'variable', 'constant', 'parameter', 'argument', 'return', 'value', 'type',
                'class', 'object', 'array', 'string', 'number', 'boolean', 'null', 'undefined'
            ];

            
            const commonWords = [
                'and', 'or', 'but', 'for', 'in', 'on', 'at', 'to', 'from', 'with',
                'without', 'by', 'personal', 'private', 'public', 'common', 'general',
                'good', 'bad', 'high', 'low', 'new', 'old', 'first', 'last', 'next',
                'previous', 'before', 'after', 'now', 'then', 'here', 'there'
            ];

            const lowercaseText = text.toLowerCase().trim();
            
            
            if (technicalTerms.includes(lowercaseText) && !commonWords.includes(lowercaseText)) {
                const contextMap = {
                    'en2zh': {prefix: 'In the context of software, ', suffix: ' refers to'},
                    'fr2zh': {prefix: 'Dans le contexte du logiciel, ', suffix: ' signifie'},
                    'de2zh': {prefix: 'Im Softwarekontext bedeutet ', suffix: ''}
                };
                
                const context = contextMap[transType];
                if (context) {
                    processedText = context.prefix + text + context.suffix;
                }
            }
        }

        const payload = {
            source: [processedText],
            trans_type: transType,
            request_id: "demo",
            detect: true,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-authorization': 'token ' + token,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.target && data.target.length > 0) {
            return data.target[0];
        } else {
            throw new Error('没有收到有效的翻译结果');
        }
    } catch (error) {
        console.error('翻译错误:', error);
        throw error;
    }
}

async function getEditor(tp) {
    let editor = null;
    
    try {
        const activeLeaf = app.workspace.activeLeaf;
        if (activeLeaf && activeLeaf.view && activeLeaf.view.editor) {
            editor = activeLeaf.view.editor;
            return editor;
        }
    } catch (e) {
        console.log('通过 activeLeaf 获取编辑器失败:', e);
    }
    
    if (!editor && tp && tp.file && tp.file.editor) {
        editor = tp.file.editor;
        return editor;
    }
    
    if (!editor) {
        try {
            const leaves = app.workspace.getLeavesOfType('markdown');
            for (const leaf of leaves) {
                if (leaf.view && leaf.view.editor) {
                    editor = leaf.view.editor;
                    return editor;
                }
            }
        } catch (e) {
            console.log('通过 workspace leaves 获取编辑器失败:', e);
        }
    }

    return editor;
}

async function checkEditorMode() {
    if (!app || !app.workspace) {
        throw new Error('Obsidian API 未正确加载');
    }

    const activeLeaf = app.workspace.activeLeaf;
    if (!activeLeaf || !activeLeaf.view) {
        throw new Error('请先切换到编辑模式');
    }

    return true;
}

async function Translator(tp, token) {
    console.log('Translator 函数开始执行');
    let from, to;
    
    try {
        await checkEditorMode();
        const editor = await getEditor(tp);
        
        if (!editor) {
            throw new Error('请在编辑模式下使用此功能，并确保光标在编辑器中');
        }

        const selectedText = editor.getSelection();
        from = editor.getCursor('from');
        to = editor.getCursor('to');
        
        if (!selectedText || selectedText.trim() === '') {
            throw new Error('请先选择要翻译的文本');
        }

        
        const sourceLang = await detectLanguage(selectedText);
        
        
        let targetLangChoices = [];
        if (sourceLang === 'zh') {
            targetLangChoices = ['英文', '日文', '韩文', '德文', '法文'];
        } else {
            targetLangChoices = ['中文'];
        }

        
        const targetLangChoice = await tp.system.suggester(
            targetLangChoices,
            targetLangChoices,false, "Esc取消选择，将导致选中原文被清除，请Ctrl+Z (Windows) 或 Cmd+Z (Mac)撤销"
        );

        if (!targetLangChoice) {
            throw new Error('未选择目标语言');
        }

        const targetLang = LANGUAGE_CONFIG[targetLangChoice];
        const transType = getTransType(sourceLang, targetLang);

        
        let retryCount = 3;
        let translatedText = null;
        let lastError = null;

        while (retryCount > 0 && !translatedText) {
            try {
                translatedText = await translate(selectedText, transType, token);
                break;
            } catch (error) {
                lastError = error;
                retryCount--;
                if (retryCount > 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        if (!translatedText) {
            throw lastError || new Error('翻译失败');
        }

        
        const replaceTypes = [
            "替换原文",
            "在原文后面添加翻译",
            "换行添加翻译"
        ];

        
        const replaceType = await tp.system.suggester(
            replaceTypes,
            replaceTypes,false, "Esc取消选择，将导致选中原文被清除，请Ctrl+Z (Windows) 或 Cmd+Z (Mac)撤销"
        );

        if (!replaceType) {
            throw new Error('未选择替换类型');
        }

        
        let finalText;
        switch (replaceType) {
            case "替换原文":
                finalText = translatedText;
                break;
            case "在原文后面添加翻译":
                finalText = `${selectedText} ^[${translatedText}]`;
                break;
            case "换行添加翻译":
                finalText = `${selectedText}\n\n>${translatedText}\n`;
                break;
            default:
                finalText = translatedText;
        }

        editor.replaceSelection(finalText);
        new Notice('翻译成功！');
        
        return translatedText;

    } catch (error) {
        console.error('翻译过程出错:', error);
        
        let errorMessage = error.message;
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = '网络请求失败，请检查网络连接';
        } else if (error.name === 'SyntaxError') {
            errorMessage = 'API 返回数据格式错误';
        }
        
        new Notice(`翻译出错: ${errorMessage}`);
        
        
        if (from && to) {
            editor.setSelection(from, to);
            editor.focus();
        }
        
        throw error;
    }
}

function checkEnvironment() {
    if (!app) {
        throw new Error('Obsidian API 未正确加载');
    }
    
    if (!app.workspace) {
        throw new Error('Workspace API 未正确加载');
    }
    
    if (typeof fetch !== 'function') {
        throw new Error('Fetch API 不可用');
    }
}

try {
    checkEnvironment();
} catch (error) {
    console.error('环境检查失败:', error);
}

module.exports = Translator;