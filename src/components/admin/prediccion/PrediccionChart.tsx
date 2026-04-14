import React, { useEffect, useRef } from 'react';
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
    historico: Array<{ mes: string; total: number }>;
    proyeccion: Array<{ mes: string; Nt: number }>;
}

export const PrediccionChart: React.FC<PrediccionChartProps> = ({ historico, proyeccion }) => {
    const chartRef = useRef<any>(null);

    // Preparar datos para el gráfico
    const labels = [
        ...historico.map(h => h.mes),
        ...proyeccion.map(p => p.mes)
    ];

    const datosReales = historico.map(h => h.total);
    
    // Datos proyectados (con null para los meses históricos)
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
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'Proyección',
                data: datosProyectados,
                borderColor: colors.doradoClasico,
                backgroundColor: 'rgba(212, 175, 55, 0.05)',
                borderDash: [8, 4],
                fill: false,
                tension: 0.4,
                pointBackgroundColor: colors.doradoClasico,
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
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
            },
        },
    };

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <Line ref={chartRef} data={data} options={options} />
        </div>
    );
};