import {
  ArrowRightOutlined,
  CheckOutlined,
  CompassOutlined,
  DownOutlined,
  ExportOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  LoadingOutlined,
  LoginOutlined,
  SwapOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  NxtpSdk,
  NxtpSdkEvent,
  NxtpSdkEvents,
  SubgraphSyncRecord,
} from "@connext/nxtp-sdk";
import { AuctionResponse, TransactionPreparedEvent } from "@connext/nxtp-utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Col,
  Collapse,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Row,
  Tooltip,
  List,
  Card,
  Typography,
  Descriptions,
  Spin,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import BigNumber from "bignumber.js";
import { providers } from "ethers";
import { createBrowserHistory } from "history";
import QueryString from "qs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import onehiveWordmark from "../../assets/1hive_wordmark.svg";
import connextWordmark from "../../assets/connext_wordmark.png";
import lifiWordmark from "../../assets/lifi_wordmark.svg";
import xpollinateWordmark from "../../assets/xpollinate_wordmark.svg";
import { getBalancesForWalletFromChain } from "../../services/balanceService";
import {
  clearLocalStorage,
  readHideAbout,
  storeHideAbout,
} from "../../services/localStorage";
import { switchChain } from "../../services/metamask";
import {
  finishTransfer,
  getTransferQuote,
  setup,
  triggerTransfer,
} from "../../services/nxtp";
import { deepClone, formatTokenAmountOnly } from "../../services/utils";
import {
  Chain,
  ChainKey,
  ChainPortfolio,
  CrossAction,
  CrossEstimate,
  CrossStep,
  Execution,
  findDefaultCoinOnChain,
  getChainById,
  getChainByKey,
  Token,
  TokenWithAmounts,
  TransferStep,
} from "../../types";
import "../Swap.css";
import SwapForm from "../SwapForm";
import { getRpcProviders, injected } from "../web3/connectors";
import SwappingNxtp from "./SwappingNxtp";
import "./SwapXpollinate.css";
import TransactionsTableNxtp from "./TransactionsTableNxtp";
import TestBalanceOverview from "./TestBalanceOverview";
import { ActiveTransaction, CrosschainTransaction } from "./typesNxtp";

const { Paragraph } = Typography;

const history = createBrowserHistory();

const BALANCES_REFRESH_INTERVAL = 30000;
const DEBOUNCE_TIMEOUT = 800;
const MAINNET_LINK = "https://xpollinate.io";
const TESTNET_LINK = "https://testnet.xpollinate.io";
const DISABLED = false;

const getDefaultParams = (
  search: string,
  transferChains: Chain[],
  transferTokens: { [ChainKey: string]: Array<Token> }
) => {
  const defaultParams = {
    depositChain: transferChains[0].key,
    depositToken: transferTokens[transferChains[0].key][0].id,
    depositAmount: new BigNumber(-1),
    withdrawChain: transferChains[1].key,
    withdrawToken: transferTokens[transferChains[1].key][0].id,
  };

  const params = QueryString.parse(search, { ignoreQueryPrefix: true });

  // fromChain + old: senderChainId
  if (
    (params.fromChain && typeof params.fromChain === "string") ||
    (params.senderChainId && typeof params.senderChainId === "string")
  ) {
    try {
      const newFromChainId = parseInt(
        typeof params.fromChain === "string"
          ? params.fromChain
          : (params.senderChainId as string)
      );
      const newFromChain = transferChains.find(
        (chain) => chain.id === newFromChainId
      );

      if (newFromChain) {
        if (newFromChain.key === defaultParams.withdrawChain) {
          // switch with withdraw chain
          defaultParams.withdrawChain = defaultParams.depositChain;
          defaultParams.withdrawToken = defaultParams.depositToken;
        }

        const foundTokenSymbol = transferTokens[
          defaultParams.depositChain
        ].find((token) => token.id === defaultParams.depositToken)!.symbol;
        defaultParams.depositChain = newFromChain.key;
        defaultParams.depositToken = transferTokens[newFromChain.key].find(
          (token) => token.symbol === foundTokenSymbol
        )!.id;
      }
    } catch (e) {
      console.error(e);
    }
  }

  // fromToken
  if (params.fromToken && typeof params.fromToken === "string") {
    // does token exist?
    const foundToken = transferTokens[defaultParams.depositChain].find(
      (token) => token.id === params.fromToken
    );
    if (foundToken) {
      defaultParams.depositToken = foundToken.id;
      defaultParams.withdrawToken = transferTokens[
        defaultParams.withdrawChain
      ].find((token) => token.symbol === foundToken.symbol)!.id;
    }
  }

  // fromAmount
  if (params.fromAmount && typeof params.fromAmount === "string") {
    try {
      const newAmount = new BigNumber(params.fromAmount);
      if (newAmount.gt(0)) {
        defaultParams.depositAmount = newAmount;
      }
    } catch (e) {
      console.error(e);
    }
  }

  // toChain + old: receiverChainId
  if (
    (params.toChain && typeof params.toChain === "string") ||
    (params.receiverChainId && typeof params.receiverChainId === "string")
  ) {
    try {
      const newToChainId = parseInt(
        typeof params.toChain === "string"
          ? params.toChain
          : (params.receiverChainId as string)
      );
      const newToChain = transferChains.find(
        (chain) => chain.id === newToChainId
      );

      if (newToChain && newToChain.key !== defaultParams.depositChain) {
        // only set if different chain
        const foundTokenSymbol = transferTokens[
          defaultParams.depositChain
        ].find((token) => token.id === defaultParams.depositToken)!.symbol;
        defaultParams.withdrawChain = newToChain.key;
        defaultParams.withdrawToken = transferTokens[newToChain.key].find(
          (token) => token.symbol === foundTokenSymbol
        )!.id;
      }
    } catch (e) {
      console.error(e);
    }
  }

  // toToken
  if (params.toToken && typeof params.toToken === "string") {
    // does token exist?
    const foundToken = transferTokens[defaultParams.withdrawChain].find(
      (token) => token.id === params.toToken
    );
    if (foundToken) {
      defaultParams.withdrawToken = foundToken.id;
      defaultParams.depositToken = transferTokens[
        defaultParams.depositChain
      ].find((token) => token.symbol === foundToken.symbol)!.id;
    }
  }

  // old: assset
  if (params.asset && typeof params.asset === "string") {
    const foundToken = transferTokens[defaultParams.depositChain].find(
      (token) => token.symbol === params.asset
    );
    if (foundToken) {
      defaultParams.depositToken = foundToken.id;
      defaultParams.withdrawToken = transferTokens[
        defaultParams.withdrawChain
      ].find((token) => token.symbol === foundToken.symbol)!.id;
    }
  }

  return defaultParams;
};

