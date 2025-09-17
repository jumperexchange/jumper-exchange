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
    leaderboard: {
      connectWallet: 'Connect wallet';
      description: 'The leaderboard is updated on a daily basis.';
      rankCtaConnect: 'Where do you rank?';
      title: 'Leaderboard';
      updatedLabel: 'Updated: {{date}}';
    };
    missions: {
      available: 'Available Missions';
      completed: 'Completed Missions';
      mission: {
        completed: {
          description: 'All tasks in this mission have been verified and completed.';
          title: 'Mission completed';
        };
      };
      status: {
        daysLeft_one: '{{count}} day left';
        daysLeft_other: '{{count}} days left';
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
    privacyPolicy: {
      lastUpdated: 'Last updated: {{date}}';
      sections: {
        changesToPolicy: {
          content: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.';
          title: 'Changes to This Privacy Policy';
        };
        childrenPrivacy: {
          content: 'Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18.';
          title: "Children's Privacy";
        };
        contactUs: {
          content: 'If you have any questions about this Privacy Policy or our data practices, please contact us at:';
          email: 'privacy@jumper.exchange';
          title: 'Contact Us';
        };
        cookies: {
          content: 'We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.';
          title: 'Cookies and Tracking';
        };
        dataRetention: {
          content: 'We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements.';
          title: 'Data Retention';
        };
        dataSecurity: {
          content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.';
          title: 'Data Security';
        };
        howWeUseInformation: {
          content: 'We use the collected information to:';
          items: [
            'Provide and maintain our exchange services',
            'Process transactions and ensure security',
            'Improve user experience and platform functionality',
            'Communicate with you about updates and support',
            'Comply with legal obligations and prevent fraud',
          ];
          title: 'How We Use Your Information';
        };
        informationSharing: {
          content: 'We do not sell your personal information. We may share information only in the following circumstances:';
          items: [
            'With your explicit consent',
            'To comply with legal requirements or court orders',
            'To protect our rights and prevent fraud',
            'With service providers who assist in our operations (under strict confidentiality agreements)',
          ];
          title: 'Information Sharing';
        };
        informationWeCollect: {
          content: 'We may collect the following types of information:';
          items: [
            'Wallet addresses and transaction data when you connect your wallet',
            'Usage data and analytics to improve our services',
            'Communication data when you contact our support team',
            'Technical data including IP addresses and device information',
          ];
          title: 'Information We Collect';
        };
        internationalTransfers: {
          content: 'Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during such transfers.';
          title: 'International Data Transfers';
        };
        introduction: {
          content: 'This Privacy Policy describes how Jumper Exchange ("we", "our", or "us") collects, uses, and shares your personal information when you use our decentralized exchange platform and related services.';
          title: 'Introduction';
        };
        thirdPartyServices: {
          content: 'Our platform may integrate with third-party services for blockchain interactions, analytics, and other functionalities. These services have their own privacy policies, and we encourage you to review them.';
          title: 'Third-Party Services';
        };
        yourRights: {
          content: 'Depending on your jurisdiction, you may have the following rights:';
          items: [
            'Access to your personal information',
            'Correction of inaccurate data',
            'Deletion of your personal information',
            'Portability of your data',
            'Objection to certain processing activities',
          ];
          title: 'Your Rights';
        };
      };
      title: 'Privacy Policy';
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
      boostedApy: '{{baseApy}}% is the expected yearly return rate of the underlying tokens invested. The extra {{boostedApy}}% in rewards - distributed in another token - are paid exclusively to the participant of this zap campaign.';
      deposit: 'The token on which the market is defined and yield accrues on.';
      deposited: 'The token you have deposited into this market.';
      lockupPeriod: 'Once deposited, your position is subject to an {{formattedLockupPeriod}} lock-up period before you can withdraw the funds.';
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
      zap: {
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
