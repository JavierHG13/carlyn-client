import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/colors';
import { useGoogleLogin } from '@react-oauth/google';

interface LoginFormInputs {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  password: yup.string()
    .required('La contraseña es obligatoria')
});

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginOAuth, errors: authErrors, loading, isAuthenticated , user} = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [localError, setLocalError] = useState('');
  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      if (redirectTo) {
        navigate(redirectTo);
      } else if (user?.rol === 'Admin') {
        navigate('/admin');
      } else if (user?.rol === 'Barbero') {
        navigate('/barbero');
      } else {
        navigate('/mis-citas');
      }
    }
  }, [isAuthenticated, navigate, redirectTo, user?.rol]);

  // Cargar email guardado al montar el componente
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setValue('email', savedEmail);
      setRememberEmail(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormInputs) => {
    setLocalError('');

    // Guardar email en localStorage si está marcado
    if (rememberEmail) {
      localStorage.setItem('savedEmail', data.email);
    } else {
      localStorage.removeItem('savedEmail');
    }

    try {
        await login({ correoElectronico: data.email, contrasena: data.password }, redirectTo);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    scope: 'email profile',
    onSuccess: async (tokenResponse) => {
      if (tokenResponse.access_token) {
        await loginOAuth(tokenResponse.access_token);
      }
    },
    onError: () => {
      console.error('Error en Google Login');
      setLocalError('Error al conectar con Google');
    },
  });

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 96px)',
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F4EF 100%)',
    padding: '20px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255,255,255,0.96)',
    padding: '42px 46px',
    borderRadius: '18px',
    border: '1px solid #E7EBF2',
    boxShadow: '0 24px 70px rgba(15, 23, 42, 0.10)',
    width: '100%',
    maxWidth: '470px',
  };

  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '30px',
    fontWeight: 700,
    color: colors.negroSuave,
    marginBottom: '8px',
    fontFamily: 'Playfair Display, serif',
  };

  const subtitleStyle: React.CSSProperties = {
    textAlign: 'center',
    color: colors.azulAcero,
    marginBottom: '34px',
    fontSize: '15px',
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: '22px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 700,
    color: colors.azulAcero,
  };

  const inputContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    height: '52px',
    padding: '0 42px 0 42px',
    border: `1px solid ${hasError ? '#EF4444' : '#D9E1EC'}`,
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    backgroundColor: '#FFFFFF',
  });

  const inputIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#A0AEC0',
    fontSize: '14px',
  };

  const togglePasswordStyle: React.CSSProperties = {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#A0AEC0',
    background: 'none',
    border: 'none',
    fontSize: '16px',
  };

  const errorTextStyle: React.CSSProperties = {
    color: '#EF4444',
    fontSize: '12px',
    marginTop: '4px',
  };

  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '18px',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  };

  const checkboxStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  };

  const linkStyle: React.CSSProperties = {
    color: colors.doradoClasico,
    textDecoration: 'none',
    fontSize: '13px',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    height: '52px',
    backgroundColor: colors.doradoClasico,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.2s',
  };

  const googleButtonStyle: React.CSSProperties = {
    width: '100%',
    height: '54px',
    backgroundColor: '#FFFFFF',
    color: '#3C4043',
    border: '1px solid #DADCE0',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    marginTop: '12px',
    transition: 'all 0.2s',
    boxShadow: '0 1px 2px rgba(60, 64, 67, 0.08)',
  };

  const errorAlertStyle: React.CSSProperties = {
    backgroundColor: '#FEE2E2',
    color: '#EF4444',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
    textAlign: 'center',
  };

  const dividerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    margin: '22px 0',
    color: '#A0AEC0',
    fontSize: '12px',
  };

  const footerStyle: React.CSSProperties = {
    marginTop: '26px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#718096',
  };

  // Si está cargando la autenticación, mostrar loading
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: colors.azulAcero }}>Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Barbería Carlyn</h1>
        <p style={subtitleStyle}>Inicia sesión en tu cuenta</p>

        {(localError || authErrors) && (
          <div style={errorAlertStyle}>
            {localError || authErrors}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Correo Electrónico</label>
            <div style={inputContainerStyle}>
              <FontAwesomeIcon icon={faEnvelope} style={inputIconStyle} />
              <input
                type="email"
                style={inputStyle(!!errors.email)}
                placeholder="tu@email.com"
                {...register('email')}
              />
            </div>
            {errors.email && <p style={errorTextStyle}>{errors.email.message}</p>}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Contraseña</label>
            <div style={inputContainerStyle}>
              <FontAwesomeIcon icon={faLock} style={inputIconStyle} />
              <input
                type={showPassword ? 'text' : 'password'}
                style={inputStyle(!!errors.password)}
                placeholder="********"
                {...register('password')}
              />
              <button
                type="button"
                style={togglePasswordStyle}
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && <p style={errorTextStyle}>{errors.password.message}</p>}
          </div>

          <div style={checkboxContainerStyle}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                style={checkboxStyle}
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
              />
              <span style={{ fontSize: '13px', color: '#718096' }}>Recordar mi correo</span>
            </label>

            <Link to="/forgot-password" style={linkStyle}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={dividerStyle}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #E2E8F0' }} />
          <span style={{ padding: '0 16px' }}>o continúa con</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #E2E8F0' }} />
        </div>

        <button 
          style={googleButtonStyle} 
          onClick={() => handleGoogleLogin()} 
          disabled={loading}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.borderColor = '#C8CCD0';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(60, 64, 67, 0.16)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#DADCE0';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(60, 64, 67, 0.08)';
          }}
        >
          <GoogleMark />
          <span>Continuar con Google</span>
        </button>

        <div style={footerStyle}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={linkStyle}>Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
};

const GoogleMark: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M19.6 10.23c0-.68-.06-1.34-.18-1.96H10v3.71h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.31 2.98-7.28Z"
    />
    <path
      fill="#34A853"
      d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.23-2.51c-.9.6-2.04.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H1.07v2.59A10 10 0 0 0 10 20Z"
    />
    <path
      fill="#FBBC05"
      d="M4.41 11.9a6.01 6.01 0 0 1 0-3.8V5.51H1.07a10 10 0 0 0 0 8.98l3.34-2.59Z"
    />
    <path
      fill="#EA4335"
      d="M10 3.98c1.47 0 2.79.51 3.83 1.5l2.86-2.86A9.6 9.6 0 0 0 10 0 10 10 0 0 0 1.07 5.51L4.41 8.1C5.2 5.74 7.4 3.98 10 3.98Z"
    />
  </svg>
);
