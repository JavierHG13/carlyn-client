import React from 'react';
import { Bar } from 'react-chartjs-2';
import { colors } from '../../../styles/colors';

interface TableSizeChartProps {
  data: Array<{ table_name: string; total_bytes: number }>;
}

export const TableSizeChart: React.FC<TableSizeChartProps> = ({ data }) => {
  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const chartData = {
    labels: data.map(item => item.table_name.split('.').pop() || item.table_name),
    datasets: [
      {
        label: 'Tamaño Total',
        data: data.map(item => item.total_bytes / (1024 * 1024)), // Convertir a MB
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
            const bytes = context.raw * 1024 * 1024;
            return `${context.dataset.label}: ${formatBytes(bytes)}`;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Tamaño (MB)',
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