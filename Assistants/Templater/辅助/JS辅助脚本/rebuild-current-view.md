<%*
(async function() {
    await sleep(100);
    const dvPlugin = app.plugins.getPlugin('dataview');
    if (dvPlugin) {
        app.commands.executeCommandById('dataview:dataview-rebuild-current-view');
        console.log('已刷新窗口');
    } else {
        console.warn('Dataview 插件未开启');
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();
%>