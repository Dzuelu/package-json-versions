import * as vscode from 'vscode';

const currentDecorations: vscode.TextEditorDecorationType[] = [];

export const clearDecorations = (): void => {
  currentDecorations.map(decoration => decoration.dispose());
  currentDecorations.length = 0;
};
