import { JUMPER_DOMAIN } from '@/const/domain';
import { orderedListWithSmallRomanNumbers } from './utils';

export const eligibilityList = [
  {
    title: 'Legal Capacity',
    description:
      'The Functionality is intended solely for your use if you have attained the age of majority in your jurisdiction of residence and possess the legal capacity to enter into binding contracts under applicable law. If you are under the age of eighteen (18) years, or under the age of majority in your jurisdiction of residence, whichever is greater, you are strictly prohibited from accessing or using the Functionality. By accessing or using the Functionality, you represent, warrant, and covenant that you have attained the requisite age and possess the legal capacity to enter into these Terms.',
  },
  {
    title: 'Jurisdictional Restrictions',
    description:
      'Certain jurisdictions prohibit or restrict the use of blockchain-based services, digital asset transactions, or decentralized applications. You represent and warrant that: (a) you are not located in, organized under the laws of, or ordinarily resident in any jurisdiction where your use of the Functionality would be illegal, prohibited, or contrary to applicable law; (b) you are not subject to, nor are you owned or controlled by any person or entity that is subject to, any sanctions administered or enforced by the United States Department of the Treasury\'s Office of Foreign Assets Control ("OFAC"), the United Nations Security Council, the European Union, Her Majesty\'s Treasury, or any other governmental authority with jurisdiction over you or your activities (collectively, "Sanctions"); and (c) you are not identified on any list of prohibited or restricted parties, including without limitation OFAC\'s Specially Designated Nationals and Blocked Persons List, Consolidated Sanctions List, Sectoral Sanctions Identifications List, or any similar list maintained by any governmental authority.',
  },
  {
    title: 'Restricted Jurisdictions',
    description:
      "Without limiting Clause 2.2, access to and use of the Functionality is prohibited for any person or entity that is located in, organized under the laws of, or ordinarily resident in any country or territory that is, or whose government is, the subject of comprehensive trade or economic sanctions, embargoes, or similar restrictions imposed or administered by the United States, the United Kingdom, the European Union, the United Nations, or any other applicable authority (collectively, the \"Restricted Jurisdictions\"). Such jurisdictions include, without limitation, Belarus, Côte d'Ivoire, Crimea, Cuba, Donetsk People's Republic of Ukraine, Iran, Iraq, Kherson region of Ukraine, Liberia, Libya, Luhansk People's Republic of Ukraine, Myanmar, North Korea, Russia, Sudan, Syria, Venezuela, Zaporizhzhia region of Ukraine, together with any other jurisdictions designated from time to time by the U.S. Department of the Treasury's Office of Foreign Assets Control (\"OFAC\"), the United Nations Security Council, the European Union, His Majesty's Treasury (UK), or any other competent sanctions authority. We reserve the right, in our sole discretion, to restrict, suspend, or terminate access to the Functionality if it reasonably suspects that you are located in, acting on behalf of, or otherwise associated with a Restricted Jurisdiction or a sanctioned person, or if you attempt to circumvent such restrictions through virtual private networks, proxies, or similar technologies.",
  },
];

