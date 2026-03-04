import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/colors';

export const Login: React.FC = () => {
  const { login, loading, errors } = useAuth();
  const [correoElectronico, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ correo_electronico, contrasena });

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
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  };

  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '8px',
    color: colors.negroSuave,
  };

  const subtitleStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px',
    color: colors.azulAcero,
  };

  const footerStyle: React.CSSProperties = {
    marginTop: '24px',
    textAlign: 'center',
  };

  const linkStyle: React.CSSProperties = {
    color: colors.doradoClasico,
    textDecoration: 'none',
    fontWeight: 500,
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Barbería Carlyn</h1>
        <p style={subtitleStyle}>Inicia sesión en tu cuenta</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            value={correo_electronico}
            onChange={(e) => setCorreo(e.target.value)}
            required
            icon={faEnvelope}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="********"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            icon={faLock}
          />

          {/* Ahora los errores vienen directo del contexto */}
          {errors && (
            <p style={{ color: colors.error, marginBottom: '16px' }}>{errors}</p>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? (
              'Cargando...'
            ) : (
              <>
                <FontAwesomeIcon icon={faRightToBracket} style={{ marginRight: '8px' }} />
                Iniciar Sesión
              </>
            )}
          </Button>
        </form>

        <div style={footerStyle}>
          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/register" style={linkStyle}>
              Regístrate aquí
            </Link>
          </p>
          <p style={{ marginTop: '8px' }}>
            <Link to="/forgot-password" style={linkStyle}>
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};