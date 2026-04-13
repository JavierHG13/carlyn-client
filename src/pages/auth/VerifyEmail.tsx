import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/colors';

export const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyEmail, resendCode, loading } = useAuth();
    
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(true);
    
    const email = location.state?.correoElectronico || localStorage.getItem('pendingEmail') || '';
    
    // Guardar email en localStorage para persistencia
    useEffect(() => {
        if (email) {
            localStorage.setItem('pendingEmail', email);
        }
    }, [email]);
    
    // Timer para reenvío de código
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [countdown]);
    
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!code || code.length !== 6) {
            setError('Ingresa el código de 6 dígitos');
            return;
        }
        
        try {
            await verifyEmail({ correoElectronico: email, code });
            localStorage.removeItem('pendingEmail');
            navigate('/login', { state: { verified: true } });
        } catch (err: any) {
            setError(err.message || 'Código incorrecto o expirado');
        }
    };
    
    const handleResendCode = async () => {
        if (!canResend) return;
        
        setError('');
        setSuccess('');
        
        try {
            await resendCode(email);
            setSuccess('Nuevo código enviado');
            setCanResend(false);
            setCountdown(60);
        } catch (err: any) {
            setError(err.message || 'Error al reenviar el código');
        }
    };
    
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: colors.blancoHueso,
        padding: '20px',
    };
    
    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '450px',
    };
    
    const titleStyle: React.CSSProperties = {
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 700,
        color: colors.negroSuave,
        marginBottom: '8px',
    };
    
    const infoStyle: React.CSSProperties = {
        textAlign: 'center',
        color: colors.azulAcero,
        marginBottom: '24px',
        fontSize: '14px',
    };
    
    const codeInputStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px',
        fontSize: '24px',
        textAlign: 'center',
        letterSpacing: '8px',
        border: `1px solid #E2E8F0`,
        borderRadius: '8px',
        outline: 'none',
        marginBottom: '24px',
    };
    
    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px',
        backgroundColor: colors.doradoClasico,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 500,
        cursor: 'pointer',
    };
    
    const resendStyle: React.CSSProperties = {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '13px',
        color: '#718096',
    };
    
    const linkStyle: React.CSSProperties = {
        color: colors.doradoClasico,
        textDecoration: 'none',
        cursor: canResend ? 'pointer' : 'not-allowed',
        opacity: canResend ? 1 : 0.5,
    };
    
    const errorStyle: React.CSSProperties = {
        backgroundColor: '#FEE2E2',
        color: '#EF4444',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
    };
    
    const successStyle: React.CSSProperties = {
        backgroundColor: '#D1FAE5',
        color: '#10B981',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
    };
    
    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h1 style={titleStyle}>Verifica tu correo</h1>
                <p style={infoStyle}>
                    Hemos enviado un código de 6 dígitos a<br />
                    <strong>{email}</strong>
                </p>
                
                {error && <div style={errorStyle}>{error}</div>}
                {success && <div style={successStyle}>{success}</div>}
                
                <form onSubmit={handleVerify}>
                    <input
                        type="text"
                        maxLength={6}
                        style={codeInputStyle}
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                    />
                    
                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? 'Verificando...' : 'Verificar código'}
                    </button>
                </form>
                
                <div style={resendStyle}>
                    {countdown > 0 ? (
                        <span>Reenviar código en {countdown} segundos</span>
                    ) : (
                        <>
                            ¿No recibiste el código?{' '}
                            <button
                                onClick={handleResendCode}
                                style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Reenviar
                            </button>
                        </>
                    )}
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/login" style={linkStyle}>Volver al inicio de sesión</Link>
                </div>
            </div>
        </div>
    );
};