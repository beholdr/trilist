import type { TrilistValue } from './trilist'

export enum TrilistEvents {
  change = 'trilist-change'
}

export interface TrilistChangeEvent
  extends CustomEvent<TrilistValue> {}

declare global {
  interface HTMLElementEventMap {
    'trilist-change': TrilistChangeEvent
  }
}
