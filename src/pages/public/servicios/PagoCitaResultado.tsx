import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCircleExclamation,
  faClock,
  faCreditCard,
  faMapMarkerAlt,
  faPrint,
  faSpinner,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { paymentService } from '../../../services/paymentService';
import type { Cita } from '../../../types/citas';
import { colors } from '../../../styles/colors';

type ResultState = 'loading' | 'success' | 'pending' | 'error';

export const PagoCitaResultado: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<ResultState>('loading');
  const [message, setMessage] = useState('Validando tu pago con Mercado Pago...');
  const [cita, setCita] = useState<Cita | null>(null);
  const [pendingDraft, setPendingDraft] = useState<any>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
      const status = searchParams.get('status') || searchParams.get('collection_status');
      const draftRaw = sessionStorage.getItem('carlyn_pending_appointment');
      if (draftRaw) {
        try {
          setPendingDraft(JSON.parse(draftRaw));
        } catch {
          setPendingDraft(null);
        }
      }

      if (!paymentId) {
        setState(status === 'pending' ? 'pending' : 'error');
        setMessage('No recibimos un identificador de pago para confirmar la cita.');
        return;
      }

      if (status && !['approved', 'pending', 'in_process'].includes(status)) {
        setState('error');
        setMessage('El pago no fue aprobado. Tu cita aún no quedó reservada.');
        return;
      }

      try {
        const confirmation = await paymentService.confirmAppointmentPayment(paymentId);
        setCita(confirmation.data);
        setState('success');
        setMessage('Tu anticipo fue aprobado y tu cita quedó reservada.');
        sessionStorage.removeItem('carlyn_pending_appointment');
      } catch (err: any) {
        if (err.response?.status === 202) {
          setState('pending');
          setMessage('Tu pago está pendiente. Cuando sea aprobado podremos confirmar la cita.');
          return;
        }
        setState('error');
        setMessage(err.response?.data?.message || 'No pudimos confirmar el pago de la cita.');
      }
    };

    confirmPayment();
  }, [searchParams]);

  const icon =
    state === 'loading' ? faSpinner :
    state === 'success' ? faCalendarCheck :
    faCircleExclamation;

  const iconColor =
    state === 'success' ? colors.verdeJade :
    state === 'pending' ? colors.advertencia :
    state === 'error' ? colors.error :
    colors.doradoClasico;

  return (
    <main style={containerStyle}>
      <section style={cardStyle}>
        <FontAwesomeIcon
          icon={icon}
          spin={state === 'loading'}
          style={{ fontSize: 48, color: iconColor }}
        />
        <h1 style={titleStyle}>
          {state === 'success' ? 'Cita confirmada' : state === 'pending' ? 'Pago pendiente' : state === 'error' ? 'No se confirmó la cita' : 'Confirmando pago'}
        </h1>
        <p style={textStyle}>{message}</p>

        {state === 'success' && cita && (
          <div style={receiptStyle}>
            <div style={receiptHeaderStyle}>
              <strong>Comprobante de reservación</strong>
              <span>Folio #{cita.id}</span>
            </div>
            <ReceiptRow label="Servicio" value={cita.servicio_nombre} />
            <ReceiptRow label="Barbero" value={cita.barbero_nombre} icon={faUserTie} />
            <ReceiptRow label="Sucursal" value={cita.local_nombre || 'Barbería Carlyn'} detail={cita.local_direccion || undefined} icon={faMapMarkerAlt} />
            <ReceiptRow label="Fecha y hora" value={`${formatDate(cita.fecha)} · ${cita.hora_inicio.slice(0, 5)} hrs`} icon={faClock} />
            <ReceiptRow label="Anticipo pagado" value={`$${Number(cita.monto_pagado || 0).toFixed(2)}`} detail={`Restante: $${Math.max(0, Number(cita.servicio_precio || 0) - Number(cita.monto_pagado || 0)).toFixed(2)}`} icon={faCreditCard} />
          </div>
        )}

        {state !== 'success' && pendingDraft && (
          <div style={receiptStyle}>
            <div style={receiptHeaderStyle}>
              <strong>Tu selección</strong>
              <span>Pendiente</span>
            </div>
            <ReceiptRow label="Servicio" value={pendingDraft.servicio?.nombre || 'Servicio seleccionado'} />
            <ReceiptRow label="Sucursal" value={pendingDraft.local?.nombre || 'Sucursal'} />
            <ReceiptRow label="Fecha y hora" value={`${pendingDraft.fecha || ''} · ${pendingDraft.hora || ''}`} />
            <ReceiptRow label="Anticipo" value={`$${Number(pendingDraft.anticipo || 0).toFixed(2)}`} />
          </div>
        )}

        <div style={actionsStyle}>
          {state === 'success' && (
            <button type="button" style={buttonStyle} onClick={() => navigate('/mis-citas', { state: { success: true, citaId: cita?.id } })}>
              Ver mis citas
            </button>
          )}
          {state === 'success' && cita && (
            <button type="button" style={secondaryButtonStyle} onClick={() => window.print()}>
              <FontAwesomeIcon icon={faPrint} style={{ marginRight: 8 }} />
              Imprimir comprobante
            </button>
          )}
          {state !== 'loading' && state !== 'success' && pendingDraft?.url && (
            <button type="button" style={buttonStyle} onClick={() => navigate(pendingDraft.url)}>
              Reintentar pago
            </button>
          )}
          {state !== 'loading' && (
            <button type="button" style={secondaryButtonStyle} onClick={() => navigate('/servicios')}>
              Volver a servicios
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

const formatDate = (fecha: string) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const ReceiptRow = ({ label, value, detail, icon }: { label: string; value: string; detail?: string; icon?: any }) => (
  <div style={receiptRowStyle}>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#AAB6C2' }}>
      {icon && <FontAwesomeIcon icon={icon} style={{ color: colors.doradoClasico }} />}
      <span>{label}</span>
    </div>
    <div style={{ textAlign: 'right' }}>
      <strong>{value}</strong>
      {detail && <small style={{ display: 'block', color: '#AAB6C2', marginTop: 3 }}>{detail}</small>}
    </div>
  </div>
);

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#0A0F14',
  display: 'grid',
  placeItems: 'center',
  padding: 24,
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 520,
  backgroundColor: '#11181F',
  border: '1px solid rgba(212, 175, 55, 0.18)',
  borderRadius: 8,
  padding: 34,
  textAlign: 'center',
  color: colors.blancoHueso,
};

const titleStyle: React.CSSProperties = {
  margin: '18px 0 10px',
  fontSize: 28,
};

const textStyle: React.CSSProperties = {
  color: '#AAB6C2',
  lineHeight: 1.6,
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginTop: 24,
};

const receiptStyle: React.CSSProperties = {
  marginTop: 22,
  border: '1px solid rgba(212, 175, 55, 0.2)',
  borderRadius: 8,
  overflow: 'hidden',
  textAlign: 'left',
  backgroundColor: '#151E27',
};

const receiptHeaderStyle: React.CSSProperties = {
  padding: '14px 16px',
  borderBottom: '1px solid rgba(212, 175, 55, 0.16)',
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  color: colors.blancoHueso,
};

const receiptRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 16px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

const buttonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 8,
  padding: '12px 18px',
  backgroundColor: colors.doradoClasico,
  color: '#0A0F14',
  fontWeight: 800,
  cursor: 'pointer',
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: 'transparent',
  color: colors.blancoHueso,
  border: '1px solid rgba(212, 175, 55, 0.28)',
};
