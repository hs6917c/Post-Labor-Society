export interface OutlineItem {
  id: string;
  title: string;
  subItems?: string[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface GeneratedContent {
  markdown: string;
  chartData?: ChartDataPoint[];
  chartType?: 'bar' | 'line' | 'pie' | 'area';
  chartTitle?: string;
  chartXLabel?: string;
  chartYLabel?: string;
  timelineEvents?: TimelineEvent[];
}

export const REPORT_OUTLINE: OutlineItem[] = [
  {
    id: 'intro',
    title: '서론 — 노동이라는 시스템은 어떻게 무너지는가',
    subItems: ['기술혁명 속도 > 규제·교육·계층의 적응 속도', '인간 노동의 가격이 떨어지는 이유']
  },
  {
    id: 'automation-shock',
    title: 'AI·로봇 자동화의 구조적 충격',
    subItems: ['한국 직업군의 자동화 위험률', '제조·물류·백오피스의 선제적 붕괴', '화이트칼라의 붕괴는 블루칼라보다 늦게 온다']
  },
  {
    id: 'energy-currency',
    title: '에너지 기반 화폐 시스템의 등장',
    subItems: ['탄소·전기·ESS·H2 기반 단위가 화폐 역할', '노동→에너지 전환의 경제학']
  },
  {
    id: 'surplus-humanity',
    title: '잉여인간 문제를 어떻게 해결할 것인가',
    subItems: ['문제: “일이 없는데 소득을 어떻게 배분할까?”', '더 큰 문제: “일 없이 인간은 어떻게 자존감을 유지할까?”']
  },
  {
    id: 'project-society',
    title: 'Project Society 모델',
    subItems: ['생존노동 → 프로젝트 수행', '소비자 → 창작·연구·교육·탐험 주체로 변화', '기초 프로젝트 자금(BPF)의 개념']
  },
  {
    id: 'policy',
    title: '정책 과제',
    subItems: ['기본소득 → 기본 프로젝트 투자금', '교육: 산업 중심 → 프로젝트 중심', 'AI 파트너십 기반의 개인 생산성 혁명', '세금 구조: 로봇세, AI세, 에너지세 설계']
  },
  {
    id: 'conclusion',
    title: '결론 — 인류는 어디로 가는가',
    subItems: ['생존경제 → 탐험경제로의 이동', '2035~2050 3단계 시나리오']
  }
];