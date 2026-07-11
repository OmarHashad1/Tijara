import slugify from 'slugify';
export const createSlug = (text: string): string => {
  const slug = slugify(text, {
    lower: true,
    replacement: '-',
    trim: true,
  });

  return slug;
};
