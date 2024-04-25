import { BlogCTA } from '@/components/Blog/CTAs/BlogCTA/BlogCTA';
import {
  InstructionsAccordion,
  type InstructionItemProps,
} from '@/components/Blog/CTAs/InstructionsAccordion/InstructionsAccordion';
import { Lightbox } from '@/components/Lightbox/Lightbox';
import type { MediaAttributes } from '@/types/strapi';
import { useTheme } from '@mui/material';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';
import { Widget } from '../Widgets';
import { BlogArticleParagraph } from './BlogArticle/BlogArticle.style';
import {
  BlogH1,
  BlogH2,
  BlogH3,
  BlogH4,
  BlogH5,
  BlogH6,
  BlogLink,
  BlogParagraph,
} from './CustomRichBlocks.style';

interface CustomRichBlocksProps {
  baseUrl?: string;
  content: RootNode[] | undefined;
  id?: number;
}

interface ImageData {
  image: MediaAttributes;
}

export const CustomRichBlocks = ({
  id,
  baseUrl,
  content,
}: CustomRichBlocksProps) => {
  const theme = useTheme();
  const customRichBlocks = {
    // You can use the default components to set class names...
    // link: (data: any) => {
    //   return <Link href={data.url}>{data.children[0].props.text}</Link>;
    // },
    image: (data: ImageData) =>
      baseUrl ? <Lightbox imageData={data.image} baseUrl={baseUrl} /> : null,
    heading: ({ children, level }: any) => {
      switch (level) {
        case 1:
          return <BlogH1 variant="h1">{children}</BlogH1>;
        case 2:
          return <BlogH2 variant="h2">{children}</BlogH2>;
        case 3:
          return <BlogH3 variant="h3">{children}</BlogH3>;
        case 4:
          return <BlogH4 variant="h4">{children}</BlogH4>;
        case 5:
          return <BlogH5 variant="h5">{children}</BlogH5>;
        case 6:
          return <BlogH6 variant="h6">{children}</BlogH6>;
        default:
          return <BlogH1 variant="h1">{children}</BlogH1>;
      }
    },
    paragraph: ({ children }: any) => {
      if (children[0].props.text.includes('<JUMPER_CTA')) {
        try {
          const htmlString = children[0].props.text;

          // Regular expressions to extract title and url strings
          const titleRegex = /title="(.*?)"/;
          const urlRegex = /url="(.*?)"/;

          // Extract title and url strings using regular expressions
          const titleMatch = htmlString.match(titleRegex);
          const urlMatch = htmlString.match(urlRegex);

          // Check if matches were found and extract strings
          const title = titleMatch ? titleMatch[1] : null;
          const url = urlMatch ? urlMatch[1] : null;
          return <BlogCTA title={title} url={url} id={id} />;
        } catch (error) {
          return;
        }
      } else if (children[0].props.text.includes('<WIDGET>')) {
        return <Widget starterVariant="default" />;
      } else if (children[0].props.text.includes('<INSTRUCTIONS')) {
        try {
          const new_array: InstructionItemProps[] = [];
          let jso = children[0].props.text
            .replace('<INSTRUCTIONS ', '')
            .replace('/>', '');

          // Parse the JSON string and push each parsed object into the new_array
          JSON.parse(jso).forEach((obj: InstructionItemProps) => {
            new_array.push(obj);
          });

          return <InstructionsAccordion data={new_array} />;
        } catch (error) {
          // console.log(error);
          return;
        }
      } else {
        return (
          <BlogArticleParagraph>
            {children.map((el: any) => {
              if (el.props.text && el.props.text !== '') {
                return (
                  <BlogParagraph
                    sx={{
                      bold: el.props.bold,
                      textDecoration: el.props.underline
                        ? 'underline'
                        : el.props.strikethrough
                          ? 'line-through'
                          : 'auto',
                      fontStyle: el.props.italic ? 'italic' : 'normal',
                    }}
                  >
                    {el.props.text}
                  </BlogParagraph>
                );
              } else if (el.props.content?.type === 'link') {
                return (
                  <BlogLink href={el.props.content.children[0].url}>
                    {el.props.content.children[0].text}
                  </BlogLink>
                );
              } else {
                return null;
              }
            })}
          </BlogArticleParagraph>
        );
      }
    },
  };

  return content ? (
    <BlocksRenderer content={content} blocks={customRichBlocks as any} />
  ) : null;
};
