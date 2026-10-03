import getFishChart, { FISH_NAMES, FISH_TYPES, type FishType, type FishVector3 } from '@so-chart/fish';
import { useEffect, useRef, useState } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';

const VIEWS: Array<{ id: string; label: string; position: FishVector3 }> = [
  { id: 'right', label: '右侧', position: [0, 0, 8.5] },
  { id: 'left', label: '左侧', position: [0, 0, -8.5] },
  { id: 'front', label: '正面', position: [8.5, 0, 0] },
  { id: 'rear', label: '尾后', position: [-8.5, 0, 0] },
  { id: 'dorsal', label: '背部', position: [0, 8.5, 0.01] },
  { id: 'ventral', label: '腹部', position: [0, -8.5, 0.01] },
  { id: 'oblique', label: '斜视', position: [5, 2, 8.5] },
];

const REFERENCES: Record<FishType, { features: string; url: string }> = {
  'black-carp': {
    features: '青鱼：体形修长、吻圆钝、上颌略长，腹部圆而无棱；背部与鳍青黑。',
    url: 'https://www.fws.gov/media/black-carp-photo-usfws-kellie-hanser-and-edited-usfws-liam-wardpng',
  },
  'grass-carp': { features: '草鱼：头较钝、身体近筒状，大鳞边缘较深，无须。', url: 'https://www.fws.gov/media/grass-carp-6' },
  'silver-carp': {
    features: '鲢：侧扁深体、低位小眼、上翘口、无须，腹棱从喉部延伸至肛门。',
    url: 'https://www.fws.gov/apps/media/silver-carp-hypophthalmichthys-molitrix-0',
  },
  'bighead-carp': {
    features: '鳙：宽大头口、低位眼与灰黑不规则暗斑；腹棱只在腹鳍至肛门之间。',
    url: 'https://commons.wikimedia.org/wiki/File:Tolstolobec_pestr%C3%BD.jpg',
  },
  'common-carp': { features: '鲤鱼：身体较长、吻部向前收窄，厚唇、两对须，背鳍基部较长。', url: 'https://www.fws.gov/media/common-carp-10' },
  'crucian-carp': {
    features: '鲫鱼：体高侧扁、头较小、尾柄短而较粗，无须；普通灰银色鲫鱼。',
    url: 'https://www.inaturalist.org/observations/228813295',
  },
};

function FishChartDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<FishType | 'all'>('all');
  const [status, setStatus] = useState('正在加载模型…');
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState(VIEWS[0]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let active = true;
    const chart = getFishChart({
      container,
      chartType: 'fish',
      layout: { height: 580 },
    });
    chart.setOption({
      ariaLabel: '六种淡水鱼三维预览，可使用下方按钮切换鱼种、视角与播放',
      onReady: event => {
        if (active) setStatus(`已加载 ${event.count} 条鱼`);
      },
      onError: error => {
        if (active) setStatus('加载失败：' + String(error));
      },
      fishes: (selection === 'all' ? FISH_TYPES : [selection]).map(type => {
        const index = FISH_TYPES.indexOf(type);
        return {
          id: type,
          type,
          rotation: [0, 0, 0] as const,
          scale: [0.95, 1, 0.94, 1.06, 1.03, 0.92][index],
          swimSpeed: [0.82, 1, 0.9, 0.76, 1.08, 0.94][index],
          swimAmplitude: [0.9, 1, 0.85, 0.95, 1, 0.88][index],
        };
      }),
      backgroundColor: '#dce6e8',
      lighting: { color: '#ffffff', intensity: 1.35, fillIntensity: 1.2, fillColor: '#52605b', position: [-2.8, 4.5, 5.5] },
      camera: { position: view.position, target: [0, 0, 0], fov: 38, autoFit: true, near: 0.01, far: 100 },
      controls: {
        enabled: true,
        damping: true,
        dampingFactor: 0.05,
        enableRotate: true,
        enableZoom: true,
        enablePan: false,
        touchAction: 'pan-y',
        minPolarAngle: 0,
        maxPolarAngle: Math.PI,
        minDistance: 1.5,
      },
      animation: { enabled: playing, speed: 1, reducedMotion: 'auto' },
      renderer: { pixelRatio: 1.5, toneMappingExposure: 0.75 },
    });

    return () => {
      active = false;
      chart.dispose();
    };
  }, [selection, playing, view]);

  return (
    <ChartWrapper
      title="六种常见淡水鱼"
      description="展示当前保存的六鱼候选，全部尚未通过写实验收。默认显示全部并暂停，可切换鱼种、角度，拖拽旋转或播放游动。"
      height={760}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <p role="status" aria-live="polite">
          {status}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0, marginBottom: 12 }}>
          {([...FISH_TYPES, 'all'] as const).map(type => (
            <button
              key={type}
              type="button"
              aria-pressed={selection === type}
              onClick={() => setSelection(type)}
              style={{
                minHeight: 40,
                padding: '6px 14px',
                border: '1px solid var(--border-color, #bdc8cb)',
                borderRadius: 6,
                background: selection === type ? '#1f5763' : 'transparent',
                color: selection === type ? '#ffffff' : 'inherit',
                cursor: 'pointer',
              }}
            >
              {type === 'all' ? '全部六种' : FISH_NAMES[type]}
            </button>
          ))}
          <button type="button" onClick={() => setPlaying(value => !value)} style={{ minHeight: 40, padding: '6px 14px', cursor: 'pointer' }}>
            {playing ? '暂停游动' : '继续游动'}
          </button>
        </div>
        <div role="group" aria-label="查看鱼体角度" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0, marginBottom: 12 }}>
          {VIEWS.map(item => (
            <button
              key={item.id}
              type="button"
              aria-pressed={view.id === item.id}
              onClick={() => setView(item)}
              style={{
                minHeight: 40,
                padding: '6px 14px',
                cursor: 'pointer',
                border: '1px solid var(--border-color, #bdc8cb)',
                borderRadius: 6,
                background: view.id === item.id ? '#1f5763' : 'transparent',
                color: view.id === item.id ? '#ffffff' : 'inherit',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div role="status" style={{ flexShrink: 0, marginBottom: 10, fontSize: 14, lineHeight: 1.6 }}>
          {selection === 'all'
            ? '当前状态：六种均为各自独立的彩色材质候选。全部未验收。'
            : `${FISH_NAMES[selection]}：${selection === 'black-carp' || selection === 'grass-carp' || selection === 'silver-carp' || selection === 'bighead-carp' || selection === 'common-carp' || selection === 'crucian-carp' ? '彩色材质候选' : '灰模候选'} · 未验收`}
        </div>
        <div style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, fontSize: 13, lineHeight: 1.6 }}>
          <span>{selection === 'all' ? '选择单种鱼，可查看它的外形特征和实拍来源。' : `参考特征：${REFERENCES[selection].features}`}</span>
          {selection !== 'all' && (
            <a href={REFERENCES[selection].url} target="_blank" rel="noreferrer">
              查看实拍参考 ↗
            </a>
          )}
        </div>
        <div ref={ref} style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden', borderRadius: 8 }} />
      </div>
    </ChartWrapper>
  );
}

export default FishChartDemo;
