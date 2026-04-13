import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock, faUser, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/colors';

interface RegisterFormInputs {
    nombreCompleto: string;
    correoElectronico: string;
    telefono: string;
    contrasena: string;
    confirmPassword: string;
}

const schema = yup.object({
    nombreCompleto: yup.string()
        .required('El nombre completo es obligatorio')
        .min(3, 'El nombre debe tener al menos 3 caracteres'),
    correoElectronico: yup.string()
        .email('Correo electrónico inválido')
        .required('El correo electrónico es obligatorio'),
    telefono: yup.string()
        .matches(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos'),
    contrasena: yup.string()
        .required('La contraseña es obligatoria')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('contrasena')], 'Las contraseñas no coinciden')
        .required('Debes confirmar tu contraseña'),
});

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register: registerUser, errors: authErrors, loading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);
    const [localError, setLocalError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormInputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: RegisterFormInputs) => {
        setLocalError('');

        if (!acceptTerms) {
            setLocalError('Debes aceptar los términos y condiciones');
            return;
        }

        if (!acceptPrivacy) {
            setLocalError('Debes aceptar el aviso de privacidad');
            return;
        }

        try {
            await registerUser({
                nombreCompleto: data.nombreCompleto,
                correoElectronico: data.correoElectronico,
                telefono: data.telefono,
                contrasena: data.contrasena,
            });
            // La navegación se maneja en el contexto después del registro exitoso
        } catch (err) {
            // El error ya se maneja en el contexto
        }
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
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
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
        alignItems: 'flex-start',
        gap: '8px',
        marginBottom: '16px',
    };

    const checkboxStyle: React.CSSProperties = {
        width: '16px',
        height: '16px',
        cursor: 'pointer',
        marginTop: '2px',
    };

    const linkStyle: React.CSSProperties = {
        color: colors.doradoClasico,
        textDecoration: 'none',
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
        marginTop: '16px',
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

    const footerStyle: React.CSSProperties = {
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#718096',
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h1 style={titleStyle}>Crear Cuenta</h1>
                <p style={subtitleStyle}>Únete a la experiencia Carlyn</p>

                {(localError || authErrors) && (
                    <div style={errorAlertStyle}>
                        {localError || authErrors}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Nombre Completo</label>
                        <div style={inputContainerStyle}>
                            <FontAwesomeIcon icon={faUser} style={inputIconStyle} />
                            <input
                                type="text"
                                style={inputStyle(!!errors.nombreCompleto)}
                                placeholder="Ej. Juan Pérez"
                                {...register('nombreCompleto')}
                            />
                        </div>
                        {errors.nombreCompleto && <p style={errorTextStyle}>{errors.nombreCompleto.message}</p>}
                    </div>

                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Correo Electrónico</label>
                        <div style={inputContainerStyle}>
                            <FontAwesomeIcon icon={faEnvelope} style={inputIconStyle} />
                            <input
                                type="email"
                                style={inputStyle(!!errors.correoElectronico)}
                                placeholder="tu@email.com"
                                {...register('correoElectronico')}
                            />
                        </div>
                        {errors.correoElectronico && <p style={errorTextStyle}>{errors.correoElectronico.message}</p>}
                    </div>

                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Teléfono (opcional)</label>
                        <div style={inputContainerStyle}>
                            <FontAwesomeIcon icon={faPhone} style={inputIconStyle} />
                            <input
                                type="tel"
                                style={inputStyle(!!errors.telefono)}
                                placeholder="Ej. 7821234567"
                                {...register('telefono')}
                            />
                        </div>
                        {errors.telefono && <p style={errorTextStyle}>{errors.telefono.message}</p>}
                    </div>

                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Contraseña</label>
                        <div style={inputContainerStyle}>
                            <FontAwesomeIcon icon={faLock} style={inputIconStyle} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                style={inputStyle(!!errors.contrasena)}
                                placeholder="Mínimo 6 caracteres"
                                {...register('contrasena')}
                            />
                            <button
                                type="button"
                                style={togglePasswordStyle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {errors.contrasena && <p style={errorTextStyle}>{errors.contrasena.message}</p>}
                    </div>

                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Confirmar Contraseña</label>
                        <div style={inputContainerStyle}>
                            <FontAwesomeIcon icon={faLock} style={inputIconStyle} />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                style={inputStyle(!!errors.confirmPassword)}
                                placeholder="********"
                                {...register('confirmPassword')}
                            />
                            <button
                                type="button"
                                style={togglePasswordStyle}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {errors.confirmPassword && <p style={errorTextStyle}>{errors.confirmPassword.message}</p>}
                    </div>

                    <div style={checkboxContainerStyle}>
                        <input
                            type="checkbox"
                            style={checkboxStyle}
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                        />
                        <span style={{ fontSize: '13px', color: '#718096' }}>
                            Acepto los{' '}
                            <Link to="/terminos" style={linkStyle}>términos y condiciones</Link>
                        </span>
                    </div>

                    <div style={checkboxContainerStyle}>
                        <input
                            type="checkbox"
                            style={checkboxStyle}
                            checked={acceptPrivacy}
                            onChange={(e) => setAcceptPrivacy(e.target.checked)}
                        />
                        <span style={{ fontSize: '13px', color: '#718096' }}>
                            Acepto el{' '}
                            <Link to="/privacidad" style={linkStyle}>aviso de privacidad</Link>
                        </span>
                    </div>

                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <div style={footerStyle}>
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" style={linkStyle}>Inicia sesión aquí</Link>
                </div>
            </div>
        </div>
    );
};