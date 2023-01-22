import * as vscode from 'vscode';
import { localVersions, remoteVersions } from './caches';
import { clearWindowDecorations, decorateInactive } from './decorations';
import { getDependencyPositions, isPackageJson } from './packageJson';

const setupDecorations = async (document: vscode.TextDocument) => {
  const textEditor = vscode.window.visibleTextEditors.find(editor => editor.document === document);
  if (textEditor == null) {
    return;
  }

  const dependencies = getDependencyPositions(document);
  if (dependencies.length === 0) {
    return;
  }

  const refreshWithVersion = async (
    dependencyName: string,
    range: vscode.Range,
    previousDecoration: vscode.TextEditorDecorationType
  ) => {
    const [local, remote] = await Promise.all([localVersions.get(dependencyName), remoteVersions.get(dependencyName)]);
    previousDecoration.dispose();
    const decorator = decorateInactive(`Current: ${local} Latest: ${remote}`);
    textEditor.setDecorations(decorator, [{ range }]);
  };

  dependencies.forEach(({ dependencyName, range }) => {
    const decorator = decorateInactive('Loading...');
    textEditor.setDecorations(decorator, [{ range }]);
    refreshWithVersion(dependencyName, range, decorator);
  });
};

export const handleEditor = (document: vscode.TextDocument): void => {
  if (isPackageJson(document)) {
    clearWindowDecorations(document.uri.toString());
    setupDecorations(document);
  }
};
