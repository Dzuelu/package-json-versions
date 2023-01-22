import * as vscode from 'vscode';
import { parseJson } from './parseJson';

export const isPackageJson = (document: vscode.TextDocument) => {
  return document.fileName.endsWith('package.json');
};

export const getDependencies = (
  document: vscode.TextDocument
): { dependencies: string[]; devDependencies: string[]; peerDependencies: string[]; resolutions: string[] } => {
  const packageJson = parseJson<{
    dependencies?: { [key: string]: string };
    devDependencies?: { [key: string]: string };
    peerDependencies?: { [key: string]: string };
    resolutions?: { [key: string]: string };
  }>(document.getText());
  return {
    dependencies: packageJson?.dependencies ? Object.keys(packageJson.dependencies) : [],
    devDependencies: packageJson?.devDependencies ? Object.keys(packageJson.devDependencies) : [],
    peerDependencies: packageJson?.peerDependencies ? Object.keys(packageJson.peerDependencies) : [],
    resolutions: packageJson?.resolutions ? Object.keys(packageJson.resolutions) : []
  };
};

export const getDependencyPositions = (
  document: vscode.TextDocument
): {
  dependencyName: string;
  linePosition: number;
  range: vscode.Range;
}[] => {
  const lines = Array.from({ length: document.lineCount }).map((val, index) => index);

  // Here we find the main keys for dependencies and then add the index for each of it's keys
  const findLineOf = (regexp: RegExp) => lines.find(i => regexp.test(document.lineAt(i).text));

  const devDependenciesLine = findLineOf(/\s*"devDependencies"\s*:/);
  const dependenciesLine = findLineOf(/\s*"dependencies"\s*:/);
  const peerDependenciesLine = findLineOf(/\s*"peerDependencies"\s*:/);
  const resolutionsLine = findLineOf(/\s*"resolutions"\s*:/);

  const dependencies = getDependencies(document);
  const positions: {
    dependencyName: string;
    linePosition: number;
    range: vscode.Range;
  }[] = [];
  const addPosition = (dependencyName: string, linePosition: number) => {
    const endOfLine = document.lineAt(linePosition).text.length;
    positions.push({
      dependencyName,
      linePosition,
      range: new vscode.Range(
        // Create a range at the end of the package's line
        new vscode.Position(linePosition, endOfLine),
        new vscode.Position(linePosition, endOfLine)
      )
    });
  };

  if (dependenciesLine) {
    dependencies.dependencies.forEach((dependencyName, index) => {
      if (!dependencies.peerDependencies.includes(dependencyName)) {
        addPosition(dependencyName, dependenciesLine + index + 1);
        console.log(`dependency ${dependencyName} at ${dependenciesLine + index + 1}`);
      }
    });
  }
  if (devDependenciesLine) {
    dependencies.devDependencies.forEach((dependencyName, index) => {
      addPosition(dependencyName, devDependenciesLine + index + 1);
      console.log(`devDependencies ${dependencyName} at ${devDependenciesLine + index + 1}`);
    });
  }
  if (peerDependenciesLine) {
    dependencies.peerDependencies.forEach((dependencyName, index) => {
      addPosition(dependencyName, peerDependenciesLine + index + 1);
      console.log(`devDependencies ${dependencyName} at ${peerDependenciesLine + index + 1}`);
    });
  }
  if (resolutionsLine) {
    dependencies.resolutions.forEach((dependencyName, index) => {
      addPosition(dependencyName, resolutionsLine + index + 1);
      console.log(`devDependencies ${dependencyName} at ${resolutionsLine + index + 1}`);
    });
  }

  return positions;
};
