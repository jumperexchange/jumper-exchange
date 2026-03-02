interface Resources {
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
    badge: {
      updated: 'Updated {{time}} ago';
    };
    blog: {
      allCategories: 'All';
      categories: 'Categories';
      copiedLink: 'Copied Link';
      faq: 'FAQ';
      goToArticle: 'Go to article';
      jumperCta: 'Try jumper.xyz';
      minRead: '{{minRead}} min read';
      openApp: 'Open app';
      recentPosts: 'Recent Posts';
      seeAllPosts: 'See all posts';
      shareFb: 'Share article on Facebook';
      shareLink: 'Share the link';
      shareLinkedIn: 'Share article on LinkedIn';
      shareX: 'Share article on X';
      similarPosts: 'Similar Posts';
      subtitle: 'TL;DR step-by-step guides to DeFi and crypto for all levels';
      title: 'Tips and tutorials';
    };
    button: {
      connectAnotherWallet: 'Connect another wallet';
      goBack: 'Go back';
      manageYourPosition: 'Manage your position';
      okay: 'Okay';
    };
    buttons: {
      deposit: 'Deposit';
      depositButtonLabel: 'Quick deposit';
      depositNow: 'Deposit now';
      managePositionsButtonLabel: 'Manage positions';
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
      riskDescriptions: {
        risk: 'Risk';
        riskTag: {
          'Basis Trading': 'Basis Trading may encounter several risk vectors that could influence the vault’s performance: funding rate inversion, spread compression, execution slippage, liquidation risk, exchange solvency risk, smart-contract risk, market volatility disrupting hedges, counterparty risk.';
          Bridge: 'Bridge liquidity provisioning may face risks such as cross-chain message failure, bridge contract exploits, validator misbehavior, chain reorganizations, liquidity shortages, bridged-asset depegs, and counterparty insolvency.';
          CDP: 'CDP strategies may face risks including collateral price crashes, oracle manipulation, failed liquidations, rate volatility, collateral concentration, protocol changes, and stablecoin depegs.';
          Credit: 'Credit may encounter several risk vectors that could influence the vault’s performance: borrower default, counterparty insolvency, collateral devaluation, liquidation failure, liquidity risk, interest-rate volatility, smart contract exploits';
          Farming: 'Farming strategies may face risks such as reward-token volatility, impermanent loss, emission dilution, liquidity migration, execution slippage, and smart-contract exploits.';
          Lending: 'Lending may encounter several risk vectors that could influence the vault’s performance: oracle manipulation, collateral price crashes leading to borrower liquidation events, liquidity withdrawal constraints, depegs, interest-rate instability, smart contract exploits';
          'Liquid Staking': 'Liquid Staking may encounter several risk vectors that could influence the vault’s performance: slashing events, validator downtime, liquid staking token peg instability, liquidity shortages, smart contract exploits';
          Liquidity: 'Liquidity provisioning may face risks including impermanent loss, pool imbalance, liquidity drains, volatility disrupting ranges, oracle failures, and smart-contract exploits.';
          RWA: 'RWA strategies may face risks such as issuer default, legal or jurisdictional issues, custodial failure, redemption delays, liquidity constraints, and valuation mismatches between on-chain and off-chain markets.';
          Staking: 'Staking strategies may face risks including validator downtime, slashing, LST peg instability, withdrawal delays, governance shifts, and smart-contract exploits.';
          Structured: 'Structured products may face risks such as model errors, volatility shifts, barrier breaches, rebalancing slippage, liquidity gaps, counterparty defaults, and oracle failures.';
          Synthetic: "Synthetic may encounter several risk vectors that could influence the vault's performance: oracle manipulation, under-collateralization, market dislocations impacting peg, liquidity gaps, counterparty risk, smart contract exploits";
          'Yield Aggregator': 'Yield Aggregator may encounter several risk vectors that could influence the vault’s performance: auto-compounder logic failures, rebalancing errors, strategy misconfiguration, dependency risk from integrated protocols, multisig or governance compromise, stacked smart-contract risk across underlying protocols';
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
        useYourSpare: 'Deposit your spare <asset/> with <protocol/> and earn up to <apy/> APY';
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
    format: {
      currency: '{{value, currencyExt(currency: USD)}}';
      currencyCompact: '{{value, currencyExt(currency: USD; notation: compact; compactDisplay: short)}}';
      date: '{{value, dateExt(month: long)}}';
      decimal: '{{value, decimalExt(maximumFractionDigits: 3)}}';
      decimal2Digit: '{{value, decimalExt(maximumFractionDigits: 2)}}';
      decimalCompact: '{{value, decimalExt(maximumFractionDigits: 3; notation: compact; compactDisplay: short)}}';
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
    jumperWallet: {
      login: {
        biometric: 'Use biometrics';
        biometricFailed: 'Biometric authentication failed. Please try again.';
        biometricUnlock: 'Unlock with biometrics';
        enterPassword: 'Enter your password';
        forgotPassword: 'Forgot password?';
        hidePassword: 'Hide password';
        orUsePassword: 'or use your password';
        showPassword: 'Show password';
        title: 'Unlock Jumper Account';
        unlock: 'Unlock';
        wrongPassword: 'Incorrect password. Please try again.';
      };
      name: 'Jumper Account';
      passwordPrompt: {
        cancel: 'Cancel';
        confirm: 'Confirm';
        description: 'Enter your password to authorize this transaction';
        title: 'Confirm action';
      };
      passwordStrength: {
        fair: 'Fair';
        good: 'Good';
        strong: 'Strong';
        veryStrong: 'Very strong';
        weak: 'Weak';
      };
      recovery: {
        collectShares: 'Provide your recovery shares';
        emailCodePlaceholder: 'Paste the code from your recovery email';
        failed: 'Recovery failed. Please check your shares and try again.';
        finishRecovery: 'Recover';
        googleDrive: {
          attemptsRemaining: '{{remaining}} attempt(s) remaining';
          manualFallbackInfo: "Automatic retrieval didn't work. You can try a different Google account or paste the share manually.";
          pastePlaceholder: 'Paste the share content here...';
          pasteShare: 'Paste Google Drive share';
          retrieve: 'Retrieve from Google Drive';
          retrieved: 'Share retrieved from Google Drive';
          retrieving: 'Connecting to Google Drive...';
          title: 'Google Drive';
        };
        invalidShare: 'Invalid share — paste the exact code you received';
        manualEntry: 'Or paste shares manually';
        reconstructing: 'Reconstructing your wallet...';
        recoveryCodePlaceholder: 'Paste your recovery code';
        selectMethods: 'Select recovery sources';
        selectWallet: {
          noWalletsFound: 'No local recovery shares found on this device.';
          recoverWithoutDevice: "My wallet isn't listed here";
          selectButton: 'Select';
          subtitle: 'We found {{count}} wallet(s) on this device.';
          title: 'Which account do you want to recover?';
        };
        setNewPassword: 'Set a new password';
        shareFromCode: 'Recovery code';
        shareFromEmail: 'Share from email';
        sharesCollected: '{{count}} of {{needed}} shares collected';
        sharesNeeded: '{{needed}} of {{total}} shares required';
        subtitle: 'Collect your recovery shares to restore access';
        success: 'Account recovered successfully!';
        title: 'Recover your account';
      };
      shareStatus: {
        copied: 'Copied!';
        copy: 'Copy';
        failed: 'Failed';
        pending: 'Pending';
        retrieved: 'Retrieved';
        retrieving: 'Retrieving...';
        retry: 'Retry';
        saved: 'Saved';
        saving: 'Saving...';
      };
      shares: {
        email: 'Email';
        googleDrive: 'Google Drive';
        emailConnectFailed: 'Failed to connect email. Please try again.';
        googleDriveConnectFailed: 'Failed to connect Google Drive. Please try again.';
        localStorageConnectFailed: 'Failed to access local storage. Please try again.';
        recoveryCodeConnectFailed: 'Failed to generate recovery code. Please try again.';
        localStorage: 'Local Storage';
        recoveryCode: 'Recovery Code';
        localStorageDesc: 'Stored on this device';
        emailDesc: 'Sent to your email address';
        googleDriveDesc: 'Saved to your Google Drive';
        recoveryCodeDesc: 'A code you copy and keep safe';
      };
      signup: {
        back: 'Back';
        biometricSetup: 'Enable biometrics';
        biometricSetupEnable: 'Enable biometrics';
        biometricSetupError: 'Failed to enable biometrics. You can always enable it later.';
        biometricSetupNotSupported: 'Biometrics are not supported on this device.';
        biometricSetupSkip: 'Skip for now';
        biometricSetupSubtitle: 'Use Face ID, Touch ID, or fingerprint to unlock your Jumper Account without a password.';
        biometricSetupSuccess: 'Biometrics enabled!';
        biometricSetupTitle: 'Log in faster with biometrics';
        confirmMnemonic: 'Verify your recovery phrase';
        confirmMnemonicDesc: 'Select the correct word for each highlighted position';
        confirmPassword: 'Confirm password';
        continue: 'Continue';
        createAccount: 'Create Account';
        createPassword: 'Create a password';
        distributing: 'Storing recovery shares...';
        distributionComplete: 'Recovery setup complete!';
        loginInstead: 'Already have an account? Login instead';
        disclaimer: 'Important notice';
        disclaimerTitle: 'Your funds are your responsibility';
        disclaimerBody: 'If you lose your password and retrieve fewer than {{threshold}} of your recovery shares, you will permanently lose access to your funds. There is no way to recover them.';
        disclaimerAcknowledge: 'I understand';
        disclaimerAcknowledgeCountdown: 'I understand ({{seconds}}s)';
        mnemonicConfirmed: 'I have saved my recovery phrase';
        mnemonicWarning: 'Write down these 24 words in order. Never share them with anyone. This is the only way to recover your account if all other methods fail.';
        passwordMismatch: 'Passwords do not match';
        passwordRequirements: 'At least 12 characters with a mix of letters, numbers, and symbols';
        advancedSetup: 'Advanced Setup';
        advancedSetupDesc: 'Customize which locations store your recovery shares. At least 3 are required.';
        connect: 'Connect';
        recoveryDesc: 'Choose where to securely store your recovery shares. You will need to store at least {{total}} shares in different locations. {{threshold}} of these shares are required to recover your account.';
        recoverySetup: 'Set up recovery';
        recoverySetupDesc: "Your wallet key is split across {{total}} locations. You'll need {{threshold}} of them to recover your account.";
        sharesMin: 'Minimum {{min}} shares required.';
        thresholdDesc: 'How many shares are needed to recover your account.';
        thresholdLabel: 'Recovery threshold';
        showMnemonic: 'Your recovery phrase';
        subtitle: 'Your keys, your crypto. No third parties.';
        title: 'Create your Jumper Account';
      };
    };
    labels: {
      apy: 'APY';
      assets_one: 'Asset';
      assets_other: 'Assets';
      assets_other_one: 'Asset';
      capInDollar: 'Capacity';
      chains_one: 'Chain';
      chains_other: 'Chains';
      lockupPeriod: 'Lockup Period';
      overview: 'Overview';
      protocol: 'Protocol';
      rewardsApy: 'Rewards APY';
      tvl: 'TVL';
    };
    leaderboard: {
      connectWallet: 'Connect wallet';
      description: 'The leaderboard is updated on a daily basis.';
      rankCtaConnect: 'Where do you rank?';
      title: 'Leaderboard';
      updatedLabel: 'Updated: {{date}}';
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
        back: 'Back';
        buy: 'Buy';
        dashboard: 'Dashboard';
        earn: 'Earn';
        exchange: 'Exchange';
        missions: 'Missions';
        portfolio: 'Portfolio';
        refuel: 'Gas';
      };
      navbarMenu: {
        brandAssets: 'Brand Assets';
        developers: 'Developers';
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
        title: 'Make. The. Jump.';
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
          opened: 'Opened';
          tooltip: {
            address: 'View contract';
            info: 'View earn detail';
          };
        };
      };
      emptyList: {
        clearFilters: 'Clear filters';
        description: 'Unfortunately there are no results for your search, try clearing your filters.';
        title: 'No results';
      };
      filter: {
        asset: 'Asset';
        chain: 'Chain';
        clearAll: 'Clear all';
        filterAndSort: 'Filter and sort';
        protocol: 'Protocol';
        search: 'Search {{filterBy}}...';
        type: 'Type';
        value: 'Value';
        wallet: 'Wallet';
      };
      overviewCard: {
        refreshTooltip: 'Click here to restart the indexing of your assets.';
        title: 'Portfolio';
      };
      sorting: {
        asset: 'Asset';
        chain: 'Chain';
        sort: 'Sort';
        sortBy: 'Sort by';
        totalValue: 'Total Value';
      };
      views: {
        defiProtocols: 'DeFi Protocols';
        tokens: 'Tokens';
        viewBy: 'View by';
      };
      welcome: {
        getStarted: 'Get started';
        subtitle: "<strong>DeFi's interactive portfolio.</strong>";
        title: 'Welcome to Jumper Portfolio!';
      };
    };
    profile_page: {
      achievements: 'Achievements';
      availableRewards: 'Available Rewards';
      campaigns: 'Campaigns';
      copyAddress: 'Copy wallet address';
      level: 'Level';
      levelInfo: 'A higher level increases your odds to win rewards from raffles, perks, partners, rewards and more.';
      levelWithValue: 'Level {{level}}';
      mobileDescription: 'The Jumper Loyalty Pass page is not available on small screens yet. We are working on it.';
      mobileTitle: 'Only available on Desktop';
      noData: {
        caption: 'Start your journey by completing missions, swapping tokens, and bridging across chains to unlock unique achievements and earn XP.';
        cta: 'Start swapping';
        description: "No {{entity}} yet? Let's change that!";
      };
      open: 'Open {{tool}}';
      perks: 'Perks';
      pointsInfo: 'XP is your score for interacting with Jumper. As you gain XP points, your level goes up. XP coming from Jumper transactions is updated on a daily basis.';
      rank: 'Rank';
      rankInfo: 'Rank is your position in the leaderboard. Gain XP and move upward in the leaderboard.';
      rewards: 'Rewards Earned';
      rewardsClaim: {
        action: {
          claim: 'Claim';
          claiming: 'Claiming';
          retry: 'Retry';
        };
        error: 'An unknown error occurred. Please try again.';
      };
      shareProfile: 'Share profile';
      tooltips: {
        unlockAtLevel: 'Unlocked at Level {{level}}';
      };
      unlocked: 'Unlocked';
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
      apy: 'Expected yearly return rate of the tokens invested.';
      assets_one: 'The asset you will earn from';
      assets_other: 'The assets you will earn from';
      assets_other_one: 'The asset you will earn from';
      boostedApy: '{{baseApy}}% is the expected yearly return rate of the underlying tokens invested. The extra {{boostedApy}}% in rewards - distributed in another token - are paid exclusively to the participant of this zap campaign.';
      capInDollar: 'Available liquidity capacity of the market';
      chains_one: 'The chain you will earn from';
      chains_other: 'The chains you will earn from';
      deposit: 'The token on which the market is defined and yield accrues on.';
      depositDisabled: 'Deposit currently disabled for this opportunity. <0>Go to {{protocolName}}</0>';
      deposited: 'The token you have deposited into this market.';
      lockupPeriod: 'Once deposited, your position is subject to an {{formattedLockupPeriod}} lock-up period before you can withdraw the funds.';
      manageYourPosition: 'You can also manage your funds (withdraw, check PNL) on {{partnerName}} UI by clicking on this button';
      noPositionsToManage: 'You do not have any positions to manage';
      protocol: 'The protocol you will earn from';
      rewardsApy: 'Expected yearly return rate distributed in reward token.';
      tvl: 'Total value of crypto assets deposited in this market.';
      withdrawDisabled: 'Withdraw currently disabled for this opportunity. <0>Go to {{protocolName}}</0>';
    };
    widget: {
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

export default Resources;
