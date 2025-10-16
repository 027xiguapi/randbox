export default {
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
}