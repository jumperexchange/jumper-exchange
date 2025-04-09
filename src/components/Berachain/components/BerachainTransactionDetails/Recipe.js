"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var material_1 = require("@mui/material");
var Grid_1 = require("@mui/material/Grid");
var useActiveMarket_1 = require("../../hooks/useActiveMarket");
function Recipe(_a) {
    var market = _a.market, type = _a.type;
    var _b = (0, useActiveMarket_1.useActiveMarket)({
        chain_id: 1,
        market_type: market.market_type,
        market_id: '0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b',
    }), isLoading = _b.isLoading, marketMetadata = _b.marketMetadata, 
    // currentMarketData,
    previousMarketData = _b.previousMarketData;
    return (<Grid_1.default container spacing={{ xs: 1, md: 3 }} mb={2} className="mb-2 grid grid-cols-2 gap-x-1 md:gap-x-3">
      {type === 'deposit' && (<Grid_1.default size={12}>
          <material_1.Typography variant="body2" color="textSecondary">
            Deposit Script
          </material_1.Typography>
          <material_1.Box sx={function (theme) { return ({
                maxHeight: 200, // Matches max-h-[200px]
                overflowX: 'hidden', // Matches overflow-x-hidden
                overflowY: 'auto', // Matches overflow-y-scroll
                border: 1, // Matches border
                borderRadius: '8px', // Matches rounded-lg
                padding: 1, // Matches p-1
                borderColor: theme.palette.text.primary,
            }); }}>
            {/*            <ActionFlow
              size="xs"
              actions={propsActionsDecoderEnterMarket.data ?? []}
              showAlertIcon={false}
            />*/}
          </material_1.Box>
        </Grid_1.default>)}
      {type === 'withdraw' && (<Grid_1.default size={12}>
          <material_1.Typography variant="body2" color="textSecondary">
            Withdrawal Script
          </material_1.Typography>

          <material_1.Box sx={function (theme) { return ({
                maxHeight: 200, // Matches max-h-[200px]
                overflowX: 'hidden', // Matches overflow-x-hidden
                overflowY: 'auto', // Matches overflow-y-scroll
                border: 1, // Matches border
                borderRadius: '8px', // Matches rounded-lg
                padding: 1, // Matches p-1
                borderColor: theme.palette.text.primary,
            }); }}>
            {/*            <ActionFlow
              size="xs"
              actions={propsActionsDecoderExitMarket.data ?? []}
              showAlertIcon={false}
            />*/}
          </material_1.Box>
        </Grid_1.default>)}
    </Grid_1.default>);
}
exports.default = Recipe;
