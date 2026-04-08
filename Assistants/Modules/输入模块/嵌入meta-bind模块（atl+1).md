<%*
const assistantsFolder = "Assistants"; 
const files = app.vault.getMarkdownFiles().filter(file => {
  return file.path.startsWith(assistantsFolder + "/");
});
const fileOptions = files.map(file => file.basename);
const selectedFile = await tp.system.suggester(fileOptions, fileOptions, false, "选择要嵌入的模板");
if (selectedFile) {
  tR += "```meta-bind-embed\n[[" + selectedFile + "]]\n```\n";
} else {
  tR += "";
}
%>