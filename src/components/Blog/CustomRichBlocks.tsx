import { BlogCTA } from '@/components/Blog/CTAs/BlogCTA/BlogCTA';
import {
  InstructionsAccordion,
  type InstructionItemProps,
} from '@/components/Blog/CTAs/InstructionsAccordion/InstructionsAccordion';
import { Lightbox } from '@/components/Lightbox/Lightbox';
import { Link } from '@/components/Link.style';
import type { MediaAttributes } from '@/types/strapi';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';
import type { BlogWidgetProps } from './BlogWidget';
import { BlogWidget } from './BlogWidget';
import {
  BlogH1,
  BlogH2,
  BlogH3,
  BlogH4,
  BlogH5,
  BlogH6,
  BlogParagraph,
} from './CustomRichBlocks.style';
import type { ThemeModesSupported } from '@/types/settings';

interface CustomRichBlocksProps {
  baseUrl?: string;
  content: RootNode[] | undefined;
  id?: number;
  activeTheme?: ThemeModesSupported;
}

interface ImageData {
  image: MediaAttributes;
}

// TODO: Fix dynamic typing line 102
interface WidgetRouteSettings
  extends Omit<BlogWidgetProps, 'activeTheme' | 'fromChain' | 'toChain'> {
  fromChain?: string;
  toChain?: string;
}

export const CustomRichBlocks = ({
  id,
  baseUrl,
  content,
  activeTheme,
}: CustomRichBlocksProps) => {
  const customRichBlocks = {
    // You can use the default components to set class names...
    link: (data: any) => {
      return <Link href={data.url}>{data.children[0].props.text}</Link>;
    },
    image: (data: ImageData) =>
      baseUrl ? <Lightbox imageData={data.image} baseUrl={baseUrl} /> : null,
    heading: ({ children, level }: any) => {
      switch (level) {
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
      } else if (children[0].props.text.includes('<WIDGET')) {
        // Regular expression to match specific props
        try {
          const propRegex =
            /(?:fromAmount|fromChain|fromToken|toChain|toToken|allowChains)="([^"]*)"/g;

          let match;
          const props: WidgetRouteSettings = {};
          while ((match = propRegex.exec(children[0].props.text)) !== null) {
            const [, value] = match;
            const prop = match[0].split('=')[0] as keyof WidgetRouteSettings;
            props[prop] = value;
          }

          return (
            <>
              <BlogWidget
                fromChain={
                  props.fromChain !== undefined
                    ? parseInt(props.fromChain)
                    : undefined
                }
                fromToken={props.fromToken}
                toChain={
                  props.toChain !== undefined
                    ? parseInt(props.toChain)
                    : undefined
                }
                fromAmount={props.fromAmount}
                toToken={props.toToken}
                allowChains={props.allowChains}
                activeTheme={activeTheme}
              />
            </>
          );
        } catch (error) {
          console.error('Error integrating widget into blog article', error);
        }
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
        return <BlogParagraph>{children}</BlogParagraph>;
      }
    },
  };

  return content ? (
    <BlocksRenderer content={content} blocks={customRichBlocks as any} />
  ) : null;
};
