import { ComputerInfo, ComputerType, edge, graph, node } from "./react-graph-vis-types";
import { EPS } from "./Logic/Computer";
import { Move, TransitionParams } from "./Logic/IGraphTypes";
import { Elements } from "./App";
import { DataSet } from "vis-network/standalone/esm/vis-network";


const epsSubstStr = (epsText: string) => (value: string) => value === EPS ? epsText : value

const epsSubstStrs = (epsText: string) => (values: string[]) => {
    return values.map(v => epsSubstStr(epsText)(v)).join(":")
}

const mvStr = (value: Move) => value === 0 ? "L" : "R"

export const transitionsToLabel = (transitions: Set<TransitionParams[]>, frmt: null | ComputerType): string => {
    const maxLength = (): number => {
        let max: number = 0;
        if (transitions !== undefined) {
            transitions.forEach(value => {
                value.forEach(value1 => {
                    if (value1.stackDown !== undefined && value1.stackPush !== undefined) {
                        const phs: number = Math.max(...value1.stackPush.map(o => o === EPS ? 0 : o.length), 0)
                        const ttl: number = value1.title === EPS ? 0 : value1.title.length
                        const std: number = value1.stackDown === EPS ? 0 : value1.stackDown.length
                        max = Math.max(...[phs, ttl, std, max].map(o => o), 0)
                    }
                })
            })
        }
        return max
    }

    let spc = ""
    const pdng_k = 7

    for (let i = 0; i < maxLength() * pdng_k; i++) {
        spc += " "
    }

    const epsSubst = epsSubstStr("ε")
    const epsSubsts = epsSubstStrs("ε")

    spc = frmt === 'tm' ? '       ' : spc

    let str = "" + spc
    if (transitions !== undefined) {
        if (frmt === 'tm') {
            transitions.forEach(value => {
                value.forEach((v) => {
                    if (v.stackDown !== undefined && v.stackPush !== undefined && v.move !== undefined) {
                        str += epsSubst(v.stackDown) + " | " + epsSubsts(v.stackPush) + " " + mvStr(v.move) + "\n" + spc
                    }
                })
            })
        } else if (frmt === 'pda' || frmt === "dpda") {
            transitions.forEach(value => {
                value.forEach((v) => {
                    if (v.title !== undefined && v.title.length > 0 && v.stackDown !== undefined && v.stackDown.length > 0 && v.stackPush !== undefined && v.stackPush.length > 0) {
                        str += epsSubst(v.title) + ", " + epsSubst(v.stackDown) + " | " + epsSubsts(v.stackPush) + " " + "\n" + spc
                    }
                })
            })
        } else if (frmt === "dfa" || frmt === "nfa" || frmt === "nfa-eps" || frmt === "moore" || frmt === "dmoore") {
            transitions.forEach(value => {
                value.forEach((v) => {
                    if (v.title !== undefined && v.title.length > 0) {
                        str += epsSubst(v.title) + " " + "\n" + spc
                    }
                })
            })
        } else if (frmt === "mealy" || frmt === "dmealy") {
            transitions.forEach(value => {
                value.forEach((v) => {
                    if (v.title !== undefined && v.title.length > 0 && v.output !== undefined) {
                        str += epsSubst(v.title) + " | " + v.output + "\n" + spc
                    }
                })
            })
        }
    }
    return str
}


export const getTransitionsTitles = (transitions: Set<TransitionParams[]>, frmt: null | ComputerType): string => {
    const epsSubst = epsSubstStr("eps")
    const epsSubsts = epsSubstStrs("eps")

    let str = ""
    if (transitions !== undefined) {
        if (frmt === 'tm') {
            transitions.forEach(value => {
                value.forEach((v) => {
                    if (v.stackDown !== undefined && v.stackPush !== undefined && v.move !== undefined) {
                        str += epsSubst(v.stackDown) + " | " + epsSubsts(v.stackPush) + '>' + mvStr(v.move) + ";\n"
                    }
                })
            })
        } else if (frmt === "pda" || frmt === "dpda") {
            transitions.forEach(value => {
                value.forEach((v) => {
                    if (v.title !== undefined && v.title.length > 0 && v.stackDown !== undefined && v.stackDown.length > 0 && v.stackPush !== undefined && v.stackPush.length > 0) {
                        str += epsSubst(v.title) + ", " + epsSubst(v.stackDown) + " | " + epsSubsts(v.stackPush) + ";\n"
                    }
                })
            })
        } else if (frmt === "dfa" || frmt === "nfa" || frmt === "nfa-eps" || frmt === "moore" || frmt === "dmoore") {
            transitions.forEach(value => {
                value.forEach((v) => {
                    if (v.title !== undefined && v.title.length > 0) {
                        str += epsSubst(v.title) + ";\n"
                    }
                })
            })
        } else if (frmt === "mealy" || frmt === "dmealy") {
            transitions.forEach(value => {
                value.forEach((v) => {
                    if (v.title !== undefined && v.title.length > 0 && v.output !== undefined) {
                        str += epsSubst(v.title) + " | " + v.output + ";\n"
                    }
                })
            })
        }
    }

    return str
}

