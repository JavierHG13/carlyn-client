import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/axios';
import { colors } from '../../styles/colors';

export const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await api.post('/auth/forgot-password', { correoElectronico: email });
            setSuccess('Código enviado a tu correo');
            setStep('code');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al enviar código');
        } finally {
            setLoading(false);
        }
    };
    
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await api.post('/auth/verify-recovery-code', { 
                correoElectronico: email, 
                code 
            });
            setStep('reset');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Código incorrecto');
        } finally {
            setLoading(false);
        }
    };
    
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }
        
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }
        
        try {
            await api.post('/auth/reset-password', {
                correoElectronico: email,
                newPassword,
            });
            navigate('/login', { state: { reset: true } });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al resetear contraseña');
        } finally {
            setLoading(false);
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
    
    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px',
        border: `1px solid #E2E8F0`,
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        marginBottom: '20px',
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
    
    const linkStyle: React.CSSProperties = {
        color: colors.doradoClasico,
        textDecoration: 'none',
        fontSize: '13px',
        display: 'inline-block',
        marginTop: '16px',
        textAlign: 'center',
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
                <h1 style={titleStyle}>Recuperar Contraseña</h1>
                
                {error && <div style={errorStyle}>{error}</div>}
                {success && <div style={successStyle}>{success}</div>}
                
                {step === 'email' && (
                    <form onSubmit={handleSendCode}>
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            style={inputStyle}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" style={buttonStyle} disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar código'}
                        </button>
                    </form>
                )}
                
                {step === 'code' && (
                    <form onSubmit={handleVerifyCode}>
                        <input
                            type="text"
                            placeholder="Código de 6 dígitos"
                            style={inputStyle}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            maxLength={6}
                            required
                        />
                        <button type="submit" style={buttonStyle} disabled={loading}>
                            {loading ? 'Verificando...' : 'Verificar código'}
                        </button>
                    </form>
                )}
                
                {step === 'reset' && (
                    <form onSubmit={handleResetPassword}>
                        <input
                            type="password"
                            placeholder="Nueva contraseña"
                            style={inputStyle}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirmar contraseña"
                            style={inputStyle}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit" style={buttonStyle} disabled={loading}>
                            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                        </button>
                    </form>
                )}
                
                <div style={{ textAlign: 'center' }}>
                    <Link to="/login" style={linkStyle}>Volver al inicio de sesión</Link>
                </div>
            </div>
        </div>
    );
};