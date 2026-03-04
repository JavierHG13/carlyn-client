// src/pages/Register.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUser, faEnvelope, faLock, faCheck, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/colors';

export const Register: React.FC = () => {
  const { register, loading, errors } = useAuth();
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [localError, setLocalError] = useState(''); // solo para validaciones del form

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (contrasena !== confirmarContrasena) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    if (contrasena.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // navigate y errores del backend los maneja el contexto
    await register({ nombreCompleto, correoElectronico, telefono, contrasena });
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', backgroundColor: colors.blancoHueso, padding: '20px',
  };
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white', padding: '40px', borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '450px',
  };
  const titleStyle: React.CSSProperties = { textAlign: 'center', marginBottom: '8px', color: colors.negroSuave };
  const subtitleStyle: React.CSSProperties = { textAlign: 'center', marginBottom: '32px', color: colors.azulAcero };
  const footerStyle: React.CSSProperties = { marginTop: '24px', textAlign: 'center' };
  const linkStyle: React.CSSProperties = { color: colors.doradoClasico, textDecoration: 'none', fontWeight: 500 };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Crear Cuenta</h1>
        <p style={subtitleStyle}>Únete a la experiencia Carlyn</p>

        <form onSubmit={handleSubmit}>
          <Input label="Nombre Completo" type="text" placeholder="Ej. Juan Pérez"
            value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} required icon={faUser} />
          <Input label="Correo Electrónico" type="email" placeholder="tu@email.com"
            value={correoElectronico} onChange={(e) => setCorreoElectronico(e.target.value)} required icon={faEnvelope} />
          <Input label="Teléfono (opcional)" type="tel" placeholder="Ej. 7821234567"
            value={telefono} onChange={(e) => setTelefono(e.target.value)} icon={faPhone} />
          <Input label="Contraseña" type="password" placeholder="Mínimo 6 caracteres"
            value={contrasena} onChange={(e) => setContrasena(e.target.value)} required icon={faLock} />
          <Input label="Confirmar Contraseña" type="password" placeholder="********"
            value={confirmarContrasena} onChange={(e) => setConfirmarContrasena(e.target.value)} required icon={faCheck} />

          {/* localError = validaciones del form | errors = errores del backend */}
          {(localError || errors) && (
            <p style={{ color: colors.error, marginBottom: '16px' }}>{localError || errors}</p>
          )}

          <Button type="submit" variant="accent" fullWidth disabled={loading}>
            {loading ? 'Creando cuenta...' : (
              <><FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '8px' }} />Registrarse</>
            )}
          </Button>
        </form>

        <div style={footerStyle}>
          <p>¿Ya tienes cuenta?{' '}<Link to="/login" style={linkStyle}>Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
};