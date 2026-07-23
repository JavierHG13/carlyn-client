import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { colors } from '../../../styles/colors';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface PrediccionChartProps {
    historico: Array<{ periodo: string; total: number }>;
    proyeccion: Array<{ periodo: string; Nt: number }>;
}

export const PrediccionChart: React.FC<PrediccionChartProps> = ({ historico, proyeccion }) => {
    const labels = [
        ...historico.map(h => h.periodo),
        ...proyeccion.map(p => p.periodo)
    ];

    const datosReales = historico.map(h => h.total);
    
    const datosProyectados = [
        ...new Array(historico.length - 1).fill(null),
        historico[historico.length - 1]?.total || null,
        ...proyeccion.map(p => p.Nt)
    ];

    const data = {
        labels,
        datasets: [
            {
                label: 'Citas reales',
                data: datosReales,
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
            {
                label: 'Proyección mensual',
                data: datosProyectados,
                borderColor: colors.doradoClasico,
                backgroundColor: 'rgba(212, 175, 55, 0.05)',
                borderDash: [8, 4],
                fill: false,
                tension: 0.4,
                pointBackgroundColor: colors.doradoClasico,
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                },
            },
            tooltip: {
                callbacks: {
                    title: (tooltipItems: any) => {
                        const index = tooltipItems[0].dataIndex;
                        const label = labels[index];
                        return `Mes: ${label}`;
                    },
                    label: (context: any) => {
                        const label = context.dataset.label || '';
                        const value = context.raw;
                        if (value === null) return '';
                        return `${label}: ${value} citas`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de citas',
                    color: '#718096',
                },
                grid: {
                    color: '#E2E8F0',
                },
                ticks: {
                    stepSize: 1,
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Meses',
                    color: '#718096',
                },
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                        size: 11,
                    },
                },
            },
        },
    };

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <Line data={data} options={options} />
        </div>
    );
};