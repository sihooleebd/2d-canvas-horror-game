export type ChineseT = {
  definition: string;
  sound: string;
  letter: string;
};

const chineseWords: ChineseT[] = [
  { definition: '나아가다', sound: '진', letter: '進' },
  { definition: '가지다', sound: '취', letter: '取' },
  { definition: '스승', sound: '사', letter: '師' },
  { definition: '뒤', sound: '후', letter: '後' },
  { definition: '깊다', sound: '심', letter: '深' },
];

export { chineseWords };
