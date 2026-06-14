export const formatMoney = (amount: number): string => {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}万`;
  }
  return amount.toLocaleString();
};

export const formatDate = (date: string): string => {
  return date;
};

export const getLevelText = (level: string): string => {
  const map: Record<string, string> = {
    'beginner': '入门',
    'intermediate': '进阶',
    'expert': '专家'
  };
  return map[level] || level;
};

export const getInvestmentText = (level: string): string => {
  const map: Record<string, string> = {
    'zero': '零投入',
    'low': '1万以下',
    'medium': '1-5万',
    'high': '5万以上'
  };
  return map[level] || level;
};

export const getTimeText = (level: string): string => {
  const map: Record<string, string> = {
    'weekend': '仅周末',
    'parttime': '兼职',
    'fulltime': '全职'
  };
  return map[level] || level;
};

export const getCategoryText = (category: string): string => {
  const map: Record<string, string> = {
    'stall': '摊位经营',
    '探店账号': '探店账号',
    '手作团购': '手作团购',
    '社区团长': '社区团长',
    '摄影接单': '摄影接单',
    'other': '其他',
    '其他': '其他'
  };
  return map[category] || category;
};