export const decorateGraph = (elements: Elements, frmt: null | ComputerType) => {
    elements.edges.forEach((edge) => {
        elements.edges.update({
            id: edge.id!,
            label: transitionsToLabel(edge.transitions, frmt)
        })
    })

    elements.nodes.forEach((node) => {
        const lableTokens =
            node.label
                .split('')
                .filter(x => x !== " " && x !== "\n")
                .join('')
                .split('|')
        const output = lableTokens[1] !== undefined ? lableTokens[1] : undefined
        node.output = output

        const border = node.isInitial ? "#0041d0" : node.isAdmit ? "#ff0072" : "#000000"
        const background = node.isCurrent ? "#ffff55" : "#ffffff";
        const borderWidth = {
            default: 1.5,
            primary: 2,
            highlight: 4
        };

        elements.nodes.update({
            id: node.id,
            color: {
                background: background,
                border: border,
                highlight: {
                    border: border,
                    background: background
                }
            },
            borderWidth: node.isInitial || node.isAdmit ? borderWidth.primary : borderWidth.default,
            borderWidthSelected: borderWidth.highlight
        })
    })

}

export const graphToElements = (graph: graph): Elements => {
    let acc: Elements = { nodes: new DataSet<node, "id">(), edges: new DataSet<edge, "id">() }

    graph.nodes.forEach((node) => {
        acc.nodes.add(node)
    })
    graph.edges.forEach((edge) => {
        acc.edges.add(edge)
    })

    return acc
}

export const elementsToGraph = (elements: Elements): graph => {
    let acc: graph = { nodes: [], edges: [] }

    elements.nodes.forEach((node) => {
        acc.nodes.push(node)
    })
    elements.edges.forEach((edge) => {
        acc.edges.push(edge)
    })

    return acc
}

export const getNodeNamePrefix = (graph: graph): string => {
    let prefix = graph.nodes.length === 0 ? "" : graph.nodes[0].label;

    graph.nodes.forEach(node => {
        let i = 0;
        while (i < node.label.length && i < prefix.length && node.label[i] === prefix[i]) {
            i++;
        }
        prefix = prefix.substring(0, i);
    });

    return prefix;
}

export const computersInfo: Record<any, ComputerInfo> = {
    mealy: {
        name: "Автомат Мили",
        preview: "mealy.png",
        description: "Зависит от состояния автомата и входных сигналов",
        defaultGraph: {
            nodes: [
                { x: 0, y: 0, id: 1, isAdmit: false, isCurrent: false, isInitial: true, label: "0 rub" },
                { x: 300, y: -200, id: 2, isAdmit: false, isCurrent: false, isInitial: false, label: "5 rub" },
                { x: 500, y: -300, id: 3, isAdmit: false, isCurrent: false, isInitial: false, label: "15 rub" },
                { x: -100, y: -500, id: 4, isAdmit: false, isCurrent: false, isInitial: false, label: "10 rub" }
            ],
            edges: [
                { from: 1, to: 2, transitions: new Set([[{ title: 'f', output: 'n' }]]) },
                { from: 1, to: 4, transitions: new Set([[{ title: 't', output: 'n' }]]) },
                { from: 2, to: 3, transitions: new Set([[{ title: 't', output: 'n' }]]) },
                { from: 2, to: 4, transitions: new Set([[{ title: 'f', output: 'n' }]]) },
                { from: 3, to: 1, transitions: new Set([[{ title: 'f', output: '0' }, { title: 't', output: '5' }]]) },
                { from: 4, to: 3, transitions: new Set([[{ title: 'f', output: 'n' }]]) },
                { from: 4, to: 1, transitions: new Set([[{ title: 't', output: '0' }]]) },
            ]
        }
    },
}

export const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}