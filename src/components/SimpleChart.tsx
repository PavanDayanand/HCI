import { Box, Typography, useTheme } from "@mui/material";

export type ChartPoint = {
  label: string;
  value: number;
};

const palette = ["#215a9c", "#4a86c8", "#7aa8d9", "#3d6e8c", "#c4a35a", "#b85c38"];

export function SimpleChart({
  kind,
  points,
}: {
  kind: "bar" | "pie" | "line";
  points: ChartPoint[];
}) {
  const theme = useTheme();
  const axis = theme.palette.text.secondary;
  const line = theme.palette.divider;

  if (points.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 6, textAlign: "center" }}>
        No submissions match this widget yet.
      </Typography>
    );
  }

  if (kind === "pie") {
    return <PieChart points={points} />;
  }

  const max = Math.max(...points.map((point) => point.value), 1);
  const width = 420;
  const height = 220;
  const left = 36;
  const bottom = 36;
  const top = 16;
  const right = 12;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  if (kind === "line") {
    const coords = points.map((point, index) => {
      const x = left + (points.length === 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth);
      const y = top + plotHeight - (point.value / max) * plotHeight;
      return `${x},${y}`;
    });
    return (
      <Box sx={{ overflowX: "auto" }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={220} role="img" aria-label="Line chart">
          <line x1={left} y1={top} x2={left} y2={top + plotHeight} stroke={line} />
          <line x1={left} y1={top + plotHeight} x2={left + plotWidth} y2={top + plotHeight} stroke={line} />
          <polyline fill="none" stroke={palette[0]} strokeWidth="2.5" points={coords.join(" ")} />
          {points.map((point, index) => {
            const [x, y] = coords[index].split(",").map(Number);
            return (
              <g key={point.label}>
                <circle cx={x} cy={y} r="4" fill={palette[0]} />
                <text x={x} y={height - 10} textAnchor="middle" fontSize="10" fill={axis}>
                  {shortLabel(point.label)}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>
    );
  }

  const gap = 10;
  const barWidth = Math.max(18, plotWidth / points.length - gap);

  return (
    <Box sx={{ overflowX: "auto" }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={220} role="img" aria-label="Bar chart">
        <line x1={left} y1={top + plotHeight} x2={left + plotWidth} y2={top + plotHeight} stroke={line} />
        {points.map((point, index) => {
          const barHeight = (point.value / max) * plotHeight;
          const x = left + index * (barWidth + gap);
          const y = top + plotHeight - barHeight;
          return (
            <g key={point.label}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="4" fill={palette[index % palette.length]} />
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="11" fill={axis}>
                {point.value}
              </text>
              <text x={x + barWidth / 2} y={height - 10} textAnchor="middle" fontSize="10" fill={axis}>
                {shortLabel(point.label)}
              </text>
            </g>
          );
        })}
      </svg>
    </Box>
  );
}

function PieChart({ points }: { points: ChartPoint[] }) {
  const total = points.reduce((sum, point) => sum + point.value, 0) || 1;
  const size = 180;
  const radius = 72;
  const cx = size / 2;
  const cy = size / 2;
  const slices = points.reduce<
    { label: string; value: number; d: string; color: string; end: number }[]
  >((drawn, point, index) => {
    const start = drawn.at(-1)?.end ?? -Math.PI / 2;
    const slice = (point.value / total) * Math.PI * 2;
    const end = start + slice;
    const large = slice > Math.PI ? 1 : 0;
    const x1 = cx + Math.cos(start) * radius;
    const y1 = cy + Math.sin(start) * radius;
    const x2 = cx + Math.cos(end) * radius;
    const y2 = cy + Math.sin(end) * radius;
    const d =
      slice >= Math.PI * 2 - 0.001
        ? `M ${cx} ${cy} m 0 ${-radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 ${-radius * 2}`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
    return [...drawn, { label: point.label, value: point.value, d, color: palette[index % palette.length], end }];
  }, []);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={180} height={180} role="img" aria-label="Pie chart">
        {slices.map((slice) => (
          <path key={slice.label} d={slice.d} fill={slice.color} />
        ))}
      </svg>
      <Box sx={{ display: "grid", gap: 0.75 }}>
        {slices.map((slice) => (
          <Box key={slice.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "2px", bgcolor: slice.color, flexShrink: 0 }} />
            <Typography variant="body2">
              {slice.label} ({slice.value})
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function shortLabel(label: string) {
  return label.length > 12 ? `${label.slice(0, 11)}…` : label;
}
