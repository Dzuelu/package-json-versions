import * as vscode from 'vscode';
import { localVersions, remoteVersions } from './caches';
import { clearWindowDecorations, decorateInactive } from './decorations';
import { getDependencyPositions, isPackageJson } from './packageJson';

const setupDecorations = async (textEditor: vscode.TextEditor) => {
  const documentUri = textEditor.document.uri.toString();
  const filePath = textEditor.document.uri.fsPath;
  const dependencies = getDependencyPositions(textEditor.document);
  if (dependencies.length === 0) {
    return;
  }

  const refreshWithVersion = async (
    packageName: string,
    range: vscode.Range,
    previousDecoration: vscode.TextEditorDecorationType
  ) => {
    const [local, remote] = await Promise.all([
      localVersions.get({ filePath, packageName }),
      remoteVersions.get(packageName)
    ]);
    const decorator = decorateInactive(documentUri, `Current: ${local} Latest: ${remote}`);
    previousDecoration.dispose();
    textEditor.setDecorations(decorator, [{ range }]);
  };

  // clear after we try to get dependencies, if user editing we don't want to remove
  // once we can't parse the json
  clearWindowDecorations(documentUri);

  dependencies.forEach(({ packageName: dependencyName, range }) => {
    const decorator = decorateInactive(documentUri, 'Loading...');
    textEditor.setDecorations(decorator, [{ range }]);
    refreshWithVersion(dependencyName, range, decorator);
  });
};

export const handleEditor = (textEditor: vscode.TextEditor): void => {
  if (isPackageJson(textEditor.document) && textEditor.document.uri.scheme === 'file') {
    setupDecorations(textEditor);
  }
};
