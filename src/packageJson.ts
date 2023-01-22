import * as vscode from 'vscode';
import { parseJson } from './parseJson';

export const isPackageJson = (document: vscode.TextDocument) => {
  return document.fileName.endsWith('package.json');
};

const getDependencies = (
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
  packageName: string;
  range: vscode.Range;
}[] => {
  const lines = Array.from({ length: document.lineCount }).map((val, index) => index);

  // Here we find the main keys for dependencies and then add the index for each of it's keys
  const findLineOf = (regexp: RegExp) => lines.find(i => regexp.test(document.lineAt(i).text));

  const devDependenciesLine = findLineOf(/\s*"devDependencies"\s*:/);
  const dependenciesLine = findLineOf(/\s*"dependencies"\s*:/);
  const peerDependenciesLine = findLineOf(/\s*"peerDependencies"\s*:/);
  const resolutionsLine = findLineOf(/\s*"resolutions"\s*:/);

  const packageDependencies = getDependencies(document);
  const positions: {
    packageName: string;
    range: vscode.Range;
  }[] = [];
  const addPosition = (packageType: string, packageName: string, linePosition: number) => {
    const endOfLine = document.lineAt(linePosition).text.length;
    console.log(`${packageType} ${packageName} at line ${linePosition} with length ${endOfLine}`);
    positions.push({
      packageName,
      range: new vscode.Range(
        // Create a range at the end of the package's line
        new vscode.Position(linePosition, endOfLine),
        new vscode.Position(linePosition, endOfLine)
      )
    });
  };

  // Assumes nice formatting with each package on a new line
  if (dependenciesLine) {
    packageDependencies.dependencies.forEach((dependencyName, index) => {
      if (!packageDependencies.peerDependencies.includes(dependencyName)) {
        addPosition('dependency', dependencyName, dependenciesLine + index + 1);
      }
    });
  }
  if (devDependenciesLine) {
    packageDependencies.devDependencies.forEach((dependencyName, index) =>
      addPosition('devDependencies', dependencyName, devDependenciesLine + index + 1)
    );
  }
  if (peerDependenciesLine) {
    packageDependencies.peerDependencies.forEach((dependencyName, index) =>
      addPosition('peerDependencies', dependencyName, peerDependenciesLine + index + 1)
    );
  }
  if (resolutionsLine) {
    packageDependencies.resolutions.forEach((dependencyName, index) =>
      addPosition('resolutions', dependencyName, resolutionsLine + index + 1)
    );
  }

  return positions;
};
