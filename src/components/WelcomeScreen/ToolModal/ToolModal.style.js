'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolModaItemlTitle = exports.ToolModalAvatar = exports.ToolModalGrid = exports.ToolModalIconButton = exports.ToolModalTitle = exports.ModalHeader = exports.ModalHeaderAppBar = exports.ModalContent = exports.ModalContainer = void 0;
var material_1 = require("@mui/material");
var styles_1 = require("@mui/material/styles");
exports.ModalContainer = (0, styles_1.styled)(material_1.Box)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            margin: 'auto',
            paddingBottom: theme.spacing(3),
            borderRadius: '12px',
            boxShadow: theme.shadows[1],
            width: "calc( 100% - ".concat(theme.spacing(3), ")"),
            maxWidth: 640,
            maxHeight: '85%',
            overflowY: 'auto',
            background: theme.palette.mode === 'light'
                ? theme.palette.surface1.main
                : theme.palette.surface2.main,
            '&:focus-visible': {
                outline: 0,
            }
        },
        _b[theme.breakpoints.up('md')] = {
            margin: 0,
            width: 640,
        },
        _b);
});
exports.ModalContent = (0, styles_1.styled)(material_1.Grid)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            alignItems: 'center',
            gap: '26px',
            padding: theme.spacing(0, 3),
            justifyContent: 'space-between'
        },
        _b[theme.breakpoints.up('md')] = {
            justifyContent: 'inherit',
        },
        _b);
});
exports.ModalHeaderAppBar = (0, styles_1.styled)(material_1.AppBar)(function (_a) {
    var theme = _a.theme;
    return ({
        zIndex: 1500,
        left: 'initial',
        right: 'initial',
        position: 'sticky',
        color: theme.palette.text.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 48,
        top: 0,
        padding: theme.spacing(1.5, 3),
        backgroundColor: theme.palette.mode === 'light'
            ? (0, styles_1.alpha)(theme.palette.surface1.main, 0.84)
            : (0, styles_1.alpha)(theme.palette.surface2.main, 0.2),
        backdropFilter: 'blur(12px)',
        boxShadow: 'unset',
        backgroundImage: 'unset',
        '@supports ( -moz-appearance:none )': {
            backgroundColor: theme.palette.mode === 'light'
                ? theme.palette.surface1.main
                : theme.palette.surface2.main,
        },
    });
});
exports.ModalHeader = (0, styles_1.styled)(material_1.Box)(function () { return ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
}); });
exports.ToolModalTitle = (0, styles_1.styled)(material_1.Typography)(function () { return ({
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '18px',
    lineHeight: '24px',
    maxWidth: '80%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
}); });
exports.ToolModalIconButton = (0, styles_1.styled)(material_1.IconButton)(function (_a) {
    var theme = _a.theme;
    return ({
        color: theme.palette.text.primary,
        transform: 'translateX(8px)',
    });
});
exports.ToolModalGrid = (0, styles_1.styled)(material_1.Grid)(function () { return ({
    width: 72,
    textAlign: 'center',
}); });
exports.ToolModalAvatar = (0, styles_1.styled)(material_1.Avatar)(function () { return ({
    margin: 'auto',
    height: 48,
    width: 48,
}); });
exports.ToolModaItemlTitle = (0, styles_1.styled)(material_1.Typography)(function (_a) {
    var theme = _a.theme;
    return ({
        color: theme.palette.text.primary,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 72,
        height: 32,
        maxHeight: 32,
        marginTop: theme.spacing(1.5),
    });
});
