"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Portfolio_styles_1 = require("@/components/Portfolio/Portfolio.styles");
var TokenImage_1 = require("@/components/Portfolio/TokenImage");
var useMainPaths_1 = require("@/hooks/useMainPaths");
var widgetCache_1 = require("@/stores/widgetCache");
var material_1 = require("@mui/material");
var navigation_1 = require("next/navigation");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("src/stores/menu");
function PortfolioTokenChainButton(_a) {
    var _b;
    var token = _a.token;
    var setFrom = (0, widgetCache_1.useWidgetCacheStore)(function (state) { return state.setFrom; });
    var setWalletMenuState = (0, menu_1.useMenuStore)(function (state) { return state; }).setWalletMenuState;
    var isMainPaths = (0, useMainPaths_1.useMainPaths)().isMainPaths;
    var router = (0, navigation_1.useRouter)();
    // const { lng } = useParams();
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<material_1.ButtonBase onClick={function () {
            setFrom(token.address, token.chainId);
            setWalletMenuState(false);
            if (!isMainPaths) {
                router.push('/');
            }
        }} sx={function (theme) { return ({
            width: '100%',
            paddingLeft: '20px',
            paddingRight: '16px',
            paddingY: '16px',
            display: 'flex',
            '&:hover': {
                backgroundColor: theme.palette.mode === 'light'
                    ? (0, material_1.darken)(theme.palette.surface2.main, 0.04)
                    : (0, material_1.lighten)(theme.palette.surface2.main, 0.04),
            },
            '&:last-child:hover': {
                borderRadius: '0 0 16px 16px',
                backgroundColor: theme.palette.mode === 'light'
                    ? (0, material_1.darken)(theme.palette.surface2.main, 0.04)
                    : (0, material_1.darken)(theme.palette.surface2.main, 0.04),
            },
        }); }}>
      <material_1.Grid container display="flex" alignItems="center">
        <material_1.Grid textAlign="left" size={2}>
          <material_1.Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={<Portfolio_styles_1.SmallAvatar>
                <TokenImage_1.default token={{
                logoURI: token.chainLogoURI,
                name: (_b = token.chainName) !== null && _b !== void 0 ? _b : '',
            }}/>
              </Portfolio_styles_1.SmallAvatar>}>
            <material_1.Avatar sx={{ width: 32, height: 32 }}>
              <TokenImage_1.default token={token}/>
            </material_1.Avatar>
          </material_1.Badge>
        </material_1.Grid>
        <material_1.Grid textAlign="left" size={5}>
          <Portfolio_styles_1.TypographyPrimary sx={{ fontSize: '0.875rem', lineHeight: '1.125rem' }}>
            {token.symbol}
          </Portfolio_styles_1.TypographyPrimary>
          <Portfolio_styles_1.TypographySecondary sx={{ fontSize: '0.625rem', lineHeight: '0.875rem' }}>
            {token.chainName}
          </Portfolio_styles_1.TypographySecondary>
        </material_1.Grid>
        <material_1.Grid style={{ textAlign: 'right' }} size={5}>
          <Portfolio_styles_1.TypographyPrimary sx={{
            fontWeight: 600,
            fontSize: '0.875rem',
            lineHeight: '1.125rem',
        }}>
            {t('format.decimal', { value: token.cumulatedBalance })}
          </Portfolio_styles_1.TypographyPrimary>
          <Portfolio_styles_1.TypographySecondary sx={{
            fontSize: '0.625rem',
            lineHeight: '0.875rem',
        }}>
            {t('format.currency', { value: token.totalPriceUSD })}
          </Portfolio_styles_1.TypographySecondary>
        </material_1.Grid>
      </material_1.Grid>
    </material_1.ButtonBase>);
}
exports.default = PortfolioTokenChainButton;
