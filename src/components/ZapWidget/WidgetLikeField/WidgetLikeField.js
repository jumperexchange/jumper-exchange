"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var wallet_management_1 = require("@lifi/wallet-management");
var material_1 = require("@mui/material");
var ethers_1 = require("ethers");
var React = require("react");
var react_1 = require("react");
var ConnectButton_1 = require("src/components/ConnectButton");
var TxConfirmation_1 = require("src/components/ZapWidget/Confirmation/TxConfirmation");
var wagmi_1 = require("wagmi");
var WidgetEndAdornment_1 = require("./WidgetEndAdornment");
var WidgetLikeField_style_1 = require("./WidgetLikeField.style");
var useChains_1 = require("@/hooks/useChains");
var userTracking_1 = require("@/hooks/userTracking");
var trackingKeys_1 = require("src/const/trackingKeys");
var useToken_1 = require("@/hooks/useToken");
var WidgetStartAdornment_1 = require("@/components/ZapWidget/WidgetLikeField/WidgetStartAdornment");
function WidgetLikeField(_a) {
    var _this = this;
    var _b, _c, _d, _e;
    var contractCalls = _a.contractCalls, label = _a.label, image = _a.image, placeholder = _a.placeholder, _f = _a.hasMaxButton, hasMaxButton = _f === void 0 ? true : _f, helperText = _a.helperText, token = _a.token, _g = _a.overrideStyle, overrideStyle = _g === void 0 ? {} : _g, balance = _a.balance, projectData = _a.projectData, writeDecimals = _a.writeDecimals, refetch = _a.refetch;
    var trackEvent = (0, userTracking_1.useUserTracking)().trackEvent;
    var chains = (0, useChains_1.useChains)();
    var chain = (0, react_1.useMemo)(function () { return chains.getChainById(projectData === null || projectData === void 0 ? void 0 : projectData.chainId); }, [projectData === null || projectData === void 0 ? void 0 : projectData.chainId]);
    var wagmiConfig = (0, wagmi_1.useConfig)();
    var account = (0, wallet_management_1.useAccount)().account;
    var switchChainAsync = (0, wagmi_1.useSwitchChain)().switchChainAsync;
    var _h = (0, wagmi_1.useWriteContract)(), writeContract = _h.writeContract, data = _h.data, isPending = _h.isPending, isError = _h.isError, error = _h.error, isSuccessWriteContract = _h.isSuccess;
    var tokenInfo = (0, useToken_1.useToken)(token.chainId, token.address).token;
    var _j = (0, react_1.useState)(''), value = _j[0], setValue = _j[1];
    var tokenUSDAmount = (0, react_1.useMemo)(function () {
        if (!value || !(tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.priceUSD)) {
            return '0';
        }
        return (parseFloat(tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.priceUSD) * parseFloat(value)).toString();
    }, [value, tokenInfo]);
    var _k = (0, wagmi_1.useWaitForTransactionReceipt)({
        chainId: projectData === null || projectData === void 0 ? void 0 : projectData.chainId,
        hash: data,
        confirmations: 5,
        pollingInterval: 1000,
    }), transactionReceiptData = _k.data, isLoading = _k.isLoading, isSuccess = _k.isSuccess;
    // When the transaction is done, triggering the refetch
    (0, react_1.useEffect)(function () {
        var _a;
        if (!isSuccess) {
            return;
        }
        setValue('');
        refetch();
        trackEvent({
            category: trackingKeys_1.TrackingCategory.WidgetEvent,
            action: 'zap_withdraw',
            label: 'execution_success',
            data: {
                protocol_name: projectData.integrator,
                chain_id: token.chainId,
                withdrawn_token: token.address,
                amount_withdrawn: value !== null && value !== void 0 ? value : 'NA',
                amount_withdrawn_usd: parseFloat(value !== null && value !== void 0 ? value : '0') * parseFloat((_a = tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.priceUSD) !== null && _a !== void 0 ? _a : '0'),
                timestamp: new Date(),
            }, // Shortcut
            isConversion: true,
        });
    }, [transactionReceiptData]);
    var shouldSwitchChain = (0, react_1.useMemo)(function () {
        if (!!(projectData === null || projectData === void 0 ? void 0 : projectData.address) && (account === null || account === void 0 ? void 0 : account.chainId) !== (projectData === null || projectData === void 0 ? void 0 : projectData.chainId)) {
            return true;
        }
        return false;
    }, [account === null || account === void 0 ? void 0 : account.chainId, projectData]);
    var handleInputChange = function (e) {
        var inputValue = e.target.value;
        // Only allow numbers and one decimal point
        if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
            setValue(inputValue);
        }
    };
    function onSubmit(e) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    e.preventDefault();
                    writeContract({
                        address: ((projectData === null || projectData === void 0 ? void 0 : projectData.withdrawAddress) ||
                            (projectData === null || projectData === void 0 ? void 0 : projectData.address)),
                        chainId: projectData === null || projectData === void 0 ? void 0 : projectData.chainId,
                        functionName: 'redeem',
                        abi: [
                            {
                                inputs: [{ name: 'amount', type: 'uint256' }],
                                name: 'redeem',
                                outputs: [{ name: '', type: 'uint256' }],
                                stateMutability: 'nonpayable',
                                type: 'function',
                            },
                        ],
                        args: [(0, ethers_1.parseUnits)(value, writeDecimals)],
                    });
                }
                catch (e) {
                    console.error(e);
                }
                return [2 /*return*/];
            });
        });
    }
    var hasErrorText = (0, react_1.useMemo)(function () {
        var _a;
        if (balance && ((_a = parseFloat(value)) !== null && _a !== void 0 ? _a : 0) > parseFloat(balance)) {
            return "You have not enough tokens. Current balance: ".concat(balance, ".");
        }
        if (error === null || error === void 0 ? void 0 : error.message) {
            return "An error occurred during the execution: ".concat(error === null || error === void 0 ? void 0 : error.name, ". Please check your wallet.");
        }
        return null;
    }, [value, balance, error]);
    var handleSwitchChain = function (chainId) { return __awaiter(_this, void 0, void 0, function () {
        var id, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, switchChainAsync({
                            chainId: chainId,
                        })];
                case 1:
                    id = (_a.sent()).id;
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<material_1.Grid container justifyContent={'center'}>
      <material_1.Grid p={3} bgcolor={'#fff'} borderRadius={1} sx={function (theme) { return ({
            backgroundColor: theme.palette.surface1.main,
            padding: theme.spacing(2, 3),
        }); }} size={{
            xs: 12,
            md: 12
        }}>
        <material_1.Box component="form" sx={{
            display: 'flex',
            flexDirection: 'column',
        }} noValidate autoComplete="off" onSubmit={onSubmit}>
          <material_1.InputLabel htmlFor="component" sx={{ marginBottom: 2 }}>
            <material_1.Typography variant="titleSmall">{label}</material_1.Typography>
          </material_1.InputLabel>
          <WidgetLikeField_style_1.CustomFormControl variant="standard" aria-autocomplete="none" sx={{
            display: 'flex',
            flexDirection: 'row',
        }}>
            <WidgetStartAdornment_1.default tokenUSDAmount={tokenUSDAmount} image={image}/>
            <material_1.Stack spacing={2} direction="column">
              <material_1.Input autoComplete="off" id="component" value={value} onChange={handleInputChange} placeholder={placeholder} disabled={isPending || isLoading} aria-describedby="withdraw-component-text" disableUnderline={true}/>
              <material_1.FormHelperText id="withdraw-component-text" sx={function (theme) { return ({
            marginLeft: "".concat(theme.spacing(2), "!important"),
            marginTop: '0!important', // There's an override of that property into the main theme, !important cannot be removed yet
        }); }}>
                <material_1.Typography variant="bodyXSmall" color="textSecondary" component="span" sx={{
            color: '#bbbbbb',
        }}>
                  {tokenUSDAmount
            ? Intl.NumberFormat('en-US', {
                style: 'currency',
                notation: 'compact',
                currency: 'USD',
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: parseFloat(tokenUSDAmount) > 2 ? 2 : 4,
            }).format(parseFloat(tokenUSDAmount))
            : 'NA'}
                </material_1.Typography>
              </material_1.FormHelperText>
            </material_1.Stack>
            {!!(account === null || account === void 0 ? void 0 : account.isConnected) && !!balance && parseFloat(balance) > 0 && (<WidgetEndAdornment_1.default balance={balance} mainColor={overrideStyle === null || overrideStyle === void 0 ? void 0 : overrideStyle.mainColor} setValue={setValue}/>)}
          </WidgetLikeField_style_1.CustomFormControl>
          {hasErrorText && (<WidgetLikeField_style_1.WidgetFormHelperText>{hasErrorText}</WidgetLikeField_style_1.WidgetFormHelperText>)}

          {!(account === null || account === void 0 ? void 0 : account.isConnected) ? (<ConnectButton_1.ConnectButton sx={function (theme) { return ({ marginTop: theme.spacing(2) }); }}/>) : shouldSwitchChain ? (<material_1.Button sx={function (theme) { return ({ marginTop: theme.spacing(2) }); }} type="button" variant="contained" onClick={function () { return handleSwitchChain(projectData === null || projectData === void 0 ? void 0 : projectData.chainId); }}>
              <material_1.Typography variant="bodyMediumStrong">Switch chain</material_1.Typography>
            </material_1.Button>) : (<material_1.Button type="submit" loading={isPending || isLoading} disabled={balance === '0' || isPending} variant="contained" sx={function (theme) {
                var _a;
                var _b, _c;
                return (_a = {
                        marginTop: theme.spacing(2),
                        borderColor: (0, material_1.alpha)(theme.palette.surface2.main, 0.08)
                    },
                    _a["&.".concat(material_1.buttonClasses.loading)] = {
                        border: "1px solid ".concat((_b = overrideStyle === null || overrideStyle === void 0 ? void 0 : overrideStyle.mainColor) !== null && _b !== void 0 ? _b : theme.palette.primary.main),
                    },
                    _a["&.".concat(material_1.buttonClasses.loadingIndicator)] = {
                        color: (_c = overrideStyle === null || overrideStyle === void 0 ? void 0 : overrideStyle.mainColor) !== null && _c !== void 0 ? _c : theme.palette.primary.main,
                    },
                    _a);
            }}>
              <material_1.Typography variant="bodyMediumStrong">
                {contractCalls[0].label}
              </material_1.Typography>
            </material_1.Button>)}

          {isSuccess && (<TxConfirmation_1.TxConfirmation s={'Withdraw successful'} link={"".concat((_c = (_b = chain === null || chain === void 0 ? void 0 : chain.metamask.blockExplorerUrls) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : 'https://etherscan.io/', "tx/").concat(data)} success={!!isSuccessWriteContract && !isPending ? true : false}/>)}

          {!isSuccess && data && (<TxConfirmation_1.TxConfirmation s={'Check on explorer'} link={"".concat((_e = (_d = chain === null || chain === void 0 ? void 0 : chain.metamask.blockExplorerUrls) === null || _d === void 0 ? void 0 : _d[0]) !== null && _e !== void 0 ? _e : 'https://etherscan.io/', "tx/").concat(data)} success={false}/>)}
        </material_1.Box>
      </material_1.Grid>
    </material_1.Grid>);
}
exports.default = WidgetLikeField;
