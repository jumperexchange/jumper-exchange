import { Fragment, type ReactElement } from 'react';
import { cl } from '../utils/utils';

export function RevealsBackground({
  className,
  isRare,
}: {
  className?: string;
  isRare?: boolean;
}): ReactElement {
  return (
    <div
      className={cl(
        'absolute left-1/2 top-2/3 -z-10 -translate-y-1/2 -translate-x-1/2 ',
        className,
      )}
    >
      <div className={'absolute left-0 top-0 -z-30 size-full bg-violet-100'} />
      <svg
        style={{ animation: 'spin 40s linear infinite' }}
        width={'8000'}
        height={'8000'}
        viewBox={'0 0 8000 8000'}
        fill={'none'}
        xmlns={'http://www.w3.org/2000/svg'}
      >
        {isRare ? (
          <Fragment>
            <g opacity={'0.2'}>
              <path
                d={'M8000 6929.73L3998.92 3999.98L8000 7800.04V6929.73Z'}
                fill={'url(#paint0_radial_1842_3169)'}
              />
              <path
                d={'M8000 5647.89L3998.92 3999.98L8000 6226.49V5647.89Z'}
                fill={'url(#paint1_radial_1842_3169)'}
              />
              <path
                d={'M8000 4665.74L3998.92 3999.98L8000 5130.33V4665.74Z'}
                fill={'url(#paint2_radial_1842_3169)'}
              />
              <path
                d={'M8000 3783.34L3998.92 3999.98L8000 4216.62V3783.34Z'}
                fill={'url(#paint3_radial_1842_3169)'}
              />
              <path
                d={'M8000 2869.63L3998.92 3999.98L8000 3334.22V2869.63Z'}
                fill={'url(#paint4_radial_1842_3169)'}
              />
              <path
                d={'M8000 1773.48L3998.92 3999.98L8000 2351.99V1773.48Z'}
                fill={'url(#paint5_radial_1842_3169)'}
              />
              <path
                d={'M8000 199.921L3998.92 3999.98L8000 1070.24V199.921Z'}
                fill={'url(#paint6_radial_1842_3169)'}
              />
              <path
                d={
                  'M7199.68 0H6367.96L3998.92 3999.98L5623.84 0H4956L3998.92 3999.98L4310.36 0H3687.44L3998.88 3999.94L3041.84 0H2374L3998.92 3999.94L1629.88 0H798.16L3998.92 3999.94L0 202.119V1071.83L3998.92 3999.98L0 1774.67V2352.91L3998.92 3999.98L0 2870.23V3334.58L3998.92 3999.98L0 3783.46V4216.5L3998.92 3999.98L0 4665.38V5129.73L3998.92 3999.98L0 5646.97V6225.29L3998.92 3999.98L0 6928.13V7797.84L3998.92 3999.98L798.16 7999.96H1629.88L3998.92 4000.02L2374 7999.96H3041.84L3998.92 4000.02L3687.48 7999.96H4310.4L3998.96 4000.02L4956.04 8000H5623.88L3998.96 4000.02L6368 8000H7199.72L3998.96 4000.02L7199.68 0Z'
                }
                fill={'url(#paint7_radial_1842_3169)'}
              />
            </g>
            <defs>
              <radialGradient
                id={'paint0_radial_1842_3169'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop offset={'0.3'} stopColor={'#FFC306'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint1_radial_1842_3169'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop offset={'0.3'} stopColor={'#FFC306'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint2_radial_1842_3169'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop offset={'0.3'} stopColor={'#FFC306'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint3_radial_1842_3169'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop offset={'0.3'} stopColor={'#FFC306'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint4_radial_1842_3169'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop offset={'0.3'} stopColor={'#FFC306'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint5_radial_1842_3169'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop offset={'0.3'} stopColor={'#FFC306'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint6_radial_1842_3169'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop offset={'0.3'} stopColor={'#FFC306'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint7_radial_1842_3169'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop offset={'0.3'} stopColor={'#FFC306'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
            </defs>
          </Fragment>
        ) : (
          <Fragment>
            <path
              d={'M8000 6929.73L3998.92 3999.98L8000 7800.04V6929.73Z'}
              fill={'url(#paint0_radial_1842_3170)'}
            />
            <path
              d={'M8000 5647.89L3998.92 3999.98L8000 6226.49V5647.89Z'}
              fill={'url(#paint1_radial_1842_3170)'}
            />
            <path
              d={'M8000 4665.74L3998.92 3999.98L8000 5130.33V4665.74Z'}
              fill={'url(#paint2_radial_1842_3170)'}
            />
            <path
              d={'M8000 3783.34L3998.92 3999.98L8000 4216.62V3783.34Z'}
              fill={'url(#paint3_radial_1842_3170)'}
            />
            <path
              d={'M8000 2869.63L3998.92 3999.98L8000 3334.22V2869.63Z'}
              fill={'url(#paint4_radial_1842_3170)'}
            />
            <path
              d={'M8000 1773.48L3998.92 3999.98L8000 2351.99V1773.48Z'}
              fill={'url(#paint5_radial_1842_3170)'}
            />
            <path
              d={'M8000 199.921L3998.92 3999.98L8000 1070.24V199.921Z'}
              fill={'url(#paint6_radial_1842_3170)'}
            />
            <path
              d={
                'M7199.68 0H6367.96L3998.92 3999.98L5623.84 0H4956L3998.92 3999.98L4310.36 0H3687.44L3998.88 3999.94L3041.84 0H2374L3998.92 3999.94L1629.88 0H798.16L3998.92 3999.94L0 202.119V1071.83L3998.92 3999.98L0 1774.67V2352.91L3998.92 3999.98L0 2870.23V3334.58L3998.92 3999.98L0 3783.46V4216.5L3998.92 3999.98L0 4665.38V5129.73L3998.92 3999.98L0 5646.97V6225.29L3998.92 3999.98L0 6928.13V7797.84L3998.92 3999.98L798.16 7999.96H1629.88L3998.92 4000.02L2374 7999.96H3041.84L3998.92 4000.02L3687.48 7999.96H4310.4L3998.96 4000.02L4956.04 8000H5623.88L3998.96 4000.02L6368 8000H7199.72L3998.96 4000.02L7199.68 0Z'
              }
              fill={'url(#paint7_radial_1842_3170)'}
            />
            <defs>
              <radialGradient
                id={'paint0_radial_1842_3170'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop stopColor={'#28065F'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint1_radial_1842_3170'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop stopColor={'#28065F'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint2_radial_1842_3170'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop stopColor={'#28065F'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint3_radial_1842_3170'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop stopColor={'#28065F'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint4_radial_1842_3170'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop stopColor={'#28065F'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint5_radial_1842_3170'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop stopColor={'#28065F'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint6_radial_1842_3170'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop stopColor={'#28065F'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
              <radialGradient
                id={'paint7_radial_1842_3170'}
                cx={'0'}
                cy={'0'}
                r={'1'}
                gradientUnits={'userSpaceOnUse'}
                gradientTransform={
                  'translate(4000 4000) rotate(90) scale(4000 4000)'
                }
              >
                <stop stopColor={'#28065F'} />
                <stop offset={'1'} stopColor={'#1B1036'} />
              </radialGradient>
            </defs>
          </Fragment>
        )}
      </svg>
    </div>
  );
}
