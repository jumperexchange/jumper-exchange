import generateKey from '@/app/lib/generateKey';
import { BlogCTA } from '@/components/Blog/CTAs/BlogCTA/BlogCTA';
import {
  InstructionsAccordion,
  type InstructionItemProps,
} from '@/components/Blog/CTAs/InstructionsAccordion/InstructionsAccordion';
import { Lightbox } from '@/components/Lightbox/Lightbox';
import type { ThemeModesSupported } from '@/types/settings';
import type { MediaAttributes } from '@/types/strapi';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';
import { isValidElement, type JSX, type ReactElement } from 'react';
import nl2br from 'react-nl2br';
import { BlogParagraphContainer } from './BlogArticle/BlogArticle.style';
import type { BlogWidgetProps } from './BlogWidget';
import { BlogWidget } from './BlogWidget';
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
  activeThemeMode?: ThemeModesSupported;
  variant?: string;
}

interface ImageData {
  image: MediaAttributes;
}

// TODO: Fix dynamic typing line 102
interface WidgetRouteSettings
  extends Omit<BlogWidgetProps, 'activeThemeMode' | 'fromChain' | 'toChain'> {
  fromChain?: string;
  toChain?: string;
}

interface ParagraphProps {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  [key: string]: any;
}

interface QuoteProps {
  text: string;
  [key: string]: any;
}

interface RichElement<T> {
  key: string | null;
  props: T;
  ref: any;
  [key: string]: any;
}

type ParagraphElement = RichElement<ParagraphProps>;
type QuoteElement = RichElement<QuoteProps>;

export const CustomRichBlocks = ({
  id,
  baseUrl,
  content,
  activeThemeMode,
  variant,
}: CustomRichBlocksProps) => {
  const customRichBlocks = {
    image: (data: ImageData) =>
      baseUrl ? (
        <Lightbox imageData={data.image} baseUrl={baseUrl} />
      ) : undefined,

    heading: ({
      children,
      level,
    }: {
      children: JSX.Element | JSX.Element[];
      level: number;
    }) => {
      switch (level) {
        case 2:
          return (
            <BlogH2 variant="h2" key={generateKey('typography')}>
              {children}
            </BlogH2>
          );
        case 3:
          return (
            <BlogH3 variant="h3" key={generateKey('typography')}>
              {children}
            </BlogH3>
          );
        case 4:
          return (
            <BlogH4 variant="h4" key={generateKey('typography')}>
              {children}
            </BlogH4>
          );
        case 5:
          return (
            <BlogH5 variant="h5" key={generateKey('typography')}>
              {children}
            </BlogH5>
          );
        case 6:
          return (
            <BlogH6 variant="h6" key={generateKey('typography')}>
              {children}
            </BlogH6>
          );
        default:
          return (
            <BlogH1 variant="h1" key={generateKey('typography')}>
              {children}
            </BlogH1>
          );
      }
    },

    quote: ({ children }: { children: QuoteElement[] }) => {
      return children.map((quote) => {
        return (
          <BlogParagraphContainer key={generateKey('quote')}>
            <BlogParagraph quote={true} as="q">
              {quote.props.text}
            </BlogParagraph>
          </BlogParagraphContainer>
        );
      });
    },

    paragraph: ({ children }: ParagraphElement) => {
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
          const title = titleMatch?.[1];
          const url = urlMatch ? urlMatch[1] : undefined;
          return (
            <BlogCTA title={title} url={url} id={id} key={generateKey('cta')} />
          );
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
              activeThemeMode={activeThemeMode}
              key={generateKey('widget')}
            />
          );
        } catch (error) {
          console.error('Error integrating widget into blog article', error);
        }
      } else if (children[0].props.text.includes('<INSTRUCTIONS')) {
        try {
          const instructions_array: InstructionItemProps[] = [];
          let jso = children[0].props.text
            .replace('<INSTRUCTIONS ', '')
            .replace('/>', '');

          // Parse the JSON string and push each parsed object into the instructions_array
          JSON.parse(jso).forEach((obj: InstructionItemProps) => {
            instructions_array.push(obj);
          });

          return (
            <InstructionsAccordion
              data={instructions_array}
              key={generateKey('instructions')}
              activeThemeMode={activeThemeMode}
              variant={variant}
            />
          );
        } catch (error) {
          //// console.log(error);
          return;
        }
      } else {
        return (
          <BlogParagraphContainer>
            {children.map((el: ParagraphElement, index: number) => {
              if (el.props.text || el.props.text !== '') {
                if (el.props.content?.type === 'link') {
                  return (
                    <BlogLink
                      href={el.props.content.url}
                      key={generateKey('link')}
                    >
                      {el.props.content.children[0].text}
                    </BlogLink>
                  );
                } else {
                  const nl2brText: Array<ReactElement | string> = nl2br(
                    el.props.text,
                  );
                  return nl2brText.map((line, lineIndex: number) => {
                    if (isValidElement(line) && line.type === 'br') {
                      // adds <br> from nl2br
                      return line;
                    }
                    return (
                      <BlogParagraph
                        italic={el.props.italic}
                        strikethrough={el.props.strikethrough}
                        underline={el.props.underline}
                        bold={el.props.bold}
                        key={`blog-paragraph-line-${index}-${lineIndex}`}
                      >
                        {line}
                      </BlogParagraph>
                    );
                  });
                }
              } else {
                return <></>;
              }
            })}
          </BlogParagraphContainer>
        );
      }
    },
  };

  return content ? (
    <BlocksRenderer content={content} blocks={customRichBlocks as any} />
  ) : null;
};
