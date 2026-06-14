import { User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: '小琳',
    avatar: 'https://picsum.photos/id/64/200/200',
    age: 28,
    location: '朝阳区三里屯',
    bio: '手作爱好者，有3年夜市摆摊经验，擅长饰品设计和客户沟通。',
    skills: [
      { name: '饰品设计', level: 'expert', experience: '5年' },
      { name: '销售', level: 'intermediate', experience: '3年' },
      { name: '摄影', level: 'beginner', experience: '1年' }
    ],
    availableTime: {
      weekdays: ['晚上19:00-22:00'],
      weekends: ['全天'],
      totalHoursPerWeek: 20
    },
    resources: [
      { type: 'equipment', name: '手作工具套装', description: '专业银饰制作工具' },
      { type: 'network', name: '货源渠道', description: '稳定的银饰原材料供应商' },
      { type: 'space', name: '夜市摊位', description: '三里屯夜市固定摊位' }
    ],
    creditScore: 95,
    reviews: [
      {
        id: 'r1',
        fromUserId: 'u2',
        fromUserName: '食神阿杰',
        projectName: '美食探店视频合作',
        rating: 5,
        comment: '沟通顺畅，执行力强，合作非常愉快！',
        createdAt: '2023-12-15'
      }
    ],
    cooperationPreferences: {
      projectCategories: ['手作', '饰品', '文创'],
      investmentRange: [0, 10000],
      timeCommitment: 'weekend',
      preferRoles: ['设计', '销售'],
      minCreditScore: 80
    },
    completedProjects: 3,
    successRate: 100,
    matchScore: 92,
    complementarySkills: ['饰品设计', '货源渠道']
  },
  {
    id: 'u2',
    name: '食神阿杰',
    avatar: 'https://picsum.photos/id/91/200/200',
    age: 32,
    location: '东城区东直门',
    bio: '资深美食博主，吃遍北京大小餐馆，擅长内容策划和粉丝运营。',
    skills: [
      { name: '内容策划', level: 'expert', experience: '6年' },
      { name: '文案写作', level: 'expert', experience: '6年' },
      { name: '粉丝运营', level: 'intermediate', experience: '4年' }
    ],
    availableTime: {
      weekdays: ['下午14:00-18:00'],
      weekends: ['上午10:00-下午18:00'],
      totalHoursPerWeek: 30
    },
    resources: [
      { type: 'network', name: '餐饮资源', description: '北京500+餐厅合作资源' },
      { type: 'other', name: '自媒体账号', description: '抖音2万+粉丝账号' }
    ],
    creditScore: 92,
    reviews: [],
    cooperationPreferences: {
      projectCategories: ['美食', '自媒体', '探店'],
      investmentRange: [0, 5000],
      timeCommitment: 'parttime',
      preferRoles: ['运营', '策划'],
      minCreditScore: 85
    },
    completedProjects: 5,
    successRate: 100,
    matchScore: 88,
    complementarySkills: ['内容策划', '餐饮资源']
  },
  {
    id: 'u3',
    name: '果农小王',
    avatar: 'https://picsum.photos/id/177/200/200',
    age: 35,
    location: '海淀区中关村',
    bio: '来自山东的果农，自家果园直供各类鲜果，诚信经营，品质保证。',
    skills: [
      { name: '供应链管理', level: 'expert', experience: '10年' },
      { name: '品质把控', level: 'expert', experience: '10年' },
      { name: '物流配送', level: 'intermediate', experience: '5年' }
    ],
    availableTime: {
      weekdays: ['全天'],
      weekends: ['全天'],
      totalHoursPerWeek: 60
    },
    resources: [
      { type: 'network', name: '果园直供', description: '山东烟台自有果园' },
      { type: 'capital', name: '启动资金', description: '50万流动资金' },
      { type: 'space', name: '仓储中心', description: '200平米保鲜仓库' }
    ],
    creditScore: 88,
    reviews: [],
    cooperationPreferences: {
      projectCategories: ['生鲜', '电商', '社区团购'],
      investmentRange: [0, 20000],
      timeCommitment: 'any',
      preferRoles: ['团长', '销售'],
      minCreditScore: 75
    },
    completedProjects: 2,
    successRate: 100,
    matchScore: 75,
    complementarySkills: ['供应链', '货源']
  },
  {
    id: 'u4',
    name: '摄影师Leo',
    avatar: 'https://picsum.photos/id/338/200/200',
    age: 29,
    location: '西城区西单',
    bio: '专业宠物摄影师，佳能认证摄影师，热爱动物，擅长捕捉宠物最萌瞬间。',
    skills: [
      { name: '宠物摄影', level: 'expert', experience: '5年' },
      { name: '后期精修', level: 'expert', experience: '5年' },
      { name: '影棚管理', level: 'intermediate', experience: '3年' }
    ],
    availableTime: {
      weekdays: ['上午10:00-下午18:00'],
      weekends: ['全天'],
      totalHoursPerWeek: 40
    },
    resources: [
      { type: 'equipment', name: '专业器材', description: '佳能R5 + 多支专业镜头' },
      { type: 'space', name: '影棚', description: '80平米专业宠物影棚' },
      { type: 'network', name: '客户资源', description: '200+稳定客户' }
    ],
    creditScore: 96,
    reviews: [],
    cooperationPreferences: {
      projectCategories: ['宠物', '摄影', '文创'],
      investmentRange: [10000, 50000],
      timeCommitment: 'any',
      preferRoles: ['摄影师', '合伙人'],
      minCreditScore: 90
    },
    completedProjects: 8,
    successRate: 100,
    matchScore: 85,
    complementarySkills: ['摄影技术', '影棚']
  },
  {
    id: 'u5',
    name: '多多买菜',
    avatar: 'https://picsum.photos/id/1027/200/200',
    age: 25,
    location: '丰台区方庄',
    bio: '社区团购平台招商经理，负责北京区域团长招募和培训。',
    skills: [
      { name: '招商加盟', level: 'expert', experience: '3年' },
      { name: '培训指导', level: 'intermediate', experience: '2年' },
      { name: '运营支持', level: 'intermediate', experience: '3年' }
    ],
    availableTime: {
      weekdays: ['上午9:00-下午18:00'],
      weekends: [],
      totalHoursPerWeek: 40
    },
    resources: [
      { type: 'network', name: '电商平台', description: '多多买菜官方平台' },
      { type: 'other', name: '供应链体系', description: '完善的商品供应链' }
    ],
    creditScore: 98,
    reviews: [],
    cooperationPreferences: {
      projectCategories: ['电商', '社区团购'],
      investmentRange: [0, 0],
      timeCommitment: 'any',
      preferRoles: ['团长'],
      minCreditScore: 60
    },
    completedProjects: 20,
    successRate: 100,
    matchScore: 95,
    complementarySkills: ['平台资源', '供应链']
  },
  {
    id: 'u6',
    name: '露营达人',
    avatar: 'https://picsum.photos/id/1025/200/200',
    age: 31,
    location: '通州区运河公园',
    bio: '户外露营爱好者，熟悉北京周边各大营地，有丰富的露营装备和组织经验。',
    skills: [
      { name: '活动策划', level: 'expert', experience: '4年' },
      { name: '户外领队', level: 'expert', experience: '4年' },
      { name: '装备维护', level: 'intermediate', experience: '3年' }
    ],
    availableTime: {
      weekdays: ['晚上19:00-22:00'],
      weekends: ['全天'],
      totalHoursPerWeek: 25
    },
    resources: [
      { type: 'equipment', name: '露营装备', description: '20套轻奢露营装备' },
      { type: 'network', name: '营地合作', description: '10+合作营地' },
      { type: 'other', name: '户外社群', description: '500+户外爱好者社群' }
    ],
    creditScore: 90,
    reviews: [],
    cooperationPreferences: {
      projectCategories: ['户外', '露营', '旅游'],
      investmentRange: [0, 5000],
      timeCommitment: 'weekend',
      preferRoles: ['运营', '领队'],
      minCreditScore: 80
    },
    completedProjects: 4,
    successRate: 100,
    matchScore: 82,
    complementarySkills: ['露营装备', '营地资源']
  },
  {
    id: 'u7',
    name: '皮匠老张',
    avatar: 'https://picsum.photos/id/1027/200/200',
    age: 42,
    location: '朝阳区798',
    bio: '传统手工皮艺传承人，20年皮具制作经验，作品曾获多项设计大奖。',
    skills: [
      { name: '手工皮具', level: 'expert', experience: '20年' },
      { name: '皮具设计', level: 'expert', experience: '15年' },
      { name: '工艺教学', level: 'intermediate', experience: '8年' }
    ],
    availableTime: {
      weekdays: ['上午10:00-下午18:00'],
      weekends: ['上午10:00-下午18:00'],
      totalHoursPerWeek: 50
    },
    resources: [
      { type: 'equipment', name: '皮艺工具', description: '全套专业皮具制作工具' },
      { type: 'space', name: '工作室', description: '798艺术区60平米工作室' },
      { type: 'network', name: '高端客户', description: '众多高端私人定制客户' }
    ],
    creditScore: 93,
    reviews: [],
    cooperationPreferences: {
      projectCategories: ['手工', '文创', '奢侈品'],
      investmentRange: [20000, 50000],
      timeCommitment: 'fulltime',
      preferRoles: ['销售', '设计师'],
      minCreditScore: 85
    },
    completedProjects: 6,
    successRate: 100,
    matchScore: 78,
    complementarySkills: ['皮艺技术', '工作室']
  },
  {
    id: 'u8',
    name: 'MCN创始人',
    avatar: 'https://picsum.photos/id/177/200/200',
    age: 34,
    location: '国贸CBD',
    bio: '连续创业者，前字节跳动运营经理，现在做本地生活MCN机构。',
    skills: [
      { name: '公司运营', level: 'expert', experience: '8年' },
      { name: '抖音运营', level: 'expert', experience: '5年' },
      { name: '商务拓展', level: 'expert', experience: '10年' }
    ],
    availableTime: {
      weekdays: ['全天'],
      weekends: ['上午10:00-下午18:00'],
      totalHoursPerWeek: 70
    },
    resources: [
      { type: 'capital', name: '创业资金', description: '200万启动资金' },
      { type: 'network', name: '商家资源', description: '1000+本地商家资源' },
      { type: 'other', name: 'MCN资质', description: '抖音官方认证MCN机构' }
    ],
    creditScore: 97,
    reviews: [],
    cooperationPreferences: {
      projectCategories: ['自媒体', '电商', '本地生活'],
      investmentRange: [50000, 200000],
      timeCommitment: 'fulltime',
      preferRoles: ['合伙人', '核心团队'],
      minCreditScore: 90
    },
    completedProjects: 12,
    successRate: 92,
    matchScore: 70,
    complementarySkills: ['资金', '资源', 'MCN资质']
  },
  {
    id: 'u9',
    name: '童趣摄影',
    avatar: 'https://picsum.photos/id/91/200/200',
    age: 27,
    location: '海淀区五道口',
    bio: '儿童摄影工作室，专注0-12岁儿童摄影，温馨有爱的拍摄风格深受家长喜爱。',
    skills: [
      { name: '儿童摄影', level: 'expert', experience: '6年' },
      { name: '后期修图', level: 'intermediate', experience: '4年' },
      { name: '客户服务', level: 'expert', experience: '6年' }
    ],
    availableTime: {
      weekdays: [],
      weekends: ['全天'],
      totalHoursPerWeek: 16
    },
    resources: [
      { type: 'equipment', name: '摄影器材', description: '多套专业相机和镜头' },
      { type: 'space', name: '摄影棚', description: '150平米儿童实景影棚' }
    ],
    creditScore: 91,
    reviews: [],
    cooperationPreferences: {
      projectCategories: ['摄影', '儿童'],
      investmentRange: [0, 0],
      timeCommitment: 'weekend',
      preferRoles: ['摄影师', '助理'],
      minCreditScore: 70
    },
    completedProjects: 15,
    successRate: 100,
    matchScore: 90,
    complementarySkills: ['儿童摄影', '影棚']
  },
  {
    id: 'u10',
    name: '市集主办方',
    avatar: 'https://picsum.photos/id/338/200/200',
    age: 30,
    location: '朝阳区大悦城',
    bio: '专业文创市集主办方，北京各大商圈定期举办市集活动，为摊主提供优质平台。',
    skills: [
      { name: '活动策划', level: 'expert', experience: '5年' },
      { name: '场地合作', level: 'expert', experience: '5年' },
      { name: '招商运营', level: 'expert', experience: '5年' }
    ],
    availableTime: {
      weekdays: ['上午9:00-下午18:00'],
      weekends: ['全天'],
      totalHoursPerWeek: 50
    },
    resources: [
      { type: 'network', name: '商圈资源', description: '20+合作商圈' },
      { type: 'other', name: '市集IP', description: '知名文创市集品牌' }
    ],
    creditScore: 94,
    reviews: [],
    cooperationPreferences: {
      projectCategories: ['文创', '市集', '活动'],
      investmentRange: [0, 1000],
      timeCommitment: 'weekend',
      preferRoles: ['摊主'],
      minCreditScore: 65
    },
    completedProjects: 30,
    successRate: 100,
    matchScore: 96,
    complementarySkills: ['商圈资源', '活动策划']
  }
];

