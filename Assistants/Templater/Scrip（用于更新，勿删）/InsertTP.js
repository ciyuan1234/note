
async function InsetTP(tp, path, link = false) {

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

module.exports = InsetTP;