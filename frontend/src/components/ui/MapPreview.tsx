import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
  Circle,
  G,
} from 'react-native-svg';
import { T } from '@/theme';

type Props = {
  height?: number;
  radius?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
};

/**
 * Mapa decorativo estilo Google/Airbnb dibujado con SVG.
 * - Calles, parques, río, manzanas
 * - Tonos cálidos coordinados con el theme
 */
export function MapPreview({ height = 180, radius = 18, style, children }: Props) {
  const W = 400;
  const H = 200;

  // Colores tipo mapa real (warm light theme)
  const C = {
    bg: '#F1ECE0',
    blockA: '#E6E0D2',
    blockB: '#EBE6DA',
    blockShadow: '#D9D2C0',
    park: '#CFDEB5',
    parkDark: '#B8CC9A',
    water: '#C8D9E4',
    waterEdge: '#B0C5D5',
    roadFill: '#FFFFFF',
    roadOutline: '#DAD3C2',
    roadMinor: '#E7E1D2',
    roadLabel: '#A89D86',
  };

  return (
    <View
      style={[
        {
          width: '100%',
          height,
          borderRadius: radius,
          overflow: 'hidden',
          backgroundColor: C.bg,
          position: 'relative',
        },
        style,
      ]}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <LinearGradient id="mapGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={C.bg} />
            <Stop offset="1" stopColor="#EDE7D9" />
          </LinearGradient>
          <LinearGradient id="parkGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={C.park} />
            <Stop offset="1" stopColor={C.parkDark} />
          </LinearGradient>
          <LinearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={C.water} />
            <Stop offset="1" stopColor={C.waterEdge} />
          </LinearGradient>
        </Defs>

        {/* Background */}
        <Rect width={W} height={H} fill="url(#mapGrad)" />

        {/* === RIVER (top right curving down) === */}
        <Path
          d={`M ${W - 60} -10 Q ${W - 30} 30, ${W - 10} 60 T ${W + 20} 130 L ${W + 40} 130 L ${W + 40} -20 Z`}
          fill="url(#waterGrad)"
        />
        {/* River edge highlight */}
        <Path
          d={`M ${W - 60} -10 Q ${W - 30} 30, ${W - 10} 60 T ${W + 20} 130`}
          stroke="#fff"
          strokeOpacity={0.5}
          strokeWidth={1}
          fill="none"
        />

        {/* === PARK (bottom left blob) === */}
        <Path
          d="M -10 130 Q 30 110, 60 125 Q 90 145, 100 175 Q 80 200, 40 200 Q 0 200, -10 175 Z"
          fill="url(#parkGrad)"
        />
        {/* Park trees (small circles) */}
        <Circle cx={28} cy={150} r={4} fill={C.parkDark} opacity={0.6} />
        <Circle cx={50} cy={165} r={3.5} fill={C.parkDark} opacity={0.55} />
        <Circle cx={72} cy={155} r={3} fill={C.parkDark} opacity={0.55} />
        <Circle cx={38} cy={180} r={3.5} fill={C.parkDark} opacity={0.6} />

        {/* === CITY BLOCKS === */}
        {/* Main grid of blocks */}
        <G opacity={0.9}>
          {/* Row 1 */}
          <Rect x={20} y={20} width={70} height={40} rx={3} fill={C.blockA} />
          <Rect x={100} y={20} width={90} height={40} rx={3} fill={C.blockB} />
          <Rect x={200} y={20} width={60} height={40} rx={3} fill={C.blockA} />
          <Rect x={270} y={20} width={75} height={40} rx={3} fill={C.blockB} />

          {/* Row 2 */}
          <Rect x={20} y={70} width={50} height={50} rx={3} fill={C.blockB} />
          <Rect x={80} y={70} width={110} height={50} rx={3} fill={C.blockA} />
          <Rect x={200} y={70} width={75} height={50} rx={3} fill={C.blockB} />
          <Rect x={285} y={70} width={55} height={50} rx={3} fill={C.blockA} />

          {/* Row 3 */}
          <Rect x={110} y={130} width={80} height={45} rx={3} fill={C.blockA} />
          <Rect x={200} y={130} width={90} height={45} rx={3} fill={C.blockB} />
          <Rect x={300} y={130} width={45} height={45} rx={3} fill={C.blockA} />
        </G>

        {/* === ROADS (main avenues - thick white) === */}
        {/* Horizontal main avenue */}
        <Rect x={0} y={62} width={W} height={6} fill={C.roadFill} />
        <Rect x={0} y={61} width={W} height={1} fill={C.roadOutline} opacity={0.5} />
        <Rect x={0} y={68} width={W} height={1} fill={C.roadOutline} opacity={0.5} />

        {/* Horizontal secondary */}
        <Rect x={0} y={122} width={W} height={4} fill={C.roadFill} />

        {/* Vertical main avenue */}
        <Rect x={92} y={0} width={6} height={H} fill={C.roadFill} />
        <Rect x={91} y={0} width={1} height={H} fill={C.roadOutline} opacity={0.5} />
        <Rect x={98} y={0} width={1} height={H} fill={C.roadOutline} opacity={0.5} />

        {/* Vertical secondary */}
        <Rect x={193} y={0} width={4} height={H} fill={C.roadFill} />
        <Rect x={278} y={0} width={4} height={H} fill={C.roadFill} />

        {/* Diagonal road (avenue) */}
        <Path
          d={`M 0 200 L 200 60 L 200 70 L 10 200 Z`}
          fill={C.roadFill}
          opacity={0.85}
        />

        {/* Road center dashes on main avenue */}
        <G stroke={C.roadLabel} strokeWidth={0.8} strokeDasharray="4 5" opacity={0.55}>
          <Path d={`M 0 65 L ${W} 65`} />
          <Path d={`M 95 0 L 95 ${H}`} />
        </G>

        {/* Small intersection circles */}
        <Circle cx={95} cy={65} r={4} fill={C.roadFill} />
        <Circle cx={195} cy={65} r={3} fill={C.roadFill} />
        <Circle cx={280} cy={65} r={3} fill={C.roadFill} />
        <Circle cx={95} cy={124} r={3} fill={C.roadFill} />
        <Circle cx={195} cy={124} r={3} fill={C.roadFill} />

        {/* === USER LOCATION RING === */}
        <Circle cx={W / 2} cy={H / 2 + 8} r={36} fill="#5083F0" opacity={0.08} />
        <Circle cx={W / 2} cy={H / 2 + 8} r={22} fill="#5083F0" opacity={0.12} />
        <Circle
          cx={W / 2}
          cy={H / 2 + 8}
          r={7}
          fill="#5083F0"
          stroke="#fff"
          strokeWidth={2.5}
        />
      </Svg>

      {children}
    </View>
  );
}
