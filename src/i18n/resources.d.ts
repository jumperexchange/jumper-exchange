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
    blog: {
      allCategories: 'All';
      categories: 'Categories';
      copiedLink: 'Copied Link';
      faq: 'FAQ';
      goToArticle: 'Go to article';
      jumperCta: 'Try jumper.exchange';
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
      depositButtonLabel: 'Quick deposit';
      managePositionsButtonLabel: 'Manage Positions';
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
      copy: {
        forYouBasedOnActivity: 'Handpicked markets selected across {{totalMarkets}}+ based on your account activity';
        forYouDefault: 'Explore curated and comprehensive ways to put your assets to work across {{totalMarkets}}+ markets';
      };
      filter: {
        clear: 'Clear';
        search: 'Search {{filterBy}}...';
        selected: '{{count}} selected';
      };
      overview: {
        updated: 'Updated {{time}} ago';
      };
      relatedMarkets: {
        title: 'Related Markets';
      };
      sorting: {
        apy: 'APY';
        sortBy: 'Sort By';
        tvl: 'TVL';
      };
      top: {
        earnUpTo: 'Your idle <asset/> on <chain/> could earn up to <apy/> a year if placed on <protocol/>';
        makeTheJump: 'Your idle <asset/> on <chain/> could earn up to <apy/> on <protocol/>, make the jump!';
        maximizeYourRevenue: 'Maximise your <tag/> revenues by depositing on <protocol/> <token/> Pool';
        useYourSpare: 'Use your spare <asset/> with <protocol/> and earn up to <apy/> APY';
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
      date: '{{value, dateExt(month: long)}}';
      decimal: '{{value, decimalExt(maximumFractionDigits: 3)}}';
      decimal2Digit: '{{value, decimalExt(maximumFractionDigits: 2)}}';
      percent: '{{value, percentExt()}}';
      shortDate: '{{value, dateExt(month: short)}}';
    };
    labels: {
      apy: 'APY';
      assets_one: 'Asset';
      assets_other: 'Assets';
      assets_other_one: 'Asset';
      chains_one: 'Chain';
      chains_other: 'Chains';
      lockupPeriod: 'Lockup Period';
      overview: 'Overview';
      protocol: 'Protocol';
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
        refuel: 'Gas';
      };
      navbarMenu: {
        brandAssets: 'Brand Assets';
        developers: 'Developers';
        learn: 'Learn';
        privacyPolicy: 'Privacy Policy';
        profile: 'Profile';
        resources: 'Resources';
        scan: 'Scan';
        support: 'Support';
        theme: 'Theme';
      };
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
      welcome: {
        cta: 'Get started';
        subtitle: '<0>4x audited</0> multi-chain liquidity aggregator';
        title: 'Find the best route';
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
      chains_one: 'The chain you will earn from';
      chains_other: 'The chains you will earn from';
      deposit: 'The token on which the market is defined and yield accrues on.';
      deposited: 'The token you have deposited into this market.';
      lockupPeriod: 'Once deposited, your position is subject to an {{formattedLockupPeriod}} lock-up period before you can withdraw the funds.';
      manageYourPosition: 'You can also manage your funds (withdraw, check PNL) on {{partnerName}} UI by clicking on this button';
      noPositionsToManage: 'You do not have any positions to manage';
      protocol: 'The protocol you will earn from';
      tvl: 'Total value of crypto assets deposited in this market.';
    };
    widget: {
      depositCard: {
        apy: 'Base APR';
        boostedApy: 'Boosted APR';
        lockupPeriod: 'Lockup period';
        token: 'Asset';
        tvl: 'TVL';
      };
      sweepTokensCard: {
        button: {
          claim: 'Claim returned funds';
          switchChain: 'Switching chain...';
          transactionInProgress: 'Transaction in progress...';
          viewTransaction: 'View transaction';
          waitingForTransaction: 'Waiting for transaction...';
        };
        error: {
          description: 'A previous transaction failed and your funds are now available to be returned to you.';
          title: 'Claim returned funds';
        };
        success: {
          description: 'Your funds have been returned and are now available to use in your wallet.';
          title: 'Funds successfully returned';
        };
      };
      zap: {
        depositSuccess: 'You will be able to see your position in a few seconds or alternatively by clicking on <bold>Manage your position</bold> that redirects to {{partnerName}} UI';
        placeholder: {
          comingSoon: 'Coming soon';
          'embedded-multisig': {
            description: 'We are working on adding support for embedded and smart contract wallets. In the mean time please use a different wallet to complete this mission.';
            title: 'Your wallet is currently not supported';
          };
          'non-evm': {
            description: 'We are working on adding support for non-EVM wallets. In the mean time please use a different wallet to complete this mission.';
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
