export const getRandomWidth = ({
  seed = 0,
  multiplier = 37,
  baseWidth = 50,
  maxWidth = 200,
}: {
  seed?: number;
  multiplier?: number;
  baseWidth?: number;
  maxWidth?: number;
}) => {
  const jitter = seed % 2 === 0 ? seed * 17 : -seed * 8;
  return baseWidth + ((seed * multiplier + jitter) % (maxWidth - baseWidth));
};
