"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioSkeletonBox = exports.NoTokenImageBox = exports.PortfolioBox = exports.CustomDivider = exports.Icon = exports.SmallAvatar = exports.CustomAvatarGroup = exports.TypographySecondary = exports.TypographyPrimary = exports.CustomAccordion = exports.VariationValue = exports.TotalValue = void 0;
var material_1 = require("@mui/material");
var styles_1 = require("@mui/material/styles");
exports.TotalValue = (0, material_1.styled)(material_1.Typography)(function (_a) {
    var theme = _a.theme;
    return ({
        color: theme.palette.text.primary,
        textOverflow: 'ellipsis',
        fontWeight: '700',
        fontSize: '48px',
        lineHeight: '64px',
        fontFamily: 'var(--font-inter)',
        userSelect: 'none',
    });
});
exports.VariationValue = (0, material_1.styled)(material_1.Typography)(function (_a) {
    var theme = _a.theme;
    return ({
        textOverflow: 'ellipsis',
        fontWeight: '500',
        fontSize: '0.75rem',
        lineHeight: '16px',
        display: 'flex',
        alignItems: 'center',
    });
});
exports.CustomAccordion = (0, material_1.styled)(material_1.Accordion)(function (_a) {
    var theme = _a.theme;
    return ({
        background: 'transparent',
        border: 0,
        boxShadow: 'none',
        width: '100%',
        '& .MuiAccordionSummary-root': {
            padding: '16px',
            borderRadius: 12,
            '&:hover': {
                backgroundColor: theme.palette.mode === 'light'
                    ? (0, material_1.darken)(theme.palette.surface2.main, 0.04)
                    : (0, styles_1.lighten)(theme.palette.surface2.main, 0.04),
                borderRadius: '16px',
            },
        },
        variants: [
            {
                props: function (_a) {
                    var isExpanded = _a.isExpanded;
                    return isExpanded;
                },
                style: {
                    '& .MuiAccordionSummary-root': {
                        '&:hover': {
                            borderRadius: '16px 16px 0 0',
                        },
                    },
                },
            },
        ],
    });
});
exports.TypographyPrimary = (0, material_1.styled)(material_1.Typography)(function (_a) {
    var theme = _a.theme;
    return ({
        color: theme.palette.text.primary,
        fontSize: '1.125rem',
        fontWeight: 700,
        lineHeight: '1.5rem',
        alignSelf: 'stretch',
    });
});
exports.TypographySecondary = (0, material_1.styled)(material_1.Typography)(function (_a) {
    var theme = _a.theme;
    return ({
        color: theme.palette.text.secondary,
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: '1rem',
    });
});
exports.CustomAvatarGroup = (0, material_1.styled)(material_1.AvatarGroup)(function (_a) {
    var theme = _a.theme;
    return ({
        justifyContent: 'flex-end',
        '& .MuiAvatar-colorDefault': {
            fontSize: '0.4rem',
        },
        '& .MuiAvatar-root': {
            width: 16,
            height: 16,
            border: "2px solid ".concat(theme.palette.surface2.main),
            '&:last-child': {
                marginLeft: '-6px',
            },
        },
    });
});
exports.SmallAvatar = (0, material_1.styled)(material_1.Avatar)(function (_a) {
    var theme = _a.theme;
    return ({
        width: 16,
        height: 16,
        border: "2px solid ".concat(theme.palette.surface2.main),
    });
});
exports.Icon = (0, material_1.styled)(material_1.SvgIcon)(templateObject_1 || (templateObject_1 = __makeTemplateObject([""], [""])));
exports.CustomDivider = (0, material_1.styled)(material_1.Divider)(function (_a) {
    var theme = _a.theme;
    return ({
        backgroundColor: theme.palette.surface2.main,
        opacity: 0.3,
    });
});
exports.PortfolioBox = (0, material_1.styled)(material_1.Box)(function (_a) {
    var theme = _a.theme;
    return ({
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(0, 2),
    });
});
exports.NoTokenImageBox = (0, material_1.styled)(material_1.Box)(function () { return ({
    backgroundColor: 'grey',
    borderRadisu: '50%',
    height: 40,
    width: 40,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
}); });
exports.PortfolioSkeletonBox = (0, material_1.styled)(material_1.Box)(function () { return ({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
}); });
var templateObject_1;
