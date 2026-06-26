import { useEffect, useState } from 'react';
import { addons, types, useGlobals } from 'storybook/manager-api';
import {
  loadStorybookPartnerThemes,
  type PartnerThemeToolbarItem,
} from './loadStorybookPartnerThemes.ts';
import { NO_PARTNER_THEME_UID } from './partnerThemeConstants.ts';

const ADDON_ID = 'partner-theme-toolbar';

const defaultItems: PartnerThemeToolbarItem[] = [
  { value: NO_PARTNER_THEME_UID, title: 'None' },
];

const PartnerThemeTool = () => {
  const [{ partnerTheme }, updateGlobals] = useGlobals();
  const [items, setItems] = useState(defaultItems);

  useEffect(() => {
    void loadStorybookPartnerThemes().then(setItems);
  }, []);

  const selected = (partnerTheme as string | undefined) ?? NO_PARTNER_THEME_UID;

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        marginInline: 4,
      }}
    >
      <span aria-hidden style={{ opacity: 0.8 }}>
        🖌
      </span>
      <select
        aria-label="Partner theme"
        value={selected}
        onChange={(event) =>
          updateGlobals({ partnerTheme: event.target.value })
        }
        style={{ maxWidth: 160 }}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.title}
          </option>
        ))}
      </select>
    </label>
  );
};

addons.register(ADDON_ID, () => {
  addons.add(`${ADDON_ID}/tool`, {
    type: types.TOOL,
    title: 'Partner theme',
    match: ({ viewMode }) => viewMode === 'story',
    render: PartnerThemeTool,
  });
});
