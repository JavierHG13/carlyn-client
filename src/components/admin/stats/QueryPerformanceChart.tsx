import React from 'react';
import { Bar } from 'react-chartjs-2';
import { colors } from '../../../styles/colors';

interface QueryPerformanceChartProps {
  data: Array<{ query_preview: string; avg_ms: number; calls: number }>;
}

export const QueryPerformanceChart: React.FC<QueryPerformanceChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((_, i) => `Query ${i + 1}`),
    datasets: [
      {
        label: 'Tiempo Promedio (ms)',
        data: data.map(item => item.avg_ms),
        backgroundColor: colors.doradoClasico,
        borderRadius: 8,
      },
      {
        label: 'Número de Llamadas',
        data: data.map(item => item.calls),
        backgroundColor: '#3B82F6',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          afterBody: (context: any) => {
            const index = context[0].dataIndex;
            return `Query: ${data[index].query_preview.substring(0, 100)}...`;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Valor',
        },
      },
    },
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};