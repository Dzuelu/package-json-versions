import * as vscode from 'vscode';
import { localVersions, remoteVersions } from './caches';
import { execute } from './caches/execute';
import { clearAllDecorations } from './decorations';
import { handleEditor } from './editor';

const checkNpm = async (): Promise<void> => {
  try {
    const npmVersion = await execute('npm -v');
    console.log(`Using npm version ${npmVersion}`);
  } catch (error) {
    // Don't have access(?) to npm, inform the user
    vscode.window.showErrorMessage('Unable to run npm command!', JSON.stringify(error));
  }
};

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, extension "package-versions" is now active!');

  checkNpm();

  vscode.window.visibleTextEditors.forEach(textEditor => {
    handleEditor(textEditor);
  });

  const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(textEditor => {
    if (textEditor !== undefined) {
      handleEditor(textEditor);
    }
  });

  const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(textDocumentChangeEvent => {
    const textEditor = vscode.window.visibleTextEditors.find(
      editor => editor.document === textDocumentChangeEvent.document
    );
    if (textEditor) {
      handleEditor(textEditor);
    }
  });

  const clearCacheCommand = vscode.commands.registerCommand('package-versions.clear-cache', () => {
    remoteVersions.clear();
    localVersions.clear();
    vscode.window.visibleTextEditors.forEach(textEditor => {
      handleEditor(textEditor);
    });
  });

  context.subscriptions.push(clearCacheCommand, onDidChangeActiveTextEditor, onDidChangeTextDocument);
}

export function deactivate() {
  clearAllDecorations();
  console.log('Extension "package-versions" is now deactivated!');
}
