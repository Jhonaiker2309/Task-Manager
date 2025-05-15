/**
 * Utility module exports for checklist application.
 *
 * Exposes functions for:
 * - WebSQL database operations (`openDB`, `loadListsFromWebSQL`, `saveListsToWebSQL`)
 * - Slug generation (`generateSlug`)
 * - Toast notifications (`notify`)
 */

import { openDB, loadListsFromWebSQL, saveListsToWebSQL } from './websql';
import { generateSlug } from './generateSlug';
import notify from './notify';

export {
  openDB,
  loadListsFromWebSQL,
  saveListsToWebSQL,
  generateSlug,
  notify,
};