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
        brandAssets: 'Brand Assets';
        theme: 'Theme';
        developers: 'Developers';
        support: 'Support';
        profile: 'Jumper Profile';
        fest: 'Superfest Festival';
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
    };
    profile_page: {
      mobileTitle: 'Only available on Desktop';
      mobileDescription: 'The Jumper Profile page is not available on small screens yet. We are working on it.';
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
      decimal2Digit: '{{value, decimalExt(maximumFractionDigits: 2)}}';
      date: '{{value, dateExt(month: long)}}';
      shortDate: '{{value, dateExt(month: short)}}';
    };
  };
}

export default Resources;
