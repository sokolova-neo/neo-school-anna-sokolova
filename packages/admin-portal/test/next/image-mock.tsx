import { type ImageProps } from 'next/image';

export function mockNextImage() {
  return jest.mock('next/image', () => ({
    __esModule: true,

    default: (props: ImageProps) => {
      const { objectFit: _, objectPosition: __, ...cleanProps } = props;
      return (
        // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
        <img
          // eslint-disable-next-line
          {
            // eslint-disable-next-line jsx-a11y/alt-text
            ...(cleanProps as unknown as React.ImgHTMLAttributes<
              Record<never, never>
            >)
          }
        />
      );
    },
  }));
}
