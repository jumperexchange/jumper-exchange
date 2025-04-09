"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generateKey_1 = require("@/app/lib/generateKey");
var Menus_1 = require("@/components/Menus");
var WalletCard_style_1 = require("@/components/Menus/WalletMenu/WalletCard.style");
var Portfolio_styles_1 = require("@/components/Portfolio/Portfolio.styles");
var PortfolioTokenChainButton_1 = require("@/components/Portfolio/PortfolioTokenChainButton");
var TokenImage_1 = require("@/components/Portfolio/TokenImage");
var useMainPaths_1 = require("@/hooks/useMainPaths");
var widgetCache_1 = require("@/stores/widgetCache");
var material_1 = require("@mui/material");
var AccordionSummary_1 = require("@mui/material/AccordionSummary");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("src/stores/menu");
var stringLenShortener_1 = require("src/utils/stringLenShortener");
var PortfolioDivider_1 = require("./PortfolioDivider");
function PortfolioToken(_a) {
    var _b, _c, _d;
    var token = _a.token;
    var _e = (0, react_1.useState)(false), isExpanded = _e[0], setExpanded = _e[1];
    var t = (0, react_i18next_1.useTranslation)().t;
    var isMainPaths = (0, useMainPaths_1.useMainPaths)().isMainPaths;
    var router = (0, navigation_1.useRouter)();
    var setFrom = (0, widgetCache_1.useWidgetCacheStore)(function (state) { return state.setFrom; });
    var setWalletMenuState = (0, menu_1.useMenuStore)(function (state) { return state; }).setWalletMenuState;
    var theme = (0, material_1.useTheme)();
    var hasMultipleChains = token.chains.length > 1;
    var handleChange = function (_, expanded) {
        if (!hasMultipleChains) {
            setFrom(token.address, token.chainId);
            setWalletMenuState(false);
            if (!isMainPaths) {
                router.push('/');
            }
            return;
        }
        setExpanded(expanded);
    };
    return (<Menus_1.WalletCardContainer sx={function (theme) {
            var _a;
            return (_a = {
                    padding: 0
                },
                _a[theme.breakpoints.up('sm')] = {
                    padding: 0,
                },
                _a[theme.breakpoints.up('md')] = {
                    padding: 0,
                },
                _a);
        }}>
      <Portfolio_styles_1.CustomAccordion expanded={isExpanded} disableGutters onChange={handleChange}>
        <AccordionSummary_1.default sx={{
            padding: 0,
            '& .MuiAccordionSummary-content': {
                margin: 0,
            },
        }}>
          <material_1.Grid container display="flex" alignItems="center">
            <material_1.Grid size={2}>
              {hasMultipleChains ? (<material_1.Avatar>
                  <TokenImage_1.default token={token}/>
                </material_1.Avatar>) : (<WalletCard_style_1.WalletCardBadge overlap="circular" className="badge" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={!hasMultipleChains ? (<material_1.Avatar alt={(token === null || token === void 0 ? void 0 : token.chainName) || 'chain-name'} sx={function (theme) { return ({
                    width: '18px',
                    height: '18px',
                    border: "2px solid ".concat(theme.palette.surface2.main),
                }); }}>
                        <TokenImage_1.default token={{
                    name: (_b = token.chainName) !== null && _b !== void 0 ? _b : '',
                    logoURI: token.chainLogoURI,
                }}/>
                      </material_1.Avatar>) : (<material_1.Skeleton variant="circular"/>)}>
                  <WalletCard_style_1.WalletAvatar>
                    <TokenImage_1.default token={token}/>
                  </WalletCard_style_1.WalletAvatar>
                </WalletCard_style_1.WalletCardBadge>)}
            </material_1.Grid>
            <material_1.Grid size={5}>
              <Portfolio_styles_1.TypographyPrimary>
                {(0, stringLenShortener_1.stringLenShortener)(token.symbol, 8)}
              </Portfolio_styles_1.TypographyPrimary>
              {!hasMultipleChains ? (<Portfolio_styles_1.TypographySecondary>
                  {(0, stringLenShortener_1.stringLenShortener)((_d = (_c = token.chains) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.name, 18)}
                </Portfolio_styles_1.TypographySecondary>) : (<Portfolio_styles_1.CustomAvatarGroup spacing={6} max={15}>
                  {token.chains.map(function (chain) {
                var _a;
                return (<material_1.Tooltip title={chain.name} key={"".concat(token.symbol, "-").concat(chain.address, "-").concat(chain.chainId)}>
                      <material_1.Avatar alt={chain.chainName} sx={{ width: '12px', height: '12px' }}>
                        <TokenImage_1.default token={{
                        name: (_a = chain.chainName) !== null && _a !== void 0 ? _a : '',
                        logoURI: chain.chainLogoURI,
                    }}/>
                      </material_1.Avatar>
                    </material_1.Tooltip>);
            })}
                </Portfolio_styles_1.CustomAvatarGroup>)}
            </material_1.Grid>
            <material_1.Grid style={{ textAlign: 'right' }} size={5}>
              <Portfolio_styles_1.TypographyPrimary>
                {t('format.decimal', { value: token.cumulatedBalance })}
              </Portfolio_styles_1.TypographyPrimary>
              <Portfolio_styles_1.TypographySecondary>
                {t('format.currency', { value: token.cumulatedTotalUSD })}
              </Portfolio_styles_1.TypographySecondary>
            </material_1.Grid>
          </material_1.Grid>
        </AccordionSummary_1.default>
        <material_1.AccordionDetails sx={{
            margin: 0,
            padding: 0,
        }}>
          <material_1.Box sx={{
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
        }}>
            <PortfolioDivider_1.PortfolioDivider />
            {token.chains.map(function (tokenWithChain) { return (<PortfolioTokenChainButton_1.default key={(0, generateKey_1.default)(tokenWithChain.address)} token={tokenWithChain}/>); })}
          </material_1.Box>
        </material_1.AccordionDetails>
      </Portfolio_styles_1.CustomAccordion>
    </Menus_1.WalletCardContainer>);
}
exports.default = (0, react_1.memo)(PortfolioToken);
