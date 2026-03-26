import React from 'react';
import { Bar } from 'react-chartjs-2';
import { colors } from '../../../styles/colors';

interface IndexUsageChartProps {
  data: Array<{ table_name: string; index_usage_pct: number }>;
}

export const IndexUsageChart: React.FC<IndexUsageChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.table_name.split('.').pop() || item.table_name),
    datasets: [
      {
        label: 'Uso de Índices (%)',
        data: data.map(item => item.index_usage_pct),
        backgroundColor: colors.doradoClasico,
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
          label: (context: any) => {
            return `${context.raw.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Porcentaje de uso',
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