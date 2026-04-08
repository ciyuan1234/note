/*
** Script Name: Local Image Picker
** Author: 鱼先生的模块化Obsidian
** Bilibili: https://space.bilibili.com/2035394961?spm_id_from=333.1007.0.0
** 小红书：https://www.xiaohongshu.com/user/profile/63cfeb720000000026010489
** Version: 1.0.2
*/

class LocalImagePicker {
    constructor(tp, tR, settings) {
        this.tp = tp;
        this.tR = typeof tR === 'string' ? tR.trim() : '';
        this.settings = settings;
        this.vault = app.vault;
        this.selectedMaskClass = '';
        this.selectedSize = null;
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

    async getImageFiles() {
        const files = this.vault.getFiles();
        return files.filter(file => {
            const extension = file.extension.toLowerCase();
            return ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension);
        });
    }

    encodeImagePath(path) {
        const parts = path.split('/');
        
        const encodedParts = parts.map(part => encodeURIComponent(part));
        
        return encodedParts.join('/');
    }

    createImagePreview(file, width, height) {
        const relativePath = this.vault.getResourcePath(file);
        const fileName = file.name;

        return `
            <div class="image-preview-container" 
                 style="margin: 0; display: inline-block; text-align: center;"
                 role="button"
                 tabindex="0">
                <img src="${relativePath}" 
                     style="width: ${width}px; height: ${height}px; object-fit: cover; cursor: pointer; border: 1px solid #ddd; border-radius: 3px;"
                     data-path="${file.path}">
                <div style="font-size: 12px; margin-top: 5px; word-break: break-all; max-width: ${width}px;">
                    ${fileName}
                </div>
            </div>
        `;
    }

    async searchImages(searchTerm) {
        const allImages = await this.getImageFiles();
        if (!searchTerm) return allImages;

        const searchLower = searchTerm.toLowerCase();
        return allImages.filter(file => {
            const fileName = file.name.toLowerCase();
            const extension = file.extension.toLowerCase();
            return fileName.includes(searchLower) || 
                   (searchTerm.startsWith('.') && extension === searchTerm.slice(1).toLowerCase());
        });
    }

    async createImageSelectionModal() {
        return new Promise((resolve) => {
            const modal = new this.tp.obsidian.Modal(app);
            
            modal.containerEl.style.width = '850px';
            modal.containerEl.style.height = '85vh';
            modal.containerEl.style.position = 'fixed';
            modal.containerEl.style.top = '50%';
            modal.containerEl.style.left = '50%';
            modal.containerEl.style.transform = 'translate(-50%, -50%)';
            modal.containerEl.style.maxWidth = '1600px';
            
            modal.containerEl.querySelector('.modal').style.width = '850px';
            modal.containerEl.querySelector('.modal-bg').style.display = 'none';
            
            modal.contentEl.style.height = '100%';
            modal.contentEl.style.display = 'flex';
            modal.contentEl.style.flexDirection = 'column';
            modal.contentEl.style.padding = '0';
            modal.contentEl.style.margin = '0';

            const headerEl = modal.contentEl.createDiv('search-header');
            headerEl.style.padding = '15px';
            headerEl.style.borderBottom = '1px solid var(--background-modifier-border)';
            headerEl.style.backgroundColor = 'var(--background-secondary)';

            const searchInput = headerEl.createEl('input', {
                type: 'text',
                placeholder: '搜索图片 (例如: .jpg 或 图片名称 | Tab键聚焦到预览图)'
            });
            searchInput.style.width = '100%';
            searchInput.style.padding = '10px';
            searchInput.style.borderRadius = '4px';
            searchInput.style.border = '1px solid var(--background-modifier-border)';
            searchInput.style.backgroundColor = 'var(--background-primary)';

            const previewContainer = modal.contentEl.createDiv('preview-container');
            previewContainer.style.flex = '1';
            previewContainer.style.overflow = 'auto';
            previewContainer.style.padding = '10px';
            previewContainer.style.display = 'grid';
            previewContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
            previewContainer.style.gap = '10px';
            previewContainer.style.width = '100%';
            previewContainer.style.boxSizing = 'border-box';
            previewContainer.style.backgroundColor = 'var(--background-primary)';
            previewContainer.style.alignContent = 'start';

            const handleKeyboardNavigation = (e, elements) => {
                const current = document.activeElement;
                const containers = Array.from(elements);
                const currentIndex = containers.indexOf(current);
                
                switch (e.key) {
                    case 'Tab':
                        if (!e.shiftKey && currentIndex === containers.length - 1) {
                            containers[0].focus();
                            e.preventDefault();
                        } else if (e.shiftKey && currentIndex === 0) {
                            containers[containers.length - 1].focus();
                            e.preventDefault();
                        }
                        break;
                    case 'ArrowRight':
                        if (currentIndex < containers.length - 1) {
                            containers[currentIndex + 1].focus();
                            e.preventDefault();
                        }
                        break;
                    case 'ArrowLeft':
                        if (currentIndex > 0) {
                            containers[currentIndex - 1].focus();
                            e.preventDefault();
                        }
                        break;
                    case 'ArrowDown':
                        const nextIndex = currentIndex + 4;
                        if (nextIndex < containers.length) {
                            containers[nextIndex].focus();
                            e.preventDefault();
                        }
                        break;
                    case 'ArrowUp':
                        const prevIndex = currentIndex - 4;
                        if (prevIndex >= 0) {
                            containers[prevIndex].focus();
                            e.preventDefault();
                        }
                        break;
                    case 'Enter':
                    case ' ':
                        current.click();
                        e.preventDefault();
                        break;
                }
            };

            const updatePreview = async (autoFocus = false) => {
                const searchTerm = searchInput.value;
                const filteredImages = await this.searchImages(searchTerm);
                previewContainer.empty();

                filteredImages.forEach(file => {
                    const previewHtml = this.createImagePreview(file, 150, 150);
                    const previewEl = previewContainer.createDiv();
                    previewEl.innerHTML = previewHtml;
                    
                    const containerEl = previewEl.querySelector('.image-preview-container');
                    
                    containerEl.addEventListener('focus', () => {
                        containerEl.style.outline = '2px solid var(--interactive-accent)';
                        containerEl.style.outlineOffset = '2px';
                    });
                    
                    containerEl.addEventListener('blur', () => {
                        containerEl.style.outline = 'none';
                    });

                    const imgEl = containerEl.querySelector('img');
                    imgEl.removeAttribute('title');
                    imgEl.removeAttribute('alt');
                    containerEl.removeAttribute('title');

                    const handleSelection = () => {
                        const [width, height] = this.selectedSize.split('x').map(Number);
                        this.tR = this.insertImage(file.path, width, height, this.selectedMaskClass);
                        
                        modal.close();
                        resolve(this.tR);
                    };

                    containerEl.addEventListener('click', handleSelection);
                    containerEl.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleSelection();
                            e.preventDefault();
                        }
                    });
                });

                const containers = previewContainer.querySelectorAll('.image-preview-container');
                previewContainer.addEventListener('keydown', (e) => {
                    handleKeyboardNavigation(e, containers);
                });

                if (autoFocus && containers.length > 0) {
                    containers[0].focus();
                }
            };

