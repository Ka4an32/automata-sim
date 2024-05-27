import SavesManager from "./SavesManager";
import { Save, SaveMeta } from "./Save";
import { ComputerType, graph } from "../react-graph-vis-types";

import { SaveModel } from "../Models/SaveModel";

export default class CloudSavesManager implements SavesManager {
    private readonly onAuthFailed;

    constructor(onAuthFailed: () => void) {
        this.onAuthFailed = onAuthFailed;
    }

    async getSave(saveMeta: SaveMeta): Promise<Save | null> {
        let save = null;
        return save;
    }

    async getSavesMeta(): Promise<SaveMeta[]> {
        let saves: SaveModel[] = [];
        return saves.map(x => {
            const saveMeta: SaveMeta = {
                id: x.id,
                name: x.name
            };
            return saveMeta;
        });
    }

    async save(name: string, graph: graph, type: ComputerType): Promise<void> {
        const serialized_save = JSON.stringify({
            graph: graph,
            type: type
        }, (key, value) => value instanceof Set ? Array.from(value) : value);
    }
}
