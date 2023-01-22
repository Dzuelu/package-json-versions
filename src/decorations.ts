import { OverviewRulerLane, TextEditorDecorationType, ThemableDecorationRenderOptions, window } from 'vscode';

const currentDecorations: TextEditorDecorationType[] = [];
const decorations: Map<string, TextEditorDecorationType[]> = new Map<string, TextEditorDecorationType[]>();

export const clearAllDecorations = (): void => {
  currentDecorations.map(decoration => decoration.dispose());
  currentDecorations.length = 0;
};

export const clearWindowDecorations = (documentUri: string): void => {
  const decorationsList = decorations.get(documentUri);
  decorationsList?.map(decoration => decoration.dispose());
  decorations.delete(documentUri);
};

const createDecoration = ({
  overviewRulerColor,
  light,
  dark,
  contentText
}: {
  contentText: string;
  dark: ThemableDecorationRenderOptions;
  light: ThemableDecorationRenderOptions;
  overviewRulerColor: string;
}) => {
  const decoration = window.createTextEditorDecorationType({
    after: { contentText, margin: '1em' },
    dark,
    isWholeLine: false,
    light,
    overviewRulerColor,
    overviewRulerLane: OverviewRulerLane.Right
  });
  currentDecorations.push(decoration);
  return decoration;
};

export const decorateInactive = (contentText: string) => {
  return createDecoration({
    contentText,
    dark: { after: { color: 'darkgray' }, color: 'darkgray' },
    light: { after: { color: 'lightgray' }, color: 'lightgray' },
    overviewRulerColor: 'darkgray'
  });
};
