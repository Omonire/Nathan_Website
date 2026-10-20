const px = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

export const images = {
  hero: px(12464841, 1920),
  interior: px(7518728, 1600),
  tools: px(7697208, 1600),
  projects: [px(5188621, 900), px(20302331, 900), px(18483769, 900)],
  beforeAfter: {
    before: px(1453005, 1200),
    after: px(1453005, 1200),
  },
  gallery: [
    { src: px(18301169, 900), category: 'edits' },
    { src: px(29189821, 900), category: 'edits' },
    { src: px(9992817, 900), category: 'edits' },
    { src: px(12464841, 900), category: 'edits' },
    { src: px(5188621, 900), category: 'edits' },
    { src: px(3998397, 900), category: 'color' },
    { src: px(7697216, 900), category: 'color' },
    { src: px(20638028, 900), category: 'color' },
    { src: px(1453005, 900), category: 'color' },
    { src: px(19664876, 900), category: 'color' },
    { src: px(10989588, 900), category: 'color' },
    { src: px(19287849, 900), category: 'shorts' },
    { src: px(7447145, 900), category: 'shorts' },
    { src: px(7518745, 900), category: 'shorts' },
    { src: px(8867554, 900), category: 'shorts' },
    { src: px(20302331, 900), category: 'shorts' },
  ],
} as const