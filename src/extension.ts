import * as vscode from 'vscode';
import { localVersions, remoteVersions } from './caches';
import { execute } from './caches/execute';
import { clearAllDecorations } from './decorations';
import { handleEditor } from './editor';
import { log } from './utils';

const initialize = (context: vscode.ExtensionContext): void => {
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

  const clearCacheCommand = vscode.commands.registerCommand('package-versions-npm.clear-cache', () => {
    log('Clearing remote and local versions...');
    remoteVersions.clear();
    localVersions.clear();
    vscode.window.visibleTextEditors.forEach(textEditor => {
      handleEditor(textEditor);
    });
  });

  context.subscriptions.push(clearCacheCommand, onDidChangeActiveTextEditor, onDidChangeTextDocument);
};

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, extension "package-versions-npm" is now active!');

  (async () => {
    try {
      const shell = await execute('echo $0');
      log(`Using shell: ${shell}`);
      const npmVersion = await execute('npm -v');
      log(`Using npm version: ${npmVersion}`);
      // All good! Were able to access npm command!
      initialize(context);
    } catch (error) {
      // Don't have access(?) to npm, inform the user
      const message = [
        'Unable to run npm command! You may need to set your shell explicitly.',
        'Set with "package-versions-npm.shell" in vscode settings.',
        JSON.stringify(error)
      ].join('\n');
      vscode.window.showErrorMessage(message);
      log(message);
    }
  })();
}

export function deactivate() {
  clearAllDecorations();
  console.log('Extension "package-versions-npm" is now deactivated!');
}