export const currentUser: User = {
  id: 'me',
  name: '我',
  avatar: 'https://picsum.photos/id/64/200/200',
  age: 26,
  location: '朝阳区望京',
  bio: '互联网产品经理，想利用周末时间做点副业，有短视频运营经验和不错的审美。',
  skills: [
    { name: '产品设计', level: 'expert', experience: '3年' },
    { name: '短视频运营', level: 'intermediate', experience: '2年' },
    { name: 'PS/PR', level: 'intermediate', experience: '2年' },
    { name: '文案写作', level: 'beginner', experience: '1年' }
  ],
  availableTime: {
    weekdays: ['晚上20:00-22:00'],
    weekends: ['全天'],
    totalHoursPerWeek: 15
  },
  resources: [
    { type: 'equipment', name: '微单相机', description: '索尼A7M4 + 50mm定焦镜头' },
    { type: 'equipment', name: '稳定器', description: '大疆云台稳定器' },
    { type: 'network', name: '互联网人脉', description: '众多互联网行业朋友' }
  ],
  creditScore: 85,
  reviews: [],
  cooperationPreferences: {
    projectCategories: ['自媒体', '文创', '摄影', '手作'],
    investmentRange: [0, 10000],
    timeCommitment: 'weekend',
    preferRoles: ['运营', '设计', '摄影'],
    minCreditScore: 80
  },
  completedProjects: 1,
  successRate: 100
};
