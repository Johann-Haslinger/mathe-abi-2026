import type { InkBBox, InkPoint, InkStroke, InkTool } from '../domain/models';

export type { InkBBox, InkPoint, InkStroke, InkTool };

export type InkBrush = InkTool | 'eraser';

export type InkViewport = {
  panX: number;
  panY: number;
  ratio: number;
};