export const functionalityList = [
  {
    title: 'General Description',
    description:
      'The Functionality consists of a website-hosted user interface that provides you with a means to access and interact with blockchain networks, third-party services and decentralized protocols. The Functionality consists of a set of interface features that allow users to user-directedly initiate on-chain interactions directly with third-party protocols for convenience.',
  },
  {
    title: 'Self-Custodial Nature',
    description: (
      <>
        The Functionality operates on a strictly self-custodial basis. This
        means that:
        {orderedListWithSmallRomanNumbers(
          <>
            We never take possession of, hold, or exercise control over any
            digital assets, tokens, private keys, or other assets or property of
            the Users;
          </>,
          <>
            Users retain full and continuous possession, custody, and control of
            their digital assets and private keys;
          </>,
          <>
            No fiduciary, agency, partnership, or trust relationship exists
            between us and any User; and
          </>,
          <>
            All transactions occur directly on a peer-to-peer basis between
            Users and third parties or between Users and blockchain-based smart
            contracts, without any intermediation by us.
          </>,
        )}
      </>
    ),
  },
  {
    title: 'Smart Contract Functionality',
    description: (
      <>
        The Functionality enables Users to engage directly with smart contracts
        deployed on various blockchain networks. You acknowledge and agree that:
        {orderedListWithSmallRomanNumbers(
          <>
            Smart contracts are autonomous, self-executing computer programs
            that function according to programmed code and the consensus rules
            of their respective blockchain networks;
          </>,
          <>
            Smart contract execution and outcomes are determined solely by the
            code, data fed to code by oracles or similar third parties, and the
            state of the blockchain network at the time of execution; and
          </>,
          <>
            We make no representations, warranties, or guarantees regarding the
            functionality, reliability, or outcome of any smart contract
            interaction.
          </>,
        )}
      </>
    ),
  },
  {
    title: 'Network Dependency',
    description:
      'The functionality and availability of the Functionality depends on the performance and integrity of third-party blockchain networks. These decentralized systems are maintained by distributed networks of independent validators, miners, or node operators. We do not operate, control, or maintain any such networks and disclaims all responsibility for any outages, congestion, forks, failures, or disruptions that may affect the availability or operation of the Functionality.',
  },
  {
    title: 'No Financial Services',
    description:
      'The Functionality does not constitute, and we do not provide, a regulated activity including but not limited to brokerage, exchange, payment service provider, financial intermediary, or investment advisory services. We merely provide the infrastructure for user-initiated transactions on a self-custodial basis.',
  },
  {
    title: 'Informational and Educational Content',
    description:
      'The Functionality may include information related to blockchain technology, digital assets, or decentralized finance. Such content is provided solely for informational purposes and does not constitute financial, investment, legal, or tax advice, nor does it represent a recommendation or offer to engage in any particular transaction or strategy. Users are responsible for conducting their own due diligence or consulting qualified professionals before making any related decisions.',
  },
];

export const thirdPartyServicesList = [
  {
    description:
      'The Functionality may include integrations, links or other access to third-party services, sites, technology, APIs, content and resources (each a “Third-Party Functionality”). Your access and use of the Third-Party Functionality may also be subject to additional terms and conditions, privacy policies, or other agreements with such third party. You agree to comply with all terms, conditions, and policies applicable to any Third-Party Functionality integrated with or made available through the Functionality. We do not have visibility into, nor do we control, the terms on which any Third-Party Functionality may be modified, suspended, or terminated.',
  },
  {
    description:
      'You will be responsible for any and all costs and charges associated with your use of any Third-Party Functionality. We do not curate, select, recommend, endorse, sponsor, or approve any Third-Party Functionality, nor do we make any judgment as to their quality, legality, security, suitability, or appropriateness for any particular user or use case. We enable the Third-Party Functionality merely as a convenience and the integration or inclusion of such Third-Party Functionality does not imply an endorsement or recommendation. Any dealings you have with third parties while using our Products are between you and the third party. We do not assume any responsibility for the suitability of any Third-Party Functionality for your individual circumstances. We will not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any Third-Party Functionality. We do not assume responsibility for the ongoing operation, performance, availability, or results of any Third-Party Functionality and have no obligation to monitor, update, or remove any Third-Party Functionality except as required to maintain the technical functionality or security of the interface. ',
  },
  {
    description:
      'When you interact with any Third-Party Functionality, we may display information about your on-chain activities or other content that is publicly available on the blockchain and/or provided by such Third-Party Functionaliy. You should assume that we have not verified the accuracy of any such information, and we will not be liable for any losses that you may incur as a result of relying on such information.',
  },
];

export const feesList = [
  {
    description:
      'We may charge fees for some or part of the Functionality. We reserve the right to change those fees at our discretion. We will disclose the amount of fees we will charge you for the applicable Functionality at the time that you access it or at the time indicated in any notice to you.',
  },
  {
    description:
      'You may incur charges from third parties for your use of any Third-Party Functionality. Any fees charged by us, if applicable, relate to the provision, operation, and ongoing maintenance of the user interface and technical aggregation services made available through the Functionality. Fees may be determined by reference to certain characteristics of a user-initiated on-chain interaction. Such reference is used solely to quantify usage of the interface and aggregation features provided through the Functionality and shall not constitute or be construed as consideration for, or participation in, the execution or settlement of any transaction. Unless otherwise stated, third-party fees are neither charged by, nor paid to, us. Any fee charged by us will be designated as such, and presented before you submit your transaction.',
  },
  {
    description:
      'For the avoidance of doubt, the calculation or triggering of any fee does not reflect any selection, prioritisation, or endorsement of a particular Third-Party Functionality and is independent of the economic outcome of any on-chain interaction.',
  },
];

