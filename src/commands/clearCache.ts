import * as vscode from 'vscode';
import { remoteVersions, localVersions } from "../caches";
import { handleEditor } from "../editor";
import { log } from "../logger";

export const clearCache = (): void => {
  log('Clearing remote and local versions...');
  remoteVersions.clear();
  localVersions.clear();
  vscode.window.visibleTextEditors.forEach(textEditor => {
    handleEditor(textEditor);
  });
};
