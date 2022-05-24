const bloodMap = {
  LM: ["LM"],
  LAD: ["pLAD", "mLAD", "dLAD"],
  D: ["D1", "D2"],
  LCX: ["pLCx", "LCx"],
  OM: ["OM1", "OM2"],
  RI: ["RI"],
  RCA: ["pRCA", "mRCA", "dRCA"],
  PDA: ["R-PDA", "L-PDA"],
  PLB: ["R-PLB", "L-PLB"],
};

const coronaryMap : { [k: string]: { en: string, zh: string, name: string }} = {
  1: {
    en: 'artery',
    zh: '主动脉',
    name: '',
  },
  11: {
    en: 'pRCA',
    zh: '右冠状动脉近段',
    name: 'RCA',
  },
  12: {
    en: 'mRCA',
    zh: '右冠状动脉中段',
    name: 'RCA',
  }, 
  13: {
    en: 'dRCA',
    zh: '右冠状动脉远段',
    name: 'RCA',
  },
  14: {
    en: 'R-PDA',
    zh: '右冠状动脉发出后降支',
    name: 'R-PDA',
  },
  15: {
    en: 'LM',
    zh: '左主干',
    name: 'LM',
  },
  16: {
    en: 'pLAD',
    zh: '前降支近段',
    name: 'LAD',
  },
  17: {
    en: 'mLAD',
    zh: '前降支中段',
    name: 'LAD',
  },
  18: {
    en: 'dLAD',
    zh: '前降支远段',
    name: 'LAD',
  },
  19: {
    en: 'D1',
    zh: '第一对角支',
    name: 'D1',
  },
  20: {
    en: 'D2',
    zh: '第二对角支',
    name: 'D2',
  },
  21: {
    en: 'pLCx',
    zh: '回旋支近段',
    name: 'LCX',
  },
  22: {
    en: 'OM1',
    zh: '第一钝缘支',
    name: 'OM1',
  },
  23: {
    en: 'LCx',
    zh: '回旋支中远段',
    name: 'LCX',
  },
  24: {
    en: 'OM2',
    zh: '第二钝缘支',
    name: 'OM2',
  },
  25: {
    en: 'L-PDA',
    zh: '回旋支发出后降支',
    name: 'L-PDA',
  },
  26: {
    en: 'R-PLB',
    zh: '右冠状动脉发出左后室支',
    name: 'R-PLB',
  },
  27: {
    en: 'RI',
    zh: '中间支',
    name: 'RI',
  },
  28: {
    en: 'L-PLB',
    zh: '回旋支发出左后室支',
    name: 'L-PLB',
  },
  60: {
    en: 'others',
    zh: '其他',
    name: '',
  },
};

export {
  bloodMap,
  coronaryMap,
}