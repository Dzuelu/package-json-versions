import { OverviewRulerLane, TextEditorDecorationType, window } from 'vscode';

const currentDecorations: Map<string, TextEditorDecorationType[]> = new Map<string, TextEditorDecorationType[]>();

export const clearWindowDecorations = (documentUri: string): void => {
  const decorationsList = currentDecorations.get(documentUri);
  decorationsList?.map(decoration => decoration.dispose());
  currentDecorations.delete(documentUri);
};

export const clearAllDecorations = (): void => {
  Array.from(currentDecorations.keys()).forEach(uri => clearWindowDecorations(uri));
};

const createDecoration = (
  documentUri: string,
  contentText: string,
  darkColor: string,
  lightColor: string,
  overviewRulerColor: string
) => {
  const decoration = window.createTextEditorDecorationType({
    after: { contentText, margin: '1em' },
    dark: { after: { color: darkColor }, color: darkColor },
    isWholeLine: false,
    light: { after: { color: lightColor }, color: lightColor },
    overviewRulerColor,
    overviewRulerLane: OverviewRulerLane.Right
  });
  if (currentDecorations.has(documentUri)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    currentDecorations.get(documentUri)!.push(decoration);
  } else {
    currentDecorations.set(documentUri, [decoration]);
  }
  return decoration;
};

export const decorateInactive = (documentUri: string, contentText: string) =>
  createDecoration(documentUri, contentText, 'darkgray', 'lightgray', 'darkgray');

export const decorateMajor = (documentUri: string, contentText: string) =>
  createDecoration(documentUri, contentText, '#E03419', '#C74632', 'red');

export const decorateMinor = (documentUri: string, contentText: string) =>
  createDecoration(documentUri, contentText, '#F8FF99', '#ABAB00', 'yellow');

export const decoratePatch = (documentUri: string, contentText: string) =>
  createDecoration(documentUri, contentText, '#19E034', '#009113', 'green');

export const decoratePrerelease = (documentUri: string, contentText: string) =>
  createDecoration(documentUri, contentText, '#EC33FF', '#C433FF', 'purple');
