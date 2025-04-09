'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActiveMarket = void 0;
var hooks_1 = require("royco/hooks");
var use_immer_1 = require("use-immer");
var react_1 = require("react");
var lodash_1 = require("lodash");
var immer_1 = require("immer");
var market_1 = require("royco/market");
var useActiveMarket = function (_a) {
    /*
    /!**
     * @notice Enriched Market
     *!/
    const propsEnrichedMarket = useEnrichedMarkets({
      /!*    // @ts-ignore
      chain_id: parseInt(chain_id),*!/
      // @ts-ignore
      market_type: parseInt(market_type),
      // @ts-ignore
      market_id: market_id,
    });
  */
    var chain_id = _a.chain_id, market_type = _a.market_type, market_id = _a.market_id;
    /**
     * @notice Enriched Market Placeholder Data
     */
    var _b = (0, use_immer_1.useImmer)([
        undefined,
        undefined,
    ]), placeholderDatasEnrichedMarket = _b[0], setPlaceholderDatasEnrichedMarket = _b[1];
    /**
     * @notice Top Offers
     */
    var propsHighestOffers = (0, hooks_1.useHighestOffers)({
        // @ts-ignore
        chain_id: parseInt(chain_id),
        // @ts-ignore
        market_id: market_id,
        // @ts-ignore
        market_type: parseInt(market_type),
    });
    /**
     * @notice Top Offers Placeholder Data
     */
    var _c = 
    // @ts-ignore
    (0, use_immer_1.useImmer)([undefined, undefined]), placeholderDatasHighestOffers = _c[0], setPlaceholderDatasHighestOffers = _c[1];
    /*
    /!**
     * @notice Read Recipe Market
     *!/
    const propsReadMarket = useReadMarket({
      // @ts-ignore
      chain_id: parseInt(chain_id),
      // @ts-ignore
      market_type: 'recipe',
      // @ts-ignore
      market_id: market_id,
    });
  
    /!**
     * @notice Actions Decoder Enter Market
     *!/
    const propsActionsDecoderEnterMarket = useActionsDecoder({
      // @ts-ignore
      chain_id: parseInt(chain_id),
      script: propsReadMarket.data?.enter_market_script ?? null,
    });
  
    /!**
     * @notice Actions Decoder Exit Market
     *!/
    const propsActionsDecoderExitMarket = useActionsDecoder({
      // @ts-ignore
      chain_id: parseInt(chain_id),
      script: propsReadMarket.data?.exit_market_script ?? null,
    });*/
    /**
     * @notice Update Top Offers Recipe Data
     */
    (0, react_1.useEffect)(function () {
        if (propsHighestOffers.isLoading === false &&
            propsHighestOffers.isRefetching === false &&
            !(0, lodash_1.isEqual)(propsHighestOffers.data, placeholderDatasHighestOffers[1])) {
            setPlaceholderDatasHighestOffers(function (prevDatas) {
                return (0, immer_1.produce)(prevDatas, function (draft) {
                    // Prevent overwriting previous data with the same object reference
                    if (!(0, lodash_1.isEqual)(draft[1], propsHighestOffers.data)) {
                        draft[0] = draft[1]; // Set previous data to the current data
                        draft[1] =
                            propsHighestOffers.data; // Set current data to the new data
                    }
                });
            });
        }
    }, [
        propsHighestOffers.isLoading,
        propsHighestOffers.isRefetching,
        propsHighestOffers.data,
    ]);
    /*
    /!**
     * @notice Update Enriched Market Data
     *!/
    useEffect(() => {
      if (
        propsEnrichedMarket.isLoading === false &&
        propsEnrichedMarket.isRefetching === false &&
        !isEqual(propsEnrichedMarket.data, placeholderDatasEnrichedMarket[1])
      ) {
        setPlaceholderDatasEnrichedMarket((prevDatas) => {
          return produce(prevDatas, (draft) => {
            // Prevent overwriting previous data with the same object reference
            if (!isEqual(draft[1], propsEnrichedMarket.data)) {
              // @ts-ignore
              draft[0] = draft[1] as typeof propsEnrichedMarket.data; // Set previous data to the current data
              // @ts-ignore
              draft[1] =
                propsEnrichedMarket.data as typeof propsEnrichedMarket.data; // Set current data to the new data
            }
          });
        });
      }
    }, [
      ,
      propsEnrichedMarket.isLoading,
      propsEnrichedMarket.isRefetching,
      propsEnrichedMarket.data,
    ]);*/
    var isLoading = 
    // propsEnrichedMarket.isLoading ||
    propsHighestOffers.isLoading;
    // propsReadMarket.isLoading ||
    // propsActionsDecoderEnterMarket.isLoading ||
    // propsActionsDecoderExitMarket.isLoading;
    return {
        isLoading: isLoading,
        marketMetadata: {
            // @ts-ignore
            chain_id: parseInt(chain_id),
            // @ts-ignore
            // market_type: parseInt(market_type) as 0 | 1,
            market_type: market_1.RoycoMarketType.recipe.id,
            // @ts-ignore
            market_id: market_id,
        },
        // propsEnrichedMarket,
        previousMarketData: !!placeholderDatasEnrichedMarket[0] &&
            // @ts-ignore
            placeholderDatasEnrichedMarket[0].length > 0
            ? // @ts-ignore
                placeholderDatasEnrichedMarket[0][0]
            : undefined,
        // currentMarketData: propsEnrichedMarket.data?.[0] as EnrichedMarketDataType,
        // currentMarketData:
        //   !!placeholderDatasEnrichedMarket[1] &&
        //   // @ts-ignore
        //   placeholderDatasEnrichedMarket[1].length > 0
        //     ? // @ts-ignore
        //       (placeholderDatasEnrichedMarket[1][0] as EnrichedMarketDataType)
        //     : undefined,
        propsHighestOffers: propsHighestOffers,
        previousHighestOffers: placeholderDatasHighestOffers[0],
        currentHighestOffers: placeholderDatasHighestOffers[1],
        // propsActionsDecoderEnterMarket,
        // propsActionsDecoderExitMarket,
        // propsReadMarket,
    };
};
exports.useActiveMarket = useActiveMarket;
