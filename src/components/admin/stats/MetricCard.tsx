import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { colors } from '../../../styles/colors';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  color?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = colors.doradoClasico,
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
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

  const titleStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#718096',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    color: colors.negroSuave,
    marginBottom: '8px',
  };

  const trendStyle: React.CSSProperties = {
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: trend?.positive ? '#10B981' : '#EF4444',
  };

  return (
    <div style={cardStyle}>
      <div style={iconContainerStyle}>
        <FontAwesomeIcon icon={icon} style={iconStyle} />
      </div>
      <div style={titleStyle}>{title}</div>
      <div style={valueStyle}>{value}</div>
      {trend && (
        <div style={trendStyle}>
          <span>{trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
          <span style={{ color: '#718096' }}>{trend.label}</span>
        </div>
      )}
    </div>
  );
};