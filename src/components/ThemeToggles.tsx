'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Box } from '@mui/system';

function ThemeToggles() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // The active theme is not available on the server.
  // If you have styling that is conditionally applied based on the active-theme,
  // you have to await the mounted state before rendering the active theme.
  useEffect(() => setMounted(true), [])

  const themeMapping: Record<string, string> = {
    light: 'Default',
    'dark': 'Dark',
  }

  return <></>

  return (
    <Box sx={{
      background: (theme) => theme.palette.primary.main,
      width: 500,
      height: 500
    }}>
      <div className="mt-16 grid grid-cols-3 grid-rows-2 grid-flow-col gap-4">
        {Object.entries(themeMapping).map(([key, value]) => (
          <button
            key={key}
            className={`px-4 py-2 font-semibold rounded-md transition-colors duration-200 ${
              // The theme is only available after the component is mounted.
              mounted && theme == key
                ? 'border border-primary bg-primary-foreground text-primary'
                : 'bg-primary text-primary-foreground'
            }`}
            onClick={() => {
              console.log(`setting theme to ${key}`)
              setTheme(key)
            }}
          >
            {value}
          </button>
        ))}
      </div>
    </Box>
  )
}

export default ThemeToggles
