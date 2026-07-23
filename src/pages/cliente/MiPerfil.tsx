import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faPhone,
  faSave,
  faUser,
  faImage,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { colors } from '../../styles/colors';

export const MiPerfil: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [foto, setFoto] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setNombre(user.nombre || '');
    setTelefono(user.telefono || '');
    setFoto(user.foto || '');
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (nombre.trim().length < 3) {
      setError('Tu nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (telefono && !/^[0-9]{10}$/.test(telefono)) {
      setError('El teléfono debe tener 10 dígitos.');
      return;
    }

    try {
      setSaving(true);
      const updated = await profileService.update({
        nombre: nombre.trim(),
        telefono: telefono.trim() || undefined,
        foto: foto.trim() || undefined,
      });
      updateUser(updated);
      setMessage('Perfil actualizado correctamente.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'No pudimos actualizar tu perfil.');
    } finally {
      setSaving(false);
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.blancoHueso,
    padding: '42px 20px',
  };

  const wrapStyle: React.CSSProperties = {
    maxWidth: 920,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: 22,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    border: '1px solid #EDF2F7',
    borderRadius: 8,
    padding: 24,
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: colors.azulAcero,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 7,
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: 18,
  };

  const buttonStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: 8,
    padding: '12px 18px',
    backgroundColor: colors.doradoClasico,
    color: 'white',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  };

  return (
    <main style={pageStyle}>
      <div style={wrapStyle}>
        <aside style={cardStyle}>
          <div style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            backgroundColor: colors.doradoClasico,
            display: 'grid',
            placeItems: 'center',
            color: 'white',
            fontSize: 38,
            fontWeight: 800,
            marginBottom: 16,
            overflow: 'hidden',
          }}>
            {foto ? (
              <img src={foto} alt={nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              nombre.charAt(0).toUpperCase() || <FontAwesomeIcon icon={faUser} />
            )}
          </div>
          <h1 style={{ margin: 0, color: colors.negroSuave, fontSize: 24 }}>{user?.nombre}</h1>
          <p style={{ color: '#718096', marginTop: 6 }}>{user?.rol}</p>
          <div style={{ display: 'grid', gap: 10, marginTop: 20, color: '#475569', fontSize: 14 }}>
            <span><FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8, color: colors.doradoClasico }} />{user?.email}</span>
            <span><FontAwesomeIcon icon={faPhone} style={{ marginRight: 8, color: colors.doradoClasico }} />{user?.telefono || 'Sin teléfono'}</span>
          </div>
        </aside>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0, color: colors.negroSuave }}>Mi perfil</h2>
          <p style={{ color: '#718096', marginBottom: 24 }}>
            Mantén tus datos actualizados para que podamos contactarte sobre tus citas.
          </p>

          {message && <div style={{ backgroundColor: '#D1FAE5', color: '#047857', padding: 12, borderRadius: 8, marginBottom: 16 }}>{message}</div>}
          {error && <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: 12, borderRadius: 8, marginBottom: 16 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Nombre completo</label>
              <input style={inputStyle} value={nombre} onChange={(event) => setNombre(event.target.value)} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Correo electrónico</label>
              <input style={{ ...inputStyle, backgroundColor: '#F8FAFC', color: '#718096' }} value={user?.email || ''} disabled />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Teléfono</label>
              <input style={inputStyle} value={telefono} onChange={(event) => setTelefono(event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10 dígitos" />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Foto URL</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ display: 'grid', placeItems: 'center', color: colors.doradoClasico }}>
                  <FontAwesomeIcon icon={faImage} />
                </span>
                <input style={inputStyle} value={foto} onChange={(event) => setFoto(event.target.value)} placeholder="https://..." />
              </div>
            </div>

            <button type="submit" style={buttonStyle} disabled={saving}>
              <FontAwesomeIcon icon={saving ? faSpinner : faSave} spin={saving} />
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};
