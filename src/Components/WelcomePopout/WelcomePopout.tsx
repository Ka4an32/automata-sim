import React, { useEffect, useState } from "react";

import { ComputerType, graph } from "../../react-graph-vis-types";
import { computersInfo } from "../../utils";

import { SaveMeta } from "../../SavesManager/Save";

import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";

import "./WelcomePopout.css";

export interface WelcomePopoutProps {
    open: boolean,
    onClose: () => void,
    changeComputerType: (computerType: null | ComputerType, graph: graph | null) => void,
}

export const WelcomePopout: React.FunctionComponent<WelcomePopoutProps> = (
    {
        open,
        onClose,
        changeComputerType
    }) => {
    // const onCreateTemplateClicked = (type: ComputerType) => {
    //     changeComputerType(type, null);
    //     onClose();
    // }

    // const onBrowserSaveOpenClicked = async (saveMeta: SaveMeta) => {
    //     const save = await browserSavesManager.getSave(saveMeta);

    //     if (save) {
    //         changeComputerType(save.save.type, save.save.graph);
    //         onClose();
    //     }
    // }

    const onCreateEmptyClicked = (type: ComputerType) => {
        changeComputerType(type, { nodes: [], edges: [] });
        onClose();
    }

    const [cloudSavesMeta, setCloudSavesMeta] = useState<SaveMeta[]>([]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <p>Меню</p>
            </DialogTitle>
            <DialogContent>
                <Paper
                    className="welcome-popout__body"
                    variant="outlined"
                >
                    <List dense>
                        {
                            cloudSavesMeta.length !== 0 ?
                                <ListSubheader>
                                    Открыть сохранение в облаке
                                </ListSubheader>
                                : null
                        }
                        <ListSubheader>
                            Создать новый вычислитель
                        </ListSubheader>
                        {
                            Object.entries(computersInfo).map(entry => (
                                <ListItem
                                    key={entry[1].name}
                                    secondaryAction={
                                        <div>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => onCreateEmptyClicked(entry[0] as ComputerType)}
                                            >
                                                Создать
                                            </Button>
                                        </div>
                                    }
                                >
                                    <ListItemText primary={entry[1].name} secondary={entry[1].description} />
                                </ListItem>
                            ))
                        }
                    </List>
                </Paper>
            </DialogContent>
        </Dialog>
    );
}

export default WelcomePopout;
