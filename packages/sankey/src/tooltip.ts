import type { DataflowInstance } from '@so-chart/types/sankey';
import { BaseType, color, pointer, quadtree, select, Selection } from 'd3';
import { Link } from './dataflow';

type LinkPath = Selection<SVGPathElement, Link, SVGSVGElement, unknown>;
type LinkSample = { x: number; y: number; link: Link };
type HoverTarget = { link: Link; visual: LinkPath };

export function handleTooltip(chart: DataflowInstance) {
  const svg = select(chart.svg);
  const visualLinks = svg.selectAll<SVGPathElement, Link>('.so-chart_dataflow_links>path.so-chart_dataflow_link') as LinkPath;
  const hitWidth = Math.max(chart.style.linkHoverHitWidth, chart.style.linkHoverWidth, 4);
  const hitRadius = hitWidth / 2;
  const sampleStep = Math.max(2, Math.min(6, hitRadius / 2));
  const linkSamples: LinkSample[] = [];

  visualLinks.data().forEach(link => addLinkSamples(linkSamples, link, sampleStep));

  const linkTree = quadtree<LinkSample>()
    .x(d => d.x)
    .y(d => d.y)
    .addAll(linkSamples);
  const searchRadius = hitRadius + sampleStep;

  let active: HoverTarget | undefined;

  function getHoverTarget(link: Link) {
    const visual = visualLinks.filter(d => d.index === link.index);
    if (visual.empty()) return;

    return { link, visual };
  }

  function highlightNodes(link: LinkPath) {
    const eles = getLinkNodes(svg, link);
    eles?.forEach(d => {
      const ele = select(d);
      const origin_fill = ele.attr('origin_fill');
      const colorStr =
        origin_fill ??
        (() => {
          const c = ele.attr('fill');
          ele.attr('origin_fill', c);
          return c;
        })();

      const c = color(colorStr);
      if (c) {
        const nc = c.brighter();
        ele.transition().duration(100).attr('fill', nc.toString());
      }
    });
  }

  function restoreNodes(link: LinkPath) {
    const eles = getLinkNodes(svg, link);
    eles?.forEach(d => {
      const ele = select(d);
      const origin_fill = ele.attr('origin_fill');
      if (origin_fill) {
        ele.transition().duration(100).attr('fill', origin_fill);
      }
    });
  }

  function clearActive() {
    if (active) {
      restoreLink(active.visual);
      restoreNodes(active.visual);
      active = undefined;
    }
    svg.style('cursor', null);
  }

  function moved(this: BaseType, event: MouseEvent | PointerEvent | TouchEvent) {
    if (event.target instanceof SVGRectElement || event.target instanceof SVGTextElement) {
      clearActive();
      return;
    }

    const [x, y] = pointer(event, chart.svg);
    const nearest = linkTree.find(x, y, searchRadius);
    const target = nearest && getHoverTarget(nearest.link);
    if (!target) {
      clearActive();
      return;
    }

    svg.style('cursor', 'pointer');
    if (active?.link.index === target.link.index) return;

    clearActive();
    active = target;
    highlightLink(target.visual, chart.style);
    highlightNodes(target.visual);
  }

  function leaved(this: BaseType) {
    clearActive();
  }

  svg
    .on('.sankeyHover', null)
    .on('pointermove.sankeyHover', moved)
    .on('pointerleave.sankeyHover', leaved)
    .on('mousemove.sankeyHover', moved)
    .on('mouseleave.sankeyHover', leaved)
    .on('touchmove.sankeyHover', moved)
    .on('touchend.sankeyHover touchcancel.sankeyHover', leaved);
}

function addLinkSamples(samples: LinkSample[], link: Link, sampleStep: number) {
  const x0 = link.source.x1;
  const y0 = link.y0;
  const x1 = link.target.x0;
  const y1 = link.y1;
  const controlX = (x0 + x1) / 2;
  const sampleCount = Math.max(24, Math.ceil((Math.abs(x1 - x0) + Math.abs(y1 - y0)) / sampleStep));

  for (let i = 0; i <= sampleCount; i += 1) {
    const t = i / sampleCount;
    const inverseT = 1 - t;
    samples.push({
      x: inverseT ** 3 * x0 + 3 * inverseT ** 2 * t * controlX + 3 * inverseT * t ** 2 * controlX + t ** 3 * x1,
      y: inverseT ** 3 * y0 + 3 * inverseT ** 2 * t * y0 + 3 * inverseT * t ** 2 * y1 + t ** 3 * y1,
      link,
    });
  }
}

function highlightLink<E extends BaseType, D, P extends BaseType, PD>(ele: Selection<E, D, P, PD>, style: DataflowInstance['style']) {
  const originStroke = ele.attr('origin_stroke') ?? ele.attr('stroke');
  if (!originStroke) return;

  ele.attr('origin_stroke', originStroke);
  ele.attr('origin_stroke_width', ele.attr('origin_stroke_width') ?? ele.attr('stroke-width'));
  ele.attr('origin_mix_blend_mode', ele.attr('origin_mix_blend_mode') ?? ele.style('mix-blend-mode'));
  ele.attr('origin_opacity', ele.attr('origin_opacity') ?? ele.style('opacity'));

  const c = color(style.linkHoverColor || '#2a72dc') ?? color(originStroke);
  if (c) {
    const opacity = Number.isFinite(style.linkHoverOpacity) ? style.linkHoverOpacity : 0.35;
    c.opacity = Math.min(Math.max(opacity, 0), 1);
    ele.interrupt().attr('stroke', c.toString()).style('mix-blend-mode', 'normal').style('opacity', '1');
  }

  const strokeWidth = Number(ele.attr('origin_stroke_width'));
  if (Number.isFinite(strokeWidth)) {
    ele.interrupt().transition().duration(100).attr('stroke-width', Math.max(strokeWidth, style.linkHoverWidth));
  }
}

function restoreLink<E extends BaseType, D, P extends BaseType, PD>(ele: Selection<E, D, P, PD>) {
  const transition = ele.interrupt().transition().duration(100);

  const originStroke = ele.attr('origin_stroke');
  if (originStroke) {
    transition.attr('stroke', originStroke);
  }

  const originStrokeWidth = ele.attr('origin_stroke_width');
  if (originStrokeWidth) {
    transition.attr('stroke-width', originStrokeWidth);
  }

  const originMixBlendMode = ele.attr('origin_mix_blend_mode');
  if (originMixBlendMode) {
    transition.style('mix-blend-mode', originMixBlendMode);
  } else {
    transition.style('mix-blend-mode', null);
  }

  const originOpacity = ele.attr('origin_opacity');
  if (originOpacity) {
    transition.style('opacity', originOpacity);
  } else {
    transition.style('opacity', null);
  }
}

function getLinkNodes<E extends BaseType, D, P extends BaseType, PD>(
  svg: Selection<SVGSVGElement, unknown, null, undefined>,
  ele: Selection<E, D, P, PD>
) {
  const data = ele.data();
  if (data && data[0]) {
    const link = data[0] as unknown as Link;
    const source = link.source;
    const target = link.target;
    const rects = svg.selectAll('.so-chart_dataflow_nodes>rect');
    const eles = [] as BaseType[];
    rects.each(function (d) {
      if (d === target) {
        eles[0] = this;
      }
      if (d === source) {
        eles[1] = this;
      }
    });

    return eles;
  }
}