function debounce(func: Function, timeout: number = 300) {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

let chainProviders: Record<number, providers.FallbackProvider>;

let startParams: {
  depositChain: ChainKey;
  depositToken: string;
  depositAmount: BigNumber;
  withdrawChain: ChainKey;
  withdrawToken: string;
};

interface SwapXpollinateProps {
  aboutMessage?: React.ReactNode;
  aboutDescription?: React.ReactNode;
  transferChains: Chain[];
  transferTokens: { [ChainKey: string]: Array<Token> };
  testnet?: boolean;
}

const SwapXpollinate = ({
  aboutMessage,
  aboutDescription,
  transferChains,
  transferTokens,
  testnet,
}: SwapXpollinateProps) => {
  // INIT
  startParams =
    startParams ??
    getDefaultParams(history.location.search, transferChains, transferTokens);
  chainProviders =
    chainProviders ?? getRpcProviders(transferChains.map((chain) => chain.id));

  const [stateUpdate, setStateUpdate] = useState<number>(0);
  const [showAbout, setShowAbout] = useState<boolean>(!readHideAbout());

  // Form
  const [depositChain, setDepositChain] = useState<ChainKey>(
    startParams.depositChain
  );
  const [depositAmount, setDepositAmount] = useState<BigNumber>(
    startParams.depositAmount
  );
  const [depositToken, setDepositToken] = useState<string>(
    startParams.depositToken
  );
  const [withdrawChain, setWithdrawChain] = useState<ChainKey>(
    startParams.withdrawChain
  );
  const [withdrawAmount, setWithdrawAmount] = useState<BigNumber>(
    new BigNumber(Infinity)
  );
  const [withdrawToken, setWithdrawToken] = useState<string>(
    startParams.withdrawToken
  );
  const [tokens, setTokens] =
    useState<{ [ChainKey: string]: Array<TokenWithAmounts> }>(transferTokens);
  const [refreshBalances, setRefreshBalances] = useState<number>(1);
  const [balances, setBalances] =
    useState<{ [ChainKey: string]: Array<ChainPortfolio> }>();
  const [updatingBalances, setUpdatingBalances] = useState<boolean>(false);

  // Advanced Options
  const [optionInfiniteApproval, setOptionInfiniteApproval] =
    useState<boolean>(true);
  const [optionReceivingAddress, setOptionReceivingAddress] =
    useState<string>("");
  const [optionContractAddress, setOptionContractAddress] =
    useState<string>("");
  const [optionCallData, setOptionCallData] = useState<string>("");

  // Routes
  const [routeUpdate, setRouteUpdate] = useState<number>(1);
  const [routeRequest, setRouteRequest] = useState<any>();
  const [routeQuote, setRouteQuote] = useState<AuctionResponse>();
  const [routesLoading, setRoutesLoading] = useState<boolean>(false);
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false);
  const [routes, setRoutes] = useState<Array<Array<TransferStep>>>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [executionRoutes, setExecutionRoutes] = useState<
    Array<Array<TransferStep>>
  >([]);
  const [modalRouteIndex, setModalRouteIndex] = useState<number>();

  // nxtp
  const [sdk, setSdk] = useState<NxtpSdk>();
  const [sdkChainId, setSdkChainId] = useState<number>();
  const [sdkAccount, setSdkAccount] = useState<string>();
  const [syncStatus, setSyncStatus] =
    useState<Record<number, SubgraphSyncRecord>>();
  const [activeTransactions, setActiveTransactions] = useState<
    Array<ActiveTransaction>
  >([]);
  const [updatingActiveTransactions, setUpdatingActiveTransactions] =
    useState<boolean>(false);
  const [activeKeyTransactions, setActiveKeyTransactions] =
    useState<string>("");

  // Wallet
  const web3 = useWeb3React<Web3Provider>();
  const { activate, deactivate } = useWeb3React();
  const intervalRef = useRef<NodeJS.Timeout>();

  // update query string
  useEffect(() => {
    const params = {
      fromChain: getChainByKey(depositChain).id,
      fromToken: depositToken,
      toChain: getChainByKey(withdrawChain).id,
      toToken: withdrawToken,
      fromAmount: depositAmount.gt(0) ? depositAmount.toString() : undefined,
    };
    const search = QueryString.stringify(params);
    history.push({
      search,
    });
  }, [depositChain, withdrawChain, depositToken, withdrawToken, depositAmount]);

  // hide about
  useEffect(() => {
    storeHideAbout(!showAbout);
  }, [showAbout]);

  // auto-trigger finish if corresponding modal is opend
  // useEffect(() => {
  //   // is modal open?
  //   if (modalRouteIndex !== undefined) {
  //     const crossEstimate = executionRoutes[modalRouteIndex][0].estimate! as CrossEstimate
  //     const transaction = activeTransactions.find((item) => item.txData.invariant.transactionId === crossEstimate.quote.bid.transactionId)
  //     if (transaction && transaction.status === NxtpSdkEvents.ReceiverTransactionPrepared) {
  //       const route = executionRoutes[modalRouteIndex]
  //       const update = (step: TranferStep, status: Execution) => {
  //         step.execution = status
  //         updateExecutionRoute(route)
  //       }
  //       finishTransfer(sdk!, transaction.event, route[0], update)
  //     }
  //   }
  // }, [modalRouteIndex, executionRoutes, sdk, activeTransactions])

  const updateSyncStatus = useCallback(
    (sdk: NxtpSdk) => {
      const newSyncStatus: { [ChainKey: number]: SubgraphSyncRecord } = {};
      transferChains.forEach((chain) => {
        newSyncStatus[chain.id] = sdk.getSubgraphSyncStatus(chain.id);
      });
      setSyncStatus(newSyncStatus);
    },
    [transferChains]
  );

  // update table helpers
  const updateActiveTransactionsWith = (
    transactionId: string,
    status: NxtpSdkEvent,
    event: any,
    txData?: CrosschainTransaction
  ) => {
    setActiveTransactions((activeTransactions) => {
      // update existing?
      let updated = false;
      const updatedTransactions = activeTransactions.map((item) => {
        if (item.txData.invariant.transactionId === transactionId) {
          if (txData) {
            item.txData = Object.assign({}, item.txData, txData);
          }
          item.status = status;
          item.event = event;
          updated = true;
        }
        return item;
      });

      if (updated) {
        return updatedTransactions;
      } else {
        return [...activeTransactions, { txData: txData!, status, event }];
      }
    });
  };

  const removeActiveTransaction = (transactionId: string) => {
    setActiveTransactions((activeTransactions) => {
      return activeTransactions.filter(
        (t) => t.txData.invariant.transactionId !== transactionId
      );
    });
  };

  useEffect(() => {
    const initializeConnext = async () => {
      if (sdk && sdkChainId === web3.chainId && sdkAccount === web3.account) {
        return sdk;
      }
      if (!web3.library || !web3.account) {
        throw Error("Connect Wallet first.");
      }

      const signer = web3.library.getSigner();
      setSdkChainId(web3.chainId);
      setSdkAccount(web3.account);

      if (sdk) {
        sdk.removeAllListeners();
      }

      const _sdk = await setup(signer, chainProviders);
      setSdk(_sdk);

      // listen to events
      _sdk.attach(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
        updateActiveTransactionsWith(
          data.txData.transactionId,
          NxtpSdkEvents.SenderTransactionPrepared,
          data,
          { invariant: data.txData, sending: data.txData }
        );
        setRefreshBalances((state) => state + 1);
      });

      _sdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, async (data) => {
        updateActiveTransactionsWith(
          data.txData.transactionId,
          NxtpSdkEvents.SenderTransactionFulfilled,
          data,
          { invariant: data.txData, sending: data.txData }
        );
        removeActiveTransaction(data.txData.transactionId);
        setRefreshBalances((state) => state + 1);
      });

      _sdk.attach(NxtpSdkEvents.SenderTransactionCancelled, async (data) => {
        updateActiveTransactionsWith(
          data.txData.transactionId,
          NxtpSdkEvents.SenderTransactionCancelled,
          data,
          { invariant: data.txData, sending: data.txData }
        );
        removeActiveTransaction(data.txData.transactionId);
      });

      _sdk.attach(NxtpSdkEvents.ReceiverPrepareSigned, (data) => {
        updateActiveTransactionsWith(
          data.transactionId,
          NxtpSdkEvents.ReceiverPrepareSigned,
          data
        );
        setActiveKeyTransactions("active");
      });

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
        updateActiveTransactionsWith(
          data.txData.transactionId,
          NxtpSdkEvents.ReceiverTransactionPrepared,
          data,
          { invariant: data.txData, receiving: data.txData }
        );
      });

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionFulfilled, async (data) => {
        updateActiveTransactionsWith(
          data.txData.transactionId,
          NxtpSdkEvents.ReceiverTransactionFulfilled,
          data,
          { invariant: data.txData, receiving: data.txData }
        );
        removeActiveTransaction(data.txData.transactionId);
        setRefreshBalances((state) => state + 1);
      });

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionCancelled, async (data) => {
        updateActiveTransactionsWith(
          data.txData.transactionId,
          NxtpSdkEvents.ReceiverTransactionCancelled,
          data,
          { invariant: data.txData, receiving: data.txData }
        );
        removeActiveTransaction(data.txData.transactionId);
      });

      // get pending transactions
      setUpdatingActiveTransactions(true);
      const transactions = await _sdk.getActiveTransactions();
      for (const transaction of transactions) {
        // merge to txData to be able to pass event to fulfillTransfer
        (transaction as any).txData = {
          ...transaction.crosschainTx.invariant,
          ...(transaction.crosschainTx.receiving ??
            transaction.crosschainTx.sending),
        };
        updateActiveTransactionsWith(
          transaction.crosschainTx.invariant.transactionId,
          transaction.status as NxtpSdkEvent,
          transaction,
          transaction.crosschainTx
        );
      }
      if (transactions.length) {
        setActiveKeyTransactions("active");
      }
      setUpdatingActiveTransactions(false);

      updateSyncStatus(_sdk);

      return _sdk;
    };

    // init only once
    if (
      web3.library &&
      web3.account &&
      ((!sdk && !sdkChainId) || (sdk && sdkChainId))
    ) {
      initializeConnext();
    }

    // deactivate
    if (!web3.account) {
      setHighlightedIndex(-1);
      setActiveTransactions([]);
      setExecutionRoutes([]);
      setSdkChainId(undefined);
      if (sdk) {
        sdk.removeAllListeners();
        sdk.detach();
        setSdk(undefined);
      }
    }
  }, [web3, sdk, sdkChainId, sdkAccount, updateSyncStatus, transferChains]);

  const getSelectedWithdraw = () => {
    if (highlightedIndex === -1) {
      return "...";
    } else {
      const selectedRoute = routes[highlightedIndex];
      const lastStep = selectedRoute[selectedRoute.length - 1];
      if (lastStep.action.type === "withdraw") {
        return formatTokenAmountOnly(
          lastStep.action.token,
          lastStep.estimate?.toAmount
        );
      } else if (lastStep.action.type === "cross") {
        return formatTokenAmountOnly(
          lastStep.action.toToken,
          lastStep.estimate?.toAmount
        );
      } else {
        return "...";
      }
    }
  };

  const updateBalances = useCallback(
    async (address: string) => {
      setUpdatingBalances(true);

      // add gas token
      const token = deepClone(transferTokens);
      Object.entries(token).forEach(async ([chainKey, tokens]) => {
        const chain = getChainByKey(chainKey as ChainKey);
        const gasToken = findDefaultCoinOnChain(chain.coin, chain.key);
        token[chainKey].unshift(gasToken);
      });

      await getBalancesForWalletFromChain(address, token).then(setBalances);
      setUpdatingBalances(false);
    },
    [transferTokens]
  );

  useEffect(() => {
    if (refreshBalances && web3.account) {
      setRefreshBalances((state) => 0);
      updateBalances(web3.account);
    }
  }, [refreshBalances, web3.account, updateBalances]);

  useEffect(() => {
    if (!web3.account) {
      setBalances(undefined); // reset old balances
    } else {
      setRefreshBalances((state) => state + 1);
    }
  }, [web3.account]);

  const getBalance = (chainKey: ChainKey, tokenId: string) => {
    if (!balances) {
      return new BigNumber(0);
    }

    const tokenBalance = balances[chainKey].find(
      (portfolio) => portfolio.id === tokenId
    );

    return tokenBalance?.amount || new BigNumber(0);
  };

  useEffect(() => {
    // merge tokens and balances
    if (!balances) {
      for (const chain of transferChains) {
        for (const token of tokens[chain.key]) {
          token.amount = new BigNumber(-1);
          token.amountRendered = "";
        }
      }
    } else {
      for (const chain of transferChains) {
        for (const token of tokens[chain.key]) {
          token.amount = getBalance(chain.key, token.id);
          token.amountRendered = token.amount.gte(0.0001)
            ? token.amount.toFixed(4)
            : token.amount.toFixed();
        }
      }
    }

    setTokens(tokens);
    setStateUpdate(stateUpdate + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, balances]);

  useEffect(() => {
    intervalRef.current = setInterval(
      () => setRefreshBalances((state) => state + 1),
      BALANCES_REFRESH_INTERVAL
    );

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const hasSufficientBalance = () => {
    if (!depositToken) {
      return true;
    }
    return depositAmount.lte(getBalance(depositChain, depositToken));
  };

  const findToken = useCallback(
    (chainKey: ChainKey, tokenId: string) => {
      const token = tokens[chainKey].find((token) => token.id === tokenId);
      if (!token) {
        throw new Error("Token not found");
      }
      return token;
    },
    [tokens]
  );

  const doRequestAndBidMatch = (request: any, quote: AuctionResponse) => {
    if (
      getChainByKey(request.depositChain).id !== quote.bid.sendingChainId ||
      request.depositToken !== quote.bid.sendingAssetId ||
      getChainByKey(request.withdrawChain).id !== quote.bid.receivingChainId ||
      request.withdrawToken !== quote.bid.receivingAssetId ||
      request.depositAmount !== quote.bid.amount ||
      request.receivingAddress !== quote.bid.receivingAddress
      // || request.callTo !== quote.bid.callTo
      // || request.callData !== quote.bid.callDataHash
    ) {
      return false;
    }

    return true;
  };

  // update request based on UI
  const defineRoute = (
    depositChain: ChainKey,
    depositToken: string,
    withdrawChain: ChainKey,
    withdrawToken: string,
    depositAmount: string,
    receivingAddress: string,
    callTo: string | undefined,
    callData: string | undefined
  ) => {
    setRouteRequest({
      depositChain,
      depositToken,
      withdrawChain,
      withdrawToken,
      depositAmount,
      receivingAddress,
      callTo,
      callData,
    });
  };
  const debouncedSave = useRef(debounce(defineRoute, DEBOUNCE_TIMEOUT)).current;
  const getTransferRoutes = useCallback(async () => {
    setRoutes([]);
    setHighlightedIndex(-1);
    setNoRoutesAvailable(false);

    if (!sdk || !web3.account || !routeUpdate) {
      return;
    }

    if (
      depositAmount.gt(0) &&
      depositChain &&
      depositToken &&
      withdrawChain &&
      withdrawToken
    ) {
      const receiving =
        optionReceivingAddress !== "" ? optionReceivingAddress : web3.account;
      const callTo =
        optionContractAddress !== "" ? optionContractAddress : undefined;
      const callData = optionCallData !== "" ? optionCallData : undefined;
      const dToken = findToken(depositChain, depositToken);
      const dAmount = new BigNumber(depositAmount).shiftedBy(dToken.decimals);
      debouncedSave(
        depositChain,
        depositToken,
        withdrawChain,
        withdrawToken,
        dAmount.toFixed(0),
        receiving,
        callTo,
        callData
      );
    }
  }, [
    depositAmount,
    depositChain,
    depositToken,
    withdrawChain,
    withdrawToken,
    web3,
    sdk,
    optionReceivingAddress,
    optionContractAddress,
    optionCallData,
    debouncedSave,
    findToken,
    routeUpdate,
  ]);
  useEffect(() => {
    getTransferRoutes();
  }, [getTransferRoutes]);

  // route generation if needed
  const generateRoutes = useCallback(
    async (
      sdk: NxtpSdk,
      depositChain: ChainKey,
      depositToken: string,
      withdrawChain: ChainKey,
      withdrawToken: string,
      depositAmount: string,
      receivingAddress: string,
      callTo: string | undefined,
      callData: string | undefined
    ) => {
      setRoutesLoading(true);

      try {
        const quote = await getTransferQuote(
          sdk!,
          getChainByKey(depositChain).id,
          depositToken,
          getChainByKey(withdrawChain).id,
          withdrawToken,
          depositAmount,
          receivingAddress,
          callTo,
          callData
        );

        if (!quote) {
          throw new Error("Empty Quote");
        }

        setRouteQuote(quote);
      } catch (e) {
        console.error(e);
        setNoRoutesAvailable(true);
        setRoutesLoading(false);
        updateSyncStatus(sdk);
      }
    },
    [updateSyncStatus]
  );
  useEffect(() => {
    if (
      routeRequest &&
      routeQuote &&
      doRequestAndBidMatch(routeRequest, routeQuote)
    ) {
      return; // already calculated
    }

    if (sdk && routeRequest) {
      generateRoutes(
        sdk,
        routeRequest.depositChain,
        routeRequest.depositToken,
        routeRequest.withdrawChain,
        routeRequest.withdrawToken,
        routeRequest.depositAmount,
        routeRequest.receivingAddress,
        routeRequest.callTo,
        routeRequest.callData
      );
    }
  }, [sdk, routeRequest, routeQuote, generateRoutes]);

  // parse routeQuote if still it matches current request
  useEffect(() => {
    if (!routeRequest || !routeQuote) {
      return;
    }
    if (!doRequestAndBidMatch(routeRequest, routeQuote)) {
      return;
    }

    const dAmount = routeRequest.depositAmount;
    const dToken = findToken(
      routeRequest.depositChain,
      routeRequest.depositToken
    );
    const wToken = findToken(
      routeRequest.withdrawChain,
      routeRequest.withdrawToken
    );

    const crossAction: CrossAction = {
      type: "cross",
      tool: "nxtp",
      chainId: getChainByKey(routeRequest.depositChain).id,
      toChainId: getChainByKey(routeRequest.withdrawChain).id,
      token: dToken,
      toToken: wToken,
      amount: dAmount,
      toAddress: "",
    };
    // TODO: calculate real fee
    const crossEstimate: CrossEstimate = {
      type: "cross",
      fromAmount: routeQuote.bid.amount,
      toAmount: routeQuote.bid.amountReceived,
      fees: {
        included: true,
        percentage: "0.0005",
        token: crossAction.token,
        amount: new BigNumber(crossAction.amount).times("0.0005").toFixed(0),
      },
      data: routeQuote,
    };

    const sortedRoutes: Array<Array<TransferStep>> = [
      [
        {
          action: crossAction,
          estimate: crossEstimate,
        },
      ],
    ];

    setRoutes(sortedRoutes);
    setHighlightedIndex(sortedRoutes.length === 0 ? -1 : 0);
    setNoRoutesAvailable(sortedRoutes.length === 0);
    setRoutesLoading(false);
  }, [routeRequest, routeQuote, findToken]);

  const updateExecutionRoute = (route: Array<TransferStep>) => {
    setExecutionRoutes((routes) => {
      let index = routes.findIndex((item) => {
        return item[0].id === route[0].id;
      });
      const newRoutes = [
        ...routes.slice(0, index),
        route,
        ...routes.slice(index + 1),
      ];
      return newRoutes;
    });
  };

  const openSwapModal = () => {
    if (!web3.library || !web3.account) return;
    const signer = web3.library.getSigner();

    // add execution route
    const route = deepClone(routes[highlightedIndex]) as Array<TransferStep>;
    setExecutionRoutes((routes) => [...routes, route]);

    // get new route to avoid triggering the same quote twice
    setDepositAmount(new BigNumber(-1));
    setRouteRequest(undefined);
    setRouteQuote(undefined);

    // add as active
    const crossAction = route[0].action as CrossAction;
    const crossEstimate = route[0].estimate as CrossEstimate;
    const txData = {
      invariant: {
        user: "",
        router: "",
        initiator: "",
        sendingAssetId: crossAction.token.id,
        receivingAssetId: crossAction.toToken.id,
        sendingChainFallback: "",
        callTo: "",
        receivingAddress: "",
        sendingChainId: crossAction.chainId,
        receivingChainId: crossAction.toChainId,
        callDataHash: "",
        transactionId: crossEstimate.data.bid.transactionId,
        receivingChainTxManagerAddress: "",
      },
      sending: {
        amount: crossAction.amount,
        preparedBlockNumber: 0,
        expiry: Math.floor(Date.now() / 1000) + 3600 * 24 * 3, // 3 days
      },
    };
    updateActiveTransactionsWith(
      crossEstimate.data.bid.transactionId,
      "Started" as NxtpSdkEvent,
      {} as TransactionPreparedEvent,
      txData
    );
    setActiveKeyTransactions("active");

    // start execution
    const update = (step: TransferStep, status: Execution) => {
      step.execution = status;
      updateExecutionRoute(route);
    };
    triggerTransfer(
      signer,
      sdk!,
      route[0],
      (status: Execution) => update(route[0], status),
      optionInfiniteApproval
    );

    // open modal
    setModalRouteIndex(executionRoutes.length);
  };

  const openSwapModalFinish = (action: ActiveTransaction) => {
    if (!web3.library || !web3.account) return;
    const signer = web3.library.getSigner();

    // open modal
    const index = executionRoutes.findIndex((item) => {
      return item[0].id === action.txData.invariant.transactionId;
    });

    if (index !== -1) {
      setModalRouteIndex(index);

      // trigger sdk
      const route = executionRoutes[index];
      const update = (step: TransferStep, status: Execution) => {
        step.execution = status;
        updateExecutionRoute(route);
      };
      finishTransfer(signer, sdk!, action.event, route[0], update);
    } else {
      finishTransfer(signer, sdk!, action.event);
    }
  };

  const submitButton = () => {
    if (DISABLED) {
      return (
        <Button disabled={true} shape="round" type="primary" size={"large"}>
          Down for Maintenance
        </Button>
      );
    }
    if (!web3.account) {
      return (
        <Button
          shape="round"
          type="primary"
          icon={<LoginOutlined />}
          size={"large"}
          htmlType="submit"
          onClick={() => activate(injected)}
        >
          Connect Wallet
        </Button>
      );
    }
    if (web3.chainId !== getChainByKey(depositChain).id) {
      return (
        <Button
          shape="round"
          type="primary"
          size={"large"}
          htmlType="submit"
          onClick={() => switchChain(getChainByKey(depositChain).id)}
        >
          Change Chain
        </Button>
      );
    }
    if (routesLoading) {
      return (
        <Button
          disabled={true}
          shape="round"
          type="primary"
          icon={<SyncOutlined spin />}
          size={"large"}
        >
          Searching Routes...
        </Button>
      );
    }
    if (noRoutesAvailable) {
      return (
        <Button
          shape="round"
          type="primary"
          size={"large"}
          className="grayed"
          onClick={() => {
            setRouteUpdate(routeUpdate + 1);
          }}
        >
          No Route Found (Retry)
        </Button>
      );
    }
    if (!hasSufficientBalance()) {
      return (
        <Button disabled={true} shape="round" type="primary" size={"large"}>
          Insufficient Funds
        </Button>
      );
    }

    return (
      <Button
        disabled={highlightedIndex === -1}
        shape="round"
        type="primary"
        icon={<SwapOutlined />}
        htmlType="submit"
        size={"large"}
        onClick={() => openSwapModal()}
      >
        Swap
      </Button>
    );
  };

  const cancelTransfer = async (txData: CrosschainTransaction) => {
    try {
      await sdk?.cancel(
        {
          signature: "0x",
          txData: { ...txData.invariant, ...txData.sending! },
        },
        txData.invariant.sendingChainId
      );
      removeActiveTransaction(txData.invariant.transactionId);
    } catch (e) {
      console.error("Failed to cancel", e);
    }
  };

  const handleMenuClick = (e: any) => {
    if (e.key === "mainnet" || e.key === "testnet") {
      // open link
    } else {
      switchChain(parseInt(e.key));
    }
  };

  const getCurrentChain = () => {
    if (!web3.chainId) return undefined;

    try {
      return getChainById(web3.chainId);
    } catch {
      return undefined;
    }
  };
  const currentChain = getCurrentChain();
  const menuChain = (
    <Menu onClick={handleMenuClick}>
      <Menu.ItemGroup title="Supported Chains">
        {transferChains.map((chain) => {
          return (
            <Menu.Item
              key={chain.id}
              icon={<LoginOutlined />}
              disabled={web3.chainId === chain.id}
            >
              <Badge
                color={
                  syncStatus
                    ? syncStatus[chain.id].synced
                      ? "green"
                      : "orange"
                    : "gray"
                }
                text={chain.name}
              />
            </Menu.Item>
          );
        })}
      </Menu.ItemGroup>
      <Menu.ItemGroup title="Other Chains">
        {testnet ? (
          <Menu.Item key="mainnet" icon={<ExportOutlined />}>
            <a href={MAINNET_LINK} target="_blank" rel="nofollow noreferrer">
              Visit Mainnet Version
            </a>
          </Menu.Item>
        ) : (
          <Menu.Item key="testnet" icon={<ExportOutlined />}>
            <a href={TESTNET_LINK} target="_blank" rel="nofollow noreferrer">
              Visit Testnet Version
            </a>
          </Menu.Item>
        )}
      </Menu.ItemGroup>
    </Menu>
  );

  const menuAccount = (
    <Menu>
      <Menu.Item key="disconnect" onClick={() => disconnect()}>
        Disconnect
      </Menu.Item>
    </Menu>
  );

  const disconnect = () => {
    deactivate();
    clearLocalStorage();
  };

  const priceImpact = () => {
    const token = transferTokens[withdrawChain].find(
      (token) => token.id === withdrawToken
    );
    let impact = new BigNumber(0);
    let routerFee = new BigNumber(0);
    let gasFee = new BigNumber(0);
    let decimals = 2;

    if (highlightedIndex !== -1) {
      const selectedRoute = routes[highlightedIndex];
      const cross = selectedRoute[0] as CrossStep;

      const fromToken = cross.action.token;
      const fromAmount = new BigNumber(cross.estimate.fromAmount).shiftedBy(
        -fromToken.decimals
      );

      const toToken = cross.action.toToken;
      const toAmount = new BigNumber(cross.estimate.toAmount).shiftedBy(
        -toToken.decimals
      );

      const diff = fromAmount.minus(toAmount);
      impact = diff.div(fromAmount).times(-100);

      gasFee = new BigNumber(
        cross.estimate.data.gasFeeInReceivingToken
      ).shiftedBy(-toToken.decimals);
      routerFee = diff.minus(gasFee);

      if (routerFee.lt("0.01")) {
        decimals = 4;
      }
    }

    return (
      <div>
        <Tooltip
          color={"gray"}
          placement="topRight"
          title={
            <table>
              <tbody>
                <tr>
                  <td>Included Fees:</td>
                  <td style={{ textAlign: "right" }}></td>
                </tr>
                <tr>
                  <td>Base Fee</td>
                  <td style={{ textAlign: "right" }}>
                    {routerFee.toFixed(decimals, 1)} {token?.symbol}
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: 10 }}>Router Gas Fee</td>
                  <td style={{ textAlign: "right" }}>
                    {gasFee.toFixed(decimals, 1)} {token?.symbol}
                  </td>
                </tr>
              </tbody>
            </table>
          }
        >
          Fee Impact: {impact.toFixed(2)}%
          <Badge
            count={<InfoCircleOutlined style={{ color: "gray" }} />}
            offset={[4, -1]}
          />
        </Tooltip>
      </div>
    );
  };

  const renderActiveTransaction = (tx: ActiveTransaction) => {
    const { transactionId } = tx.txData.invariant;
    const sendingChain = getChainById(tx.txData.invariant.sendingChainId);
    const receivingChain = getChainById(tx.txData.invariant.receivingChainId);

    const getToken = (sendingChain: Chain, assetId: string) =>
      tokens[sendingChain.key].find(
        (token) => token.id === assetId.toLowerCase()
      );
    const sendingToken = getToken(
      sendingChain,
      tx.txData.invariant.sendingAssetId
    );
    const receivingToken = getToken(
      receivingChain,
      tx.txData.invariant.receivingAssetId
    );

    const parseAmount = (amount: string = "0", decimals: number) => {
      const fixedDecimals = 4;
      const parsed = (parseInt(amount) / 10 ** decimals).toFixed(fixedDecimals);
      return parsed === `0.${"0".repeat(fixedDecimals)}`
        ? `<0.${"0".repeat(fixedDecimals - 1)}1`
        : parsed;
    };
    const sendingAmount = parseAmount(
      tx.txData.sending?.amount,
      sendingToken?.decimals || 18
    );
    const receivingAmount = parseAmount(
      tx.txData.receiving?.amount,
      receivingToken?.decimals || 18
    );

    const index = executionRoutes.findIndex((item) => {
      return (
        (item[0].estimate as CrossEstimate).data.bid.transactionId ===
        transactionId
      );
    });

    const status =
      index !== -1 ? (
        <Button onClick={() => setModalRouteIndex(index)}>{tx.status}</Button>
      ) : (
        tx.status
      );
    const cancelled = tx.status.includes("Cancelled");
    const success =
      tx.status.includes("Receiver") && tx.status.includes("Fulfilled");
    const badge = cancelled ? "error" : success ? "success" : "processing";
    const expiry =
      (tx.txData.sending?.expiry || 0) > Date.now() / 1000
        ? `in ${(
            ((tx.txData.sending?.expiry || 0) - Date.now() / 1000) /
            3600
          ).toFixed(2)} hours`
        : "Expired";

    let claimAction = undefined;
    if (tx.txData.sending && Date.now() / 1000 > tx.txData.sending.expiry) {
      // check chain
      if (web3.chainId !== tx.txData.invariant.sendingChainId) {
        claimAction = (
          <Button
            type="link"
            onClick={() => switchChain(tx.txData.invariant.sendingChainId)}
          >
            Change Chain
          </Button>
        );
      } else {
        claimAction = (
          <Button type="link" onClick={() => cancelTransfer(tx.txData)}>
            Cancel
          </Button>
        );
      }
    } else if (
      tx.status === NxtpSdkEvents.ReceiverTransactionPrepared &&
      tx.event
    ) {
      claimAction = (
        <Button
          className="xpollinate-button"
          type="primary"
          shape="round"
          size="large"
          style={{ borderRadius: 6 }}
          onClick={() => openSwapModalFinish(tx)}
        >
          Sign to claim Transfer
        </Button>
      );
    } else if (
      tx.status === NxtpSdkEvents.ReceiverTransactionFulfilled ||
      tx.status === NxtpSdkEvents.SenderTransactionFulfilled
    ) {
      claimAction = (
        <CheckOutlined
          style={{
            margin: "auto",
            display: "block",
            color: "green",
            fontSize: 24,
          }}
        />
      );
    } else {
      const index = executionRoutes.findIndex((item) => {
        return (
          (item[0].estimate as CrossEstimate).data.bid.transactionId ===
          tx.txData.invariant.transactionId
        );
      });
      if (
        index !== -1 &&
        executionRoutes[index][0].execution?.status === "FAILED"
      ) {
        claimAction = "Failed";
      } else if (index !== -1) {
        claimAction = (
          <Spin
            style={{ margin: "auto", display: "block" }}
            indicator={<LoadingOutlined spin style={{ fontSize: 24 }} />}
          />
        );
      }
    }
    return (
      <List.Item key={transactionId}>
        <Card
          bodyStyle={{ padding: 0 }}
          actions={claimAction !== undefined ? [claimAction] : []}
          bordered={false}
          title={
            <Row>
              <Col span={11}>
                {sendingChain.name} {sendingAmount} {sendingToken?.name}
              </Col>
              <Col span={2}>
                <ArrowRightOutlined />
              </Col>
              <Col span={11}>
                {receivingChain.name} {receivingAmount} {receivingToken?.name}
              </Col>
            </Row>
          }
        >
          <Descriptions
            column={1}
            size="small"
            labelStyle={{ fontWeight: 500 }}
            bordered
          >
            <Descriptions.Item label="ID">
              <Paragraph copyable={true} style={{ margin: 0 }}>
                <a
                  href={"https://connextscan.io/tx/" + transactionId}
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  {transactionId.slice(0, 20) + "..."}
                </a>
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Badge status={badge} />
              {status}
            </Descriptions.Item>
            {!cancelled && !success && (
              <Descriptions.Item label="Expires">{expiry}</Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      </List.Item>
    );
  };

  return (
    <Content className="site-layout xpollinate">
      <div className="xpollinate-header">
        <Row
          justify="space-between"
          style={{ padding: 20, maxWidth: 1600, margin: "auto" }}
        >
          <a href="/">
            <img
              src={xpollinateWordmark}
              alt="xPollinate"
              width="160"
              height="38"
            />
            <span className="version">v2 {testnet && "Testnet"}</span>
          </a>

          <span className="header-options">
            <a
              href="https://connextscan.io"
              target="_blank"
              rel="nofollow noreferrer"
            >
              <Button className="header-button">
                <CompassOutlined />
                Explorer
              </Button>
            </a>

            {web3.account ? (
              <>
                <a
                  href={`https://connextscan.io/address/${web3.account}`}
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  <Button className="header-button">
                    <HistoryOutlined />
                    Transaction History
                  </Button>
                </a>

                <Dropdown overlay={menuChain}>
                  <Button className="header-button">
                    <Badge
                      color={
                        syncStatus &&
                        currentChain &&
                        syncStatus[currentChain.id]
                          ? syncStatus[currentChain.id].synced
                            ? "green"
                            : "orange"
                          : "gray"
                      }
                      text={currentChain?.name || "Unsupported Chain"}
                    />{" "}
                    <DownOutlined />
                  </Button>
                </Dropdown>

                <Dropdown overlay={menuAccount}>
                  <Button className="header-button">
                    {web3.account.substr(0, 6)}...{web3.account.substr(-4, 4)}
                  </Button>
                </Dropdown>
              </>
            ) : (
              <Button
                shape="round"
                type="link"
                icon={<LoginOutlined />}
                onClick={() => activate(injected)}
              >
                Connect Wallet
              </Button>
            )}

            <a
              href="https://chat.connext.network/"
              target="_blank"
              rel="nofollow noreferrer"
              className="header-button support-link"
            >
              <span>
                <LinkOutlined /> Support
              </span>
            </a>
          </span>
        </Row>
      </div>

      <div
        className="swap-view"
        style={{ minHeight: "900px", maxWidth: 1600, margin: "auto" }}
      >
        {/* Warning Message */}
        <Row
          justify="center"
          style={{ padding: 20, paddingBottom: 0, display: "none" }}
        >
          <Alert
            style={{ maxWidth: 700 }}
            message=""
            description=""
            type="error"
          />
        </Row>

        {/* Infos */}
        {showAbout && (
          <Row justify="center" style={{ padding: 20, paddingBottom: 0 }}>
            <Alert
              style={{ maxWidth: 700 }}
              afterClose={() => setShowAbout(false)}
              message={aboutMessage}
              description={aboutDescription}
              type="info"
              closable={true}
            />
          </Row>
        )}

        {/* Balances */}
        {testnet && (
          <Collapse activeKey={activeKeyTransactions} accordion ghost>
            <Collapse.Panel
              className={balances ? "" : "empty"}
              header={
                <h2
                  onClick={() =>
                    setActiveKeyTransactions((key) =>
                      key === "balances" ? "" : "balances"
                    )
                  }
                  style={{ display: "inline" }}
                >
                  Balances (
                  {updatingBalances ? (
                    <SyncOutlined spin style={{ verticalAlign: -4 }} />
                  ) : !balances ? (
                    "-"
                  ) : (
                    <CheckOutlined />
                  )}
                  )
                </h2>
              }
              key="balances"
            >
              <div
                style={{
                  overflowX: "scroll",
                  background: "white",
                  margin: "10px 20px",
                }}
              >
                <TestBalanceOverview
                  transferChains={transferChains}
                  updateBalances={() => updateBalances(web3.account!)}
                  updatingBalances={updatingBalances}
                  balances={balances}
                />
              </div>
            </Collapse.Panel>
          </Collapse>
        )}

        <Col style={{ padding: 20, paddingBottom: 0 }}>
          {/* Active Transactions */}
          <Collapse.Panel
            className={activeTransactions.length ? "" : "empty"}
            header={
              <h2
                onClick={() =>
                  setActiveKeyTransactions((key) =>
                    key === "active" ? "" : "active"
                  )
                }
                style={{ display: "inline" }}
              >
                Active Transactions (
                {!sdk ? (
                  "-"
                ) : updatingActiveTransactions ? (
                  <SyncOutlined spin style={{ verticalAlign: -4 }} />
                ) : (
                  activeTransactions.length
                )}
                )
              </h2>
            }
            key="active"
          >
            <div
              style={{
                overflowX: "scroll",
                background: "white",
                margin: "10px 20px",
              }}
            >
              <TransactionsTableNxtp
                activeTransactions={activeTransactions}
                executionRoutes={executionRoutes}
                setModalRouteIndex={setModalRouteIndex}
                openSwapModalFinish={openSwapModalFinish}
                switchChain={switchChain}
                cancelTransfer={cancelTransfer}
                tokens={tokens}
              />
            </div>
          </Collapse.Panel>

          {/* Swap Form */}
          <Row style={{ margin: 20, marginTop: 0 }} justify={"center"}>
            <Col className="swap-form">
              <div
                className="swap-input"
                style={{
                  maxWidth: 480,
                  borderRadius: 6,
                  padding: 24,
                  margin: "0 auto",
                }}
              >
                <Row>
                  <Title className="swap-title" level={4}>
                    Please Specify Your Transaction
                  </Title>
                </Row>

                <Form>
                  <SwapForm
                    depositChain={depositChain}
                    setDepositChain={setDepositChain}
                    depositToken={depositToken}
                    setDepositToken={setDepositToken}
                    depositAmount={depositAmount}
                    setDepositAmount={setDepositAmount}
                    withdrawChain={withdrawChain}
                    setWithdrawChain={setWithdrawChain}
                    withdrawToken={withdrawToken}
                    setWithdrawToken={setWithdrawToken}
                    withdrawAmount={withdrawAmount}
                    setWithdrawAmount={setWithdrawAmount}
                    estimatedWithdrawAmount={getSelectedWithdraw()}
                    transferChains={transferChains}
                    tokens={tokens}
                    balances={balances}
                    forceSameToken={true}
                    syncStatus={syncStatus}
                  />

                  <Row
                    justify={"end"}
                    style={{ marginRight: 20, marginTop: 4 }}
                  >
                    {priceImpact()}
                  </Row>

                  <Row style={{ marginTop: 24 }} justify={"center"}>
                    {submitButton()}
                  </Row>
                </Form>

                {/* Advanced Options */}
                <Row justify={"center"}>
                  <Collapse ghost>
                    <Collapse.Panel header={`Advanced Options`} key="1">
                      Infinite Approval
                      <div>
                        <Checkbox
                          checked={optionInfiniteApproval}
                          onChange={(e) =>
                            setOptionInfiniteApproval(e.target.checked)
                          }
                        >
                          Activate Infinite Approval
                        </Checkbox>
                      </div>
                      Receiving Address
                      <Input
                        value={optionReceivingAddress}
                        onChange={(e) =>
                          setOptionReceivingAddress(e.target.value)
                        }
                        pattern="^0x[a-fA-F0-9]{40}$"
                        placeholder="Only when other than your sending wallet"
                        style={{
                          border: "1px solid rgba(0,0,0,0.25)",
                          borderRadius: 6,
                        }}
                      />
                      Contract Address
                      <Input
                        value={optionContractAddress}
                        onChange={(e) =>
                          setOptionContractAddress(e.target.value)
                        }
                        pattern="^0x[a-fA-F0-9]{40}$"
                        placeholder="To call a contract"
                        style={{
                          border: "1px solid rgba(0,0,0,0.25)",
                          borderRadius: 6,
                        }}
                      />
                      CallData
                      <Input
                        value={optionCallData}
                        onChange={(e) => setOptionCallData(e.target.value)}
                        pattern="^0x[a-fA-F0-9]{64}$"
                        placeholder="Only when calling a contract directly"
                        style={{
                          border: "1px solid rgba(0,0,0,0.25)",
                          borderRadius: 6,
                        }}
                      />
                    </Collapse.Panel>
                  </Collapse>
                </Row>
              </div>
            </Col>
          </Row>
        </Col>

        {/* Footer */}
        <div className="xpollinate-footer">
          <Row justify="center" style={{ marginTop: 48, marginBottom: 8 }}>
            <Col>Powered by</Col>
          </Row>
          <Row justify="center" align="middle" style={{ marginBottom: 24 }}>
            <Col span={6} style={{ textAlign: "right" }}>
              <a
                href="https://connext.network/"
                target="_blank"
                rel="nofollow noreferrer"
              >
                <img
                  src={connextWordmark}
                  alt="Connext"
                  width="200"
                  height="50"
                  style={{ width: "100%", maxWidth: "200px", height: "auto" }}
                />
              </a>
            </Col>
            <Col span={1} style={{ textAlign: "center" }}>
              x
            </Col>
            <Col span={6} style={{ textAlign: "center" }}>
              <a
                href="https://li.finance/"
                target="_blank"
                rel="nofollow noreferrer"
              >
                <img
                  src={lifiWordmark}
                  alt="Li.Finance"
                  width="200"
                  height="50"
                  style={{ width: "100%", maxWidth: "200px", height: "auto" }}
                />
              </a>
            </Col>
            <Col span={1} style={{ textAlign: "center" }}>
              x
            </Col>
            <Col span={6} style={{ textAlign: "left" }}>
              <a
                href="https://about.1hive.org/"
                target="_blank"
                rel="nofollow noreferrer"
              >
                <img
                  src={onehiveWordmark}
                  alt="1hive"
                  width="160"
                  height="42"
                  style={{ width: "80%", maxWidth: "160px", height: "auto" }}
                />
              </a>
            </Col>
          </Row>
        </div>
      </div>

      {modalRouteIndex !== undefined ? (
        <Modal
          className="swapModal"
          visible={true}
          onOk={() => setModalRouteIndex(undefined)}
          onCancel={() => setModalRouteIndex(undefined)}
          width={700}
          footer={null}
        >
          <SwappingNxtp route={executionRoutes[modalRouteIndex]}></SwappingNxtp>
        </Modal>
      ) : (
        ""
      )}
    </Content>
  );
};

export default SwapXpollinate;
