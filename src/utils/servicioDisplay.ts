import type { Servicio } from '../types/servicio';

const fallbackImages = [
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&h=650&q=80',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&h=650&q=80',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&h=650&q=80',
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&h=650&q=80',
];

export const formatPrice = (precio: number | string) =>
  Number(precio || 0).toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

export const getServiceDisplayName = (nombre: string) => {
  const match = nombre.match(/^(Paquete\s+\d+)\s*-\s*(.+)$/i);
  if (!match) {
    return {
      label: 'Servicio',
      title: nombre,
    };
  }

  return {
    label: match[1],
    title: match[2],
  };
};

export const getServiceImage = (servicio: Servicio, index = 0) =>
  servicio.imagen_url || fallbackImages[index % fallbackImages.length];

export const getServiceCategory = (servicio: Servicio) => {
  if (servicio.categoria) return servicio.categoria;

  const source = `${servicio.nombre} ${servicio.descripcion || ''}`.toLowerCase();
  if (source.includes('barba')) return 'Barba';
  if (source.includes('facial') || source.includes('mascarilla') || source.includes('exfoliacion')) return 'Facial';
  if (source.includes('premium') || source.includes('experiencia')) return 'Premium';
  return 'Corte';
};

export const getServiceBenefits = (descripcion?: string | null) => {
  if (!descripcion) return [];
  return descripcion
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
};