export const changesList = [
  {
    description:
      'We reserve the right to modify, amend, revise, supplement, or update these Terms at any time, for any reason or no reason, in our sole and absolute discretion. We will provide notice of material changes to these Terms by: (a) Posting the updated Terms on or through the Functionality; (b) Updating the "Effective Date" date at the top of these Terms; or (c) Providing notice through the Functionality, by email, or by other reasonable means (at our sole discretion). It’s important that you review the Terms whenever we modify them because if you continue to use the Functionality after we have modified the Terms, you are agreeing to be bound by the modified Terms. If you don’t agree to be bound by the modified Terms, then you must cease using the Functionality.',
  },
  {
    description:
      'We reserve the absolute and unconditional right, at any time and from time to time, in its sole and absolute discretion, without prior notice to you and without any liability whatsoever, to: (a) Modify, update, change, enhance, add features to, or remove features from the Functionality or any part thereof; (b) Temporarily or permanently suspend, discontinue, or terminate the Functionality or any part thereof; (c) Restrict, limit, or condition access to the Functionality or any features, functionality, or content thereof; (d) Change the availability, functionality, or user interface of the Functionality; (e) Impose new fees, charges, or costs for access to or use of the Functionality; (f) Add, remove, modify, or restrict integrations with Third-Party Functionality; (g) Modify, update, or change the technical requirements, specifications, or compatibility requirements for using the Functionality.',
  },
];

export const prohibitedList = [
  {
    description:
      'Engage in Unlawful or Fraudulent Activity. Use the Functionality for any unlawful, illegal, fraudulent, deceptive, or prohibited purpose, including but not limited to: (a) engaging in or facilitating money laundering, terrorist financing, fraud, theft, or any other financial crime; (b) purchasing, selling, or distributing illegal goods or services, including narcotics, controlled substances, weapons, explosives, stolen property, counterfeit items, or contraband; (c) evading, avoiding, or violating any applicable tax, sanctions, or regulatory requirements; (d) harming or damaging any person or entity, or (e) infringing, misappropriating, or otherwise violating the intellectual property, privacy, publicity, or proprietary rights of any person.',
  },
  {
    description:
      'Violate Sanctions or Regulatory Restrictions. Transact with, transfer assets to or from, or otherwise engage with any person, entity, or jurisdiction that is the subject of applicable trade or economic sanctions, export control laws, embargoes, or other governmental restrictions.',
  },
  {
    description:
      'Interfere with or Exploit the Functionality. Attempt to access, disrupt, damage, or interfere with the operation, performance, or security of the Functionality or any blockchain network or system connected thereto, including but not limited to: (a) introducing, uploading, or transmitting any virus, worm, Trojan horse, malware, or other harmful code; (b) circumventing or attempting to circumvent any access controls, authentication mechanisms, security measures, or technical safeguards; (c) engaging in denial-of-service attacks, network flooding, or similar disruptive activities; or (d) exploiting any bug, vulnerability, logic flaw, or unintended feature for personal gain or to the detriment of others.',
  },
  {
    description:
      'Engage in Deceptive or Manipulative Conduct. Engage in any act or practice that is false, misleading, or deceptive, including but not limited to: (a) impersonating any person or entity, or misrepresenting your affiliation with any person or entity; (b) providing false, inaccurate, or misleading information in connection with your use of the Functionality; or (c) manipulating, falsifying, or misrepresenting data, transactions, or market activity in any way.',
  },
  {
    description:
      'Use Unauthorized Automation or Data Extraction. Access, query, or interact with the Functionality through any automated means, including but not limited to bots, spiders, scrapers, crawlers, or data-mining tools not expressly authorized by us, or harvest, extract, or copy data or content from the Functionality without prior written consent.',
  },
  {
    description:
      'Misuse or Abuse the Functionality. Use the Functionality in any manner that could: (a) damage, disable, impair, or overburden the Functionality or related systems; (b) interfere with the access, use, or enjoyment of the Functionality by any other person; or (c) use the Functionality for benchmarking, reverse engineering, competitive analysis, or the development of competing products or services.',
  },
];

