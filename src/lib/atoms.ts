
import { atom } from 'jotai';

/**
 * Atom to track if a modal (Drawer or Sheet) is currently open.
 * true if a modal is open, false otherwise.
 * Used to prevent background actions like pull-to-refresh when a modal is active.
 */
export const isModalOpenAtom = atom(false);
