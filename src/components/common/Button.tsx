// src/components/common/Button.tsx
import { colors } from '../../styles/colors';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  fullWidth = false,
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Lato, sans-serif',
    fontSize: '18px',
    fontWeight: 500,
    transition: 'opacity 0.2s, transform 0.1s',
    width: fullWidth ? '100%' : 'auto',
  };

  const variantStyles = {
    primary: {
      backgroundColor: colors.grafito,
      color: colors.blancoHueso,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: colors.grafito,
      border: `2px solid ${colors.grafito}`,
    },
    accent: {
      backgroundColor: colors.doradoClasico,
      color: colors.blancoHueso,
    },
  };

  const combinedStyle = {
    ...baseStyle,
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button style={combinedStyle} {...props}>
      {children}
    </button>
  );
};