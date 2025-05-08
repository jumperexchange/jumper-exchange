'use client';

import { useEffect, useRef, useState } from 'react';

export type UnicornSceneProps = {
  projectId?: string;
  jsonFilePath?: string;
  scale?: number;
  dpi?: number;
  fps?: number;
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
  lazyLoad = false,
  isMobile = false,
}: UnicornSceneProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ destroy: () => void } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scriptId = useRef(`us-data-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const initializeScript = (callback: () => void) => {
      const version = '1.4.19';

      const existingScript = document.querySelector(
        'script[src^="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js"]',
      );

      if (existingScript) {
        if ((window as Window & { UnicornStudio?: unknown }).UnicornStudio) {
          callback();
        } else {
          existingScript.addEventListener('load', callback);
        }
        return;
      }

      const script = document.createElement('script');
      script.src = `https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v${version}/dist/unicornStudio.umd.js`;
      script.async = true;

      script.onload = () => {
        callback();
      };
      script.onerror = () => setError('Failed to load UnicornStudio script');

      document.body.appendChild(script);
    };

    const initializeScene = async () => {
      if (!elementRef.current) {
        return;
      }

      if (jsonFilePath) {
        elementRef.current.setAttribute(
          'data-us-project-src',
          `${jsonFilePath}`,
        );
      } else if (projectId) {
        const [cleanProjectId, query] = projectId.split('?');
        const production = query?.includes('production');

        elementRef.current.setAttribute('data-us-project', cleanProjectId);

        if (production) {
          elementRef.current.setAttribute('data-us-production', '1');
        }
      } else {
        throw new Error('No project ID or JSON file path provided');
      }

      interface UnicornStudioType {
        init: (config: { scale: number; dpi: number }) => Promise<
          Array<{
            element: HTMLElement;
            destroy: () => void;
            contains?: (element: HTMLElement | null) => boolean;
          }>
        >;
      }

      const UnicornStudio = (
        window as Window & { UnicornStudio?: UnicornStudioType }
      ).UnicornStudio;

      if (!UnicornStudio) {
        throw new Error('UnicornStudio not found');
      }

      if (sceneRef.current?.destroy) {
        sceneRef.current.destroy();
      }

      await UnicornStudio?.init({
        scale,
        dpi,
      }).then((scenes) => {
        const ourScene = scenes.find(
          (scene) =>
            scene.element === elementRef.current ||
            scene.element.contains(elementRef.current),
        );
        if (ourScene) {
          sceneRef.current = ourScene;
        }
      });
    };

    initializeScript(() => {
      void initializeScene();
    });

    return () => {
      if (sceneRef.current?.destroy) {
        sceneRef.current.destroy();
        sceneRef.current = null;
      }
      if (jsonFilePath) {
        const script = document.getElementById(scriptId.current);
        script?.remove();
      }
    };
  }, [projectId, jsonFilePath, scale, dpi]);

  return (
    <div
      ref={elementRef}
      style={{
        height: isMobile ? '250px' : '500px',
        width: isMobile ? '100%' : '120%',
      }}
      role="img"
      aria-label={ariaLabel}
      data-us-dpi={dpi}
      data-us-scale={scale}
      data-us-fps={fps}
      data-us-disablemobile
      data-us-alttext={altText}
      data-us-arialabel={ariaLabel}
      data-us-production={true}
      data-us-lazyload={lazyLoad ? 'true' : ''}
    >
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
