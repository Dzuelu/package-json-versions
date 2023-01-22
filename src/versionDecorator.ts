import { TextEditorDecorationType } from 'vscode';
import { decorateMajor, decorateMinor, decoratePatch, decoratePrerelease } from './decorations';
import { diff, valid } from 'semver';

export const versionDecorator = (
  documentUri: string,
  localVersion: string,
  remoteVersion: string
): TextEditorDecorationType | undefined => {
  if (valid(localVersion) && valid(remoteVersion)) {
    const text = `Installed: ${localVersion}, Latest: ${remoteVersion}`;
    switch (diff(localVersion, remoteVersion)) {
      case 'major':
      case 'premajor':
        return decorateMajor(documentUri, text);
      case 'minor':
      case 'preminor':
        return decorateMinor(documentUri, text);
      case 'patch':
      case 'prepatch':
        return decoratePatch(documentUri, text);
      case 'prerelease':
        return decoratePrerelease(documentUri, text);
      case null:
      default:
        return undefined;
    }
  }
  return undefined;
};
