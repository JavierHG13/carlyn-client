const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

export const getDateOnlyKey = (value: string | Date | null | undefined): string => {
  if (!value) return '';

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return '';

    return [
      value.getFullYear(),
      String(value.getMonth() + 1).padStart(2, '0'),
      String(value.getDate()).padStart(2, '0'),
    ].join('-');
  }

  const rawValue = String(value);
  const match = rawValue.match(DATE_ONLY_PATTERN);

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) return '';

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
};

export const parseDateOnlyLocal = (value: string | Date | null | undefined): Date | null => {
  const key = getDateOnlyKey(value);
  if (!key) return null;

  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const parseAppointmentDateTimeLocal = (
  fecha: string | Date | null | undefined,
  hora: string | null | undefined,
): Date | null => {
  const key = getDateOnlyKey(fecha);
  if (!key) return null;

  const [year, month, day] = key.split('-').map(Number);
  const [hours = 0, minutes = 0, seconds = 0] = String(hora || '00:00:00')
    .split(':')
    .map((part) => Number(part));

  return new Date(year, month - 1, day, hours || 0, minutes || 0, seconds || 0);
};

export const formatDateOnly = (
  value: string | Date | null | undefined,
  locale = 'es-MX',
  options?: Intl.DateTimeFormatOptions,
): string => {
  const date = parseDateOnlyLocal(value);
  if (!date) return '';

  return date.toLocaleDateString(locale, options);
};
