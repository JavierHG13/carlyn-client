// src/components/common/Input.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { colors } from '../../styles/colors';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: IconDefinition; // Cambiamos el tipo a IconDefinition de Font Awesome
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  id,
  style,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const containerStyle: React.CSSProperties = {
    marginBottom: '16px',
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontFamily: 'Lato, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    color: colors.azulAcero,
  };

  const inputWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${error ? colors.error : colors.azulAcero}`,
    borderRadius: '4px',
    backgroundColor: colors.blancoHueso,
    transition: 'border-color 0.2s',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: 'none',
    outline: 'none',
    fontFamily: 'Lato, sans-serif',
    fontSize: '16px',
    backgroundColor: 'transparent',
    color: colors.negroSuave,
  };

  const iconStyle: React.CSSProperties = {
    padding: '0 8px 0 12px',
    display: 'flex',
    alignItems: 'center',
    color: colors.azulAcero,
  };

  const errorStyle: React.CSSProperties = {
    marginTop: '4px',
    fontSize: '14px',
    color: colors.error,
  };

  return (
    <div style={containerStyle}>
      {label && <label htmlFor={inputId} style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        {icon && (
          <span style={iconStyle}>
            <FontAwesomeIcon icon={icon} style={{ fontSize: '16px' }} />
          </span>
        )}
        <input id={inputId} style={inputStyle} {...props} />
      </div>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};