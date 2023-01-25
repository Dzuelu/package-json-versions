import * as vscode from 'vscode';

const output = vscode.window.createOutputChannel('Package Versions NPM');

export const log = (text: string): void => output.appendLine(text);