export const disclaimersList = [
  {
    description:
      '“AS IS” and “AS AVAILABLE” Basis. The Functionality is provided on an "AS IS" and "AS AVAILABLE" basis, except as otherwise required by applicable law. To the fullest extent permitted by law, we and our affiliates, contractors, service providers, and licensors disclaim all warranties - express, implied, statutory, or otherwise - including any implied warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, reliability, or availability.',
  },
  {
    description:
      'Third-Party Functionality. The Functionality may interoperate with or rely upon third-party services. We do not control, endorse, or guarantee any third-party service, product, or content and provide no warranty regarding their availability, legality, or performance. You are solely responsible for reviewing and accepting any applicable third-party terms before using such services.',
  },
  {
    description:
      'Blockchain Network and Smart Contract Risks. You acknowledge that blockchain networks, smart contracts, and decentralized technologies are experimental and may fail, fork, or behave unpredictably. We do not operate or control any blockchain network and make no warranty regarding the security, functionality, or outcomes of any smart-contract execution. We cannot reverse or modify any blockchain transaction once confirmed on-chain.',
  },
  {
    description:
      'Key Management Risks. You acknowledge that you are solely in control and responsible for storing and securing your private key(s), recovery phrase, credential or other means of authorization necessary to access your wallet.  ',
  },
  {
    description:
      'Decentralized Lending Risks. You acknowledge that we act solely as a technology provider facilitating your direct interaction with decentralized lending protocols and their associated vaults. We do not hold custody of your digital assets deposited into the vaults, nor do we act as a financial institution, lender, or borrower. You understand that participation in decentralized lending protocols involves inherent risks, including but not limited to smart contract vulnerabilities, oracle failures, market volatility, liquidation risks, and the risk of losing your funds due to borrower defaults or other protocol failures. All lending and borrowing activities, including interest rates and liquidation thresholds, are governed by the smart contracts of the relevant third-party lending protocols, over which we have no control. While we may facilitate access to certain lending vaults, we provide no guarantee of returns, and you assume full responsibility for assessing and accepting all associated risks.',
  },
  {
    description:
      'Bridging Risks. You acknowledge that we do not create, own or operate cross-chain bridges and we do not make any representation or warranty about the safety and soundness of any cross-chain bridge.',
  },
  {
    description:
      'Swapping Risks. You acknowledge that we do not facilitate the execution or settlement of your trades, which occur entirely on blockchain networks. As a result, we do not (and cannot) guarantee market best pricing or best execution through our Functionality or when using our Jumper (an interface aggregating third-party liquidity sources) functionality, which routes trades across a variety of protocols. Any references in the Functionality to "best price" or similar expressions describe the output of automated, technical aggregation logic based on predefined parameters and available third-party data and do not constitute a representation, warranty or recommendation about pricing available through such Functionality, nor do they imply that we have assessed or selected any Third-Party Functionality on your behalf. Routing outcomes are determined by technical aggregation logic and user-selected parameters and do not involve discretionary decision-making or protocol selection by us.',
  },
  {
    description:
      'Security Risks. While we apply commercially reasonable security practices, no technology is entirely secure. We do not warrant that the Functionality or any related systems will be free from malware, unauthorized access, cyberattacks, phishing, or other malicious activity that could compromise data or digital assets.',
  },
];

