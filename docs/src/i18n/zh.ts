export default {
  systemTitle: '🎲 RandBox - JavaScript 随机数据生成库',
  banner: {
    title: '🎲 欢迎使用 RandBox - 功能强大的 JavaScript 随机数据生成库！',
    more: '了解详情',
  },
  pageTitle: '当前页面',
  backToTop: '返回顶部',

  search: {
    placeholder: '搜索...',
    noResults: '没有搜索结果',
    errorText: '搜索出错',
    loading: '加载中...',
  },

  badgeTitle: '功能强大、易于使用 🎉',
  featureSupport: `🔥 现在支持 {{feature}}！`,
  lastUpdated: '最后更新于:',

  getStarted: '开始使用',

  themeSwitcher: {
    light: '浅色模式',
    dark: '深色模式',
    lightAria: '切换到浅色模式',
    darkAria: '切换到深色模式',
  },

  featureList: [
    {
      title: '基础数据类型生成',
      description: '生成随机布尔值、字符、数字、字符串等基础数据类型，支持多种自定义选项和概率设置',
    },
    {
      title: '人员和身份信息',
      description: '生成随机姓名、年龄、生日、电子邮件、身份证号等人员信息，支持多种国家和地区',
    },
    {
      title: '金融和信用卡数据',
      description: '生成随机信用卡号、CVV、到期日期、货币代码等金融相关数据，符合标准格式',
    },
    {
      title: '地理位置信息',
      description: '生成随机地址、城市、国家、坐标、邮编等地理位置数据，支持全球各地区',
    },
    {
      title: '时间日期生成',
      description: '生成随机日期、时间、时间戳等时间相关数据，支持多种格式和自定义范围',
    },
    {
      title: '网络和技术数据',
      description: '生成随机 IP 地址、MAC 地址、URL、域名、哈希值等网络技术相关数据',
    },
    {
      title: '文本和语言内容',
      description: '生成随机段落、句子、单词、音节等文本内容，支持多语言和表情符号',
    },
    {
      title: '辅助工具函数',
      description: '提供数组选择、打乱、填充、大小写转换等实用辅助函数，增强数据处理能力',
    },
    {
      title: '多环境支持',
      description: '支持浏览器、Node.js、RequireJS 等多种环境，提供 npm、bower、CDN 等安装方式',
    },
  ],
  featuresDesc: '轻松生成各种随机数据，提高开发效率和测试覆盖率',
  faqs: [
    {
      question: 'RandBox 支持哪些环境和安装方式？',
      answer: 'RandBox 支持浏览器、Node.js、RequireJS 等多种环境，可通过 npm、yarn、bower 安装，也可使用 CDN 直接引入。',
    },
    {
      question: '如何在我的项目中开始使用 RandBox？',
      answer: '安装后只需 import 或 require RandBox，即可使用丰富的 API 生成各种随机数据。支持 ES6 模块、CommonJS 等多种导入方式。',
    },
    {
      question: 'RandBox 可以生成哪些类型的随机数据？',
      answer: 'RandBox 可生成基础数据类型、人员信息、地理位置、时间日期、金融数据、网络技术数据、文本内容等 10+ 大类超过 100 种数据类型。',
    },
    {
      question: 'RandBox 是否支持自定义种子和可重现的随机数？',
      answer: '是的，RandBox 支持数字、字符串、多参数种子设置，确保在相同种子下生成的随机数据完全一致，便于测试和调试。',
    },
    {
      question: 'RandBox 生成的数据是否符合真实格式标准？',
      answer: '是的，RandBox 生成的信用卡号、身份证号、IP 地址、邮箱等数据都符合相应的格式标准，可用于真实的开发和测试场景。',
    },
    {
      question: '如何获得 RandBox 的技术支持或报告问题？',
      answer: '如果在使用过程中遇到问题，请通过 GitHub 仓库提交 issue，或查看详细的 API 文档获取帮助。',
    },
    {
      question: '🎲 RandBox 的最大优势是什么？',
      answer: 'API 简单易用、数据类型丰富、格式标准真实、支持多环境、可重现随机数！让你的开发和测试事半功倍！',
    },
  ],

  simplePage: {
    title: '简单随机化工具',
    subtitle: '基于线性同余生成器和Fisher-Yates洗牌算法的专业随机分组工具',
    inputPanel: {
      title: '参数设置',
      description: '设置随机化参数，确保科学严谨的分组结果',
      totalParticipants: '总参与者数量',
      totalParticipantsHint: '建议范围：10-1000人',
      groupCount: '分组数量',
      groupCountHint: '建议范围：2-10组',
      seed: '随机种子（可选）',
      seedPlaceholder: '留空使用当前时间',
      seedHint: '用于结果复现，留空则每次结果不同',
      startButton: '开始随机化',
      calculatingButton: '正在计算...',
      validationError: '请检查输入参数：参与者数量需大于0，分组数量需在2-{{maxGroups}}之间',
    },
    resultsPanel: {
      title: '随机化结果',
      description: '基于科学算法的专业分组结果',
      totalParticipantsLabel: '总参与者',
      groupCountLabel: '分组数量',
      groupDetailsTitle: '分组详情',
      participantsLabel: '人',
      participantIds: '参与者ID: ',
      moreParticipants: ' ... (+{{count}})',
      statisticsTitle: '统计分析',
      balance: '组间平衡度:',
      efficiency: '算法效率:',
      generateTime: '生成时间: ',
      noResultsText: '点击"开始随机化"查看结果',
    },
    algorithmInfo: {
      title: '算法说明',
      description: '简单随机化采用线性同余生成器产生高质量伪随机数， 结合Fisher-Yates洗牌算法确保每个参与者被分配到任意组的概率相等。',
      features: [
        '随机性保证：基于数学严格证明的随机数生成算法',
        '均匀分布：确保各组人数尽可能平均',
        '可重现性：支持随机种子，便于结果验证和复现',
        '统计有效：满足临床试验和科学研究的随机化要求',
      ],
    },
  },

  blockPage: {
    title: '区组随机化',
    subtitle: '确保在每个区组内各组样本数量相等，在研究过程中维持组间平衡，特别适用于序贯招募的临床试验',
    inputPanel: {
      title: '参数设置',
      sampleSize: '样本数量',
      sampleSizePlaceholder: '输入样本总数',
      sampleSizeHint: '范围: 1-10,000',
      groupCount: '分组数量',
      groupCountPlaceholder: '输入分组数量',
      groupCountHint: '范围: 2-10组',
      blockSize: '区组大小',
      blockSizePlaceholder: '选择区组大小',
      blockSizeHint: '区组大小必须能被分组数量整除',
      samplesPerGroupText: '每组{{count}}个样本',
      seed: '随机种子 (可选)',
      seedPlaceholder: '留空使用当前时间',
      seedHint: '用于结果重现，留空则自动生成',
      blockPreviewTitle: '区组预览',
      totalBlocks: '总区组数: ',
      samplesPerGroup: '每组样本数: ',
      startButton: '开始随机化',
      calculatingButton: '正在随机化...',
      algorithmTitle: '算法说明',
      algorithmDescription: '区组随机化将样本分成若干个区组，在每个区组内确保各组样本数量相等。这种方法结合了随机性和平衡性，特别适用于需要维持组间平衡的序贯研究。',
    },
    errorMessages: {
      sampleSizeRange: '样本数量必须在1-10000之间',
      groupCountRange: '分组数量必须在2-10之间',
      blockSizeDivisible: '区组大小必须能被分组数量整除',
      blockSizeMinimum: '区组大小不能小于分组数量',
      randomizationError: '随机化过程中发生错误',
      blockSizeValidation: '区组大小({{blockSize}})必须能被分组数量({{groupCount}})整除',
    },
    resultsPanel: {
      title: '随机化结果',
      totalSamples: '总样本数',
      blockCount: '区组数量',
      groupLabel: '第{{index}}组',
      samplesCount: '{{count}}个样本',
      downloadReport: '下载报告',
      copyReport: '复制报告',
      blockDistributionTitle: '区组分布',
      blockTitle: '区组 {{index}} (样本{{start}}-{{end}})',
      groupInBlock: '第{{index}}组',
      detailedGroupsTitle: '详细分组',
      groupTitle: '第{{index}}组 ({{count}}个样本)',
      reportPreviewTitle: '统计报告预览',
      noResults: '设置参数后点击"开始随机化"查看结果',
      downloadFileName: '区组随机化报告_{{date}}.txt',
    },
  },

  stratifiedPage: {
    title: '分层随机化',
    subtitle: '在每个分层内部进行随机分配，确保各组在重要协变量上的均衡性，提高统计检验的效力',
    defaultStrataNames: {
      male: '男性',
      female: '女性',
      newStratum: '分层{{id}}',
    },
    strataSetup: {
      title: '分层设置',
      stratumName: '分层名称',
      stratumNamePlaceholder: '输入分层名称',
      sampleSize: '样本数',
      sampleSizePlaceholder: '数量',
      addStratum: '添加分层',
      totalSamples: '总样本数: ',
    },
    randomizationParams: {
      title: '随机化参数',
      groupCount: '分组数量',
      groupCountPlaceholder: '输入分组数量',
      groupCountHint: '范围: 2-10组',
      seed: '随机种子 (可选)',
      seedPlaceholder: '留空使用当前时间',
      seedHint: '用于结果重现，留空则自动生成',
      startButton: '开始随机化',
      calculatingButton: '正在随机化...',
      algorithmTitle: '算法说明',
      algorithmDescription: '分层随机化在每个分层内部使用Fisher-Yates洗牌算法进行随机分配，确保各组在重要协变量（如性别、年龄等）上保持均衡，提高统计检验的效力。',
    },
    errorMessages: {
      minimumStrata: '至少需要一个分层',
      groupCountRange: '分组数量必须在2-10之间',
      totalSamplesRange: '总样本数量必须在1-10000之间',
      stratumNameEmpty: '分层名称不能为空',
      stratumSizeInvalid: '分层"{{name}}"的样本数量必须大于0',
      randomizationError: '随机化过程中发生错误',
    },
    resultsPanel: {
      title: '随机化结果',
      totalSamples: '总样本数',
      strataCount: '分层数量',
      groupCount: '分组数量',
      groupLabel: '第{{index}}组',
      samplesCount: '{{count}}个样本',
      downloadReport: '下载报告',
      copyReport: '复制报告',
      stratumDistributionTitle: '分层分布',
      stratumTitle: '{{name}} ({{count}}个样本)',
      groupInStratum: '第{{index}}组',
      detailedGroupsTitle: '详细分组',
      groupTitle: '第{{index}}组 ({{count}}个样本)',
      reportPreviewTitle: '统计报告预览',
      noResults: '设置分层和参数后点击"开始随机化"查看结果',
      downloadFileName: '分层随机化报告_{{date}}.txt',
    },
  },

  randomizationTools: {
    title: '随机化工具',
    subtitle: '专业的随机化分组工具，支持多种算法，满足不同研究需求',
    tools: {
      simple: {
        title: '简单随机化',
        description: '基础的随机分组算法，适用于大多数场景'
      },
      block: {
        title: '区组随机化',
        description: '确保每个区组内的平衡分配，减少偏差'
      },
      stratified: {
        title: '分层随机化',
        description: '根据不同特征分层进行随机化，确保每层平衡'
      }
    },
    getStarted: '开始使用',
    features: {
      title: '功能特色',
      reproducible: '支持种子设置，确保结果可重现',
      history: '自动保存历史记录到本地存储',
      export: '支持数据导出和报告生成'
    }
  },

}
