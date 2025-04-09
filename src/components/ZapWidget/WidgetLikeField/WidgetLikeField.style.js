"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetFormHelperText = exports.CustomFormControl = exports.WidgetLikeGrid = exports.MaxButton = void 0;
var material_1 = require("@mui/material");
exports.MaxButton = (0, material_1.styled)(material_1.Button, {
    shouldForwardProp: function (prop) { return prop !== 'mainColor'; },
})(function (_a) {
    var theme = _a.theme, mainColor = _a.mainColor;
    return ({
        padding: theme.spacing(0.5, 1, 0.625, 1),
        lineHeight: 1.0715,
        fontSize: '0.875rem',
        minWidth: 'unset',
        height: 'auto',
        color: '#fff',
        backgroundColor: mainColor !== null && mainColor !== void 0 ? mainColor : (0, material_1.alpha)(mainColor !== null && mainColor !== void 0 ? mainColor : theme.palette.primary.main, 0.75),
        '&:hover': {
            backgroundColor: mainColor !== null && mainColor !== void 0 ? mainColor : theme.palette.primary.main,
        },
    });
});
exports.WidgetLikeGrid = (0, material_1.styled)(material_1.Grid)(function (_a) {
    var theme = _a.theme;
    return ({
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '16px',
        justifyContent: 'space-between',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
        border: "1px solid ".concat((0, material_1.alpha)(theme.palette.white.main, 0.08)),
        gap: '8px',
        backgroundColor: theme.palette.surface2.main,
        boxShadow: theme.palette.mode === 'light'
            ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
            : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
    });
});
exports.CustomFormControl = (0, material_1.styled)(material_1.FormControl)(function (_a) {
    var theme = _a.theme;
    return ({
        borderRadius: theme.spacing(2),
        padding: '16px',
        backgroundColor: theme.palette.surface2.main,
        border: "1px solid ".concat(theme.palette.mode === 'light' ? '#E5E1EB' : '#302B52'),
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'flex-start',
        alignItems: 'center',
        '& input': {
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: '36px',
            marginLeft: '12px',
            padding: 0,
            height: '1em',
        },
        '& input::placeholder': {
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: '36px',
            marginLeft: '8px',
        },
        '& .MuiInput-underline:before': { borderBottom: 'none' },
        '& .MuiInput-underline:after': { borderBottom: 'none' },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: 'none',
        },
    });
});
exports.WidgetFormHelperText = (0, material_1.styled)(material_1.FormHelperText)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 1,
            color: 'red'
        },
        _b[theme.breakpoints.down('md')] = {
            maxWidth: 316,
        },
        _b[theme.breakpoints.up('md')] = {
            maxWidth: '100%',
        },
        _b);
});
