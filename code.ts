figma.showUI(__html__, { width: 400, height: 700 });

function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r, g, b };
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

figma.ui.onmessage = async (msg) => {
    if (msg.type === 'create-variables') {
        const palette = msg.palette;

        try {
            const collectionName = "配色ジェネレーター";
            const collections = await figma.variables.getLocalVariableCollectionsAsync();
            let collection = collections.find(c => c.name === collectionName);

            if (!collection) {
                collection = figma.variables.createVariableCollection(collectionName);
                collection.renameMode(collection.defaultModeId, "Light");
            }

            const allVariables = await figma.variables.getLocalVariablesAsync();

            Object.entries(palette).forEach(([role, scale]: [string, any]) => {
                const prefix = capitalize(role); // primary -> Primary
                Object.entries(scale).forEach(([step, hex]: [string, any]) => {
                    const name = `${prefix}/${step}`;
                    let variable = allVariables.find(
                        v => v.name === name && v.variableCollectionId === collection!.id
                    );

                    if (!variable) {
                        variable = figma.variables.createVariable(name, collection!, "COLOR");
                    }

                    const rgb = hexToRgb(hex);
                    variable.setValueForMode(collection!.defaultModeId, rgb);
                });
            });

            figma.notify("バリアブルを作成しました！");
        } catch (error) {
            console.error(error);
            figma.notify("エラーが発生しました: " + error);
        }
    }
};
