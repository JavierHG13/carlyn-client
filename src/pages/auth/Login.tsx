import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock, faGoogle } from '@fortawesome/free-solid-svg-icons';
import { faGoogle as faGoogleBrand } from '@fortawesome/free-brands-svg-icons';
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
  const { login, loginOAuth, errors: authErrors, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [localError, setLocalError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

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
      await login({ correoElectronico: data.email, contrasena: data.password });
    } catch (err) {
      console.log(err)
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
    fontSize: '28px',
    fontWeight: 700,
    color: colors.negroSuave,
    marginBottom: '8px',
    fontFamily: 'Playfair Display, serif',
  };

  const subtitleStyle: React.CSSProperties = {
    textAlign: 'center',
    color: colors.azulAcero,
    marginBottom: '32px',
    fontSize: '14px',
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: '20px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: colors.azulAcero,
  };

  const inputContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '12px 40px 12px 40px',
    border: `1px solid ${hasError ? '#EF4444' : '#E2E8F0'}`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  });

  const inputIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#A0AEC0',
    fontSize: '14px',
  };

  const togglePasswordStyle: React.CSSProperties = {
    position: 'absolute',
    right: '12px',
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
    marginBottom: '16px',
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
    padding: '12px',
    backgroundColor: colors.doradoClasico,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  };

  const googleButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    backgroundColor: 'white',
    color: colors.negroSuave,
    border: `1px solid #E2E8F0`,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '12px',
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
    margin: '20px 0',
    color: '#A0AEC0',
    fontSize: '12px',
  };

  const footerStyle: React.CSSProperties = {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#718096',
  };

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

        <button style={googleButtonStyle} onClick={() => handleGoogleLogin()} disabled={loading}>
          <FontAwesomeIcon icon={faGoogleBrand} />
          Google
        </button>


        <div style={footerStyle}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={linkStyle}>Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
};