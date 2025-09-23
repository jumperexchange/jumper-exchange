'use client';

import { PageContainer } from '@/components/Containers/PageContainer';
import { DynamicPagesContainer } from '@/components/DynamicPagesContainer';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { format } from 'date-fns';

export const PrivacyPolicyPage = () => {
  const currentDate = format(new Date(), 'MMMM dd, yyyy');

  const sections = [
    {
      key: 'generalInformation',
      title: '1. General Information',
      content: 'Jumper Exchange (hereinafter "Jumper", "we" or "us") takes the protection of personal data very seriously. We treat personal data confidentially and always in accordance with the applicable data protection laws, in particular Regulation (EU) 2016/679 (hereinafter "General Data Protection Regulation" or "GDPR"), the German Federal Data Protection Act (hereinafter "BDSG"), and in accordance with the provisions of this privacy policy. The aim of this privacy policy is to inform you (hereinafter "data subject" or "you") in accordance with Art. 12 et seq. GDPR about how we process your personal data and for what purposes we process your personal data when using our websites (hereinafter "Websites") or contacting us. Unless otherwise stated in this privacy policy, the terms used here have the meaning as defined in the GDPR.'
    },
    {
      key: 'dataController',
      title: '2. Data Controller',
      content: 'Jumper acts as a controller within the meaning of the GDPR in relation to your personal data processed in connection with the use of our Websites or a contact made to or by Jumper. If you have any questions about this privacy policy or the processing of your personal data, you can contact us at the following contact details:',
      email: 'E-mail: legal@jumper.exchange'
    },
    {
      key: 'categoriesPurposes',
      title: '3. Categories, Purposes and Legal Bases of the Personal Data Processed',
      content: 'We process different categories of your personal data for different purposes. Below you can see which personal data we process in which contexts, for which purposes and on which legal basis we base the respective processing.'
    },
    {
      key: 'visitingWebsites',
      title: '3.1. Visiting our Websites',
      content: 'When visiting our Websites for informational purposes, i.e., mere viewing and without you providing us with any other information, certain personal data is automatically collected each time the Websites is visited and stored in so-called server log files/databases. These are:',
      items: [
        'Browser type and version. The specific type and model of Internet browser you are using, such as Google Chrome, Mozilla Firefox, or Microsoft Edge, along with the specific version of the browser.',
        'Operating system used. Your operating system for your digital activity, such as Windows, macOS, Linux, iOS, or Android.',
        'Host name of the accessing computer. The unique name that your device has on the Internet or on a local network.',
        'The date and time of access. The exact time of access to the Websites.',
        'IP address of the requesting computer. The unique numeric identifier assigned to a device when it connects to the Internet.'
      ],
      additionalContent: 'Such data is not merged with other data sources, and the data is not evaluated for marketing purposes. Legal basis: The legal basis for the temporary storage and processing of such personal data is Art. 6 para. 1 sent. 1 lit. f GDPR. Our legitimate interest here is to be able to provide you with technically functional, attractive and user-friendly Websites as well as to ensure the security of our systems. Duration of the storage: Such personal data will be deleted as soon as it is no longer required to achieve the purpose for which it was collected. However, in some cases, e.g., due to legal retention obligations we might be under the legal obligation to continue the storage of your personal data.'
    },
    {
      key: 'contact',
      title: '3.2. Contact',
      content: 'It is possible to contact us on our Websites by e-mail or via the contact form. When you contact us, we collect and process certain information in connection with your specific request, such as, e.g., your name, e-mail address, and other data requested by us or data you voluntarily provide to us (hereinafter "Contact Data"). Legal basis: If you contact us as part of an existing contractual relationship or contact us in advance for information about our range of services, the Contact Data will be processed for the performance of a contract or in order to take steps prior to entering into a contract and to respond to your contact request in accordance with Art. 6 para. 1 sent. 1 lit. b GDPR. Otherwise, the legal basis for the processing of Contact Data is Art. 6 para. 1 sent. 1 lit. f GDPR. The Contact Data is processed to pursue our legitimate interests in responding appropriately to customer/contact inquiries. Duration of storage: We will delete Contact Data as soon as the purpose for data storage and processing no longer applies (e.g., after your request has been processed). However, in some cases, e.g., due to legal retention periods we might be under the legal obligation to continue the storage of your personal data.'
    },
    {
      key: 'newsletter',
      title: '3.3. Newsletter',
      content: 'With your consent, we may process your personal data to send you a newsletter via e-mail that contains information about our products and services. To send you the newsletter, we require to process your e-mail address. Our newsletters contain so-called tracking links that enable us to analyze the behavior of newsletter recipients. We may collect personal data such as regarding the opening of the newsletter (date and time), selected links, and the following information of the accessing computer system: IP address used, browser type and version, device type and operating system ("Tracking Data"). This enables us to statistically analyze the success or failure of online marketing campaigns. Legal basis: The data processing activities with regard to the newsletter sending and newsletter tracking only take place if and insofar as you have expressly consented to it within the merits of Article 6 para. 1 sent. 1 lit. a GDPR. Your prior consent for such processing activities is obtained during the newsletter subscription process (double opt-in) by way of independent consent declaration referring to this privacy policy. You can revoke your consent at any time with effect for the future by clicking on the unsubscribe link in e-mails. The withdrawal of your consent does not affect the lawfulness of processing based on your consent before its withdrawal. Duration of storage: We will delete your personal data as soon as the purpose for data storage and processing no longer applies. Your e-mail address will be stored for as long as the subscription to our newsletter is active. However, in some cases, e.g., due to legal retention periods we might be under the legal obligation to continue the storage of your personal data.'
    },
    {
      key: 'socialMedia',
      title: '4. Social Media and Professional Networks and Platforms',
      content: 'We utilize the possibility of company appearances on social and professional networks and platforms (LinkedIn, X (former Twitter), Telegram, Github, Discord and Medium) in order to be able to communicate with you and to inform you about our services and news about us. You can, inter alia, access the respective network or platform by clicking on the respective network icon displayed on our Websites, which includes a hyperlink. A hyperlink activated by clicking on it opens the external destination in a new browser window of your browser. No personal data is transferred to the respective network before this activation.'
    },
    {
      key: 'visitingSocialMedia',
      title: '4.1. Visiting our Page on Social Media and Professional Networks and Platforms',
      content: 'The respective aforementioned network or platform is, in principle, solely responsible for the processing of personal data when you visit our company page on one of those networks or platforms. Please do not contact us via one of the networks or platforms if you wish to avoid this. You use such networks and platforms and their functions on your own responsibility.'
    },
    {
      key: 'communicationSocialMedia',
      title: '4.2. Communication via Social Media and Professional Networks and Platforms',
      content: 'We process information that you have made available to us via our company page on the respective network or platform, e.g., your (user) name, e-mail address, contact details, communication content, job title, company name, industry, education, contact options, photo, and other data you voluntarily provide to us. The (user) names of the registered network or platform users who have visited our company page on the networks or platforms may be visible to us. Legal basis: If you contact us as part of an existing contractual relationship or contact us in advance for information about our range of services, the personal data will be processed for the performance of a contract or in order to take steps prior to entering into a contract and to respond to your contact request in accordance with Art. 6 para. 1 sent. 1 lit. b GDPR. Otherwise, the legal basis for the processing of the personal data is Art. 6 para. 1 sent. 1 lit. f GDPR. The personal data is processed to pursue our legitimate interests in responding appropriately to customer/contact inquiries. Duration of storage: We will delete your personal data as soon as the purpose for data storage and processing no longer applies (e.g., after your request has been processed). However, in some cases, e.g., due to legal retention periods we might be under the legal obligation to continue the storage of your personal data.'
    },
    {
      key: 'dataReceiver',
      title: '5. Data Receiver',
      content: 'We might transfer your personal data to certain data receivers if such transfer is necessary to fulfill our contractual and legal obligations. In individual cases, we transfer personal data to our consultants in legal or tax matters, whereby these recipients act independently in their own data protection responsibilities and are also obliged to comply with the requirements of the GDPR and other applicable data protection regulations. In addition, they are bound by special confidentiality and secrecy obligations due to their professional position. In the event of corporate transactions (e.g., sale of our business or a part of it), we may transfer personal data to involved advisors or to potential buyers. Additionally, we also use services provided by various specialized companies, e.g., IT service providers, that process data on our behalf (hereinafter "Data Processors"). We have concluded a data processing agreement according to Art. 28 GDPR or EU standard contractual clauses of the EU Commission pursuant to Art. 46 para. 2 lit. c GDPR with each service provider and they only process data in accordance with our instructions and not for their own purposes. Our current Data Processors are:',
      items: [
        'AWS - Cloud hosting and storage',
        'CloudFlare - Content delivery network (CDN) and website security',
        'Namecheap - Domain registration and DNS management',
        'Atlas MongoDB - Database management',
        'Substack - Newsletter distribution',
        'Tally - Contact form management',
        'Google Analytics - Website analytics'
      ]
    },
    {
      key: 'dataTransfers',
      title: '6. Data Transfers to Third Countries',
      content: 'Your personal data is generally processed in Germany and other countries within the European Economic Area (EEA). However, it may also be necessary for personal data to be transferred to recipients located outside the EEA, i.e., to third countries, such as the USA. If possible, we conclude the currently applicable EU standard contractual clauses of the EU Commission pursuant to Art. 46 para. 2 lit. c GDPR with all processors located outside the EEA. Otherwise, we ensure that a transfer only takes place if an adequacy decision exists with the respective third country and the recipient is certified under this, if necessary. We will provide you with respective documentation on request.'
    },
    {
      key: 'yourRights',
      title: '7. Your Rights',
      content: 'The following rights are available to you as a data subject in accordance with the provisions of the GDPR:',
      items: [
        'Right of revocation - You may revoke your consent to the processing of your personal data at any time pursuant to Art. 7 para. 3 GDPR. Please note, that the revocation is only effective for the future. Processing that took place before the revocation remains unaffected.',
        'Right of access - Under the conditions of Art. 15 GDPR you have the right to request confirmation from us at any time as to whether we are processing personal data relating to you. If this is the case, you also have the right within the scope of Art. 15 GDPR to receive access to the personal data as well as certain other information about the personal data and a copy of your personal data. The restrictions of § 34 BDSG apply.',
        'Right to rectification - Under the conditions of Art. 16 GDPR you have the right to request us to correct the personal data stored about you if it is inaccurate or incomplete.',
        'Right to erasure - You have the right, under the conditions of Art. 17 GDPR, to demand that we delete the personal data concerning you without delay.',
        'Right to restrict processing - You have the right to request that we restrict the processing of your personal data under the conditions of Art. 18 GDPR.',
        'Right to data portability - You have the right, under the conditions of Art. 20 GDPR, to request that we hand over, in a structured, common and machine-readable format, the personal data concerning you that you have provided to us. Please note that this right only applies where the processing is based on your consent, or a contract and the processing is carried out by automated means.',
        'Right to object - You have the right to object to the processing of your personal data under the conditions of Art. 21 GDPR.',
        'Right to complain to a supervisory authority - Subject to the requirements of Art. 77 GDPR, you have the right to file a complaint with a competent supervisory authority. As a rule, the data subject may contact the supervisory authority of his or her habitual residence or place of work or place of the alleged infringement or the registered office of Jumper. The supervisory authority responsible for Jumper is the Berlin Commissioner for Data Protection and Information. A list of all German supervisory authorities and their contact details can be found here.'
      ]
    },
    {
      key: 'obligationToProvide',
      title: '8. Obligation to Provide Data',
      content: 'When you visit our Websites, you may be required to provide us with certain personal data as described in this privacy policy. Beyond that, you are under no obligation to provide us with personal data. However, if you do not to provide us with your personal data as required, you may not be able to contact us and/or we may not be able to contact you to respond to your inquiries or questions.'
    },
    {
      key: 'automatedDecisions',
      title: '9. Automated Decisions/Profiling',
      content: 'The processing of your personal data carried out by us does not contain any automated decisions in individual cases within the meaning of Art. 22 para. 1 GDPR.'
    },
    {
      key: 'changesToPolicy',
      title: '10. Changes to This Privacy Policy',
      content: 'We review this privacy policy regularly and may update it at any time. If we make changes to this privacy policy, we will change the date of the last update above. Please review this privacy policy regularly to be aware of any updates. The current version of the privacy notice can be accessed at any time at https://jumper.exchange'
    }
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
            Privacy Policy
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
                    mb: section.items ? 2 : 0,
                    lineHeight: 1.6,
                  }}
                >
                  {section.content}
                </Typography>

                {section.items && (
                  <List sx={{ pl: 2 }}>
                    {section.items.map((item: string, index: number) => (
                      <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{
                                lineHeight: 1.6,
                                '&::before': {
                                  content: '"• "',
                                  color: 'primary.main',
                                  fontWeight: 'bold',
                                },
                              }}
                            >
                              {item}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                {section.additionalContent && (
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 2,
                      lineHeight: 1.6,
                    }}
                  >
                    {section.additionalContent}
                  </Typography>
                )}

                {section.email && (
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 2,
                      fontWeight: 'bold',
                      color: 'primary.main',
                    }}
                  >
                    {section.email}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      </DynamicPagesContainer>
    </PageContainer>
  );
};
