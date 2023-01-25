import * as vscode from 'vscode';

interface Config {
  shell?: string;
  shellInstances?: number;
}

let currentConfig: Config | undefined;

export const reloadConfig = () => {
  const config = vscode.workspace.getConfiguration('package-versions-npm');
  currentConfig = {
    shell: config.get<string>('shell') || undefined,
    shellInstances: config.get<number>('shellInstances') || undefined
  };
};

export const getConfig = (): Config => {
  if (currentConfig === undefined) {
    reloadConfig();
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return currentConfig!;
};
