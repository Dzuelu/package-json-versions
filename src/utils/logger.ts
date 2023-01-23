import * as vscode from 'vscode';

const output = vscode.window.createOutputChannel('Package JSON Versions');

export const log = (text: string): void => output.appendLine(text);
