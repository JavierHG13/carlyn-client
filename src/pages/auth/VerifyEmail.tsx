// src/pages/VerifyEmail.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpenText, faRotateRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/colors';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const correoElectronico = location.state?.correoElectronico as string | undefined;

  const { verifyEmail, resendCode, loading, errors } = useAuth();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState('');   // solo para "código incompleto"
  const [successMsg, setSuccessMsg] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!correoElectronico) navigate('/register');
  }, [correoElectronico, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setLocalError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    pasted.split('').forEach((char, i) => { newCode[i] = char; });
    setCode(newCode);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');

    if (fullCode.length < 6) {
      setLocalError('Ingresa el código completo de 6 dígitos');
      return;
    }

    try {
      // navigate al login lo hace el contexto
      await verifyEmail({ correoElectronico: correoElectronico!, code: fullCode });
    } catch {
      // errors del backend ya están en context.errors
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      await resendCode(correoElectronico!);
      setSuccessMsg('Código reenviado, revisa tu correo');
      setResendCooldown(30);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      // errors del backend ya están en context.errors
    } finally {
      setIsResending(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', backgroundColor: colors.blancoHueso, padding: '20px',
  };
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white', padding: '40px', borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '420px',
    textAlign: 'center',
  };
  const iconContainerStyle: React.CSSProperties = {
    width: '64px', height: '64px', borderRadius: '50%',
    backgroundColor: `${colors.doradoClasico}20`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px',
  };
  const codeInputStyle = (filled: boolean): React.CSSProperties => ({
    width: '48px', height: '56px', fontSize: '24px', fontWeight: 600,
    textAlign: 'center', border: `2px solid ${filled ? colors.doradoClasico : '#e2e8f0'}`,
    borderRadius: '8px', outline: 'none', color: colors.negroSuave,
    transition: 'border-color 0.2s', caretColor: colors.doradoClasico,
  });
  const linkStyle: React.CSSProperties = { color: colors.doradoClasico, textDecoration: 'none', fontWeight: 500 };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconContainerStyle}>
          <FontAwesomeIcon icon={faEnvelopeOpenText} size="lg" color={colors.doradoClasico} />
        </div>

        <h1 style={{ marginBottom: '8px', color: colors.negroSuave, fontSize: '24px' }}>
          Verifica tu correo
        </h1>
        <p style={{ color: colors.azulAcero, marginBottom: '8px' }}>
          Enviamos un código de 6 dígitos a
        </p>
        <p style={{ color: colors.negroSuave, fontWeight: 600, marginBottom: '32px' }}>
          {correoElectronico}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                style={codeInputStyle(!!digit)}
                onFocus={(e) => e.target.style.borderColor = colors.doradoClasico}
                onBlur={(e) => e.target.style.borderColor = digit ? colors.doradoClasico : '#e2e8f0'}
              />
            ))}
          </div>

          {/* localError = código incompleto | errors = errores del backend */}
          {(localError || errors) && (
            <p style={{ color: colors.error, marginBottom: '16px', fontSize: '14px' }}>
              {localError || errors}
            </p>
          )}
          {successMsg && (
            <p style={{ color: '#22c55e', marginBottom: '16px', fontSize: '14px' }}>{successMsg}</p>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Verificando...' : 'Verificar Cuenta'}
          </Button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <p style={{ color: colors.azulAcero, fontSize: '14px', marginBottom: '8px' }}>
            ¿No recibiste el código?
          </p>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            style={{
              background: 'none', border: 'none', cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
              color: resendCooldown > 0 ? '#94a3b8' : colors.doradoClasico,
              fontWeight: 500, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
          >
            <FontAwesomeIcon icon={faRotateRight} spin={isResending} />
            {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar código'}
          </button>
        </div>

        <div style={{ marginTop: '16px' }}>
          <Link to="/register" style={linkStyle}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '6px' }} />
            Volver al registro
          </Link>
        </div>
      </div>
    </div>
  );
};