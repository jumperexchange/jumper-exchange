import { useMemo } from 'react';
import {
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isBefore,
} from 'date-fns';
import { useTranslation } from 'react-i18next';

export const useMissionTimeStatus = (
  publishedAt: string,
  endsAt: string,
  sensitivity = 5,
) => {
  const { t } = useTranslation();

  return useMemo(() => {
    const now = new Date();
    const publishedDate = parseISO(publishedAt);
    const endsDate = parseISO(endsAt);

    if (isBefore(now, publishedDate)) {
      return {
        status: t('missions.status.upcoming'),
        isDisabled: true,
      };
    }

    const daysSincePublished = differenceInDays(now, publishedDate);

    if (daysSincePublished < sensitivity) {
      return {
        status: t('missions.status.new'),
        isDisabled: false,
      };
    }

    if (isBefore(now, endsDate)) {
      const daysLeft = differenceInDays(endsDate, now);
      const hoursLeft = differenceInHours(endsDate, now);
      const minutesLeft = differenceInMinutes(endsDate, now);

      if (minutesLeft < 60) {
        return {
          status: t('missions.status.minutesLeft', { count: minutesLeft }),
          isDisabled: false,
        };
      } else if (hoursLeft < 24) {
        return {
          status: t('missions.status.hoursLeft', { count: hoursLeft }),
          isDisabled: false,
        };
      } else if (daysLeft <= sensitivity) {
        return {
          status: t('missions.status.daysLeft', { count: daysLeft }),
          isDisabled: false,
        };
      }
    }

    return {
      status: undefined,
      isDisabled: false,
    };
  }, [t, publishedAt, endsAt, sensitivity]);
};
