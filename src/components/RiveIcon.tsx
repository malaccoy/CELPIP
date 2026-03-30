'use client';

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

interface RiveIconProps {
  artboard: string;
  size?: number;
  src?: string;
}

export default function RiveIcon({ artboard, size = 24, src = '/rive/icons.riv' }: RiveIconProps) {
  const { RiveComponent } = useRive({
    src,
    artboard,
    autoplay: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  return (
    <div style={{ width: size, height: size, display: 'inline-flex', flexShrink: 0 }}>
      <RiveComponent />
    </div>
  );
}
