import { RandBox } from "../src";

const randBox = new RandBox();

// 创建 DOM 元素
const app = document.getElementById('app')!;

// 创建主容器
const container = document.createElement('div');
container.className = 'container';

// 创建标题
const title = document.createElement('h1');
title.textContent = 'RandBox 随机数据生成器';
title.className = 'title';

// 创建结果显示区域
const resultArea = document.createElement('div');
resultArea.className = 'result-area';
resultArea.innerHTML = '<p class="placeholder">点击下方按钮生成随机数据</p>';

// 创建按钮容器
const buttonContainer = document.createElement('div');
buttonContainer.className = 'button-container';

// 定义随机数据生成函数
const generators = [
  { name: '姓名', fn: () => randBox.name() },
  { name: '邮箱', fn: () => randBox.email() },
  { name: '整数', fn: () => randBox.integer({ min: 1, max: 1000 }) },
  { name: '布尔值', fn: () => randBox.bool() },
  { name: '颜色', fn: () => randBox.color() },
  { name: '城市', fn: () => randBox.city() },
  { name: '电话', fn: () => randBox.phone() },
  { name: '日期', fn: () => randBox.date({ string: true }) },
  { name: '段落', fn: () => randBox.paragraph({ sentences: 2 }) },
  { name: '头像', fn: () => randBox.avatar() },
  { name: '年龄', fn: () => randBox.age() },
  { name: '公司', fn: () => randBox.company() }
];

// 创建按钮
generators.forEach(generator => {
  const button = document.createElement('button');
  button.textContent = `生成${generator.name}`;
  button.className = 'generate-btn';

  button.addEventListener('click', () => {
    try {
      const result = generator.fn();
      updateResult(generator.name, result);
    } catch (error) {
      updateResult(generator.name, '生成失败');
    }
  });

  buttonContainer.appendChild(button);
});

// 创建随机生成所有数据的按钮
const randomAllButton = document.createElement('button');
randomAllButton.textContent = '🎲 生成所有随机数据';
randomAllButton.className = 'random-all-btn';

randomAllButton.addEventListener('click', () => {
  const results: { [key: string]: any } = {};

  generators.forEach(generator => {
    try {
      results[generator.name] = generator.fn();
    } catch (error) {
      results[generator.name] = '生成失败';
    }
  });

  updateAllResults(results);
});

// 更新单个结果
function updateResult(type: string, value: any) {
  resultArea.innerHTML = `
    <div class="result-item">
      <h3>${type}</h3>
      <div class="result-value">${formatValue(value)}</div>
    </div>
  `;
}

// 更新所有结果
function updateAllResults(results: { [key: string]: any }) {
  const resultsHtml = Object.entries(results)
    .map(([type, value]) => `
      <div class="result-item">
        <h4>${type}</h4>
        <div class="result-value">${formatValue(value)}</div>
      </div>
    `)
    .join('');

  resultArea.innerHTML = `<div class="all-results">${resultsHtml}</div>`;
}

// 格式化显示值
function formatValue(value: any): string {
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

// 组装页面
container.appendChild(title);
container.appendChild(resultArea);
container.appendChild(buttonContainer);
container.appendChild(randomAllButton);
app.appendChild(container);