export const limitationList = [
  {
    description:
      'Under no circumstances shall we, any Jumper Party, or any provider of Third-Party Functionality be liable to you for any indirect, punitive, incidental, special, consequential, or exemplary damages, including, but not limited to, damages for loss of profits, goodwill, use, data, or other intangible property, arising out of or relating to any access or use of or inability to access or use any of the Functionality or any Third-Party Functionality, nor will we be responsible for any damage, loss, or injury resulting from hacking, tampering, or other unauthorized access or use of any of the products, Third-Party Functionality or the information contained within it, whether such damages are based in contract, tort, negligence, strict liability, or otherwise, arising out of or in connection with authorized or unauthorized use of any of the Functionality or any Third-Party Functionality, even if an authorized representative of Ultima Liquiditas JE BVI Ltd. has been advised of or knew or should have known of the possibility of such damages. We assume no liability or responsibility for any: (a) errors, mistakes, or inaccuracies of content; (b) personal injury or property damage, of any nature whatsoever, resulting from any access or use of the interface; (c) unauthorized access or use of any secure server or database in our control, or the use of any information or data stored therein; (d) interruption or cessation of function related to any of the Functionality or Third-Party Functionality; (e) bugs, viruses, trojan horses, or the like that may be transmitted to or through the interface; (f) errors or omissions in, or loss or damage incurred as a result of the use of, any content made available through any of the Functionality or Third-Party Functionality; and (g) the defamatory, offensive, or illegal conduct of any third party.',
  },
  {
    description:
      'We have no liability to you or to any third party for any claims or damages that may arise as a result of any payments or transactions that you engage in via any of our Functionality or any Third-Party Functionality, or any other payment or transactions that you conduct via any of our Functionality. ',
  },
  {
    description:
      'Neither we nor any providers of Third-Party Functionality make any warranties or representations, express or implied, about linked Third-Party Functionality, the third parties they are owned and operated by, the information contained on them, assets available through them, or the suitability, privacy, or security of their products or services. You acknowledge sole responsibility for and assume all risk arising from your use of Third-Party Functionality, third-party websites, applications, or resources. We shall not be liable under any circumstances for damages arising out of or in any way related to software, products, services, and/or information offered or provided by third parties and accessed through any of our products.',
  },
  {
    description:
      'Some jurisdictions do not allow the limitation of liability for personal injury, or of incidental or consequential damages, so this limitation may not apply to you. In no event shall our total liability to you for all damages (other than as may be required by applicable law in cases involving personal injury) exceed the amount of one hundred U.S. dollars ($100.00 USD) or its equivalent in the local currency of the applicable jurisdiction.',
  },
  {
    description:
      'The foregoing disclaimer will not apply to the extent prohibited by law.',
  },
];

export const disputeList = [
  {
    description: `Informal Resolution. Before initiating any legal or arbitral action, you and we agree to make reasonable, good-faith efforts to resolve any dispute, claim, or controversy arising out of or relating to these terms (each, a "Dispute"). Either party may start this process by sending written notice describing the issue and requested resolution. Such written notice must be sent to legal@${JUMPER_DOMAIN} and must clearly state that it is submitted pursuant to clause 13 (Dispute Resolution) of these Terms. If the Dispute is not resolved within forty-five (45) business days, either party may proceed as set forth below.  `,
  },
  {
    description:
      'Binding Arbitration. Except as provided in clause 13 lit. d (Exceptions and Consumer Rights), any Dispute that cannot be resolved informally shall be finally settled by binding arbitration administered by the International Centre for Dispute Resolution (ICDR) under its International Arbitration Rules in effect at the time of the arbitration. The arbitration shall be conducted by a single neutral arbitrator with relevant experience in technology or digital-asset matters. The seat and governing law of the arbitration shall be the British Virgin Islands, and the language shall be English. The arbitrator may award any remedy available in court under applicable law, subject to the limitations in clause 11 (Limitation of Liability) and Clause 12 (Waiver of Injunctive and Equitable Relief). The arbitral award shall be final and binding, and judgment may be entered in any court of competent jurisdiction.',
  },
  {
    description:
      'Waiver of Class and Representative Actions. You and we agree that each may bring claims only in an individual capacity and not as a plaintiff or class member in any class, collective, consolidated, or representative proceeding. You expressly waive the right to proceed in any class, mass, group or representative capacity. The arbitrator may not consolidate claims or preside over any form of class, mass, group or representative action.',
  },
  {
    description: (
      <>
        Exceptions and Consumer Rights.
        {orderedListWithSmallRomanNumbers(
          <>
            Either party may bring an individual claim in small-claims court
            where permitted by law.
          </>,
          <>
            Residents of the European Union, the United Kingdom, or any
            jurisdiction whose laws prohibit mandatory arbitration or require
            local adjudication may elect to have any Dispute heard in the courts
            of their country of residence under local consumer law.
          </>,
          <>
            Nothing in this Agreement limits or excludes any statutory rights
            you may have as a consumer.
          </>,
          <>
            If clause 13 lit. b (Binding Arbitration) does not apply to you and
            you may resolve any claim you have with us relating to, arising out
            of, or in any way in connection with our Terms, us, or our
            Functionality in a court of competent jurisdiction.
          </>,
        )}
      </>
    ),
  },
  {
    description:
      'Exclusion of UN Convention. The United Nations Convention on Contracts for the International Sale of Goods shall not apply to this Agreement or any transaction contemplated hereby.',
  },
];

