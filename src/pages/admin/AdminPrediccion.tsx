import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faCalculator,
    faCalendarAlt,
    faSpinner,
    faInfoCircle,
    faList,
    faEye,
    faCheckCircle,
    faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { PrediccionChart } from '../../components/admin/prediccion/PrediccionChart';
import { prediccionService } from '../../services/prediccionService';
import { colors } from '../../styles/colors';

// ─── Fuentes ────────────────────────────────────────────────────────────────
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500&family=DM+Mono&display=swap';
if (!document.head.querySelector('[href*="DM+Serif"]')) document.head.appendChild(fontLink);

// ─── Modal citas del mes ─────────────────────────────────────────────────────
const CitasMesModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    mes: string;
    citas: any[];
    loading: boolean;
}> = ({ isOpen, onClose, mes, citas, loading }) => {
    if (!isOpen) return null;

    const overlay: React.CSSProperties = {
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(15,20,40,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
    };

    const box: React.CSSProperties = {
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '28px',
        width: '92%', maxWidth: '900px',
        maxHeight: '80vh', overflowY: 'auto',
        border: '0.5px solid rgba(0,0,0,0.07)',
    };

    const headerRow: React.CSSProperties = {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px',
    };

    const title: React.CSSProperties = {
        fontFamily: 'DM Serif Display, serif',
        fontSize: '20px', fontWeight: 400,
        color: '#1A2035',
        display: 'flex', alignItems: 'center', gap: '8px',
    };

    const closeBtn: React.CSSProperties = {
        width: '30px', height: '30px',
        borderRadius: '8px',
        border: '0.5px solid rgba(0,0,0,0.1)',
        background: '#F7F8FA',
        cursor: 'pointer', fontSize: '18px',
        color: '#8896AB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    };

    const table: React.CSSProperties = {
        width: '100%', borderCollapse: 'collapse', marginTop: '4px',
    };

    const th: React.CSSProperties = {
        textAlign: 'left', padding: '10px 12px',
        fontSize: '11px', fontWeight: 500,
        color: '#8896AB', textTransform: 'uppercase' as const,
        letterSpacing: '0.07em',
        borderBottom: '0.5px solid rgba(0,0,0,0.07)',
        backgroundColor: '#F7F8FA',
    };

    const td: React.CSSProperties = {
        padding: '10px 12px',
        fontSize: '13px',
        borderBottom: '0.5px solid rgba(0,0,0,0.07)',
        color: '#1A2035',
    };

    const estadoBadge: React.CSSProperties = {
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '20px',
        fontSize: '11px', fontWeight: 500,
        background: '#ECFDF5', color: '#065F46',
        border: '0.5px solid #A7F3D0',
    };

    return (
        <div style={overlay} onClick={onClose}>
            <div style={box} onClick={(e) => e.stopPropagation()}>
                <div style={headerRow}>
                    <h3 style={title}>
                        <FontAwesomeIcon icon={faList} style={{ color: colors.doradoClasico, fontSize: '16px' }} />
                        Citas de {mes}
                    </h3>
                    <button style={closeBtn} onClick={onClose}>×</button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '28px', color: colors.doradoClasico }} />
                    </div>
                ) : citas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#8896AB', fontSize: '14px' }}>
                        No hay citas registradas en este mes
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '14px', fontSize: '13px', color: '#8896AB' }}>
                            Total de citas: <strong style={{ color: '#1A2035' }}>{citas.length}</strong>
                        </div>
                        <table style={table}>
                            <thead>
                                <tr>
                                    <th style={th}>Fecha</th>
                                    <th style={th}>Cliente</th>
                                    <th style={th}>Servicio</th>
                                    <th style={th}>Barbero</th>
                                    <th style={th}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {citas.map((cita, idx) => (
                                    <tr key={idx}>
                                        <td style={td}>{new Date(cita.fecha).toLocaleDateString()}</td>
                                        <td style={td}>{cita.cliente_nombre}</td>
                                        <td style={td}>{cita.servicio_nombre}</td>
                                        <td style={td}>{cita.barbero_nombre}</td>
                                        <td style={td}><span style={estadoBadge}>{cita.estado_nombre}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

// ─── Página principal ────────────────────────────────────────────────────────
export const AdminPrediccion: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [calculando, setCalculando] = useState(false);
    const [datos, setDatos] = useState<any>(null);
    const [modeloInfo, setModeloInfo] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Estados para los meses seleccionados
    const [mes1, setMes1] = useState('');
    const [mes2, setMes2] = useState('');
    const [mesesDisponibles, setMesesDisponibles] = useState<any[]>([]);
    const [totalCitasMes1, setTotalCitasMes1] = useState(0);
    const [totalCitasMes2, setTotalCitasMes2] = useState(0);
    const [totalCitasSuma, setTotalCitasSuma] = useState(0);
    const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [citasMes, setCitasMes] = useState<any[]>([]);
    const [cargandoCitas, setCargandoCitas] = useState(false);
    const [mesSeleccionado, setMesSeleccionado] = useState('');

    useEffect(() => {
        loadMesesDisponibles();
    }, []);

    // Cargar meses disponibles
    const loadMesesDisponibles = async () => {
        setLoading(true);
        try {
            const response = await prediccionService.getMesesDisponibles();
            if (response && response.data) {
                setMesesDisponibles(response.data);
            }
        } catch (error) {
            console.error('Error cargando meses disponibles:', error);
            setError('Error al cargar los meses disponibles');
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener el mes siguiente
    const obtenerMesSiguiente = (mesValue: string): string | null => {
        const [year, month] = mesValue.split('-');
        let añoNum = parseInt(year);
        let mesNum = parseInt(month);

        mesNum++;
        if (mesNum > 12) {
            mesNum = 1;
            añoNum++;
        }

        const mesSiguiente = `${añoNum}-${String(mesNum).padStart(2, '0')}`;

        // Verificar si el mes siguiente existe en la lista de meses disponibles
        const existe = mesesDisponibles.some(mes => mes.value === mesSiguiente);
        return existe ? mesSiguiente : null;
    };

    // Función para obtener el mes anterior
    const obtenerMesAnterior = (mesValue: string): string | null => {
        const [year, month] = mesValue.split('-');
        let añoNum = parseInt(year);
        let mesNum = parseInt(month);

        mesNum--;
        if (mesNum < 1) {
            mesNum = 12;
            añoNum--;
        }

        const mesAnterior = `${añoNum}-${String(mesNum).padStart(2, '0')}`;

        // Verificar si el mes anterior existe en la lista de meses disponibles
        const existe = mesesDisponibles.some(mes => mes.value === mesAnterior);
        return existe ? mesAnterior : null;
    };

    // Cargar total de citas cuando se selecciona un mes
    const loadTotalCitasPorMes = async (mesValue: string, setter: (value: number) => void) => {
        if (!mesValue) return 0;

        try {
            const [year, month] = mesValue.split('-');
            const fechaInicio = new Date(parseInt(year), parseInt(month) - 1, 1);
            const fechaFin = new Date(parseInt(year), parseInt(month), 0);

            const inicioStr = `${fechaInicio.getFullYear()}-${String(fechaInicio.getMonth() + 1).padStart(2, '0')}-01`;
            const finStr = `${fechaFin.getFullYear()}-${String(fechaFin.getMonth() + 1).padStart(2, '0')}-${String(fechaFin.getDate()).padStart(2, '0')}`;

            const response = await prediccionService.getCitasPorMes({
                fechaInicio: inicioStr,
                fechaFin: finStr
            });

            const citas = response.data || [];
            setter(citas.length);
            return citas.length;
        } catch (error) {
            console.error('Error cargando citas del mes:', error);
            setter(0);
            return 0;
        }
    };

    // Manejar cambio del Mes 1
    const handleMes1Change = async (value: string) => {
        setMes1(value);
        setMes2(''); // Limpiar Mes 2
        setTotalCitasMes2(0);

        if (value) {
            // Cargar total del Mes 1
            const total1 = await loadTotalCitasPorMes(value, setTotalCitasMes1);

            // Auto-seleccionar el mes siguiente como Mes 2
            const mesSiguiente = obtenerMesSiguiente(value);
            if (mesSiguiente) {
                setMes2(mesSiguiente);
                const total2 = await loadTotalCitasPorMes(mesSiguiente, setTotalCitasMes2);
                setTotalCitasSuma(total1 + total2);
                setErrorValidacion(null);
            } else {
                setTotalCitasSuma(0);
                setErrorValidacion('No hay un mes consecutivo disponible después de este mes');
            }
        } else {
            setTotalCitasMes1(0);
            setTotalCitasSuma(0);
            setErrorValidacion(null);
        }
    };

    // Manejar cambio del Mes 2
    const handleMes2Change = async (value: string) => {
        setMes2(value);

        if (value && !mes1) {
            // Si no hay Mes 1 seleccionado, auto-seleccionar el mes anterior
            const mesAnterior = obtenerMesAnterior(value);
            if (mesAnterior) {
                setMes1(mesAnterior);
                const total1 = await loadTotalCitasPorMes(mesAnterior, setTotalCitasMes1);
                const total2 = await loadTotalCitasPorMes(value, setTotalCitasMes2);
                setTotalCitasSuma(total1 + total2);
                setErrorValidacion(null);
            } else {
                await loadTotalCitasPorMes(value, setTotalCitasMes2);
                setTotalCitasSuma(0);
                setErrorValidacion('No hay un mes consecutivo disponible antes de este mes');
            }
        } else if (value && mes1) {
            // Validar que sean consecutivos
            const mesEsperado = obtenerMesSiguiente(mes1);
            if (mesEsperado === value) {
                const total1 = await loadTotalCitasPorMes(mes1, setTotalCitasMes1);
                const total2 = await loadTotalCitasPorMes(value, setTotalCitasMes2);
                setTotalCitasSuma(total1 + total2);
                setErrorValidacion(null);
            } else {
                setErrorValidacion('Los meses deben ser consecutivos (el Mes 2 debe ser el siguiente del Mes 1)');
                setTotalCitasSuma(0);
            }
        } else {
            setTotalCitasMes2(0);
            setTotalCitasSuma(0);
        }
    };

    // Efecto de validación adicional
    useEffect(() => {
        const validar = async () => {
            if (mes1 && mes2) {
                const mesEsperado = obtenerMesSiguiente(mes1);
                if (mesEsperado !== mes2) {
                    setErrorValidacion('Los meses deben ser consecutivos (el Mes 2 debe ser el siguiente del Mes 1)');
                    setTotalCitasSuma(0);
                }
            }
        };

        if (mes1 && mes2) {
            validar();
        }
    }, [mes1, mes2]);

    const handleCalcular = async () => {
        if (!mes1 || !mes2) {
            setError('Selecciona ambos meses');
            return;
        }

        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        setCalculando(true);
        setError(null);
        try {
            const result = await prediccionService.calcularPrediccion(mes1, mes2);
            setDatos(result.data);        // ← result.data tiene historico, proyeccion, etc.
            setModeloInfo(result.data.modelo);
        } catch (error: any) {
            console.error('Error calculando predicción:', error);
            setError(error.response?.data?.error || 'Error al calcular la predicción');
        } finally {
            setCalculando(false);
        }
    };

    const handleVerCitasDelMes = async (mesValue: string, mesLabel: string) => {
        if (!mesValue) return;

        setCargandoCitas(true);
        setMesSeleccionado(mesLabel);
        setModalOpen(true);

        try {
            const response = await prediccionService.getCitasPorMes({ mes: mesValue });
            setCitasMes(response.data || []);
        } catch (error) {
            console.error('Error cargando citas del mes:', error);
            setCitasMes([]);
            alert('Error al cargar las citas del mes');
        } finally {
            setCargandoCitas(false);
        }
    };

    // ── Estilos ──────────────────────────────────────────────────────────────

    const page: React.CSSProperties = {
        width: '100%',
        fontFamily: 'DM Sans, sans-serif',
    };

    const pageHeader: React.CSSProperties = {
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    };

    const h1Style: React.CSSProperties = {
        fontFamily: 'DM Serif Display, serif',
        fontSize: '26px',
        fontWeight: 400,
        color: '#1A2035',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '6px',
    };

    const subtitle: React.CSSProperties = {
        fontSize: '13px',
        color: '#8896AB',
    };

    const statsRow: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
    };

    const statCard = (accent: string = colors.doradoClasico): React.CSSProperties => ({
        backgroundColor: '#fff',
        borderRadius: '14px',
        padding: '18px 20px',
        border: '0.5px solid rgba(0,0,0,0.07)',
        position: 'relative',
        overflow: 'hidden',
    });

    const accentBar = (color: string): React.CSSProperties => ({
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '2px',
        background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
    });

    const iconBox = (bg: string, color: string): React.CSSProperties => ({
        width: '32px', height: '32px',
        borderRadius: '8px',
        background: bg, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px',
        marginBottom: '12px',
    });

    const statNumber: React.CSSProperties = {
        fontFamily: 'DM Serif Display, serif',
        fontSize: '36px',
        fontWeight: 400,
        color: '#1A2035',
        lineHeight: 1,
        marginBottom: '4px',
    };

    const statLabel: React.CSSProperties = {
        fontSize: '12px',
        color: '#8896AB',
    };

    const verBtn: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        marginTop: '14px',
        padding: '6px 12px',
        background: '#FAF6EE',
        color: '#8B6914',
        border: '0.5px solid #E0C87A',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
        width: '100%',
        justifyContent: 'center',
    };

    const mainGrid: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '20px',
        marginBottom: '20px',
    };

    const card: React.CSSProperties = {
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '24px',
        border: '0.5px solid rgba(0,0,0,0.07)',
        marginBottom: '0',
    };

    const cardTitle: React.CSSProperties = {
        fontSize: '11px',
        fontWeight: 500,
        color: '#8896AB',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    };

    const dot: React.CSSProperties = {
        width: '6px', height: '6px',
        borderRadius: '50%',
        background: colors.doradoClasico,
        display: 'inline-block',
    };

    const errorBox: React.CSSProperties = {
        background: '#FEF2F2',
        border: '0.5px solid #FCA5A5',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '13px',
        color: '#B91C1C',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    };

    const successBox: React.CSSProperties = {
        background: '#ECFDF5',
        border: '0.5px solid #6EE7B7',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '13px',
        color: '#065F46',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    };

    const selectGroup: React.CSSProperties = {
        marginBottom: '20px',
    };

    const selectLabel: React.CSSProperties = {
        fontSize: '13px',
        fontWeight: 500,
        color: '#1A2035',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    };

    const selectStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '0.5px solid rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '14px',
        color: '#1A2035',
        cursor: 'pointer',
    };

    const calcBtn: React.CSSProperties = {
        width: '100%',
        padding: '13px',
        background: '#1A2035',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'opacity 0.2s',
        marginTop: '20px',
    };

    const calcBtnDisabled: React.CSSProperties = {
        ...calcBtn,
        opacity: 0.5,
        cursor: 'not-allowed',
    };

    const modelBox: React.CSSProperties = {
        marginTop: '18px',
        background: '#FAF6EE',
        borderLeft: `3px solid ${colors.doradoClasico}`,
        borderRadius: '0 10px 10px 0',
        padding: '14px 16px',
    };

    const modelLabel: React.CSSProperties = {
        fontSize: '10px',
        fontWeight: 500,
        color: '#8B6914',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '6px',
    };

    const modelEquation: React.CSSProperties = {
        fontFamily: 'DM Mono, monospace',
        fontSize: '13px',
        color: '#1A2035',
        marginBottom: '8px',
    };

    const modelRow: React.CSSProperties = {
        fontSize: '12px',
        color: '#4A5568',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '4px',
    };

    const chartEmpty: React.CSSProperties = {
        height: '340px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        color: '#8896AB',
        opacity: 0.7,
    };

    const aboutGrid: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '14px',
        marginTop: '4px',
    };

    const aboutBlock: React.CSSProperties = {
        background: '#F7F8FA',
        borderRadius: '10px',
        padding: '16px',
    };

    const aboutBlockTitle: React.CSSProperties = {
        fontSize: '13px',
        fontWeight: 500,
        color: '#1A2035',
        marginBottom: '6px',
    };

    const aboutP: React.CSSProperties = {
        fontSize: '12px',
        color: '#8896AB',
        lineHeight: 1.6,
    };

    const divider: React.CSSProperties = {
        height: '0.5px',
        background: 'rgba(0,0,0,0.07)',
        margin: '12px 0',
    };

    const eqVar: React.CSSProperties = {
        fontFamily: 'DM Mono, monospace',
        fontSize: '11px',
        color: colors.doradoClasico,
        marginRight: '6px',
    };

    const notice = (bg: string, color: string, border: string): React.CSSProperties => ({
        borderRadius: '10px',
        padding: '12px 14px',
        fontSize: '12px',
        color,
        background: bg,
        border: `0.5px solid ${border}`,
        lineHeight: 1.6,
    });

    const aboutCards: React.CSSProperties = {
        ...card,
        marginTop: '20px',
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ textAlign: 'center', padding: '80px' }}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '28px', color: colors.doradoClasico }} />
                </div>
            </AdminLayout>
        );
    }

    const botonHabilitado = mes1 && mes2 && !errorValidacion && !calculando;

    return (
        <AdminLayout>
            <div style={page}>

                {/* ── Header ── */}
                <div style={pageHeader}>
                    <div>
                        <h1 style={h1Style}>
                            <FontAwesomeIcon icon={faChartLine} style={{ color: colors.doradoClasico, fontSize: '20px' }} />
                            Predicción de Citas
                        </h1>
                        <p style={subtitle}>Selecciona dos meses consecutivos para proyectar el crecimiento</p>
                    </div>
                </div>

                {/* ── Stats: Total de los meses seleccionados ── */}
                <div style={statsRow}>
                    <div style={statCard()}>
                        <div style={accentBar('#3B82F6')} />
                        <div style={iconBox('#EFF6FF', '#3B82F6')}>
                            <FontAwesomeIcon icon={faCalculator} />
                        </div>
                        <div style={statNumber}>{totalCitasSuma}</div>
                        <div style={statLabel}>
                            Total citas · periodo seleccionado
                        </div>
                    </div>

                    <div style={statCard()}>
                        <div style={accentBar('#10B981')} />
                        <div style={iconBox('#ECFDF5', '#10B981')}>
                            <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <div style={statNumber}>{totalCitasMes1 || 0}</div>
                        <div style={statLabel}>
                            {mesesDisponibles.find(m => m.value === mes1)?.label || 'Mes 1'}
                        </div>
                        <button
                            style={verBtn}
                            onClick={() => {
                                const mesLabel = mesesDisponibles.find(m => m.value === mes1)?.label || '';
                                handleVerCitasDelMes(mes1, mesLabel);
                            }}
                            disabled={!mes1}
                        >
                            <FontAwesomeIcon icon={faEye} style={{ fontSize: '11px' }} />
                            Ver citas
                        </button>
                    </div>

                    <div style={statCard()}>
                        <div style={accentBar('#F59E0B')} />
                        <div style={iconBox('#FEF3C7', '#F59E0B')}>
                            <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <div style={statNumber}>{totalCitasMes2 || 0}</div>
                        <div style={statLabel}>
                            {mesesDisponibles.find(m => m.value === mes2)?.label || 'Mes 2'}
                        </div>
                        <button
                            style={verBtn}
                            onClick={() => {
                                const mesLabel = mesesDisponibles.find(m => m.value === mes2)?.label || '';
                                handleVerCitasDelMes(mes2, mesLabel);
                            }}
                            disabled={!mes2}
                        >
                            <FontAwesomeIcon icon={faEye} style={{ fontSize: '11px' }} />
                            Ver citas
                        </button>
                    </div>
                </div>

                {/* ── Main grid ── */}
                <div style={mainGrid}>

                    {/* Panel configuración */}
                    <div style={card}>
                        <div style={cardTitle}><span style={dot} /> Configuración</div>

                        {error && (
                            <div style={errorBox}>
                                <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '13px' }} />
                                {error}
                            </div>
                        )}

                        {errorValidacion && !error && (
                            <div style={errorBox}>
                                <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: '13px' }} />
                                {errorValidacion}
                            </div>
                        )}

                        {mes1 && mes2 && !errorValidacion && totalCitasSuma > 0 && (
                            <div style={successBox}>
                                <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '13px' }} />
                                ✅ {mesesDisponibles.find(m => m.value === mes1)?.label} → {mesesDisponibles.find(m => m.value === mes2)?.label} (consecutivos) · Total: {totalCitasSuma} citas
                            </div>
                        )}

                        <div style={selectGroup}>
                            <div style={selectLabel}>
                                <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '11px', color: colors.doradoClasico }} />
                                Seleccionar Mes 1
                            </div>
                            <select
                                style={selectStyle}
                                value={mes1}
                                onChange={(e) => handleMes1Change(e.target.value)}
                            >
                                <option value="">-- Selecciona un mes --</option>
                                {mesesDisponibles.map((mes) => (
                                    <option key={mes.value} value={mes.value}>
                                        {mes.label}
                                    </option>
                                ))}
                            </select>
                            {mes1 && (
                                <div style={{ fontSize: '11px', color: '#8896AB', marginTop: '4px' }}>
                                    💡 Al seleccionar, se autocompletará el Mes 2 como el mes siguiente
                                </div>
                            )}
                        </div>

                        <div style={selectGroup}>
                            <div style={selectLabel}>
                                <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '11px', color: colors.doradoClasico }} />
                                Seleccionar Mes 2 (consecutivo)
                            </div>
                            <select
                                style={selectStyle}
                                value={mes2}
                                onChange={(e) => handleMes2Change(e.target.value)}
                            >
                                <option value="">-- Selecciona un mes --</option>
                                {mesesDisponibles.map((mes) => (
                                    <option key={mes.value} value={mes.value}>
                                        {mes.label}
                                    </option>
                                ))}
                            </select>
                            {mes2 && mes1 && obtenerMesSiguiente(mes1) !== mes2 && (
                                <div style={{ fontSize: '11px', color: '#DC2626', marginTop: '4px' }}>
                                    ⚠️ Debe ser el mes consecutivo a {mesesDisponibles.find(m => m.value === mes1)?.label}
                                </div>
                            )}
                        </div>

                        <button
                            style={botonHabilitado ? calcBtn : calcBtnDisabled}
                            onClick={handleCalcular}
                            disabled={!botonHabilitado}
                        >
                            {calculando ? (
                                <><FontAwesomeIcon icon={faSpinner} spin /> Calculando predicción...</>
                            ) : (
                                <><FontAwesomeIcon icon={faCalculator} /> Calcular predicción</>
                            )}
                        </button>

                        {/*modeloInfo && (
                            <div style={modelBox}>
                                <div style={modelLabel}>Modelo exponencial · dx/dt = kx</div>
                                <code style={modelEquation}>{modeloInfo.ecuacion}</code>
                                <div style={divider} />
                                <div style={modelRow}>
                                    <span>Tasa de crecimiento</span>
                                    <strong style={{ color: '#1A2035' }}>{modeloInfo.tasaPeriodo}</strong>
                                </div>
                                <div style={{ ...modelRow, marginTop: '4px' }}>
                                    <span>Valor base x₀</span>
                                    <strong style={{ color: '#1A2035' }}>{modeloInfo.x0} citas</strong>
                                </div>
                                <div style={{ ...modelRow, marginTop: '8px', fontSize: '11px', color: '#8896AB' }}>
                                    Basado en {mesesDisponibles.find(m => m.value === mes1)?.label} y {mesesDisponibles.find(m => m.value === mes2)?.label}
                                </div>
                            </div>
                        )*/}
                    </div>

                    {/* Panel gráfico */}
                    <div style={card}>
                        <div style={cardTitle}><span style={dot} /> Análisis de crecimiento · proyección mensual</div>

                        {datos ? (
                            <PrediccionChart
                                historico={datos.historico}
                                proyeccion={datos.proyeccion}
                            />
                        ) : (
                            <div style={chartEmpty}>
                                <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '48px' }} />
                                <p style={{ fontSize: '13px', textAlign: 'center', maxWidth: '200px', lineHeight: 1.5 }}>
                                    Selecciona dos meses consecutivos y presiona "Calcular predicción"
                                </p>
                            </div>
                        )}
                    </div>
                </div>



            </div>

            <CitasMesModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setCitasMes([]); }}
                mes={mesSeleccionado}
                citas={citasMes}
                loading={cargandoCitas}
            />
        </AdminLayout>
    );
};