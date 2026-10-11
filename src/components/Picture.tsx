/**
 * An image with everything a fast, accessible page needs: explicit width and
 * height (no layout shift), descriptive alt text, lazy loading unless it is
 * the page's hero, and an AVIF source when a sibling file exists.
 *
 * Files live in public/images/ as .webp (plus an optional .avif with the same
 * name). scripts/verify-seo.ts fails the build if any <img> lacks width,
 * height or alt.
 */

interface Props {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Above the fold: eager, high fetch priority. */
  priority?: boolean;
  /** An .avif sibling exists next to the .webp. */
  avif?: boolean;
  className?: string;
  sizes?: string;
}

export default function Picture({ src, width, height, alt, priority, avif, className, sizes }: Props) {
  const img = (
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      sizes={sizes}
      className={className}
    />
  );
  if (!avif) return img;
  return (
    <picture>
      <source type="image/avif" srcSet={src.replace(/\.webp$/, '.avif')} />
      {img}
    </picture>
  );
}
