'use client';

import { PageContainer } from '@/components/Containers/PageContainer';
import { DynamicPagesContainer } from '@/components/DynamicPagesContainer';
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import { orderedListWithSmallLetters } from './utils';
import {
  changesList,
  disclaimersList,
  disputeList,
  eligibilityList,
  feesList,
  functionalityList,
  limitationList,
  miscellaneousList,
  prohibitedList,
  thirdPartyServicesList,
} from './lists';
import { de } from 'date-fns/locale';
import Link from 'next/link';
import { JUMPER_PRIVACY_POLICY_PATH, JUMPER_URL } from '@/const/urls';
import { JUMPER_DOMAIN } from '@/const/domain';

export const TermsOfBusinessPage = () => {
  const currentDate = format(new Date(), 'MMMM dd, yyyy');

  const sections = [
    {
      key: 'introduction',
      title: '',
      content: (
        <>
          Ultima Liquiditas JE BVI Ltd. (“we”, “us” or “our”) may provide you
          (“you”, “your”, or “User”) the ability to access the functionality
          provided by one or more third parties using a native interface
          (collectively “Functionality”). The Functionality shall include, but
          not limited to, (a) a website available at {JUMPER_URL} and (b) the
          aggregation of access to various third-party tools and services across
          multiple blockchain networks, such as decentralized exchange (DEX)
          and/or yield/staking aggregation protocols. The Functionality is
          provided on a{' '}
          <strong>
            non-custodial, user-directed basis. We do not custody or control
            your digital assets at any time, do not serve as a counterparty to
            any trades or transfers, do not execute trades or transfers on your
            behalf, and do not operate any proprietary exchange, broker,
            custodian, or other financial service
          </strong>
          . These Terms of Business (the “Terms”) constitute a legally binding
          agreement and explain the terms and conditions by which you may access
          and use the Functionality. The Terms also incorporate our Privacy
          Policy by reference,{' '}
          <Link href={JUMPER_PRIVACY_POLICY_PATH}>available here:</Link>. By
          using or assessing the Functionality in any manner, including but not
          limited to connecting your wallet, you, (a) accept and agree to these
          Terms and (b) consent to the collection, use, disclosure and other
          handling of information as described in our Privacy Policy.
        </>
      ),
    },
    {
      key: 'arbitration',
      title: '',
      content:
        'ARBITRATION NOTICE: THESE TERMS CONTAIN AN ARBITRATION CLAUSE UNDER THE HEADING “DISPUTE RESOLUTION”. BY ACCEPTING THESE TERMS YOU AGREE THAT DISPUTES WILL BE RESOLVED BY BINDING, INDIVIDUAL ARBITRATION, AND YOU WAIVE YOUR RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS ACTION OR OTHER REPRESENTATIVE PROCEEDING. NOTWITHSTANDING THE FOREGOING, NOTHING IN THESE TERMS SHALL LIMIT OR AFFECT ANY STATUTORY OR MANDATORY CONSUMER RIGHTS THAT CANNOT BE WAIVED UNDER APPLICABLE LAW.',
    },
    {
      key: 'eligibility',
      title: '1. Eligibility',
      content: orderedListWithSmallLetters(...eligibilityList),
    },
    {
      key: 'functionalities',
      title: '2. The Functionality',
      content: orderedListWithSmallLetters(...functionalityList),
    },
    {
      key: 'thirdPartyFunctionality',
      title: '3. Third-Party Functionality and Environments',
      content: orderedListWithSmallLetters(...thirdPartyServicesList),
    },
    {
      key: 'fees',
      title: '4. Fees',
      content: orderedListWithSmallLetters(...feesList),
    },
    {
      key: 'changesToFunctionality',
      title: '5. Changes to Functionality and Terms',
      content: orderedListWithSmallLetters(...changesList),
    },
    {
      key: 'prohibitedActivities',
      title: '6. Prohibited Activities',
      content: (
        <>
          <div>
            You expressly agree that you shall not, and shall not permit, cause,
            or enable any third party to, use the Functionality in any manner
            that violates these Terms, any applicable law, regulation, and
            order, or the rights of any third party. Without limiting the
            generality of the foregoing, you agree that you shall not:
          </div>
          {orderedListWithSmallLetters(...prohibitedList)}
        </>
      ),
    },
    {
      key: 'termination',
      title: '7. Termination',
      content:
        'We may terminate your access to and use of the Functionality, at our sole discretion, at any time and without notice to you. You may terminate by ceasing any and all use of the Functionality. Upon any termination the following clauses will survive: 8 (Disclaimers), 10 (Indemnity), 11 (Limitation of Liability), 12 (Waiver of Injunctive and Equitable Relief), and 13 (Dispute Resolution).',
    },
    {
      key: 'disclaimers',
      title: '8. Disclaimers',
      content: orderedListWithSmallLetters(...disclaimersList),
    },
    {
      key: 'complianceAndTaxObligations',
      title: '9. Compliance and Tax Obligations',
      content:
        'By accessing or using any of our Functionality, you agree that you are solely and entirely responsible for compliance with all laws and regulations that may apply to you. Specifically, your use of our Functionality may result in various tax consequences, such as income or capital gains tax, value-added tax, goods and services tax, or sales tax in certain jurisdictions. It is your responsibility to determine whether taxes apply to any transactions you initiate or receive and, if so, to report and/or remit the correct tax to the appropriate tax authority.',
    },
    {
      key: 'indemnity',
      title: '10. Indemnity',
      content:
        "You agree to hold harmless, release, defend, and indemnify Ultima Liquiditas JE BVI Ltd., our affiliates and our and our affiliates' respective officers, directors, employees, contractors, agents, service providers, licensors, and representatives (collectively, the “Jumper Parties”) from and against all claims, damages, obligations, losses, liabilities, costs, and expenses (including reasonable attorney's fees) arising from or relating to: (a) your access and use of any of our Functionality or any Third-Party Functionality; (b) your violation of any clause of these Terms, the right of any third party, or any other applicable law, rule, or regulation; (c) any other party's access and use of any of our Functionality or any Third-Party Functionality with your assistance or using any device or account that you own or control; and (d) any dispute between you and (i) any other user of any of the Functionality or any Third-Party Functionality or (ii) any of your own customers or users. We reserve the right to assume the exclusive defense and control of any matter which is subject to indemnification under this section, and you agree to cooperate with any reasonable requests assisting our defense of such matter. You may not settle or compromise any claim against any Jumper Party without our written consent. ",
    },
    {
      key: 'limitationOfLiability',
      title: '11. Limitation of Liability',
      content: orderedListWithSmallLetters(...limitationList),
    },
    {
      key: 'waiverOfInjunctiveRelief',
      title: '12. Waiver of Injunctive and Equitable Relief',
      content:
        "To the maximum extent permitted by applicable law, you agree that you will not be permitted to obtain, and you hereby waive any right to seek, an injunction, specific performance, or other form of injunctive and or equitable relief that would interfere with or prevent the development, operation, deployment, modification, or exploitation of: (a) The Functionality or any part thereof; (b) Any blockchain network, smart contract, protocol, or decentralized application; (c) Any other website, application, content, product, service, or intellectual property owned, licensed, used, or controlled by any Jumper Party or any third party; (e) Any Third-Party Functionality or any third party's business operations. This waiver applies even if your sole or best remedy is equitable or injunctive in nature and even if legal remedies are determined to be inadequate.",
    },
    {
      key: 'disputeResolution',
      title: '13. Dispute Resolution',
      content: orderedListWithSmallLetters(...disputeList),
    },
    {
      key: 'miscellaneous',
      title: '14. Miscellaneous',
      content: orderedListWithSmallLetters(...miscellaneousList),
    },
    {
      key: 'contactInformation',
      title: '15. Contact Information',
      content: (
        <>
          If you have any questions about these Terms or the Functionality,
          please contact us at{' '}
          <a href={`mailto:legal@${JUMPER_DOMAIN}`}>legal@{JUMPER_DOMAIN}</a>.
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <DynamicPagesContainer>
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 'bold',
              mb: 2,
              textAlign: 'center',
            }}
          >
            Terms Of Business
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            Last updated: {currentDate}
          </Typography>

          {sections.map((section) => {
            return (
              <Box key={section.key} sx={{ mb: 4 }}>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 'bold',
                    mb: 2,
                    color: 'primary.main',
                  }}
                >
                  {section.title}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.6,
                  }}
                  component="div"
                >
                  {section.content}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </DynamicPagesContainer>
    </PageContainer>
  );
};
