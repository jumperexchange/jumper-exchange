'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.darkTheme = exports.lightTheme = void 0;
var styles_1 = require("@mui/material/styles");
var utils_1 = require("@mui/utils");
var fonts_1 = require("src/fonts/fonts");
var shape = {
    borderRadius: 12,
    borderRadiusSecondary: 8,
};
var themeBase = (0, styles_1.createTheme)({
    cssVariables: false,
});
// in a separate 'createTheme' to allow listening to breakpoints set above
var themeCustomized = (0, styles_1.createTheme)({
    shape: __assign({}, shape),
    components: {
        Background: {
            styleOverrides: {
                // the slot name defined in the `slot` and `overridesResolver` parameters
                // of the `styled` API
                root: function (_a) {
                    var _b;
                    var theme = _a.theme;
                    return (_b = {
                            position: 'fixed',
                            left: 0,
                            bottom: 0,
                            right: 0,
                            top: 0,
                            zIndex: -1,
                            overflow: 'hidden',
                            pointerEvents: 'none',
                            backgroundColor: theme.palette.bg.main
                        },
                        // typed-safe access to the `variant` prop
                        _b[theme.breakpoints.up('sm')] = {
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                        },
                        _b);
                },
            },
        },
        MuiScopedCssBaseline: {
            styleOverrides: {
                root: {
                    fontFamily: "".concat(fonts_1.inter.style.fontFamily, ", Arial, Noto Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, sans-serif"),
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: function () { return ({
                    ':last-of-type': {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                    },
                    boxShadow: 'unset',
                    margin: 0,
                }); },
            },
        },
        MuiSnackbar: {
            styleOverrides: {
                root: function (_a) {
                    var _b;
                    var theme = _a.theme;
                    return (_b = {
                            top: 80
                        },
                        _b[theme.breakpoints.up('sm')] = {
                            top: 80,
                        },
                        _b);
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: function () {
                    var _a;
                    return (_a = {},
                        _a[themeBase.breakpoints.up('lg')] = {
                            maxWidth: 1280,
                        },
                        _a);
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: function (_a) {
                    var theme = _a.theme;
                    return ({
                        backgroundColor: 'rgb(0 0 0 / 64%)',
                        backdropFilter: 'blur(3px)',
                        fontSize: '0.75rem',
                        padding: theme.spacing(1, 1.5),
                    });
                },
                arrow: {
                    color: 'rgb(0 0 0 / 64%)',
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                img: {
                    objectFit: 'contain',
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: function (_a) {
                    var theme = _a.theme;
                    return ({
                        color: theme.palette.text.primary,
                        '&.Mui-focused': {
                            color: theme.palette.text.primary,
                        },
                    });
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                '@supports': { fontVariationSettings: 'normal' },
                body: { scrollBehavior: 'smooth' },
            },
        },
        MuiButton: {
            defaultProps: {
                size: 'large',
            },
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    textTransform: 'none',
                },
                sizeSmall: {
                    height: 32,
                },
                sizeMedium: {
                    height: 40,
                },
                sizeLarge: {
                    height: 48,
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: 'inherit',
                    '&:hover': {
                        color: 'inherit',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #554F4E',
                        },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #554F4E',
                    },
                    '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #554F4E',
                        },
                        '& .MuiFormLabel-root': {
                            color: 'inherit',
                        },
                    },
                },
            },
        },
        MuiTypography: {
            defaultProps: {
                variantMapping: {
                    headerXLarge: 'p',
                    headerLarge: 'p',
                    headerMedium: 'p',
                    headerSmall: 'p',
                    headerXSmall: 'p',
                    bodyXLargeStrong: 'p',
                    bodyXLarge: 'p',
                    bodyLargeStrong: 'p',
                    bodyLarge: 'p',
                    bodyMediumStrong: 'p',
                    bodyMedium: 'p',
                    bodySmallStrong: 'p',
                    bodySmall: 'p',
                    bodyXSmallStrong: 'p',
                    bodyXSmall: 'p',
                    brandHeaderXLarge: 'h1',
                    urbanistTitleLarge: 'p',
                    urbanistTitle2XLarge: 'p',
                    urbanistTitle3XLarge: 'h1',
                    urbanistBodyLarge: 'p',
                    urbanistBodyXLarge: 'p',
                },
            },
        },
    },
    palette: {
        grey: {
            100: '#F6F5FA',
            200: '#ECEBF0',
            300: '#DDDCE0',
            400: '#C9C8CC',
            500: '#9DA1A3',
            600: '#8A8D8F',
            700: '#70767A',
            800: '#4B4F52',
            900: '#000000',
        },
        success: {
            main: '#0AA65B',
            light: '#0AA65B',
            dark: '#0AA65B',
        },
        error: {
            main: '#E5452F',
            light: '#E5452F',
            dark: '#E5452F',
        },
        warning: {
            main: '#FFCC00',
            light: '#FFCC00',
            dark: '#EBC942',
        },
        info: {
            main: '#297EFF',
            light: '#297EFF',
            dark: '#297EFF',
        },
        white: {
            main: '#FFFFFF',
            light: '#FFFFFF',
            dark: '#FFFFFF',
        },
        black: {
            main: '#000000',
            light: '#000000',
            dark: '#000000',
        },
        alphaDark100: {
            main: 'rgba(0, 0, 0, 0.04)',
        },
        alphaDark200: {
            main: 'rgba(0, 0, 0, 0.08)',
        },
        alphaDark300: {
            main: 'rgba(0, 0, 0, 0.12)',
        },
        alphaDark400: {
            main: 'rgba(0, 0, 0, 0.16)',
        },
        alphaDark500: {
            main: 'rgba(0, 0, 0, 0.24)',
        },
        alphaDark600: {
            main: 'rgba(0, 0, 0, 0.32)',
        },
        alphaDark700: {
            main: 'rgba(0, 0, 0, 0.48)',
        },
        alphaDark800: {
            main: 'rgba(0, 0, 0, 0.64)',
        },
        alphaLight100: {
            main: 'rgba(255, 255, 255, 0.04)',
        },
        alphaLight200: {
            main: 'rgba(255, 255, 255, 0.08)',
        },
        alphaLight300: {
            main: 'rgba(255, 255, 255, 0.12)',
        },
        alphaLight400: {
            main: 'rgba(255, 255, 255, 0.16)',
        },
        alphaLight500: {
            main: 'rgba(255, 255, 255, 0.24)',
        },
        alphaLight600: {
            main: 'rgba(255, 255, 255, 0.32)',
        },
        alphaLight700: {
            main: 'rgba(255, 255, 255, 0.48)',
        },
        alphaLight800: {
            main: 'rgba(255, 255, 255, 0.64)',
        },
    },
    typography: {
        fontFamily: [
            fonts_1.inter.style.fontFamily,
            'Arial',
            'Noto Sans',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Helvetica Neue',
            'sans-serif',
        ].join(','),
        headerXLarge: {
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '64px',
            lineHeight: '96px',
            letterSpacing: 0,
        },
        headerLarge: {
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '48px',
            lineHeight: '64px',
            letterSpacing: 0,
        },
        headerMedium: {
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '32px',
            lineHeight: '40px',
            letterSpacing: 0,
        },
        headerSmall: {
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '24px',
            letterSpacing: 0,
        },
        headerXSmall: {
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '24px',
            letterSpacing: 0,
        },
        bodyXLargeStrong: {
            fontStyle: 'normal',
            fontWeight: 800,
            fontSize: '24px',
            lineHeight: '32px',
            letterSpacing: 0,
        },
        bodyXLarge: {
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '24px',
            lineHeight: '32px',
            letterSpacing: 0,
        },
        bodyLargeStrong: {
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '24px',
            letterSpacing: 0,
        },
        bodyLarge: {
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '18px',
            lineHeight: '24px',
            letterSpacing: 0,
        },
        bodyMediumStrong: {
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '20px',
            letterSpacing: 0,
        },
        bodyMedium: {
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '20px',
            letterSpacing: 0,
        },
        bodySmallStrong: {
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '18px',
            letterSpacing: 0,
        },
        bodySmall: {
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: 0,
        },
        bodyXSmallStrong: {
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: 0,
        },
        bodyXSmall: {
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: 0,
        },
        brandHeaderXLarge: {
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '64px',
            lineHeight: '72px',
            letterSpacing: 0,
        },
        titleSmall: {
            fontFamily: fonts_1.inter.style.fontFamily,
            fontSize: '24px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '32px',
        },
        title2XSmall: {
            fontFamily: fonts_1.inter.style.fontFamily,
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '20px',
        },
        titleLarge: {
            fontSize: '48px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '64px',
        },
        titleXSmall: {
            fontFamily: fonts_1.inter.style.fontFamily,
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '24px',
        },
        urbanistTitleXSmall: {
            fontFamily: fonts_1.urbanist.style.fontFamily,
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '24px',
        },
        urbanistTitleLarge: {
            fontFamily: fonts_1.urbanist.style.fontFamily,
            fontSize: '48px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '56px',
        },
        urbanistTitleXLarge: {
            fontFamily: fonts_1.urbanist.style.fontFamily,
            fontSize: '64px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '72px',
        },
        urbanistTitle2XLarge: {
            fontFamily: fonts_1.urbanist.style.fontFamily,
            fontSize: '80px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '96px',
        },
        urbanistTitle3XLarge: {
            fontSize: '96px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '112px',
        },
        urbanistTitleMedium: {
            fontFamily: fonts_1.urbanist.style.fontFamily,
            fontSize: '32px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '40px',
        },
        urbanistBodyLarge: {
            fontFamily: fonts_1.urbanist.style.fontFamily,
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '24px',
        },
        urbanistBodyXLarge: {
            fontFamily: fonts_1.urbanist.style.fontFamily,
            fontSize: '24px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '32px',
        },
        urbanistBody2XLarge: {
            fontFamily: fonts_1.urbanist.style.fontFamily,
            fontSize: '32px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '40px',
        },
        h1: (_a = {
                fontFamily: fonts_1.urbanist.style.fontFamily,
                fontSize: themeBase.typography.pxToRem(48),
                lineHeight: themeBase.typography.pxToRem(64),
                letterSpacing: 'inherit',
                fontWeight: 700
            },
            _a[themeBase.breakpoints.up('sm')] = {
                fontSize: themeBase.typography.pxToRem(64),
                lineHeight: themeBase.typography.pxToRem(72),
            },
            _a),
        h2: {
            fontFamily: fonts_1.urbanist.style.fontFamily,
            fontSize: themeBase.typography.pxToRem(36),
            lineHeight: themeBase.typography.pxToRem(48),
            fontWeight: 700,
        },
        h3: {
            fontFamily: fonts_1.urbanist.style.fontFamily,
            fontSize: themeBase.typography.pxToRem(28),
            lineHeight: themeBase.typography.pxToRem(36),
            fontWeight: 700,
        },
        h4: {
            fontFamily: fonts_1.urbanist.style.fontFamily,
            fontSize: themeBase.typography.pxToRem(22),
            lineHeight: themeBase.typography.pxToRem(28),
            fontWeight: 700,
        },
        h5: {
            fontFamily: fonts_1.urbanist.style.fontFamily,
            fontSize: themeBase.typography.pxToRem(18),
            lineHeight: themeBase.typography.pxToRem(24),
            fontWeight: 700,
        },
        h6: {
            fontFamily: fonts_1.urbanist.style.fontFamily,
            fontSize: themeBase.typography.pxToRem(12),
            lineHeight: themeBase.typography.pxToRem(18),
            fontWeight: 700,
        },
    },
});
var themePreset = (0, styles_1.createTheme)((0, utils_1.deepmerge)(themeBase, themeCustomized));
exports.lightTheme = (0, styles_1.createTheme)((0, utils_1.deepmerge)(themePreset, {
    palette: {
        mode: 'light',
        background: {
            default: '#FCFAFF',
        },
        text: {
            primary: '#000',
            secondary: (0, styles_1.alpha)(themeCustomized.palette.black.main, 0.75),
        },
        grey: {
            300: '#E5E1EB',
        },
        bg: {
            light: '#F3EBFF',
            main: '#F3EBFF',
            dark: '#F3EBFF',
        },
        bgSecondary: {
            main: (0, styles_1.alpha)(themeCustomized.palette.white.main, 0.48),
        },
        bgTertiary: {
            main: themeCustomized.palette.white.main,
        },
        bgQuaternary: {
            hover: (0, styles_1.alpha)('#653BA3', 0.12),
            main: (0, styles_1.alpha)('#31007A', 0.08),
        },
        primary: {
            light: '#31007A',
            main: '#31007A',
            dark: '#290066',
        },
        secondary: {
            light: '#E9E1F5',
            main: '#E9E1F5',
            dark: '#E9E1F5',
        },
        tertiary: {
            light: '#FCEBFF',
            main: '#FCEBFF',
            dark: '#FCEBFF',
        },
        accent1: {
            light: '#31007A',
            main: '#31007A',
            dark: '#31007A',
        },
        accent1Alt: {
            light: '#BEA0EB',
            main: '#BEA0EB',
            dark: '#BEA0EB',
        },
        accent2: {
            light: '#8700B8',
            main: '#8700B8',
            dark: '#8700B8',
        },
        surface1: {
            light: '#faf5ff',
            main: '#faf5ff',
            dark: '#faf5ff',
        },
        surface2: {
            light: '#FFFFFF',
            main: '#FFFFFF',
            dark: '#FFFFFF',
        },
        surface3: {
            light: '#E5E1EB',
            main: '#E5E1EB',
            dark: '#E5E1EB',
        },
        templateBg: {
            light: '#FEF5FF',
            main: '#FEF5FF',
            dark: '#FEF5FF',
        },
        templateOutline: {
            light: '#C95CFF',
            main: '#C95CFF',
            dark: '#C95CFF',
        },
        dataBg: {
            light: '#F5F6FF',
            main: '#F5F6FF',
            dark: '#F5F6FF',
        },
        dataOutline: {
            light: '#7B61FF',
            main: '#7B61FF',
            dark: '#7B61FF',
        },
    },
    shadows: __spreadArray([
        'none',
        '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
        '0px 2px 8px 0px rgba(0, 0, 0, 0.04)'
    ], themeBase.shadows.slice(3), true),
}));
exports.darkTheme = (0, styles_1.createTheme)((0, utils_1.deepmerge)(themePreset, {
    components: {
        Background: {
            styleOverrides: {
                // functions cannot merged because of mui... I know it's bad :(
                root: function (_a) {
                    var _b;
                    var theme = _a.theme;
                    return (_b = {
                            position: 'fixed',
                            left: 0,
                            bottom: 0,
                            right: 0,
                            top: 0,
                            zIndex: -1,
                            overflow: 'hidden',
                            pointerEvents: 'none',
                            backgroundColor: theme.palette.surface1.main
                        },
                        // typed-safe access to the `variant` prop
                        _b[theme.breakpoints.up('sm')] = {
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                        },
                        _b);
                },
            },
        },
    },
    palette: {
        mode: 'dark',
        background: {
            default: '#120F29', //'#241D52',
        },
        text: {
            primary: '#fff',
            secondary: (0, styles_1.alpha)(themeCustomized.palette.white.main, 0.75),
        },
        grey: {
            800: '#302B52',
        },
        bg: {
            light: '#030014',
            main: '#030014',
            dark: '#030014',
        },
        bgSecondary: {
            main: (0, styles_1.alpha)(themeCustomized.palette.white.main, 0.12),
        },
        bgTertiary: {
            main: themeCustomized.palette.alphaLight200.main,
        },
        bgQuaternary: {
            hover: (0, styles_1.alpha)('#653BA3', 0.56),
            main: (0, styles_1.alpha)('#653BA3', 0.42),
        },
        primary: {
            light: '#653BA3',
            main: '#653BA3',
            dark: '#543188',
        },
        secondary: {
            light: '#321D52',
            main: '#321D52',
            dark: '#321D52',
        },
        tertiary: {
            light: '#33163D',
            main: '#33163D',
            dark: '#33163D',
        },
        accent1: {
            light: '#653BA3',
            main: '#653BA3',
            dark: '#653BA3',
        },
        accent1Alt: {
            light: '#BEA0EB',
            main: '#BEA0EB',
            dark: '#BEA0EB',
        },
        accent2: {
            light: '#D35CFF',
            main: '#D35CFF',
            dark: '#D35CFF',
        },
        surface1: {
            light: '#120F29',
            main: '#120F29',
            dark: '#120F29',
        },
        surface2: {
            light: '#24203D',
            main: '#24203D',
            dark: '#24203D',
        },
        surface3: {
            light: '#302B52',
            main: '#302B52',
            dark: '#302B52',
        },
        templateBg: {
            light: '#401946',
            main: '#401946',
            dark: '#401946',
        },
        templateOutline: {
            light: '#D47BEB',
            main: '#D47BEB',
            dark: '#D47BEB',
        },
        dataBg: {
            light: '#28203D',
            main: '#28203D',
            dark: '#28203D',
        },
        dataOutline: {
            light: '#B8ADFF',
            main: '#B8ADFF',
            dark: '#B8ADFF',
        },
    },
    shadows: __spreadArray([
        'none',
        '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
        '0px 2px 8px 0px rgba(0, 0, 0, 0.04)'
    ], themeBase.shadows.slice(3), true),
}));
