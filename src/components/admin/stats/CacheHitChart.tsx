import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { colors } from '../../../styles/colors';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

interface CacheHitChartProps {
  cacheHitRatio: number;
}

export const CacheHitChart: React.FC<CacheHitChartProps> = ({ cacheHitRatio }) => {
  const data = {
    labels: ['Cache Hit', 'Disk Read'],
    datasets: [
      {
        data: [cacheHitRatio, 100 - cacheHitRatio],
        backgroundColor: [colors.doradoClasico, '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.raw.toFixed(2)}%`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '200px', width: '100%' }}>
      <Pie data={data} options={options} />
    </div>
  );
};