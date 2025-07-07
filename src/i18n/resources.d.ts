interface Resources {
  language: {
    language: {
      key: 'Language';
      value: 'English';
    };
  };
  translation: {
    navbar: {
      welcome: {
        title: 'Find the best route';
        subtitle: '<0>4x audited</0> multi-chain liquidity aggregator';
        cta: 'Get started';
      };
      links: {
        exchange: 'Exchange';
        missions: 'Missions';
        dashboard: 'Dashboard';
        refuel: 'Gas';
        buy: 'Buy';
      };
      statsCards: {
        dexs: 'DEXs';
        bridges: 'Bridges';
        chains: 'Chains';
      };
      connect: 'Connect';
      walletSelectMenu: {
        connectWallet: 'Connect a wallet';
        wallets: 'Wallets';
        ecosystemSelectMenu: {
          selectEcosystem: 'Select wallet ecosystem';
          noEcosystemAdapter: 'No appropriate ecosystem adapter found';
        };
      };
      seeAllWallets: 'See all wallets';
      navbarMenu: {
        learn: 'Learn';
        scan: 'Scan';
        brandAssets: 'Brand Assets';
        theme: 'Theme';
        developers: 'Developers';
        support: 'Support';
        resources: 'Resources';
        profile: 'Profile';
      };
      walletMenu: {
        disconnect: 'Disconnect';
        chains: 'Chains';
        switchChain: 'Switch Chain';
        copy: 'Copy';
        explore: 'Explore';
        copiedMsg: 'Copied';
        walletNotInstalled: '{{wallet}} is not installed';
        connectAnotherWallet: 'Connect another wallet';
        refreshBalances: 'Refresh balances';
        totalBalance: 'Total balance';
        totalBalanceTooltip: "Your total balance may not always be accurate due to potential indexing issues. We're on it!";
        totalBalanceRefresh: 'Click here to restart the indexing of your tokens now.';
        numberOfChains: '{{numberOfChains}} chains';
      };
      themes: {
        dark: 'Dark';
        light: 'Light';
        system: 'System';
        switchToLight: 'Switch to light mode';
        switchToDark: 'Switch to dark mode';
        switchToSystem: 'Switch to system mode';
        lightModeDisabled: 'Light mode is disabled for this theme';
        darkModeDisabled: 'Dark mode is disabled for this theme';
        systemModeDisabled: 'System mode is disabled for this theme';
        default: 'Default';
      };
      developers: {
        github: 'GitHub';
        documentation: 'Documentation';
      };
    };
    discordBanner: {
      ctaHeadline: 'Join our Discord to learn more';
      ctaButton: 'Join our Discord';
    };
    blog: {
      title: 'Tips and tutorials';
      categories: 'Categories';
      allCategories: 'All';
      subtitle: 'TL;DR step-by-step guides to DeFi and crypto for all levels';
      minRead: '{{minRead}} min read';
      seeAllPosts: 'See all posts';
      recentPosts: 'Recent Posts';
      similarPosts: 'Similar Posts';
      goToArticle: 'Go to article';
      openApp: 'Open app';
      faq: 'FAQ';
      jumperCta: 'Try jumper.exchange';
      copiedLink: 'Copied Link';
      shareLinkedIn: 'Share article on LinkedIn';
      shareFb: 'Share article on Facebook';
      shareX: 'Share article on X';
      shareLink: 'Share the link';
    };
    solanaAlert: {
      title: 'Limited Solana token support';
      subtitle: 'Currently only USDC and USDT can be bridged to and from Solana.';
    };
    seiAlert: {
      title: 'Linking of SEI EVM wallet required';
      subtitle: 'To use SEI EVM, you need to link your wallet address to the SEI ecosystem.';
      buttonText: 'Link Wallet';
    };
    abstractAlert: {
      title: 'This wallet only works on Abstract!';
      subtitle: "The Abstract Wallet only exist on Abstract. Don't use this address on any other blockchain, you will lose your funds.";
      buttonText: 'Check the docs';
    };
    featureCard: {
      learnMore: 'Learn more';
    };
    button: {
      okay: 'Okay';
    };
    error: {
      message: 'Something went wrong. Please try reloading the page. If the problem persists, contact our support.';
    };
    multisig: {
      connected: {
        title: 'Multisig wallet connected';
        description: 'Please notify other wallet participants to be ready to sign.';
      };
      transactionInitiated: {
        title: 'Multiple signatures required';
        description: 'Please notify other multisig wallet participants to sign before the transaction expires.';
      };
    };
    questCard: {
      completed: 'Completed';
      join: 'Join';
      xpToEarnDescription: 'Complete the progress bar by {{action}} to earn +{{xpToEarn}} addtional XP this month.';
      earnedXPDescription: "You've unlocked {{earnedXP}}XP by {{action}} so far this month and this has been added to your total XP balance.";
      action: {
        chain_oor: 'exploring chains';
        transact_oor: 'trading';
        swap_oor: 'swapping';
        bridge_oor: 'bridging';
      };
    };
    promo: {
      new: 'New';
    };
    missions: {
      available: 'Available Missions';
      completed: 'Completed Missions';
      status: {
        new: 'New';
        upcoming: 'Upcoming';
        minutesLeft_one: '{{count}} minute left';
        minutesLeft_other: '{{count}} minutes left';
        hoursLeft_one: '{{count}} hour left';
        hoursLeft_other: '{{count}} hours left';
        daysLeft_one: '{{count}} day left';
        daysLeft_other: '{{count}} days left';
      };
    };
    profile_page: {
      campaigns: 'Campaigns';
      mobileTitle: 'Only available on Desktop';
      mobileDescription: 'The Jumper Loyalty Pass page is not available on small screens yet. We are working on it.';
      level: 'Level';
      rank: 'Rank';
      rankInfo: 'Rank is your position in the leaderboard. Gain XP and move upward in the leaderboard.';
      pointsInfo: 'XP is your score for interacting with Jumper. As you gain XP points, your level goes up. XP coming from Jumper transactions is updated on a daily basis.';
      levelInfo: 'A higher level increases your odds to win rewards from raffles, perks, partners, rewards and more.';
      copyAddress: 'Copy wallet address';
      shareProfile: 'Share profile';
      open: 'Open {{tool}}';
      rewards: 'Rewards Earned';
    };
    leaderboard: {
      title: 'Leaderboard';
      description: 'The leaderboard is updated on a daily basis.';
      rankCtaConnect: 'Where do you rank?';
      updatedLabel: 'Updated: {{date}}';
      connectWallet: 'Connect wallet';
    };
    completedMissionsInformation: {
      title: '';
      description: 'As Jumper organize ad-hoc campaigns, the missions are updated on a monthly basis to create the associated graphics. Keep in mind: XP coming from specific campaigns will be updated on a monthly basis as well.';
    };
    format: {
      currency: '{{value, currencyExt(currency: USD)}}';
      decimal: '{{value, decimalExt(maximumFractionDigits: 3)}}';
      percent: '{{value, percentExt()}}';
      decimal2Digit: '{{value, decimalExt(maximumFractionDigits: 2)}}';
      date: '{{value, dateExt(month: long)}}';
      shortDate: '{{value, dateExt(month: short)}}';
    };
    walletHacked: {
      title: 'Move your XP to a different wallet';
      description: 'First, you will have to Connect your old wallet which XP points you want to link to another wallet. After a signature to verify your access, you will be asked to connect a different wallet to repeat those steps for the new wallet. Finally, double check before submitting.';
      steps: {
        intro: {
          title: 'Transfer your XP points to a new wallet';
          description: "To transfer your XP points, you'll need to connect both your current wallet (with XP) and your new wallet. Each wallet will require a signature to verify ownership. After verification, your transfer request will be submitted for approval. Note: Only EVM wallets are supported.";
          buttonLabel: 'Continue';
        };
        source: {
          title: 'Verify your deprecated wallet';
          description: 'Connect your old wallet to verify ownership and access to the XP points.';
          connectDescription: 'Please connect your old wallet that contains the XP points you want to transfer.';
          verifyDescription: 'Please verify that this is the wallet you want to mark as deprecated:';
          signDescription: 'Please sign this message to verify your ownership of the wallet:';
          readyDescription: 'Your wallet has been verified and signed. You can now proceed to connect your new wallet.';
        };
        destination: {
          title: 'Verify your new wallet';
          description: 'Connect your new wallet where you want to transfer the XP points to.';
          connectDescription: 'Please connect your new wallet where you want to transfer the XP points to.';
          verifyDescription: 'Please verify that this is the wallet you want to transfer your XP points to:';
          signDescription: 'Please sign this message to verify your ownership of the new wallet:';
          readyDescription: 'Your new wallet has been verified and signed. You can now proceed to submit the transfer.';
        };
        summary: {
          title: 'Submit';
          description: 'Move {{points}} XP from {{sourceWallet}} to {{destinationWallet}}';
        };
        success: {
          title: 'Transfer Request Submitted';
          description: 'Your XP transfer request has been submitted successfully. We will process your request shortly.';
        };
      };
      actions: {
        continue: 'Continue';
        connectWallet: 'Connect Wallet';
        verifyWallet: 'Verify Wallet';
        sign: 'Sign Message';
        submit: 'Submit';
        done: 'Done';
      };
      errors: {
        sameWalletAsSource: 'This wallet is already set as the source wallet. Please use a different wallet for the destination.';
        sameWalletAsDestination: 'This wallet is already set as the destination wallet. Please use a different wallet for the source.';
        signingFailed: 'Failed to sign the message. Please try again.';
        noWalletConnected: 'No wallet is connected. Please connect a wallet first.';
        nonEVMWallet: 'Only EVM wallets are supported for XP transfer. Please connect an EVM wallet.';
      };
    };
    tooltips: {
      tvl: 'Total value of crypto assets deposited in this market.';
      apy: 'Expected yearly return rate of the tokens invested.';
      deposit: 'The displayed token is the token required to deposit into this market.';
      deposited: 'Amount you have deposited into this market.';
      boostedApy: 'Additional APY you get from participating to this campaign inside Jumper. This APY will be paid in {{token}}.';
    };
    widget: {
      zap: {
        sendToAddressName: 'Send to {{name}}';
        sentToAddressName: 'Sent to {{name}}';
      };
    };
  };
}

export default Resources;
