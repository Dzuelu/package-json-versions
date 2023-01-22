import * as vscode from 'vscode';
import { localVersions, remoteVersions } from './caches';
import { clearWindowDecorations, decorateInactive } from './decorations';
import { getDependencyPositions, isPackageJson } from './packageJson';
import { versionDecorator } from './versionDecorator';

const setupDecorations = async (textEditor: vscode.TextEditor) => {
  const documentUri = textEditor.document.uri.toString();
  const filePath = textEditor.document.uri.fsPath;
  const dependencies = getDependencyPositions(textEditor.document);
  if (dependencies.length === 0) {
    return;
  }

  // clear after we try to get dependencies, if user editing we don't want to remove
  // once we can't parse the json
  clearWindowDecorations(documentUri);

  const refreshWithVersion = async (
    packageName: string,
    range: vscode.Range,
    previousDecoration: vscode.TextEditorDecorationType
  ) => {
    const [local, remote] = await Promise.all([
      localVersions.get({ filePath, packageName }),
      remoteVersions.get(packageName)
    ]);
    const decorator = versionDecorator(documentUri, local, remote);
    previousDecoration.dispose();
    // Don't show if no update needed
    if (decorator) {
      textEditor.setDecorations(decorator, [{ range }]);
    }
  };

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
