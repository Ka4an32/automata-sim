import { EdgeCore, Move, NodeCore, TransitionParams } from "./IGraphTypes";
export type elementOfAlphabet = {
    value: string
    idLogic: number
}

export type Output = string

export type Edge = {
    localValue: TransitionParams[]
} & EdgeCore

export type statement = {
    idLogic: number
} & NodeCore

export type History = {
    nodes: NodeCore[]
    by: string
}

export interface HistUnit {
    by: any,
    from: NodeCore
    value: NodeCore

}

export type HistTrace = {
    byEpsPred?: NodeCore[],
    byEpsAfter?: NodeCore[],
    byLetter?: NodeCore[]
}

export type Step = {
    nodes: NodeCore[]
    counter: number
    isAdmit: boolean
    history: History[]
    memory?: string[]
    move?: Move,
    pointer?: number
    output?: Output[]
    tree?: HistUnit[][],
    byEpsPred?: NodeCore[],
    byEpsAfter?: NodeCore[],
    byLetter?: NodeCore[],
    histTrace?: HistTrace[]
}


export type position = {
    stmt: statement,
    from?: NodeCore,
    cur?: NodeCore,
    by?: any,
    output?: Output,
    stack?: any
    oldStack?: any
    stackDown?: string
}