            searchInput.addEventListener('input', () => {
                updatePreview(false);
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const containers = previewContainer.querySelectorAll('.image-preview-container');
                    if (containers.length > 0) {
                        containers[0].focus();
                        e.preventDefault();
                    }
                }
            });

            searchInput.focus();

            updatePreview(false);

            modal.onClose = () => {
                resolve(this.tR);
            };

            modal.open();
        });
    }

    insertImage(imagePath, width, height, maskClass = '') {
        const prefix = this.tR ? ' ' : '';
        const encodedPath = this.encodeImagePath(imagePath);
        let imageHtml;

        if (maskClass) {
            imageHtml = `<span class="${maskClass}" style="width: ${width}px; height: ${height}px;">` +
                       `<img src="${encodedPath}" alt="${imagePath.split('/').pop()}" ` +
                       `style="width: 100%; height: 100%; object-fit: cover;"></span>\u200B`;
        } else {
            imageHtml = `<span style="width: ${width}px; height: ${height}px;">` +
                       `<img src="${encodedPath}" alt="${imagePath.split('/').pop()}" ` +
                       `style="width: 100%; height: 100%; object-fit: cover;"></span>\u200B`;
        }

        return this.tR + prefix + imageHtml;
    }

    async makeImage() {
        const isActivated = await this.checkActivation();
        if (!isActivated) {
            return this.tR + "error_cp";
        }
        
        const sizeChoice = await this.tp.system.suggester(
            this.settings.size, 
            this.settings.size, 
            false, 
            "请选择图片尺寸"
        );
        
        if (!sizeChoice) return this.tR;
        this.selectedSize = sizeChoice;
        
        if (this.settings.useMask) {
            const maskChoices = ["不用遮罩-居左", "圆角遮罩-居左", "圆形遮罩-居左", "窗格效果-居左", 
                               "不用遮罩-居右", "圆角遮罩-居右", "圆形遮罩-居右", "窗格效果-居右"];
            const maskOptions = ["default", "rounded", "circle", "blinds", 
                               "default-R", "rounded-R", "circle-R", "blinds-R"];
            const option = await this.tp.system.suggester(
                maskChoices, 
                maskOptions, 
                false, 
                "选择遮罩类型和嵌入位置"
            );
            this.selectedMaskClass = option ? `image-mask-${option}` : "";
        }

        return await this.createImageSelectionModal();
    }
}

module.exports = LocalImagePicker;