export const miscellaneousList = [
  {
    description:
      'Entire Agreement. These Terms and any other documents incorporated by reference comprise the entire understanding and agreement between you and us as to the subject matter hereof, and supersedes any and all prior discussions, agreements and understandings of any kind (including without limitation any prior versions of these Terms).',
  },
  {
    description:
      'Headings. Headings in these Terms are for convenience only and shall not govern the meaning or interpretation of any provision of these Terms. ',
  },
  {
    description:
      'Assignment. We reserve the right to assign our rights without restriction, including without limitation to any Jumper Party, or to any successor in interest of any business associated with the Functionality. In the event that Ultima Liquiditas JE BVI Ltd. is acquired by or merged with a third party entity, we reserve the right, in any of these circumstances, to transfer or assign the information we have collected from you as part of such merger, acquisition, sale, or other change of control. You may not assign any rights and/or licenses granted under these Terms. Any attempted transfer or assignment by you in violation hereof shall be null and void. Subject to the foregoing, these Terms will bind and insure to the benefit of the parties, their successors and permitted assigns.',
  },
  {
    description:
      'Severability. If any provision of this Agreement is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction or arbitrator: (a) Such provision shall be deemed modified to the minimum extent necessary to make it enforceable, or if it cannot be made enforceable, it shall be severed from this Agreement; (b) The invalidity, illegality, or unenforceability of any provision shall not affect the validity, legality, or enforceability of any other provision of this Agreement; (c) The remaining provisions of this Agreement shall remain in full force and effect.',
  },
  {
    description:
      'Non-Waiver of Rights. Our failure to insist upon or enforce any right or provision of this Agreement shall not constitute a waiver of such right or provision or any other right or provision.',
  },
  {
    description:
      'Force Majeure. We shall not be liable for delays, failure in performance or interruption of service that result directly or indirectly from any cause or condition beyond our reasonable control, including but not limited to, significant market volatility, act of God, act of civil or military authorities, act of terrorists, civil disturbance, war, strike or other labor dispute, fire, interruption in telecommunications or Internet services or network provider services, failure of equipment and/or software, pandemic, other catastrophe or any other occurrence that is beyond our reasonable control and shall not affect the validity and enforceability of any remaining provisions.',
  },
  {
    description:
      'Third-Party Beneficiaries. Unless explicitly stated, these Terms do not give rise to any third-party rights.',
  },
  {
    description:
      'Interpretation. In these Terms: (a) "including" means "including without limitation"; (b) "or" is not exclusive; (c) words in the singular include the plural and vice versa; (d) references to a person include that person\'s successors and permitted assigns; (e) references to "writing" include electronic communications; and (f) the word "will" shall be construed to have the same meaning and effect as the word "shall."',
  },
  {
    description:
      'No Agencies; No Reliance. For the avoidance of doubt, we do not act as your agent, representative, broker, fiduciary, intermediary, advisor, principal or delegate in connection with any interaction initiated through the Functionality. You act exclusively on your own behalf and at your own discretion when interacting with third-party protocols.',
  },
  {
    description:
      'No Informal Waivers, Agreements, or Representations. Our employees, contractors, and agents are not authorized to make modifications to these Terms or to make any representations, warranties, promises, or commitments on our behalf that are inconsistent with or in addition to these Terms. Any such statements or promises shall be null and void and shall not be enforceable against us.',
  },
  {
    description:
      'Governing law. These Terms shall be governed by the laws of the British Virgin Islands.',
  },
];
