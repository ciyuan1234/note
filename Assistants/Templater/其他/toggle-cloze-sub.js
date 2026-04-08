module.exports = async function toggleClozeAnswers(params) {
    try {

        const body = document.body;
        
        const hasClass = body.classList.contains('subscript-style');
        
        if (hasClass) {
            body.classList.remove('subscript-style');
            new Notice('完形填空已关闭');
        } else {
            body.classList.add('subscript-style');
            new Notice('完形填空已开启');
        }
        
    } catch (error) {
        console.error('Error toggling cloze answers:', error);
        new Notice('Error toggling cloze answers');
    }
}