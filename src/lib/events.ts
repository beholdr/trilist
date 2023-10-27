import type { TreeItemKey } from './trilist'

export enum TrilistEvents {
  change = 'trilist-change'
}

export interface TrilistChangeEvent extends CustomEvent<TreeItemKey[]> {}

declare global {
  interface HTMLElementEventMap {
    'trilist-change': TrilistChangeEvent
  }
}
