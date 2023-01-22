import * as vscode from 'vscode';
import { localVersions, remoteVersions } from './caches';
import { clearWindowDecorations, decorateInactive } from './decorations';
import { getDependencyPositions, isPackageJson } from './packageJson';

const setupDecorations = async (textEditor: vscode.TextEditor) => {
  const documentUri = textEditor.document.uri.toString();
  const documentFilePath = textEditor.document.uri.fsPath;
  const dependencies = getDependencyPositions(textEditor.document);
  if (dependencies.length === 0) {
    return;
  }

  const refreshWithVersion = async (
    dependencyName: string,
    range: vscode.Range,
    previousDecoration: vscode.TextEditorDecorationType
  ) => {
    const [local, remote] = await Promise.all([
      localVersions.get({ filePath: documentFilePath, packageName: dependencyName }),
      remoteVersions.get(dependencyName)
    ]);
    previousDecoration.dispose();
    const decorator = decorateInactive(documentUri, `Current: ${local} Latest: ${remote}`);
    textEditor.setDecorations(decorator, [{ range }]);
  };

  dependencies.forEach(({ dependencyName, range }) => {
    const decorator = decorateInactive(documentUri, 'Loading...');
    textEditor.setDecorations(decorator, [{ range }]);
    refreshWithVersion(dependencyName, range, decorator);
  });
};

export const handleEditor = (textEditor: vscode.TextEditor): void => {
  if (isPackageJson(textEditor.document) && textEditor.document.uri.scheme === 'file') {
    clearWindowDecorations(textEditor.document.uri.toString());
    setupDecorations(textEditor);
  }
};
