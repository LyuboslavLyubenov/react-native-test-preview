import TestRenderer from 'react-test-renderer';

export type ScreenDebugType =
  | TestRenderer.ReactTestRendererJSON
  | TestRenderer.ReactTestRendererJSON[]
  | null;
