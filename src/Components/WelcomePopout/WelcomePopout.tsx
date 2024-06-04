import React, { useState } from "react";

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
import { MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";

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
    const onCreateEmptyClicked = (type: ComputerType) => {
        changeComputerType(type, { nodes: [], edges: [] });
        onClose();
    }

    const onCreateTable = (states: any[], edgesState: Record<string, string>, edgesOutput: Record<string, string>) => {
        const nodes = states.map(({ label, id }, i) => ({
            x: Math.random() * 100 * (i + 1), y: Math.random() * 100 * (i + 1), id, isAdmit: false, isCurrent: false, isInitial: i === 0, label
        }))
        const edges: any = []

        Object.entries(edgesState).forEach(([key, value]) => {
            const _key = key.split('-')
            const from = _key[1]
            const title = _key[0]
            edges.push({ from: +from, to: +value, transitions: new Set([[{ title, output: edgesOutput[key] }]]) })
        })

        changeComputerType('mealy', { nodes, edges, })
        onClose();

    }

    const [tableCreate, setTableCreate] = useState(false)

    const [states, setStates] = useState([
        { label: 'S1', id: 1 },
        { label: 'S2', id: 2 },
    ])
    const [insertValue, setInsertValue] = useState([
        'f',
        'n',
    ])
    const [outputValue, setOutputValue] = useState([
        'k',
        'i',
    ])



    const [edgesState, setEdgesStateObj] = useState<Record<string, string>>({})
    const [edgesOutput, setEdgesOutputObj] = useState<Record<string, string>>({})

    const removeStates = (index: number) => {
        setStates((state) => {
            // @ts-ignore
            return state.toSpliced(index, 1)
        })
    }

    const removeInsertValue = (index: number) => {
        setInsertValue((state) => {
            // @ts-ignore
            return state.toSpliced(index, 1)
        })
    }

    const [cloudSavesMeta] = useState<SaveMeta[]>([]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <p>{tableCreate ? 'Задание автомата' : 'Меню'}</p>
                {tableCreate &&
                    (
                        <div style={{ display: 'flex', marginBottom: '15px' }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setTableCreate(false)}
                            >
                                Назад
                            </Button>

                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setStates((state) => [...state, { label: `S${state.length + 1}`, id: state.length + 1 }])}
                                sx={{ marginLeft: 'auto' }}
                            >
                                Добавить состояние
                            </Button>
                            <div style={{ display: 'flex', marginLeft: '10px' }}>
                                <TextField sx={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px', maxWidth: '170px' }} size="small" id="outlined-basic" label="Входное значение" variant="outlined" />
                                <Button size="small" variant="outlined" > Добавить</Button>
                            </div>
                            <div style={{ display: 'flex', marginLeft: '10px' }}>
                                <TextField sx={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px', maxWidth: '175px' }} size="small" id="outlined-basic" label="Выходное значение" variant="outlined" />
                                <Button size="small" variant="outlined" > Добавить</Button>
                            </div>
                        </div>
                    )
                }


            </DialogTitle>
            <DialogContent>
                <Paper
                    className="welcome-popout__body"
                    variant="outlined"
                >
                    {tableCreate ? (
                        <div>
                            <div style={{ display: 'flex' }}>
                                <Paper sx={{ margin: '10px 0 10px 10px', width: '50%' }}>
                                    <Typography sx={{ padding: '10px' }} variant="h6">Таблица переходов</Typography >
                                    <TableContainer>
                                        <Table >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>δ</TableCell>
                                                    {states.map(({ label }, index) => {
                                                        return (
                                                            <TableCell align="center">{label}
                                                                <Button onClick={() => {
                                                                    removeStates(index)
                                                                }} sx={{ minWidth: '15px' }} color="error" size="small">X</Button>
                                                            </TableCell>
                                                        )
                                                    })}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {insertValue.map((v) => {
                                                    return (
                                                        <TableRow>
                                                            <TableCell align="left">{v}</TableCell>
                                                            {states.map(({ id }) => {
                                                                return (
                                                                    <TableCell align="center">
                                                                        <Select onChange={({ target: { value } }) => {
                                                                            setEdgesStateObj((set) => ({ ...set, [`${v}-${id}`]: `${value}` }))
                                                                        }}>
                                                                            {states.map(({ label, id }) => (
                                                                                <MenuItem value={id}>{label}</MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </TableCell>
                                                                )
                                                            })}
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                                <Paper sx={{ margin: '10px', width: '50%' }}>
                                    <Typography sx={{ padding: '10px' }} variant="h6">Таблица выходных значений</Typography>

                                    <TableContainer>
                                        <Table >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>λ</TableCell>
                                                    {states.map(({ label }, index) => {
                                                        return (
                                                            <TableCell align="center">{label} <Button onClick={() => {
                                                                removeStates(index)
                                                            }} sx={{ minWidth: '15px' }} color="error" size="small">X</Button></TableCell>
                                                        )
                                                    })}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {insertValue.map((v) => {
                                                    return (
                                                        <TableRow>
                                                            <TableCell align="left">{v}</TableCell>
                                                            {states.map(({ id }) => {
                                                                return (
                                                                    <TableCell align="center">
                                                                        <Select onChange={({ target: { value } }) => {
                                                                            setEdgesOutputObj((set) =>
                                                                                ({ ...set, [`${v}-${id}`]: `${value}` })
                                                                            )
                                                                        }}>
                                                                            {outputValue.map((id) => (
                                                                                <MenuItem value={id}>{id}</MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </TableCell>
                                                                )
                                                            })}
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </div>

                        </div>

                    ) : (
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
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => setTableCreate(true)}
                                                    sx={{ marginRight: '5px' }}
                                                >
                                                    Таблица
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => onCreateEmptyClicked(entry[0] as ComputerType)}
                                                >
                                                    Графически
                                                </Button>
                                            </div>
                                        }
                                    >
                                        <ListItemText primary={entry[1].name} secondary={entry[1].description} />
                                    </ListItem>
                                ))
                            }
                        </List>
                    )}
                </Paper>
                {tableCreate && (
                    <div style={{ margin: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => { onCreateTable(states, edgesState, edgesOutput) }} variant="outlined">Сохранить</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog >
    );
}

export default WelcomePopout;
