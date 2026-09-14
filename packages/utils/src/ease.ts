import type { Animate } from '@so-chart/types/common';
import { easeBounceIn, easeBounceInOut, easeBounceOut, easeCubicIn, easeLinear, easeQuadInOut, easeQuadOut } from 'd3';

export function getEase(easeType: Animate['ease']) {
  if (easeType === 'cubicIn') {
    return easeCubicIn; // 将值clamp在[0,1]内
  } else if (easeType === 'cubicOut') {
    return easeQuadOut;
  } else if (easeType === 'cubicInOut') {
    return easeQuadInOut;
  } else if (easeType === 'bounceIn') {
    return easeBounceIn;
  } else if (easeType === 'bounceOut') {
    return easeBounceOut;
  } else if (easeType === 'bounceInOut') {
    return easeBounceInOut;
  } else {
    return easeLinear;
  }
}
