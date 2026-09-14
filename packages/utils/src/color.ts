import type { ColorSystem } from '@so-chart/types/common';

const colorPalettes: Record<ColorSystem, readonly string[]> = {
  blue: ['#f0f8ff', '#d1eaff', '#a8d4ff', '#80bbff', '#57a0ff', '#2e82ff', '#1c61d9', '#0e45b3', '#042d8c', '#021d66'],
  lightblue: ['#e6fbff', '#a6edff', '#7de1ff', '#54d1ff', '#29b6f2', '#029be6', '#0079bf', '#005c99', '#004173', '#00294d'],
  cyan: ['#e6fffc', '#a6f7f2', '#78ebe7', '#4edede', '#28cbd1', '#05b9c5', '#008e9e', '#006878', '#004452', '#00232b'],
  purple: ['#fbf0ff', '#faf0ff', '#eccffa', '#d09fed', '#b472e0', '#994ad4', '#7534ad', '#542287', '#381361', '#200b3b'],
  grassgreen: ['#f5fff0', '#dfffcf', '#b9f59f', '#91e872', '#6bdb48', '#45cf24', '#2da814', '#198209', '#0b5c02', '#043601'],
  orange: ['#fff8f0', '#ffeedb', '#ffd9b3', '#ffc08a', '#ffa561', '#f68237', '#cf6223', '#a84614', '#822d09', '#5c1d06'],
  tangerine: ['#fff1e6', '#ffd4b8', '#ffb88f', '#fc9765', '#f0703a', '#e44913', '#bd3006', '#961e00', '#701300', '#4a0a00'],
  pink: ['#fff0f7', '#fff0f8', '#fccce7', '#f09ccd', '#e36fb7', '#d546a3', '#b03188', '#8a206c', '#63124f', '#3d0a32'],
  violet: ['#eeebfa', '#e2dfed', '#bfb8e0', '#958cd4', '#6d63c7', '#473fba', '#2e2b94', '#1a1a6e', '#0e0f47', '#060821'],
  bluegray: ['#F6F8FE', '#F0F3FA', '#E5EAF5', '#E0E4F1', '#D6DAE6', '#CED2DF', '#B3B8C7', '#6D7588', '#2D364D', '#202340'],
  yellow: ['#ffffe6', '#fffda3', '#fff87a', '#fff152', '#f2db27', '#e5c300', '#bf9c00', '#997800', '#735600', '#4d3700'],
  gray: ['#ffffff', '#f2f2f2', '#e6e6e6', '#d9d9d9', '#cccccc', '#c0c0c0', '#999999', '#737373', '#4d4d4d', '#262626'],
  slate: ['#F6F8FE', '#F0F3FA', '#E5EAF5', '#E0E4F1', '#D6DAE6', '#CED2DF', '#B3B8C7', '#6D7588', '#2D364D', '#202340'],
  red: ['#fff1f0', '#ffe5e3', '#ffbcba', '#ff9191', '#f7656a', '#ea3a45', '#c42737', '#9e182a', '#780c1e', '#520716'],
  green: ['#f1ffed', '#ceffc4', '#a0f294', '#74e667', '#49d93f', '#1fcc1a', '#0da60d', '#048008', '#005906', '#003305'],
  gold: ['#fff9e6', '#ffe8a8', '#ffd980', '#ffc757', '#ffb22e', '#f99806', '#d47800', '#ad5c00', '#874400', '#612d00'],
};

const defaultColors = [
  colorPalettes.cyan[4],
  colorPalettes.lightblue[4],
  colorPalettes.purple[4],
  colorPalettes.orange[4],
  colorPalettes.pink[4],
  colorPalettes.grassgreen[4],
  colorPalettes.yellow[4],
  colorPalettes.violet[4],
  colorPalettes.red[4],
  colorPalettes.yellow[4],
];

export const getColor = (params: { i: number; o?: number; cs?: ColorSystem }): string => {
  const { i, o = 1, cs } = params;
  const colorDatas = cs ? colorPalettes[cs] : defaultColors;
  const length = colorDatas.length;
  const index = i % length;

  if (o === 1) return colorDatas[index];
  else return colorDatas[index] + o.toString(16).slice(2, 4).padEnd(2, '0');
};

export const opacityColor = (c: string, o: number) => {
  return c + o.toString(16).slice(2, 4).padEnd(2, '0');
};
