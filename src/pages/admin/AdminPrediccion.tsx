import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faCalculator,
    faCalendarAlt,
    faUsers,
    faArrowTrendUp,
    faSpinner,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { PrediccionChart } from '../../components/admin/prediccion/PrediccionChart';
import { prediccionService } from '../../services/prediccionService';
import { colors } from '../../styles/colors';

export const AdminPrediccion: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [calculando, setCalculando] = useState(false);
    const [fechaObjetivo, setFechaObjetivo] = useState('');
    const [datos, setDatos] = useState<any>(null);
    const [resumen, setResumen] = useState<any>(null);
    const [modeloInfo, setModeloInfo] = useState<any>(null);

    useEffect(() => {
        loadResumen();
        
        // Fecha por defecto: próximo mes
        const defaultDate = new Date();
        defaultDate.setMonth(defaultDate.getMonth() + 3);
        setFechaObjetivo(defaultDate.toISOString().slice(0, 7));
    }, []);

    const loadResumen = async () => {
        setLoading(true);
        try {
            const data = await prediccionService.getResumen();
            setResumen(data);
        } catch (error) {
            console.error('Error loading resumen:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCalcular = async () => {
        if (!fechaObjetivo) return;
        
        setCalculando(true);
        try {
            const result = await prediccionService.calcularPrediccion(fechaObjetivo);
            setDatos(result);
            setModeloInfo(result.modelo);
        } catch (error) {
            console.error('Error calculando predicción:', error);
            alert('Error al calcular la predicción');
        } finally {
            setCalculando(false);
        }
    };

    const containerStyle: React.CSSProperties = {
        width: '100%',
    };

    const headerStyle: React.CSSProperties = {
        marginBottom: '28px',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 700,
        color: colors.negroSuave,
        marginBottom: '8px',
        fontFamily: 'Playfair Display, serif',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    };

    const subtitleStyle: React.CSSProperties = {
        color: '#718096',
        fontSize: '15px',
    };

    const statsGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
    };

    const statCardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #EDF2F7',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    };

    const statValueStyle: React.CSSProperties = {
        fontSize: '32px',
        fontWeight: 700,
        color: colors.negroSuave,
        marginBottom: '4px',
    };

    const statLabelStyle: React.CSSProperties = {
        fontSize: '13px',
        color: '#718096',
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #EDF2F7',
        marginBottom: '24px',
    };

    const cardTitleStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: 600,
        color: colors.negroSuave,
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    const configCardStyle: React.CSSProperties = {
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '20px',
    };

    const modeloInfoStyle: React.CSSProperties = {
        backgroundColor: '#F0F9FF',
        borderRadius: '12px',
        padding: '16px',
        marginTop: '20px',
        borderLeft: `4px solid ${colors.doradoClasico}`,
    };

    const buttonStyle: React.CSSProperties = {
        padding: '12px 24px',
        backgroundColor: colors.doradoClasico,
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        justifyContent: 'center',
        transition: 'opacity 0.2s',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        fontSize: '14px',
        outline: 'none',
        marginTop: '8px',
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '32px', color: colors.doradoClasico }} />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>
                        <FontAwesomeIcon icon={faChartLine} style={{ color: colors.doradoClasico }} />
                        Predicción de Citas
                    </h1>
                    <p style={subtitleStyle}>
                        Proyecta el crecimiento de citas usando modelo matemático lineal
                    </p>
                </div>

                {/* Estadísticas rápidas */}
                <div style={statsGridStyle}>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{resumen?.total || 0}</div>
                        <div style={statLabelStyle}>Total de citas (últimos 6 meses)</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{resumen?.tasaCrecimiento || 0}</div>
                        <div style={statLabelStyle}>Citas/mes (tasa de crecimiento)</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{resumen?.primerRegistro || '--'}</div>
                        <div style={statLabelStyle}>Primer registro</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{resumen?.ultimoRegistro || '--'}</div>
                        <div style={statLabelStyle}>Último registro</div>
                    </div>
                </div>

                {/* Gráfico de predicción */}
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>
                        <FontAwesomeIcon icon={faArrowTrendUp} style={{ color: colors.doradoClasico }} />
                        Análisis de Crecimiento
                    </h3>
                    
                    {datos ? (
                        <PrediccionChart
                            historico={datos.historico}
                            proyeccion={datos.proyeccion}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#718096' }}>
                            <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                            <p>Selecciona un mes objetivo y calcula la predicción</p>
                        </div>
                    )}
                </div>

                {/* Panel de configuración */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Configuración de predicción */}
                    <div style={cardStyle}>
                        <h3 style={cardTitleStyle}>
                            <FontAwesomeIcon icon={faCalculator} style={{ color: colors.doradoClasico }} />
                            Configuración
                        </h3>
                        
                        <div>
                            <label style={{ fontSize: '14px', fontWeight: 500, color: colors.azulAcero }}>
                                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '6px' }} />
                                Mes objetivo
                            </label>
                            <input
                                type="month"
                                style={inputStyle}
                                value={fechaObjetivo}
                                onChange={(e) => setFechaObjetivo(e.target.value)}
                            />
                        </div>

                        <button
                            style={{ ...buttonStyle, marginTop: '20px' }}
                            onClick={handleCalcular}
                            disabled={calculando}
                        >
                            {calculando ? (
                                <><FontAwesomeIcon icon={faSpinner} spin /> Calculando...</>
                            ) : (
                                <><FontAwesomeIcon icon={faCalculator} /> Calcular predicción</>
                            )}
                        </button>

                        {modeloInfo && (
                            <div style={modeloInfoStyle}>
                                <div style={{ fontSize: '12px', color: colors.azulAcero, marginBottom: '8px' }}>
                                    <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '4px' }} />
                                    MODELO MATEMÁTICO
                                </div>
                                <code style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>
                                    {modeloInfo.ecuacion}
                                </code>
                                <p style={{ fontSize: '13px', margin: 0, color: '#0369A1' }}>
                                    Crecimiento estimado: <strong>{modeloInfo.tasaMensual}</strong>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Información del modelo */}
                    <div style={cardStyle}>
                        <h3 style={cardTitleStyle}>
                            <FontAwesomeIcon icon={faInfoCircle} style={{ color: colors.doradoClasico }} />
                            Sobre el modelo
                        </h3>
                        
                        <div style={configCardStyle}>
                            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                                Modelo Lineal de Crecimiento
                            </div>
                            <p style={{ fontSize: '13px', color: '#718096', marginBottom: '12px', lineHeight: 1.5 }}>
                                El modelo utiliza regresión lineal para proyectar el crecimiento de citas 
                                basado en el comportamiento histórico de los últimos meses.
                            </p>
                            <div style={{ fontSize: '13px', color: colors.azulAcero }}>
                                <strong>Ecuación:</strong> y = mx + b
                            </div>
                            <div style={{ fontSize: '12px', color: '#718096', marginTop: '8px' }}>
                                • y = número de citas proyectadas<br />
                                • x = tiempo en meses<br />
                                • m = tasa de crecimiento mensual<br />
                                • b = número base de citas
                            </div>
                        </div>

                        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#FEF3C7', borderRadius: '8px' }}>
                            <div style={{ fontSize: '12px', color: '#F59E0B' }}>
                                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '4px' }} />
                                Esta proyección permite anticipar la demanda y tomar decisiones estratégicas
                                sobre contratación de barberos y gestión de inventario.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};