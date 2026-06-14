import { Project } from '@/types/project';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: '周末夜市手作饰品摊位',
    category: 'stall',
    description: '在商圈夜市开设手作银饰摊位，主营原创设计饰品，面向年轻消费群体。已有货源渠道，需要合伙人共同经营。',
    coverImage: 'https://picsum.photos/id/103/750/500',
    location: '朝阳区三里屯',
    distance: '1.2km',
    investmentAmount: 'low',
    timeIntensity: 'weekend',
    requiredRoles: [
      { name: '销售', count: 1, skills: ['沟通能力', '销售经验'], description: '负责现场销售和客户接待' },
      { name: '摄影师', count: 1, skills: ['产品摄影', '修图'], description: '负责产品拍摄和社交媒体推广' }
    ],
    profitSharing: '利润5:5分成，按月结算',
    startupCost: 5000,
    trialPeriod: '1个月',
    exitAgreement: '提前15天通知，剩余库存按比例分配',
    publisher: {
      id: 'u1',
      name: '小琳',
      avatar: 'https://picsum.photos/id/64/200/200',
      creditScore: 95,
      completedProjects: 3
    },
    status: 'recruiting',
    createdAt: '2024-01-15',
    tags: ['手作', '饰品', '夜市', '低投入'],
    viewCount: 256,
    applyCount: 8
  },
  {
    id: '2',
    title: '本地美食探店账号合作',
    category: '探店账号',
    description: '打造北京本地美食探店账号，已有2万粉丝基础，现招募视频拍摄和后期剪辑合伙人，共同商业化运营。',
    coverImage: 'https://picsum.photos/id/292/750/500',
    location: '东城区东直门',
    distance: '2.5km',
    investmentAmount: 'zero',
    timeIntensity: 'parttime',
    requiredRoles: [
      { name: '摄像师', count: 1, skills: ['视频拍摄', '稳定器操作'], description: '负责探店视频拍摄' },
      { name: '剪辑师', count: 1, skills: ['PR/AE', '字幕制作'], description: '负责视频后期剪辑和包装' }
    ],
    profitSharing: '广告收入按4:3:3分配（运营:摄像:剪辑）',
    startupCost: 0,
    trialPeriod: '2周',
    exitAgreement: '账号归属运营方，已产生收益按比例结算',
    publisher: {
      id: 'u2',
      name: '食神阿杰',
      avatar: 'https://picsum.photos/id/91/200/200',
      creditScore: 92,
      completedProjects: 5
    },
    status: 'recruiting',
    createdAt: '2024-01-18',
    tags: ['美食', '短视频', '零投入', '自媒体'],
    viewCount: 512,
    applyCount: 15
  },
  {
    id: '3',
    title: '社区团购鲜果供应链',
    category: '手作团购',
    description: '社区鲜果团购项目，有直供货源，需要团长负责小区内推广和配送，利润空间大，时间灵活。',
    coverImage: 'https://picsum.photos/id/431/750/500',
    location: '海淀区中关村',
    distance: '3.8km',
    investmentAmount: 'low',
    timeIntensity: 'parttime',
    requiredRoles: [
      { name: '社区团长', count: 3, skills: ['社区资源', '沟通能力'], description: '负责各小区的团购推广和配送' },
      { name: '客服', count: 1, skills: ['客户服务', '订单处理'], description: '负责订单处理和售后' }
    ],
    profitSharing: '每单提成15%-20%，周结',
    startupCost: 1000,
    trialPeriod: '1周',
    exitAgreement: '随时退出，无违约金',
    publisher: {
      id: 'u3',
      name: '果农小王',
      avatar: 'https://picsum.photos/id/177/200/200',
      creditScore: 88,
      completedProjects: 2
    },
    status: 'recruiting',
    createdAt: '2024-01-20',
    tags: ['生鲜', '社区', '高佣金', '灵活'],
    viewCount: 189,
    applyCount: 6
  },
  {
    id: '4',
    title: '宠物摄影工作室合伙人',
    category: '摄影接单',
    description: '专业宠物摄影工作室，已有稳定客源和设备，需要热爱宠物、会拍照的合伙人共同扩大经营。',
    coverImage: 'https://picsum.photos/id/237/750/500',
    location: '西城区西单',
    distance: '4.2km',
    investmentAmount: 'medium',
    timeIntensity: 'weekend',
    requiredRoles: [
      { name: '宠物摄影师', count: 2, skills: ['人像摄影', '宠物引导'], description: '负责宠物拍摄和客户沟通' },
      { name: '修图师', count: 1, skills: ['Photoshop', '精修'], description: '负责照片后期精修' }
    ],
    profitSharing: '按单结算，每单提成30%-40%',
    startupCost: 20000,
    trialPeriod: '1个月',
    exitAgreement: '设备按折旧结算，客户资源共享',
    publisher: {
      id: 'u4',
      name: '摄影师Leo',
      avatar: 'https://picsum.photos/id/338/200/200',
      creditScore: 96,
      completedProjects: 8
    },
    status: 'recruiting',
    createdAt: '2024-01-22',
    tags: ['宠物', '摄影', '高分成', '有趣'],
    viewCount: 324,
    applyCount: 12
  },
  {
    id: '5',
    title: '社区便民团长招募',
    category: '社区团长',
    description: '大型电商平台社区团长招募，负责本社区商品推广和自提点管理，零成本投入，轻松赚钱。',
    coverImage: 'https://picsum.photos/id/225/750/500',
    location: '丰台区方庄',
    distance: '5.6km',
    investmentAmount: 'zero',
    timeIntensity: 'parttime',
    requiredRoles: [
      { name: '社区团长', count: 5, skills: ['社群运营', '责任心强'], description: '负责社区推广和自提管理' }
    ],
    profitSharing: '销售额10%-15%提成，月结',
    startupCost: 0,
    trialPeriod: '2周',
    exitAgreement: '随时退出，无任何费用',
    publisher: {
      id: 'u5',
      name: '多多买菜',
      avatar: 'https://picsum.photos/id/1027/200/200',
      creditScore: 98,
      completedProjects: 20
    },
    status: 'recruiting',
    createdAt: '2024-01-25',
    tags: ['零投入', '电商', '社区', '时间自由'],
    viewCount: 678,
    applyCount: 25
  },
  {
    id: '6',
    title: '周末露营装备租赁项目',
    category: '其他',
    description: '轻奢露营装备租赁服务，已有全套装备和合作营地，需要合伙人负责周末运营和客户接待。',
    coverImage: 'https://picsum.photos/id/1018/750/500',
    location: '通州区运河公园',
    distance: '8.3km',
    investmentAmount: 'low',
    timeIntensity: 'weekend',
    requiredRoles: [
      { name: '运营专员', count: 2, skills: ['客户服务', '户外经验'], description: '负责装备出租和营地接待' },
      { name: '推广专员', count: 1, skills: ['小红书运营', '活动策划'], description: '负责线上推广和活动策划' }
    ],
    profitSharing: '底薪+提成，综合月入5k-10k',
    startupCost: 3000,
    trialPeriod: '1个月',
    exitAgreement: '提前30天通知，无违约金',
    publisher: {
      id: 'u6',
      name: '露营达人',
      avatar: 'https://picsum.photos/id/1025/200/200',
      creditScore: 90,
      completedProjects: 4
    },
    status: 'recruiting',
    createdAt: '2024-01-28',
    tags: ['户外', '露营', '周末', '好玩'],
    viewCount: 445,
    applyCount: 18
  },
  {
    id: '7',
    title: '手工皮具工作室合伙',
    category: '手作团购',
    description: '手工皮具定制工作室，主营钱包、包包、皮带等产品，有稳定订单，需要熟练皮艺师傅或销售合伙人。',
    coverImage: 'https://picsum.photos/id/582/750/500',
    location: '朝阳区798',
    distance: '6.7km',
    investmentAmount: 'medium',
    timeIntensity: 'fulltime',
    requiredRoles: [
      { name: '皮艺师傅', count: 2, skills: ['手工皮具', '缝纫'], description: '负责皮具制作' },
      { name: '销售经理', count: 1, skills: ['销售管理', '客户开发'], description: '负责销售渠道开发' }
    ],
    profitSharing: '技术入股或利润分成，可面议',
    startupCost: 30000,
    trialPeriod: '2个月',
    exitAgreement: '按合作协议执行，技术股不退现',
    publisher: {
      id: 'u7',
      name: '皮匠老张',
      avatar: 'https://picsum.photos/id/1027/200/200',
      creditScore: 93,
      completedProjects: 6
    },
    status: 'recruiting',
    createdAt: '2024-02-01',
    tags: ['手工', '皮具', '技术入股', '长期'],
    viewCount: 234,
    applyCount: 7
  },
  {
    id: '8',
    title: '抖音本地生活服务商',
    category: '探店账号',
    description: '抖音本地生活服务代理，帮助本地商家做团购运营和直播带货，市场空间大，轻资产运营。',
    coverImage: 'https://picsum.photos/id/119/750/500',
    location: '国贸CBD',
    distance: '3.1km',
    investmentAmount: 'high',
    timeIntensity: 'fulltime',
    requiredRoles: [
      { name: '商务经理', count: 3, skills: ['商务谈判', '客户资源'], description: '负责商家拓展' },
      { name: '运营总监', count: 1, skills: ['抖音运营', '直播'], description: '负责账号运营和直播' },
      { name: '视频编导', count: 2, skills: ['内容策划', '脚本撰写'], description: '负责短视频内容策划' }
    ],
    profitSharing: '底薪+高提成+期权',
    startupCost: 100000,
    trialPeriod: '3个月',
    exitAgreement: '按股东协议执行',
    publisher: {
      id: 'u8',
      name: 'MCN创始人',
      avatar: 'https://picsum.photos/id/177/200/200',
      creditScore: 97,
      completedProjects: 12
    },
    status: 'recruiting',
    createdAt: '2024-02-05',
    tags: ['抖音', '本地生活', '创业', '高回报'],
    viewCount: 567,
    applyCount: 22
  },
  {
    id: '9',
    title: '亲子摄影周末兼职',
    category: '摄影接单',
    description: '儿童摄影工作室周末兼职摄影师，主要拍摄亲子照、周岁照，工作时间灵活，按单结算。',
    coverImage: 'https://picsum.photos/id/64/750/500',
    location: '海淀区五道口',
    distance: '7.2km',
    investmentAmount: 'zero',
    timeIntensity: 'weekend',
    requiredRoles: [
      { name: '儿童摄影师', count: 3, skills: ['儿童摄影', '引导技巧'], description: '负责儿童写真拍摄' },
      { name: '摄影助理', count: 2, skills: ['沟通能力', '有耐心'], description: '负责辅助拍摄和引导儿童' }
    ],
    profitSharing: '每单300-800元，日结',
    startupCost: 0,
    trialPeriod: '1周',
    exitAgreement: '提前3天通知即可',
    publisher: {
      id: 'u9',
      name: '童趣摄影',
      avatar: 'https://picsum.photos/id/91/200/200',
      creditScore: 91,
      completedProjects: 15
    },
    status: 'recruiting',
    createdAt: '2024-02-08',
    tags: ['兼职', '摄影', '日结', '时间灵活'],
    viewCount: 389,
    applyCount: 14
  },
  {
    id: '10',
    title: '文创市集摊主招募',
    category: 'stall',
    description: '定期举办的文创市集摊位招募，手作、潮玩、插画、文创产品均可，流量大，费用低。',
    coverImage: 'https://picsum.photos/id/598/750/500',
    location: '朝阳区大悦城',
    distance: '4.5km',
    investmentAmount: 'low',
    timeIntensity: 'weekend',
    requiredRoles: [
      { name: '摊主', count: 10, skills: ['手作技能', '销售能力'], description: '独立经营摊位' }
    ],
    profitSharing: '无分成，仅收取摊位费',
    startupCost: 500,
    trialPeriod: '1次市集',
    exitAgreement: '提前7天取消，退还摊位费',
    publisher: {
      id: 'u10',
      name: '市集主办方',
      avatar: 'https://picsum.photos/id/338/200/200',
      creditScore: 94,
      completedProjects: 30
    },
    status: 'recruiting',
    createdAt: '2024-02-10',
    tags: ['文创', '市集', '短期', '低门槛'],
    viewCount: 723,
    applyCount: 35
  }
];

export const categories = [
  { key: 'all', label: '全部' },
  { key: 'stall', label: '摊位经营' },
  { key: '探店账号', label: '探店账号' },
  { key: '手作团购', label: '手作团购' },
  { key: '社区团长', label: '社区团长' },
  { key: '摄影接单', label: '摄影接单' },
  { key: '其他', label: '其他' }
];

export const investmentLevels = [
  { key: 'all', label: '不限', min: 0, max: Infinity },
  { key: 'zero', label: '零投入', min: 0, max: 0 },
  { key: 'low', label: '1万以下', min: 1, max: 10000 },
  { key: 'medium', label: '1-5万', min: 10000, max: 50000 },
  { key: 'high', label: '5万以上', min: 50000, max: Infinity }
];

export const timeIntensities = [
  { key: 'all', label: '不限' },
  { key: 'weekend', label: '仅周末' },
  { key: 'parttime', label: '兼职' },
  { key: 'fulltime', label: '全职' }
];
