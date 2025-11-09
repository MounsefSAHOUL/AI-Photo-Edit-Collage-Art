import {i18n} from '@/i18n/i18n';
import {Linking} from 'react-native';

export const handleOpenTerms = () => {
  Linking.openURL(
    'https://portfolio-must-ai-generator.vercel.app/terms-conditions',
  ).catch(error => console.warn('Failed to open terms link', error));
};

export const handleOpenPrivacy = () => {
  Linking.openURL(
    'https://portfolio-must-ai-generator.vercel.app/privacy-policy',
  ).catch(error => console.warn('Failed to open privacy link', error));
};

export const disclaimerSegments = (locale: any) => {
  const text = i18n.t('messages.onboardingDisclaimer', {locale});
  const regex = /\[(.+?)\]/g;
  const segments: {type: 'text' | 'terms' | 'privacy'; value: string}[] = [];
  let lastIndex = 0;
  let matchIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        value: text.slice(lastIndex, match.index),
      });
    }
    const type = matchIndex === 0 ? 'terms' : 'privacy';
    segments.push({type, value: match[1]});
    lastIndex = regex.lastIndex;
    matchIndex += 1;
  }

  if (lastIndex < text.length) {
    segments.push({type: 'text', value: text.slice(lastIndex)});
  }

  return segments;
};

export const formatDate = (d: Date | string | undefined, loc?: string) => {
  if (!d) return '';
  const date =
    typeof d === 'string'
      ? new Date(d)
      : d instanceof Date
      ? d
      : new Date(d as any);

  try {
    // Include short time to reflect the original ISO timestamp
    return new Intl.DateTimeFormat(loc || undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    // Fallback to locale-insensitive toLocaleString
    return date.toLocaleString();
  }
};
