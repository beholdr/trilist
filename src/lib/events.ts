import type { TreeItemId } from './trilist'

export enum TrilistEvents {
  change = 'trilist-change'
}

export interface TrilistChangeEvent
  extends CustomEvent<TreeItemId[] | TreeItemId | null> {}

declare global {
  interface HTMLElementEventMap {
    'trilist-change': TrilistChangeEvent
  }
}
