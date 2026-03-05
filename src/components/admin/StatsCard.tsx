import React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colors } from '../../styles/colors';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
  change?: number;
  changeLabel?: string;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  color = colors.doradoClasico,
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    border: '1px solid #EDF2F7',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '24px',
    color: color,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    color: colors.negroSuave,
    marginBottom: '4px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '8px',
  };

  const changeStyle: React.CSSProperties = {
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const positiveChangeStyle = { color: '#10B981' };
  const negativeChangeStyle = { color: '#EF4444' };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
      }}
    >
      <div style={iconContainerStyle}>
        <FontAwesomeIcon icon={icon} style={iconStyle} />
      </div>
      <div style={titleStyle}>{title}</div>
      <div style={valueStyle}>{value}</div>
      {change !== undefined && (
        <div style={changeStyle}>
          <span style={change >= 0 ? positiveChangeStyle : negativeChangeStyle}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          <span style={{ color: '#718096' }}>{changeLabel || 'vs mes anterior'}</span>
        </div>
      )}
    </div>
  );
};