export default interface Resources {
  language: {
    language: {
      key: 'Language';
      value: 'English';
    };
  };
  translation: {
    abstractAlert: {
      buttonText: 'Check the docs';
      subtitle: "The Abstract Wallet only exist on Abstract. Don't use this address on any other blockchain, you will lose your funds.";
      title: 'This wallet only works on Abstract!';
    };
    alerts: {
      extension: 'Some browser extensions like {{extensionName}} can overwrite transactions initiated through Jumper and add an extra fee. We recommend disabling these extensions before swapping.';
    };
    badge: {
      updated: 'Updated {{time}} ago';
    };
    blog: {
      allCategories: 'All';
      banner: {
        description: 'Subscribe to the <strong>Jumper Newsletter</strong> to get the latest updates from Jumper delivered to your inbox.';
        title: 'Get the latest Jumper updates';
      };
      categories: 'Categories';
      copiedLink: 'Copied Link';
      emptyList: {
        noResults: {
          clearFilters: 'Clear filters';
          description: 'Unfortunately there are no results for your search, try clearing your filters.';
          title: 'No results';
        };
      };
      faq: 'FAQ';
      filter: {
        author: 'Author';
        clearAll: 'Clear all';
        dateRange: '1 range';
        filterAndSort: 'Filter and sort';
        filterSort: 'Filters & Sort';
        level: 'Level';
        publishDate: 'Publish date';
        readingDuration: 'Reading duration';
        search: 'Search {{filterBy}}...';
        tag: 'Tag';
      };
      goToArticle: 'Go to article';
      jumperCta: 'Try jumper.xyz';
      minRead: '{{minRead}} min read';
      noPostsFound: 'No posts found for your search criteria.';
      openApp: 'Open app';
      order: {
        highest: '(highest)';
        lowest: '(lowest)';
        newest: '(newest)';
        oldest: '(oldest)';
      };
      popularPosts: 'Popular posts';
      recentPosts: 'Recent Posts';
      seeAllPosts: 'See all posts';
      shareFb: 'Share article on Facebook';
      shareLink: 'Share the link';
      shareLinkedIn: 'Share article on LinkedIn';
      shareX: 'Share article on X';
      similarPosts: 'Similar Posts';
      sorting: {
        level: 'Level';
        publishDate: 'Publish date';
        readingTime: 'Reading time';
        sort: 'Sort';
        sortBy: 'Sort by';
      };
      subtitle: 'TL;DR step-by-step guides to DeFi and crypto for all levels';
      tableOfContents: {
        title: 'On this page';
      };
      tags: {
        all: 'All';
      };
      title: 'Tips and tutorials';
      updated: 'Updated {{date}}';
      views: {
        viewBy: 'View by';
      };
    };
    button: {
      connectAnotherWallet: 'Connect another wallet';
      goBack: 'Go back';
      manageYourPosition: 'Manage your position';
      okay: 'Okay';
    };
    buttons: {
      close: 'Close';
      convertDust: 'Convert dust';
      deposit: 'Deposit';
      depositButtonLabel: 'Quick deposit';
      depositNow: 'Deposit now';
      managePositionsButtonLabel: 'Manage positions';
      requestRedeemButtonLabel: 'Request redeem';
      requestWithdraw: 'Request withdraw';
      reviewConversion: 'Review conversion';
      withdraw: 'Withdraw';
      withdrawButtonLabel: 'Withdraw';
    };
    campaign: {
      missions: {
        title: 'Missions';
      };
      stats: {
        missions: 'Missions';
        rewards: 'Rewards';
        totalRewards: 'Total rewards';
      };
    };
    completedMissionsInformation: {
      description: 'As Jumper organize ad-hoc campaigns, the missions are updated on a monthly basis to create the associated graphics. Keep in mind: XP coming from specific campaigns will be updated on a monthly basis as well.';
      title: '';
    };
    contribution: {
      confirm: 'Confirm';
      custom: 'Custom';
      description: 'Show your appreciation by adding a contribution. 100% of it goes to improve Jumper.';
      error: {
        amountTooSmall: 'The contribution amount is too small for this token. Please try a larger amount.';
        errorSending: 'Error sending contribution:';
        invalidTokenPrice: 'Invalid token price';
        noFeeAddress: 'No contribution fee address configured for this chain.';
      };
      thankYou: 'Thank you!';
      title: 'Contribute';
    };
    discordBanner: {
      ctaButton: 'Join our Discord';
      ctaHeadline: 'Join our Discord to learn more';
    };
    earn: {
      actions: {
        goToPortfolio: 'Go to Portfolio';
        seeMore: 'see more';
        viewAllMarkets: 'View all markets';
      };
      copy: {
        forYouBasedOnActivity: 'Handpicked from over {{totalMarkets}}+ markets based on your account activity';
        forYouDefault: 'Explore curated and comprehensive ways to put your assets to work across {{totalMarkets}}+ markets';
      };
      emptyList: {
        forYouNotConnected: {
          connectWallet: 'Connect wallet';
          description: 'Connect your wallet to view markets for you.';
          title: 'No wallet connected';
        };
        noResults: {
          clearFilters: 'Clear filters';
          description: 'Unfortunately there are no results for your search, try clearing your filters.';
          title: 'No results';
        };
        yourPositions: {
          description: "Looks like you don't have any active positions in any market yet.\nIf you think a position is missing try visiting your portfolio.";
          title: 'No positions';
          viewAllMarkets: 'View all markets';
        };
        yourPositionsNotConnected: {
          connectWallet: 'Connect wallet';
          description: 'Connect your wallet to view your positions.';
          title: 'No wallet connected';
        };
      };
      filter: {
        apy: 'APY';
        asset: 'Asset';
        chain: 'Chain';
        clear: 'Clear';
        clearAll: 'Clear all';
        filterAndSort: 'Filter and sort';
        protocol: 'Protocol';
        rewards: {
          label: 'Rewards';
          withRewards: 'Include only pools with rewards';
        };
        search: 'Search {{filterBy}}...';
        selected: '{{count}} selected';
        tag: 'Type';
        tvl: 'TVL';
      };
      missingPosition: {
        description: 'Check your portfolio tokens before contacting support.';
        title: 'Missing a position?';
      };
      overview: {
        updated: 'Updated {{time}} ago';
      };
      position: {
        disabled: 'Actions are currently disabled for this opportunity. <0>Go to {{protocolName}}</0>';
        label: 'Your position';
      };
      relatedMarkets: {
        title: 'Related Markets';
      };
      requestRedeemFlow: {
        confirmation: {
          cancel: 'Cancel';
          confirm: 'Confirm';
          description: 'Please confirm that you want to request a withdrawal. This action will initiate the redemption process.';
          title: 'Confirm Request';
        };
        error: {
          chainSwitchFailed: {
            close: 'Close';
            description: 'Could not switch to the required network. Please switch manually in your wallet.';
            title: 'Failed to switch network';
          };
          fetchCallDataFailed: {
            description: 'We could not prepare your transaction. Please try again.';
            title: 'Failed to prepare transaction';
            tryAgain: 'Try again';
          };
          insufficientBalance: {
            close: 'Close';
            description: 'You do not have enough balance to complete this transaction.';
            title: 'Insufficient balance';
          };
          transactionFailed: {
            description: 'The transaction failed to complete. Please try again.';
            title: 'Transaction failed';
            tryAgain: 'Try again';
          };
          transactionRejected: {
            description: 'You rejected the transaction in your wallet. Please try again.';
            title: 'Transaction rejected';
            tryAgain: 'Try again';
          };
          unknown: {
            description: 'An unexpected error occurred. Please try again.';
            title: 'Error';
            tryAgain: 'Try again';
          };
        };
        requests: {
          approved: {
            description: 'Click to complete your withdrawal';
            title: 'Accepted request';
          };
          failed: {
            description: 'Request failed';
            title: 'Failed request';
          };
          pending: {
            description: 'Waiting for request to be approved';
            title: 'Pending request';
          };
        };
        success: {
          claim: {
            done: 'Done';
            seeDetails: 'See details';
            title: 'Withdraw complete';
          };
          request: {
            done: 'Done';
            seeDetails: 'See details';
            title: 'Withdraw request sent';
          };
        };
        title: {
          claim: 'Withdraw position';
          request: 'Request withdraw';
        };
      };
      riskDescriptions: {
        risk: 'Risk';
        riskDisclaimer: {
          description: {
            category: 'The information provided regarding potential risks is for general informational purposes only and does not purport to be complete, accurate, or up to date. It should not be construed as investment advice, a recommendation, or a curated selection of investment opportunities, nor does it replace independent due diligence, professional advice, or your own research.\n\nNo responsibility or liability is assumed for the availability, accuracy, performance, or outcomes associated with any third-party products, services, or materials referenced. Any reliance placed on such information or third-party offerings is strictly at your own risk.';
            protocol: 'The presentation of risks is provided for general informational purposes only and does not claim to be complete, accurate, or current. The services and functionalities of the respective protocols remain subject to ongoing changes, including potential extensions, modifications, or restrictions.\n\nNothing herein constitutes investment advice, a recommendation, or a curated selection of investment opportunities, nor does it replace independent research, due diligence, or professional consultation.\n\nNo liability whatsoever is assumed for any third-party products, services, protocols, or related materials, and any reliance on such third-party offerings is undertaken entirely at your own risk.';
          };
          seeDisclaimer: 'See {{type}} risk disclaimer';
          title: '{{type}} risk disclaimer';
        };
        riskTag: {
          'Basis Trading': "Basis Trading may encounter several risk vectors that could influence the vault's performance including but not limited to: funding rate inversion, spread compression, execution slippage, liquidation risk, exchange solvency risk, smart-contract risk, market volatility disrupting hedges, counterparty risk.";
          Bridge: 'Bridge liquidity provisioning may face risks including but not limited to cross-chain message failure, bridge contract exploits, validator misbehavior, chain reorganizations, liquidity shortages, bridged-asset depegs, and counterparty insolvency.';
          CDP: 'CDP strategies may face risks including but not limited to collateral price crashes, oracle manipulation, failed liquidations, rate volatility, collateral concentration, protocol changes, and stablecoin depegs.';
          Credit: "Credit may encounter several risk vectors that could influence the vault's performance including but not limited to: borrower default, counterparty insolvency, collateral devaluation, liquidation failure, liquidity risk, interest-rate volatility, smart contract exploits";
          Farming: 'Farming strategies may face risks including but not limited to reward-token volatility, impermanent loss, emission dilution, liquidity migration, execution slippage, and smart-contract exploits.';
          Lending: "Lending may encounter several risk vectors that could influence the vault's performance including but not limited to: oracle manipulation, collateral price crashes leading to borrower liquidation events, liquidity withdrawal constraints, depegs, interest-rate instability, smart contract exploits";
          'Liquid Staking': "Liquid Staking may encounter several risk vectors that could influence the vault's performance including but not limited to: slashing events, validator downtime, liquid staking token peg instability, liquidity shortages, smart contract exploits";
          Liquidity: 'Liquidity provisioning may face risks including but not limited to: impermanent loss, pool imbalance, liquidity drains, volatility disrupting ranges, oracle failures, and smart-contract exploits.';
          RWA: 'RWA strategies may face risks including but not limited to: issuer default, legal or jurisdictional issues, custodial failure, redemption delays, liquidity constraints, and valuation mismatches between on-chain and off-chain markets.';
          Staking: 'Staking strategies may face risks including but not limited to: validator downtime, slashing, LST peg instability, withdrawal delays, governance shifts, and smart-contract exploits.';
          Structured: 'Structured products may face risks including but not limited to: model errors, volatility shifts, barrier breaches, rebalancing slippage, liquidity gaps, counterparty defaults, and oracle failures.';
          Synthetic: "Synthetic may encounter several risk vectors that could influence the vault's performance including but not limited to: oracle manipulation, under-collateralization, market dislocations impacting peg, liquidity gaps, counterparty risk, smart contract exploits";
          'Yield Aggregator': "Yield Aggregator may encounter several risk vectors that could influence the vault's performance including but not limited to: auto-compounder logic failures, rebalancing errors, strategy misconfiguration, dependency risk from integrated protocols, multisig or governance compromise, stacked smart-contract risk across underlying protocols";
        };
        website: 'website';
      };
      sorting: {
        apy: 'APY';
        sort: 'Sort';
        sortBy: 'Sort By';
        tvl: 'TVL';
      };
      top: {
        earnUpTo: 'Your idle <asset/> on <chain/> could earn up to <apy/> a year if placed on <protocol/>';
        makeTheJump: 'Your idle <asset/> on <chain/> could earn up to <apy/> on <protocol/>, make the jump!';
        maximizeYourRevenue: 'Maximise your <tag/> revenues by depositing on <protocol/> <token/> Pool';
        useYourSpare: 'Earn up to <apy/> APY on <protocol/> with your idle tokens';
      };
      views: {
        all: 'All';
        allMarkets: 'All markets';
        forYou: 'For you';
        viewBy: 'View by';
        yourPositions: 'Your positions';
      };
    };
    error: {
      message: 'Something went wrong. Please try reloading the page. If the problem persists, contact our support.';
    };
    featureCard: {
      learnMore: 'Learn more';
    };
    form: {
      descriptions: {
        chainAvailable_one: '{{count}} token · {{amount}} available';
        chainAvailable_other: '{{count}} tokens · {{amount}} available';
      };
      labels: {
        amount: 'Amount';
        chain: 'Chain';
        convert: 'Convert';
        dustThreshold: 'Tokens less than';
        received: 'Received';
        requested: 'Requested';
        swap: 'Swap';
        withdrawTo: 'Withdraw to';
      };
    };
    format: {
      currency: '{{value, currencyExt(currency: USD)}}';
      currencyCompact: '{{value, currencyExt(currency: USD; notation: compact; compactDisplay: short)}}';
      date: '{{value, dateExt(month: long)}}';
      decimal: '{{value, decimalExt(maximumFractionDigits: 3)}}';
      decimal2Digit: '{{value, decimalExt(maximumFractionDigits: 2)}}';
      decimalCompact: '{{value, decimalExt(maximumFractionDigits: 3; notation: compact; compactDisplay: short)}}';
      dustAmount: '<{{value, decimalExt(maximumFractionDigits: 4)}} {{symbol}}';
      dustAmountValue: '<{{value, decimalExt(maximumFractionDigits: 4)}}';
      dustUsd: '<{{value, currencyExt(currency: USD)}}';
      percent: '{{value, percentExt()}}';
      shortDate: '{{value, dateExt(month: short)}}';
    };
    gatekeeper: {
      connecting: 'Connecting...';
      error: 'An unknown error occurred. Please try again or request access.';
      requestAccess: 'Request access';
      subtitle: {
        intro: {
          earn: '<strong>Smart earning, zero complexity.</strong>';
          portfolio: "<strong>DeFi's interactive portfolio.</strong>";
        };
        noAccess: 'We are currently in a <strong>closed beta.</strong>\nYou do not have access.';
        notConnected: 'We are currently in a <strong>closed beta.</strong>\nConnect to find out if you have access.';
      };
      title: 'Welcome to {{pageTitle}}!';
    };
    headers: {
      chains: 'Chains';
      tokens: 'Tokens';
    };
    jumperWidget: {
      emptyList: 'No {{itemsName}} available for selection';
      fieldErrors: {
        amount: {
          max: 'Amount must be at most {{max}}';
          min: 'Amount must be at least {{min}}';
          overZero: 'Amount must be greater than zero';
        };
        balancesMultiSelect: {
          max_one: 'You can select {{count}} item maximum';
          max_other: 'You can select {{count}} items maximum';
        };
        chainSingleSelect: {
          notSupported: 'Selected chain is not supported for this operation';
        };
        numericSelect: {
          max: 'Value must be at most {{max, number}}';
          min: 'Value must be at least {{min, number}}';
        };
        tokenChain: {
          notSupported: 'Token is not on a supported chain';
        };
        tokenMultiSelect: {
          max_one: 'You can select up to {{count}} token';
          max_other: 'You can select up to {{count}} tokens';
          min_one: 'Please select at least {{count}} token';
          min_other: 'Please select at least {{count}} tokens';
          notSupported: 'One or more selected tokens are not supported';
        };
        tokenSingleSelect: {
          min: 'Please select a token';
          notSupported: 'Selected token is not supported for this operation';
        };
      };
      items: 'items';
      label: {
        tokenCount_one: '{{count}} token on {{chainName}}';
        tokenCount_other: '{{count}} tokens on {{chainName}}';
      };
      networkCosts: {
        auto: 'Auto';
        fees: {
          free: 'Free';
          network: 'Network cost';
          provider: 'Provider fee';
        };
        maxSlippage: 'Max. slippage';
        minReceived: 'Min. received';
        priceImpact: 'Price impact';
      };
      placeholder: {
        balancesMultiSelect: 'Select tokens';
        chainSingleSelect: 'Select chain';
        tokenMultiSelect: 'Select tokens';
        tokenSingleSelect: 'Select token';
      };
      settings: {
        auto: 'Auto';
        slippage: 'Max. slippage';
        slippageCustom: 'Custom';
        slippageHighWarning: 'High slippage may indicate a risky trade. Please review your settings before confirming the transaction.';
        slippageLowWarning: 'Low slippage may result in failed transactions.';
        title: 'Settings';
      };
    };
    labels: {
      apr: 'APR';
      apy: 'APY';
      assets_one: 'Asset';
      assets_other: 'Assets';
      assets_other_one: 'Asset';
      category: 'Category';
      chains_one: 'Chain';
      chains_other: 'Chains';
      depositFee: 'Deposit Fee';
      lockupPeriod: 'Lockup Period';
      lockupPeriodValue_one: '{{count, number}} day';
      lockupPeriodValue_other: '{{count, number}} days';
      managementFee: 'Management Fee';
      maxCapacity: 'Max Capacity';
      overview: 'Overview';
      performanceFee: 'Performance Fee';
      promoCode: 'Promo code';
      protocol: 'Protocol';
      remainingCapacity: 'Remaining Capacity';
      rewardsApy: 'Rewards APY';
      tvl: 'TVL';
      withdrawalFee: 'Withdrawal Fee';
    };
    leaderboard: {
      connectWallet: 'Connect wallet';
      description: 'The leaderboard is updated on a daily basis.';
      rankCtaConnect: 'Where do you rank?';
      title: 'Leaderboard';
      updatedLabel: 'Updated: {{date}}';
    };
    limitOrders: {
      cancelModal: {
        cancelOrder: 'Cancel order';
        close: 'Close';
        description: "This stops the order from filling and marks it cancelled. Any portion already filled stays settled. This can't be undone.";
        done: 'Done';
        error: 'Something went wrong cancelling this order. Please try again.';
        errorTitle: 'Cancellation failed';
        keepOrder: 'Keep order';
        successDescription: 'This order will no longer fill.';
        successTitle: 'Order cancelled';
        title: 'Cancel limit order';
        tryAgain: 'Try again';
        viewOnExplorer: 'View on explorer';
      };
      marketPrice: 'Market Price';
      marketPriceEmptyState: 'Select a token to see its market price';
      modifyModal: {
        cancelStep: {
          confirm: 'Cancel & continue';
          description: 'To modify this order, the current one will be cancelled first. You can then place a new order with updated parameters.';
          title: 'Cancel & modify order';
        };
        placeholderDescription: "Editing an active order isn't available yet. Cancel it and place a new one instead.";
        placeholderTitle: 'Coming soon';
        title: 'Modify limit order';
      };
      orders: 'Orders';
      ordersEmptyState: 'No orders for this protocol yet';
      protocolLabel: 'Protocol';
      repeatModal: {
        placeholderDescription: "Repeating an order isn't available yet. Placing a new order manually works the same way.";
        placeholderTitle: 'Coming soon';
        title: 'Repeat order';
      };
      table: {
        actions: {
          cancelOrder: 'Cancel order';
          collapsePanels: 'Collapse panels';
          expandPanels: 'Expand panels';
          modifyLimit: 'Modify limit';
          refresh: 'Refresh orders';
          repeatOrder: 'Repeat order';
          rowActions: 'Row actions';
          viewOnExplorer: 'View on explorer';
        };
        columns: {
          buy: 'Buy';
          chain: 'Chain';
          expires: 'Expires';
          filled: 'Filled';
          limit: 'Limit';
          market: 'Market';
          pair: 'Pair';
          sell: 'Sell';
        };
        status: {
          cancelled: 'Cancelled';
          days_one: '{{count}} day';
          days_other: '{{count}} days';
          expired: 'Expired';
          failed: 'Failed';
          filled: 'Filled';
          temporarilyInvalid: 'Paused';
        };
      };
      walletLabel: 'Wallet';
    };
    links: {
      discover: 'Discover {{name}}';
    };
    missions: {
      available: 'Available Missions';
      completed: 'Completed Missions';
      mission: {
        completed: {
          description: 'All tasks in this mission have been verified and completed.';
          title: 'Mission completed';
        };
        ended: {
          cta: 'Go back to missions';
          description: 'Mission has ended, go back to the main missions page to explore other missions!';
          title: 'Mission has ended';
        };
      };
      status: {
        daysLeft_one: '{{count}} day left';
        daysLeft_other: '{{count}} days left';
        ended: 'Ended';
        hoursLeft_one: '{{count}} hour left';
        hoursLeft_other: '{{count}} hours left';
        minutesLeft_one: '{{count}} minute left';
        minutesLeft_other: '{{count}} minutes left';
        new: 'New';
        upcoming: 'Upcoming';
      };
      tasks: {
        action: {
          go: 'Go';
          verify: 'Verify';
        };
        completed: {
          description: 'This task has been verified and completed.';
          title: 'Task completed';
        };
        status: {
          verified: 'Verified';
          verify: 'Verify';
        };
        type: '{{type}} task';
        typeFallback: 'Task';
        typeOptional: 'Optional task';
        verifyWallet: {
          action: {
            connectAndVerify: 'Connect & verify ownership';
            verifyWallet: 'Verify ownership';
          };
          description: {
            notConnected: 'Connect and sign a message to verify ownership of your wallet address. If you do not want to do this then reach out on <0>Discord</0>.';
            notVerified: 'Sign a message to verify ownership of the below wallet address. If you do not want to do this then reach out on <0>Discord</0>.';
            verified: 'You have successfully verified ownership of your wallet address.';
          };
          status: {
            signatureFailed: {
              description: 'You need to sign the transaction to confirm ownership of the wallet address.';
              title: 'Signature required';
              tryAgain: 'Try again';
            };
            unknown: {
              description: 'An unknown error occurred. Please try again.';
              title: 'Unknown error';
              tryAgain: 'Try again';
            };
            unsupportedWallet: {
              description: "We don't support this wallet type. Please use a different wallet to complete this mission.";
              switchWallet: 'Switch wallet';
              title: 'Unsupported wallet';
            };
          };
          title: 'Verify ownership';
        };
      };
      wrapperCard: {
        explore_one: 'Explore {{count}} mission';
        explore_other: 'Explore {{count}} missions';
        title: 'Missions';
      };
    };
    modal: {
      perks: {
        claimedPerk: {
          description: 'You have verified this perk with the following address';
          howToUsePerk: 'How to use your perk ?';
          howToUsePerkDescription: 'Simply add the code we provide you in the checkout of the Nansen website.';
          nextSteps: 'Next steps';
          nextStepsPromoCodesExhaustedDescription: "Join the <0>Jumper Discord</0> and open a support ticket. We'll provide your discount code directly via Discord within one week.";
          title: 'Perk claimed!';
        };
        signatureFailed: {
          description: 'You need to sign the transaction to confirm ownership of the wallet address.';
          title: 'Signature required';
          tryAgain: 'Try again';
        };
        stepper: {
          continue: 'Continue';
          steps: {
            email: {
              description_one: '{{position}} you must first share your email address.';
              description_other: '{{position}} you must share your email address.';
              title: 'Enter email';
            };
            position: {
              finally: 'Finally';
              first: 'To claim your perk';
              next: 'Next';
            };
            username: {
              description_one: '{{position}} you must first share your {{usernameType}} username.';
              description_other: '{{position}} you must share your {{usernameType}} username.';
              title: 'Enter username';
            };
            wallet: {
              description_one: '{{position}} you must sign a message to verify ownership of the below connected wallet address.';
              description_other: '{{position}} you must sign a message to verify ownership of the below connected wallet address.';
              title: 'Verify wallet';
            };
          };
          submit: 'Verify wallet and claim perk';
          submitting: 'Waiting for verification';
        };
        unclaimedPerk: {
          title: 'Claim perk';
        };
        unknown: {
          description: 'An unknown error occurred. Please try again.';
          title: 'Unknown error';
          tryAgain: 'Try again';
        };
        unsupportedWallet: {
          description: "We don't support this wallet type. Please use a different wallet to complete this mission.";
          switchWallet: 'Switch wallet';
          title: 'Unsupported wallet';
        };
        validationFailed: {
          close: 'Close';
          description: 'Please check the fields and try again.';
          title: 'Validation failed';
        };
      };
      privateSwap: {
        addressPlaceholder: 'Recipient address';
        confirm: 'Confirm';
        disclaimer1: "The address is correct and not an exchange wallet. Tokens sent to the wrong address can't be retrieved.";
        disclaimer2: "This transaction is fulfilled by a centralized provider who might ask for KYC if it's flagged.";
        noRouteMinAmountSubtitle: 'Private swap routes typically appear for $40+ transactions.';
        noRouteMinAmountTitle: 'No private route available';
        paste: 'Paste';
        subtitle: 'Set recipient address to keep it private.';
        title: "You're going Incognito";
      };
    };
    multisig: {
      connected: {
        description: 'Please notify other wallet participants to be ready to sign.';
        title: 'Multisig wallet connected';
      };
      transactionInitiated: {
        description: 'Please notify other multisig wallet participants to sign before the transaction expires.';
        title: 'Multiple signatures required';
      };
    };
    navbar: {
      connect: 'Connect';
      developers: {
        documentation: 'Documentation';
        github: 'GitHub';
      };
      links: {
        advanced: 'Advanced';
        back: 'Back';
        buy: 'Buy';
        dashboard: 'Dashboard';
        earn: 'Earn';
        exchange: 'Exchange';
        missions: 'Missions';
        portfolio: 'Portfolio';
        private: 'Private Swap';
        refuel: 'Gas';
        simple: 'Simple';
        trade: 'Trade';
      };
      navbarMenu: {
        brandAssets: 'Brand Assets';
        developers: 'Developers';
        docs: 'Docs';
        learn: 'Learn';
        newsletter: 'Newsletter';
        privacyPolicy: 'Privacy Policy';
        profile: 'Profile';
        resources: 'Resources';
        scan: 'Scan';
        support: 'Support';
        termsOfBusiness: 'Terms Of Business';
        theme: 'Theme';
      };
      pass: 'Pass';
      passWithLevel: 'Pass - lvl {{level, number}}';
      passXp: '{{xp}} XP';
      perksUnlocked_one: '{{count}} Perk unlocked';
      perksUnlocked_other: '{{count}} Perks unlocked';
      seeAllWallets: 'See all wallets';
      statsCards: {
        bridges: 'Bridges';
        chains: 'Chains';
        dexs: 'DEXs';
      };
      themes: {
        dark: 'Dark';
        darkModeDisabled: 'Dark mode is disabled for this theme';
        default: 'Default';
        light: 'Light';
        lightModeDisabled: 'Light mode is disabled for this theme';
        switchToDark: 'Switch to dark mode';
        switchToLight: 'Switch to light mode';
        switchToSystem: 'Switch to system mode';
        system: 'System';
        systemModeDisabled: 'System mode is disabled for this theme';
      };
      wallet: 'Wallet';
      walletMenu: {
        chains: 'Chains';
        connectAnotherWallet: 'Connect another wallet';
        copiedMsg: 'Copied';
        copy: 'Copy';
        disconnect: 'Disconnect';
        explore: 'Explore';
        numberOfChains: '{{numberOfChains}} chains';
        refreshBalances: 'Refresh balances';
        switchChain: 'Switch Chain';
        totalBalance: 'Total balance';
        totalBalanceRefresh: 'Click here to restart the indexing of your tokens now.';
        totalBalanceTooltip: "Your total balance may not always be accurate due to potential indexing issues. We're on it!";
        walletBalance: 'Wallet balance';
        walletNotInstalled: '{{wallet}} is not installed';
      };
      walletSelectMenu: {
        connectWallet: 'Connect a wallet';
        ecosystemSelectMenu: {
          noEcosystemAdapter: 'No appropriate ecosystem adapter found';
          selectEcosystem: 'Select wallet ecosystem';
        };
        wallets: 'Wallets';
      };
      wallets: 'Wallets';
      welcome: {
        cta: 'Get started';
        subtitle: '<0>4x audited</0> multi-chain liquidity aggregator';
        title: 'Find the best route';
      };
    };
    newsletter: {
      welcome: {
        emailPlaceholder: 'Enter your email';
        error: {
          email: 'This is not a valid email address';
          emailLength: 'Email must not exceed 80 characters';
          required: 'This field is required';
          unknown: 'An unknown error occurred. Please try again.';
        };
        hint: "By signing up to our newsletter you are implicitly agreeing to Jumper's <0>terms of service</0> and <1>privacy policy</1>. You can unsubscribe at any time from the link in the email footer.";
        pending: 'Pending subscription confirmation...';
        subscribe: 'Subscribe';
        subtitle: 'Get the latest news and updates directly from <strong>Jumper.</strong>';
        success: 'Newsletter subscription successful!';
        title: 'Subscribe to the Jumper Newsletter';
      };
    };
    notifications: {
      apyDrop: {
        body: 'The APY for {{opportunityName}} dropped from {{previousApy, percentExt}} to {{currentApy, percentExt}}. Consider reviewing your position on Jumper Earn.';
        cta: 'View Position';
        title: '{{opportunityName}}: APY dropped';
      };
      aria: {
        deleteNotification: 'Delete notification';
        openPanel: 'Notifications';
      };
      bridgeToEarn: {
        body: 'You just bridged {{amountUsd, currencyExt(currency: USD)}} {{symbol}} to {{chainId, chainNameExt}}. Earn {{apy, percentExt}} APY by depositing into {{opportunityName}} on Jumper Earn!';
        cta: 'Start Earning';
        title: 'Earn {{apy, percentExt}} APY on your {{symbol}}';
      };
      categories: {
        all: 'All Categories';
        campaign: 'Campaign';
        earn: 'Earn';
        portfolio: 'Portfolio';
        product: 'Product';
      };
      dateFilter: {
        all: 'All Time';
        month: 'Past Month';
        today: 'Today';
        week: 'Past Week';
      };
      emptyState: 'No notifications';
      idleAssets: {
        body: 'You have {{amountUsd, currencyExt(currency: USD)}} {{symbol}} on {{chainId, chainNameExt}} sitting idle. Deposit into {{opportunityName}} to earn {{apy, percentExt}} APY.';
        cta: 'Start Earning';
        title: 'Earn {{apy, percentExt}} APY on your idle {{symbol}}';
      };
      newOpportunity: {
        body: 'Earn {{apy, percentExt}} APY on {{protocol}} ({{chainId, chainNameExt}}). You hold stablecoins on this chain — check it out!';
        cta: 'Start Earning';
        title: 'New Earn Opportunity: {{opportunityName}}';
      };
      newToolLaunch: {
        body: '{{toolName}} is now live on Jumper. You recently $t(notifications.toolVerb.{{toolType}}) on {{chainIds, chainNamesExt}} — try it now.';
        cta: 'Try it';
        title: 'New on Jumper: {{toolName}}';
      };
      perkLevelUp: {
        body_one: 'Reaching Level {{newLevel}} unlocked {{perks, listExt(prop: name)}}. Check it out in your Jumper Pass.';
        body_other: 'Reaching Level {{newLevel}} unlocked {{perks, listExt(prop: name)}}. Check them out in your Jumper Pass.';
        cta: 'View Jumper Pass';
        title_one: 'Perk unlocked: {{perks, listExt(prop: name)}}';
        title_other: 'You unlocked {{count}} new perks!';
      };
      title: 'Notifications';
      toolVerb: {
        BRIDGE: 'bridged';
        SWAP: 'swapped';
      };
      unread_one: '{{count}} unread notification';
      unread_other: '{{count}} unread notifications';
      unread_zero: 'No unread notifications';
      userLevelUp: {
        body: 'Your Jumper Pass leveled up from Level {{oldLevel}} to Level {{newLevel}}. Keep earning XP to unlock more.';
        cta: 'View Jumper Pass';
        title: 'You reached Level {{newLevel}}!';
      };
    };
    pagination: {
      next: 'Next';
      previous: 'Previous';
    };
    perks_page: {
      empty: {
        all: {
          caption: 'Check back soon for new perks from Jumper partners.';
          cta: 'Explore missions';
          description: 'No perks available right now.';
        };
        claimed: {
          caption: 'Once you unlock a perk, claim it here to start enjoying your rewards.';
          cta: 'Earn XP';
          description: "You haven't claimed any perks yet.";
        };
        unlocked: {
          caption: 'Earn XP by completing missions and using Jumper to level up your Pass and unlock perks.';
          cta: 'Earn XP';
          description: "You haven't unlocked any perks yet.";
        };
      };
      tabs: {
        all: 'All Perks';
        claimed: 'Claimed';
        unlocked: 'Unlocked';
      };
    };
    portfolio: {
      assetOverviewCard: {
        navigation: {
          defiPositions: 'DeFi Protocols';
          overview: 'Overview';
          tokens: 'Tokens';
        };
        noContent: {
          cta: {
            startEarning: 'Start Earning';
            startSwapping: 'Start Swapping';
          };
          description: 'Use Earn or Exchange and jump start your DeFi journey!';
          title: 'This is looking a bit empty!';
        };
        overview: {
          defiPositions: 'DeFi Protocols';
          tokens: 'Tokens';
        };
      };
      defiPositionCard: {
        actions: {
          borrow: 'Borrow';
          claim: 'Claim';
          compound: 'Compound';
          deposit: 'Deposit';
          repay: 'Repay';
          withdraw: 'Withdraw';
        };
        header: {
          apy: 'APY';
          borrowed: 'Borrowed';
          rewards: 'Rewards';
          supplied: 'Supplied';
          value: 'Value';
        };
        overview: {
          details: 'Details';
          lockup: 'Lockup';
          lockupPeriod: {
            days_one: '{{count}} day remaining';
            days_other: '{{count}} days remaining';
            hours_one: '{{count}} hour remaining';
            hours_other: '{{count}} hours remaining';
            lessThanOneMinute: '<1 minute remaining';
            minutes_one: '{{count}} minute remaining';
            minutes_other: '{{count}} minutes remaining';
            months_one: '{{count}} month remaining';
            months_other: '{{count}} months remaining';
            years_one: '{{count}} year remaining';
            years_other: '{{count}} years remaining';
          };
          opened: 'Opened';
          openedPeriod: {
            days_one: '{{count}} day ago';
            days_other: '{{count}} days ago';
            hours_one: '{{count}} hour ago';
            hours_other: '{{count}} hours ago';
            lessThanOneMinute: '<1 minute ago';
            minutes_one: '{{count}} minute ago';
            minutes_other: '{{count}} minutes ago';
            months_one: '{{count}} month ago';
            months_other: '{{count}} months ago';
            years_one: '{{count}} year ago';
            years_other: '{{count}} years ago';
          };
          tooltip: {
            address: 'View contract';
            info: 'View earn detail';
          };
        };
      };
      dustConversion: {
        banner: 'You have <strong>{{value}}</strong> worth of Dust tokens that can be converted!';
        chainValidationError: {
          cancel: 'Cancel';
          description: "Currently {{chain}} chain can't support this operation, but we're actively working on it.";
          title: 'Chain not supported';
        };
        error: {
          chainSwitchFailed: {
            close: 'Close';
            description: 'Could not switch to the required network. Please switch manually in your wallet.';
            title: 'Failed to switch network';
          };
          fetchCallDataFailed: {
            description: 'We could not prepare your transaction. Please try again.';
            title: 'Failed to prepare transaction';
            tryAgain: 'Try again';
          };
          insufficientBalance: {
            close: 'Close';
            description: 'You do not have enough balance to complete this transaction.';
            title: 'Insufficient balance';
          };
          transactionCanceled: {
            close: 'Close';
            description: 'The transaction was canceled. Please try again.';
            title: 'Transaction canceled';
          };
          transactionFailed: {
            description: 'The transaction failed to complete. Please try again.';
            title: 'Transaction failed';
            tryAgain: 'Try again';
          };
          transactionRejected: {
            description: 'You rejected the transaction in your wallet. Please try again.';
            title: 'Transaction rejected';
            tryAgain: 'Try again';
          };
          transactionReverted: {
            close: 'Close';
            description: 'The transaction was reverted. Please try again.';
            title: 'Transaction failed';
          };
          unknown: {
            description: 'An unexpected error occurred. Please try again.';
            title: 'Error';
            tryAgain: 'Try again';
          };
          walletDoesNotSupportBatch: {
            close: 'Close';
            description: 'Your connected wallet does not support batch transactions (EIP-5792). Please connect a different wallet.';
            title: 'Wallet does not support batch transactions';
          };
        };
        partialError: {
          cancel: 'Cancel';
          convertibleDust: 'Convertible dust';
          descriptionNotConvertible: 'The selected tokens are currently unavailable for conversion.';
          descriptionPartiallyConvertible_one: "{{tokens}} couldn't be converted. They will be excluded from the dust sweeping operation.";
          descriptionPartiallyConvertible_other: "{{tokens}} couldn't be converted. They will be excluded from the dust sweeping operation.";
          excludedTokens_one: 'Excluded token';
          excludedTokens_other: 'Excluded tokens';
          proceed: 'Proceed';
          title: "Some tokens can't be converted";
        };
        routeOverview: {
          approveToken: 'Approve {{symbol}}';
          composerAlt: 'Composer';
          composerViaLifi: 'Composer via LI.FI';
          executingStep: 'Executing step {{current, number}} out of {{total, number}}...';
          stepsCount_one: '{{count, number}} step';
          stepsCount_other: '{{count, number}} steps';
          swapTo: 'Swap to {{symbol}}';
        };
        success: {
          done: 'Done';
          seeDetails: 'See details';
          title: 'Conversion complete';
        };
        title: 'Convert dust';
      };
      emptyList: {
        clearFilters: 'Clear filters';
        description: 'Unfortunately there are no results for your search, try clearing your filters.';
        error: {
          description: "We couldn't load your transactions. Please try again.";
          retry: 'Try again';
          title: 'Something went wrong';
        };
        rateLimited: {
          description: "You've hit the rate limit. Please wait a moment and try again.";
          retry: 'Try again';
          title: 'Too many requests';
        };
        title: 'No results';
      };
      emptyPage: {
        clearFilters: 'Clear filters';
        description: 'There are no results on this page. Go back to the previous page or clear your filters.';
        goToPreviousPage: 'Previous page';
        title: 'No results on this page';
      };
      filter: {
        asset: 'Asset';
        assets: 'Assets';
        byAsset: 'By asset';
        byChain: 'By chain';
        byChainOrAssetDisclaimer: 'Filter by whole chains, or by specific assets - not both. Switching replaces your selection';
        chain: 'Chain';
        chainAndAsset: 'Chain & asset';
        chains: 'Chains';
        clearAll: 'Clear all';
        dateRange: '1 range';
        filterAndSort: 'Filter and sort';
        filterSort: 'Filters & Sort';
        protocol: 'Protocol';
        refresh: 'Refresh';
        refreshTooltipAvailable: 'Refresh transactions ({{remaining}} left)';
        refreshTooltipExhausted: 'Rate limit reached. Try again {{resetAt}}';
        refreshTooltipUnknown: 'Refresh transactions';
        search: 'Search {{filterBy}}...';
        type: 'Type';
        value: 'Value';
        wallet: 'Wallet';
      };
      holdings: {
        defiPositions: 'DeFi';
        perps: 'Perps and prediction markets';
        tokens: 'Tokens';
      };
      overviewCard: {
        pnlChartDisclaimer: 'Only EVM/SVM addresses are supported. Some DeFi and perp positions may not yet appear in the chart. New integrations are continuously being added.';
        refreshTooltip: 'Click here to restart the indexing of your assets.';
        title: 'Portfolio';
      };
      sorting: {
        action: 'Action';
        asset: 'Asset';
        chain: 'Chain';
        date: 'Date';
        sort: 'Sort';
        sortBy: 'Sort by';
        totalValue: 'Total Value';
      };
      transactionSummary: {
        columns: {
          action: 'Action';
          amount: 'Amount';
          assetIn: 'Asset in';
          assetOut: 'Asset out';
          date: 'Date';
          fee: 'Fee';
          txHash: 'Tx hash';
        };
        nftAmount: 'Amount: {{amount}}';
        nftCount_one: '{{count}} NFT';
        nftCount_other: '{{count}} NFTs';
      };
      transactionTypes: {
        approve: 'Approve';
        bid: 'Bid';
        burn: 'Burn';
        claim: 'Claim';
        delegate: 'Delegate';
        deploy: 'Deploy';
        deposit: 'Deposit';
        execute: 'Execute';
        mint: 'Mint';
        receive: 'Receive';
        revoke: 'Revoke';
        revoke_delegation: 'Revoke Delegation';
        send: 'Send';
        trade: 'Trade';
        withdraw: 'Withdraw';
      };
      views: {
        holdings: 'Holdings';
        performance: 'Performance';
        soon: 'Soon';
        transactions: 'Transactions';
        viewBy: 'View by';
      };
      welcome: {
        getStarted: 'Get started';
        subtitle: "<strong>DeFi's interactive portfolio.</strong>";
        title: 'Welcome to Jumper Portfolio!';
      };
    };
    profile_page: {
      availableRewards: 'Available Rewards';
      beginJourney: 'Begin your Jumper journey';
      campaigns: 'Campaigns';
      claimed: 'Claimed';
      copyAddress: 'Copy wallet address';
      earnXp: {
        activity: {
          nextTier: {
            bridge_oor: 'Bridge {{count}} USD more for {{xp}} XP';
            chain_oor_one: 'Explore {{count}} more chain for {{xp}} XP';
            chain_oor_other: 'Explore {{count}} more chains for {{xp}} XP';
            earn_oor: 'Deposit {{count}} USD more for {{xp}} XP';
            swap_oor: 'Swap {{count}} USD more for {{xp}} XP';
          };
          outstanding_one: 'You have <bold>{{count}} outstanding</bold> activity goal to complete this month';
          outstanding_other: 'You have <bold>{{count}} outstanding</bold> activity goals to complete this month';
          progress: {
            bridge_oor: 'You have bridged {{count}} USD';
            chain_oor_one: 'You have explored {{count}} chain';
            chain_oor_other: 'You have explored {{count}} chains';
            earn_oor: 'You have deposited {{count}} USD';
            swap_oor: 'You have swapped {{count}} USD';
          };
          topTier: 'You have reached the top tier for this month!';
          types: {
            bridge_oor: 'Bridge_oor';
            chain_oor: 'Chain_oor';
            earn_oor: 'Earn_oor';
            swap_oor: 'Swap_oor';
          };
          xpAvailable: '{{xp}} XP available';
        };
        description: 'Complete missions and increase your activity to earn XP and unlock more perks!';
        noMissions: {
          caption: 'Check back soon for new missions to earn XP and unlock more perks.';
          cta: 'Open Mission Hub';
          description: 'No missions available right now.';
        };
        openHub: 'Open Mission Hub';
        tabs: {
          activity: 'Activity';
          missions: 'Missions';
        };
        title: 'Earn XP';
        xpAvailable: '{{xp}} XP available';
        xpEarnedMessage: '<strong>{{xp}} XP</strong> earned so far this month';
      };
      joined: 'Joined {{date}}';
      jumperPass: 'Jumper Pass';
      level: 'Level';
      levelInfo: 'A higher level increases your odds to win rewards from raffles, perks, partners, rewards and more.';
      levelWithValue: 'Level {{level, number}}';
      mobileDescription: 'The Jumper Loyalty Pass page is not available on small screens yet. We are working on it.';
      mobileTitle: 'Only available on Desktop';
      open: 'Open {{tool}}';
      passStats: {
        lastMonth: 'last month';
        perks_one: '{{count}} perk';
        perks_other: '{{count}} perks';
        unlocked: 'unlocked';
      };
      pointsInfo: 'XP is your score for interacting with Jumper. As you gain XP points, your level goes up. XP coming from Jumper transactions is updated on a daily basis.';
      progressTo: 'Your progress to';
      rank: 'Rank';
      rankInfo: 'Rank is your position in the leaderboard. Gain XP and move upward in the leaderboard.';
      rewardsClaim: {
        action: {
          claim: 'Claim';
          claiming: 'Claiming';
          retry: 'Retry';
        };
        error: 'An unknown error occurred. Please try again.';
      };
      sectionCarousel: {
        goToPage: 'Go to page {{page}}';
        next: 'Next';
        previous: 'Previous';
      };
      shareProfile: 'Share profile';
      tooltips: {
        ongoingAchievement: 'This credential is currently earning XP for the ongoing month. The final XP amount will be settled at the end of the month.';
      };
      unlocked: 'Unlocked';
      unlockedPerks: {
        count_one: 'You have {{count}} unlocked perk';
        count_other: 'You have {{count}} unlocked perks';
        description: 'Find all the Jumper Perks you have unlocked so far in your pass. To see what other perks are available checkout our dedicated Perks hub.';
        empty: {
          description: 'Looks like there are no perks available right now. Check back later!';
          title: 'Out of Perks!';
        };
        openHub: 'Open Perks Hub';
        title: 'Unlocked Perks';
      };
      viewLeaderboard: 'View leaderboard';
      yourAchievements: {
        description: 'Explore all your <bold>completed</bold> missions and XP earned through using Jumper.';
        noActivity: {
          caption: 'Start your journey by completing missions, swapping tokens, and bridging across chains to unlock unique achievements and earn XP.';
          cta: 'Start swapping';
          description: "You have no recorded activity yet. Let's change that!";
        };
        noMissions: {
          caption: 'Start collecting XP by completing missions. The more XP you earn, the more Perks you unlock!';
          cta: 'View all missions';
          description: "You have not completed any missions yet. Let's change that!";
        };
        tabs: {
          activity: 'Activity';
          missions: 'Missions';
        };
        title: 'Your achievements';
        xpEarned: '{{xp}} XP earned';
      };
    };
    promo: {
      new: 'New';
    };
    questCard: {
      action: {
        bridge_oor: 'bridging';
        chain_oor: 'exploring chains';
        swap_oor: 'swapping';
        transact_oor: 'trading';
      };
      completed: 'Completed';
      earnedXPDescription: "You've unlocked {{earnedXP}}XP by {{action}} so far this month and this has been added to your total XP balance.";
      join: 'Join';
      xpToEarnDescription: 'Complete the progress bar by {{action}} to earn +{{xpToEarn}} addtional XP this month.';
    };
    search: {
      filteredResult_one: '{{filterCount}} of {{count}} result';
      filteredResult_other: '{{filterCount}} of {{count}} results';
      noResults: 'No results found';
      placeholder: 'Search...';
      result_one: '{{count}} result';
      result_other: '{{count}} results';
    };
    seiAlert: {
      buttonText: 'Link Wallet';
      subtitle: 'To use SEI EVM, you need to link your wallet address to the SEI ecosystem.';
      title: 'Linking of SEI EVM wallet required';
    };
    solanaAlert: {
      subtitle: 'Currently only USDC and USDT can be bridged to and from Solana.';
      title: 'Limited Solana token support';
    };
    tooltips: {
      apr: 'Expected yearly return rate of the tokens invested (incl. rewards if available).';
      apy: 'Expected yearly return rate of the tokens invested on a 7 day trailing basis, incl. temporary rewards.';
      assets_one: 'The asset you will earn from';
      assets_other: 'The assets you will earn from';
      assets_other_one: 'The asset you will earn from';
      boostedApy: '{{baseApy, number}}% is the expected yearly return rate of the underlying tokens invested. The extra {{boostedApy, number}}% in rewards - distributed in another token - are paid exclusively to the participant of this zap campaign.';
      chains_one: 'The chain you will earn from';
      chains_other: 'The chains you will earn from';
      close: 'Close';
      copied: 'Copied';
      deposit: 'The token on which the market is defined and yield accrues on.';
      depositDisabled: 'Deposit currently disabled for this opportunity. <0>Go to {{protocolName}}</0>';
      depositFee: 'Fee charged when depositing funds';
      deposited: 'The token you have deposited into this market.';
      exitFullscreen: 'Exit fullscreen';
      fullscreen: 'Fullscreen';
      gasless: 'We handle the gas, so you can transfer assets without holding native tokens. Network costs are included in the transfer.';
      lockupPeriod: 'Once deposited, your position is subject to an {{formattedLockupPeriod}} lock-up period before you can withdraw the funds.';
      manageYourPosition: 'You can also manage your funds (withdraw, check PNL) on {{partnerName}} UI by clicking on this button';
      managementFee: 'Annual fee charged on assets under management';
      maxCapacity: 'Maximum capacity of this vault';
      minReceived: 'The estimated minimum amount may change until the swapping/bridging transaction is signed. For 2-step transfers, this applies until the second step transaction is signed.';
      noPositionsToManage: 'You do not have any positions to manage';
      performanceFee: 'Fee charged on profits earned';
      priceImpact: 'The estimated value difference between the source and destination tokens.';
      protocol: 'The protocol you will earn from';
      remainingCapacity: 'Available capacity remaining in this vault';
      rewardsApy: 'Expected yearly return rate distributed in reward token.';
      slippage: 'The maximum percentage difference between the expected price, and the actual price at which a transfer is executed.';
      tvl: 'Total value of crypto assets deposited in this market.';
      withdrawDisabled: 'Withdraw currently disabled for this opportunity. <0>Go to {{protocolName}}</0>';
      withdrawalFee: 'Fee charged when withdrawing funds';
      zoomIn: 'Zoom in';
      zoomOut: 'Zoom out';
    };
    widget: {
      deposit: {
        title: 'Quick deposit';
      };
      depositCard: {
        apy: 'Base APR';
        boostedApy: 'Boosted APR';
        lockupPeriod: 'Lockup period';
        token: 'Asset';
        tvl: 'TVL';
      };
      earn: {
        depositSuccess: 'You will be able to see and manage your position in a few seconds by clicking on <bold>Manage your positions</bold>';
      };
      exchange: {
        title: 'Exchange';
      };
      limitOrder: {
        orderPlacedLabel: 'Order placed';
        orderPlacedTitle: 'Order placed successfully';
        orderPlacementCompleted: 'Order placement completed';
        placeOrderButton: 'Place order';
        reviewTitle: 'Review order';
      };
      private: {
        title: 'Private Swap';
      };
      swapBridge: {
        title: 'Swap & Bridge';
      };
      withdraw: {
        title: 'Withdraw';
      };
      zap: {
        depositSuccess: 'You will be able to see your position in a few seconds or alternatively by clicking on <bold>Manage your position</bold> that redirects to {{partnerName}} UI';
        placeholder: {
          comingSoon: 'Coming soon';
          'non-evm': {
            description: 'We are working on adding support for non-EVM wallets. In the meantime please use an EVM wallet to execute transactions.';
            title: 'Your wallet is currently not supported';
          };
          'not-supported': {
            description: 'Please use an <strong>{{type}} wallet</strong> to execute transactions for this opportunity.';
            title: 'Your wallet is currently not supported';
          };
        };
        sendToAddressName: 'Deposit into {{name}}';
        sentToAddressName: 'Deposited into {{name}}';
        tabs: {
          deposit: 'Deposit';
          withdraw: 'Withdraw';
        };
      };
    };
  };
}
