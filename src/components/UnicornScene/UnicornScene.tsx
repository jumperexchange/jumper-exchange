'use client';

import UnicornStudioScene from 'unicornstudio-react/next';

export type UnicornSceneProps = {
  projectId?: string;
  jsonFilePath?: string;
  scale?: number;
  dpi?: number;
  fps?: 15 | 24 | 30 | 60 | 120;
  altText?: string;
  ariaLabel?: string;
  className?: string;
  lazyLoad?: boolean;
  isMobile?: boolean;
};

export default function UnicornScene({
  projectId,
  jsonFilePath,
  scale = 1,
  dpi = 1.5,
  fps = 60,
  altText = 'Unicorn Scene',
  ariaLabel = altText,
  className,
  lazyLoad = false,
  isMobile = false,
}: UnicornSceneProps) {
  // Legacy callers pass production mode as a `?production` query suffix on the
  // project id (e.g. `KYcHAuC2qNJRwg7ors66?production`). The new SDK takes a
  // boolean prop, so split it back out here.
  let resolvedProjectId = projectId;
  let production = true;
  if (projectId) {
    const [cleanProjectId, query] = projectId.split('?');
    resolvedProjectId = cleanProjectId;
    production = query?.includes('production') ?? false;
  }

  return (
    <div
      style={{
        height: isMobile ? '400px' : '500px',
        width: isMobile ? '160%' : '120%',
        marginTop: isMobile ? '-20%' : '0',
      }}
    >
      <UnicornStudioScene
        projectId={resolvedProjectId}
        jsonFilePath={jsonFilePath}
        scale={scale}
        dpi={dpi}
        fps={fps}
        altText={altText}
        ariaLabel={ariaLabel}
        className={className}
        lazyLoad={lazyLoad}
        production={production}
        width="100%"
        height="100%"
      />
    </div>
  );
}
