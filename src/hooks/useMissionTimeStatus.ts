import { useMemo } from 'react';
import {
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isBefore,
} from 'date-fns';
const { useTranslation } = require('react-i18next');

export const useMissionTimeStatus = (
  publishedAt: string,
  endsAt: string,
  sensitivity = 5,
) => {
  const { t } = useTranslation();

  const missionTimeStatus = useMemo(() => {
    const now = new Date();
    const publishedDate = parseISO(publishedAt);
    const endsDate = parseISO(endsAt);

    if (isBefore(now, publishedDate)) {
      return t('missions.status.upcoming');
    }

    const daysSincePublished = differenceInDays(now, publishedDate);

    if (daysSincePublished < sensitivity) {
      return t('missions.status.new');
    }

    if (isBefore(now, endsDate)) {
      const daysLeft = differenceInDays(endsDate, now);
      const hoursLeft = differenceInHours(endsDate, now);
      const minutesLeft = differenceInMinutes(endsDate, now);

      if (minutesLeft < 60) {
        return t('missions.status.minutesLeft', { count: minutesLeft });
      } else if (hoursLeft < 24) {
        return t('missions.status.hoursLeft', { count: hoursLeft });
      } else if (daysLeft <= sensitivity) {
        return t('missions.status.daysLeft', { count: daysLeft });
      }
    }
  }, [t, publishedAt, endsAt, sensitivity]);

  return missionTimeStatus;
};
