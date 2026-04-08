/*
This script gets all backlinks of the current Excalidraw drawing and inserts them as non-overlapping MD-Embeddable elements.
```javascript
*/
if(!ea.verifyMinimumPluginVersion || !ea.verifyMinimumPluginVersion("1.5.21")) {
    new Notice("This script requires a newer version of Excalidraw. Please install the latest version.");
    return;
}

try {
    // Get current file
    const currentFile = ea.targetView.file;
    if (!currentFile) {
        new Notice("No current file found");
        return;
    }

    // Get and verify workspace
    if (!app.workspace) {
        new Notice("Workspace not available");
        return;
    }

    // Get all files that link to the current file
    const resolvedLinks = app.metadataCache.resolvedLinks;
    if (!resolvedLinks) {
        new Notice("Unable to get resolved links");
        return;
    }

    let backlinks = [];

    // Iterate through all files to find backlinks
    for (let [sourcePath, targetLinks] of Object.entries(resolvedLinks)) {
        if (targetLinks && targetLinks[currentFile.path]) {
            backlinks.push(sourcePath);
        }
    }

    if (backlinks.length === 0) {
        new Notice("No backlinks found");
        return;
    }

    // Layout settings
    const itemWidth = 500;
    const itemHeight = 500;
    const padding = 100;
    const scale = 0.78;
    let currentX = 164;
    let currentY = 358;

    // Function to format path with wiki links
    function formatPathWithWikiLinks(path) {
        try {
            let formattedPath = path.replace(/\.md$/, '');
            return `[[${formattedPath}]]`;
        } catch (error) {
            console.error("Error formatting path:", error);
            return path;
        }
    }

    // Get existing elements and track them
    const existingElements = ea.getViewElements() || [];
    const existingEmbeds = new Map();

    // Track existing embeds with both path and containerId
    for (const element of existingElements) {
        if (element && element.type === 'embeddable') {
            if (element.containerId) {
                existingEmbeds.set(element.containerId, true);
            }
            // Also check formatted version
            if (element.containerId && element.containerId.startsWith('[[')) {
                existingEmbeds.set(element.containerId.slice(2, -2), true);
            }
        }
    }

    // Calculate starting position based on existing elements
    if (existingElements.length > 0) {
        try {
            const boundingBox = ea.getBoundingBox(existingElements);
            if (boundingBox && typeof boundingBox.maxY === 'number') {
                currentY = boundingBox.maxY + padding;
            }
        } catch (error) {
            console.error("Error calculating bounding box:", error);
            // Keep default currentY if there's an error
        }
    }

    // Track newly added elements
    let addedElements = [];
    let addedPaths = new Set();

    // Add backlinks with retry mechanism
    for (const path of backlinks) {
        try {
            // Skip if already embedded
            const wikiLinkedPath = formatPathWithWikiLinks(path);
            if (existingEmbeds.has(path) || existingEmbeds.has(wikiLinkedPath) || 
                addedPaths.has(path) || addedPaths.has(wikiLinkedPath)) {
                continue;
            }

            // Create embedded element
            let element = ea.addEmbeddable(
                currentX,
                currentY,
                itemWidth,
                itemHeight,
                wikiLinkedPath
            );
            
            // Verify element was created
            if (!element) {
                console.error("Failed to create element for path:", path);
                continue;
            }

            // Apply styling
            element.scale = [scale, scale];
            element.backgroundColor = "transparent";
            element.strokeWidth = 0;
            element.roughness = 0;
            element.opacity = 100;
            
            if (element.customData) {
                element.customData.borderRadius = "0px";
                element.customData.hideFilename = true;
                element.customData.transparent = true;
            }
            
            // Track this element
            addedElements.push(element);
            addedPaths.add(wikiLinkedPath);
            existingEmbeds.set(wikiLinkedPath, true);
            
            // Move to next position
            currentY += (itemHeight * scale) + padding;

        } catch (error) {
            console.error("Error processing backlink:", path, error);
            continue;
        }
    }

    // Only refresh if we actually added new elements
    if (addedElements.length > 0) {
        try {
            await ea.addElementsToView(false, true);
            new Notice(`Successfully added ${addedElements.length} new backlinks`);
        } catch (error) {
            console.error("Error refreshing view:", error);
            new Notice("Error occurred while updating view");
        }
    } else {
        new Notice("No new backlinks to add");
    }

} catch (error) {
    console.error("Script error:", error);
    new Notice("An error occurred while running the script");
}