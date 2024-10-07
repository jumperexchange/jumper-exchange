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
        copiedMsg: 'Wallet address copied';
        walletNotInstalled: '{{wallet}} is not installed';
        connectAnotherWallet: 'Connect another wallet';
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
      alert: {
        title: 'Multisig wallet connected';
        description: 'Destination wallet address is required to complete the exchange.';
      };
    };
    questCard: {
      completed: 'Completed';
      join: 'Join';
      xpToEarnDescription: 'Complete the progress bar to earn +{{xpToEarn}} addtional XP this month.';
      earnedXPDescription: "You've unlocked {{earnedXP}}xp so far this month and this has been added to your total XP balance";
    };
    missions: {
      available: 'Available Missions';
      completed: 'Completed Missions';
    };
    profile_page: {
      mobileTitle: 'Only available on Desktop';
      mobileDescription: 'The Jumper Profile page is not available on small screens yet. We are working on it.';
      rank: 'Leaderboard is updated on a daily basis';
      pointsInfo: 'XP is your score for interacting with Jumper. As you gain XP points, your level goes up.';
      levelInfo: 'A higher level increases your odds to win rewards from raffles, perks, partners, rewards and more.';
    };
  };
}

export default Resources;
