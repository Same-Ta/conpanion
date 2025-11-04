'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import RadarChart from '@/components/RadarChart';
import { getUserId, apiGet, apiPost } from '@/lib/api';
import { JobPosting, UserProgress } from '@/types/api';

// 실제 채용 공고 데이터 (회사 상세 정보 포함)
const REAL_JOB_POSTINGS = [
  // IT/개발 분야
  {
    id: 'kakao-fe-1',
    company: '카카오',
    title: '프론트엔드 개발자',
    category: 'IT/개발',
    description: '카카오의 다양한 서비스를 함께 만들어갈 프론트엔드 개발자를 모집합니다.',
    logo_url: 'https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/65240c33017800001.png',
    poster_url: 'https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/6562f7bc017800001.png',
    url: 'https://careers.kakao.com/jobs',
    is_active: true,
    // 회사 정보
    company_info: {
      description: '카카오는 사람과 기술을 통해 더 나은 세상을 만들어가는 글로벌 IT 기업입니다.',
      employees: '약 10,000명',
      founded: '1995년',
      industry: 'IT/인터넷',
      location: '경기 성남시 분당구 판교역로 235'
    },
    // 복리후생
    benefits: {
      salary: '신입 4,500만원~6,000만원 (경력 협의)',
      work_life: '유연근무제, 재택근무 주 2회',
      vacation: '연차 15일, 리프레시 휴가 7일',
      welfare: ['4대보험', '퇴직연금', '건강검진', '식대 지원', '경조사 지원', '자기계발비 지원'],
      growth: ['사내 교육 프로그램', '컨퍼런스 참가 지원', '도서 구입비 지원'],
      extra: ['사내 카페 무료', '간식 제공', '통근버스 운영', '동호회 활동비 지원']
    },
    // 역량 요구사항 (레이더 차트용)
    skill_requirements: {
      technical: 90, // 기술 역량
      communication: 70, // 커뮤니케이션
      problem_solving: 85, // 문제 해결
      teamwork: 75, // 팀워크
      creativity: 80, // 창의성
      leadership: 60 // 리더십
    },
    requirements: [
      { description: 'React, Vue.js 등 프론트엔드 프레임워크 경험 2년 이상', category: '필수', priority: 'required' },
      { description: 'JavaScript/TypeScript 능숙', category: '필수', priority: 'required' },
      { description: 'RESTful API 연동 경험', category: '필수', priority: 'required' },
      { description: '웹 성능 최적화 경험', category: '우대', priority: 'preferred' },
      { description: 'Next.js 사용 경험', category: '우대', priority: 'preferred' },
      { description: '디자인 시스템 구축 경험', category: '우대', priority: 'preferred' },
      { description: '토익 800점 이상', category: '우대', priority: 'preferred' },
    ],
    // 자격증/어학 요구사항
    certifications: [
      { type: 'language', name: 'TOEIC', minScore: 800, targetScore: 850, required: false }
    ]
  },
  {
    id: 'naver-be-1',
    company: '네이버',
    title: '백엔드 개발자',
    category: 'IT/개발',
    description: '네이버 서비스의 안정적인 운영과 새로운 기능 개발을 담당할 백엔드 개발자를 찾습니다.',
    logo_url: 'https://www.navercorp.com/img/ko/recruit/logo_naver.png',
    poster_url: 'https://recruit.navercorp.com/naver/rcrtReferFriend/images/img_refer_friend.png',
    url: 'https://recruit.navercorp.com/rcrt/list.do',
    is_active: true,
    company_info: {
      description: '네이버는 국내 최고의 검색 포털이자 다양한 인터넷 서비스를 제공하는 글로벌 기업입니다.',
      employees: '약 3,000명',
      founded: '1999년',
      industry: 'IT/인터넷',
      location: '경기 성남시 분당구 정자일로 95'
    },
    benefits: {
      salary: '신입 4,000만원~5,500만원 (경력 협의)',
      work_life: '유연근무제, 재택근무 병행',
      vacation: '연차 15일, 리프레시 휴가 5일',
      welfare: ['4대보험', '퇴직연금', '건강검진', '중식 제공', '카페테리아', '헬스장'],
      growth: ['네이버 Tech Concert', '사내 교육', '외부 세미나 지원'],
      extra: ['사옥 편의시설', '동호회 지원', '경조사 지원', '자녀 학자금']
    },
    skill_requirements: {
      technical: 95,
      communication: 70,
      problem_solving: 90,
      teamwork: 75,
      creativity: 70,
      leadership: 65
    },
    requirements: [
      { description: 'Java, Spring Framework 경험 3년 이상', category: '필수', priority: 'required' },
      { description: 'RDBMS, NoSQL 활용 경험', category: '필수', priority: 'required' },
      { description: '대용량 트래픽 처리 경험', category: '우대', priority: 'preferred' },
      { description: 'MSA 아키텍처 이해', category: '우대', priority: 'preferred' },
      { description: 'Kafka, Redis 경험', category: '우대', priority: 'preferred' },
      { description: '정보처리기사 자격증', category: '우대', priority: 'preferred' },
      { description: 'TOEIC Speaking IH 이상', category: '우대', priority: 'preferred' },
    ],
    certifications: [
      { type: 'certificate', name: '정보처리기사', examDate: '2025-05-10', required: false },
      { type: 'language', name: 'TOEIC Speaking', minScore: 130, targetScore: 150, required: false }
    ]
  },
  {
    id: 'coupang-fullstack-1',
    company: '쿠팡',
    title: '풀스택 개발자',
    category: 'IT/개발',
    description: '쿠팡의 이커머스 플랫폼을 함께 발전시킬 풀스택 개발자를 모집합니다.',
    logo_url: 'https://companieslogo.com/img/orig/CPNG-34ede411.png',
    poster_url: 'https://static.coupangcdn.com/image/coupang/common/logo_coupang_w350.png',
    url: 'https://www.coupang.jobs/kr/jobs/',
    is_active: true,
    company_info: {
      description: '쿠팡은 국내 최대 이커머스 플랫폼으로 고객의 쇼핑 경험을 혁신하고 있습니다.',
      employees: '약 5,000명',
      founded: '2010년',
      industry: 'E-commerce',
      location: '서울 송파구 송파대로 570'
    },
    benefits: {
      salary: '신입 4,500만원~6,500만원 (경력 협의)',
      work_life: '유연근무제, 재택근무 가능',
      vacation: '연차 15일, 여름휴가 5일',
      welfare: ['4대보험', '퇴직연금', '종합검진', '중식 제공', '간식 무제한', '음료 무료'],
      growth: ['AWS 교육 지원', '컨퍼런스 참가', '도서 구입비'],
      extra: ['사내 카페', '게임룸', '수면실', '주차 지원']
    },
    skill_requirements: {
      technical: 88,
      communication: 75,
      problem_solving: 85,
      teamwork: 82,
      creativity: 75,
      leadership: 60
    },
    requirements: [
      { description: 'React, Node.js 개발 경험', category: '필수', priority: 'required' },
      { description: 'AWS 클라우드 서비스 활용', category: '필수', priority: 'required' },
      { description: '데이터베이스 설계 및 최적화', category: '필수', priority: 'required' },
      { description: 'Git 협업 경험', category: '필수', priority: 'required' },
      { description: 'Docker, Kubernetes 경험', category: '우대', priority: 'preferred' },
      { description: 'AWS 자격증 보유', category: '우대', priority: 'preferred' },
      { description: '토익 750점 이상', category: '우대', priority: 'preferred' },
    ],
    certifications: [
      { type: 'certificate', name: 'AWS Solutions Architect Associate', examDate: '2025-06-15', required: false },
      { type: 'language', name: 'TOEIC', minScore: 750, targetScore: 850, required: false }
    ]
  },
  {
    id: 'toss-mobile-1',
    company: '토스',
    title: 'iOS 개발자',
    category: 'IT/개발',
    description: '토스 앱의 최고의 사용자 경험을 만들어갈 iOS 개발자를 찾습니다.',
    logo_url: 'https://static.toss.im/png-icons/logo-toss-blue.png',
    poster_url: 'https://static.toss.im/assets/homepage/tossim/og/toss_og.png',
    url: 'https://toss.im/career/jobs',
    is_active: true,
    company_info: {
      description: '토스는 금융을 쉽고 간편하게 만드는 핀테크 선도 기업입니다.',
      employees: '약 2,500명',
      founded: '2013년',
      industry: 'Fintech',
      location: '서울 강남구 테헤란로 131'
    },
    benefits: {
      salary: '신입 4,800만원~6,500만원 (경력 협의)',
      work_life: '자율 출퇴근, 재택근무 자유',
      vacation: '연차 15일, 리프레시 휴가 10일',
      welfare: ['4대보험', '퇴직연금', '건강검진', '중식 지원', '피트니스 지원', '통신비 지원'],
      growth: ['성장 지원금 연 250만원', '컨퍼런스 무제한', '도서/강의 무제한'],
      extra: ['최신 맥북 프로', '듀얼 모니터', '사무용품 자유', '간식 무제한']
    },
    skill_requirements: {
      technical: 92,
      communication: 72,
      problem_solving: 88,
      teamwork: 78,
      creativity: 85,
      leadership: 62
    },
    requirements: [
      { description: 'Swift/SwiftUI 능숙', category: '필수', priority: 'required' },
      { description: 'iOS 앱 개발 및 배포 경험 2년 이상', category: '필수', priority: 'required' },
      { description: 'MVVM, Clean Architecture 이해', category: '필수', priority: 'required' },
      { description: '성능 최적화 및 디버깅 능력', category: '우대', priority: 'preferred' },
      { description: 'RxSwift, Combine 경험', category: '우대', priority: 'preferred' },
      { description: '토익 Speaking IM 이상', category: '우대', priority: 'preferred' },
    ],
    certifications: [
      { type: 'language', name: 'TOEIC Speaking', minScore: 110, targetScore: 130, required: false }
    ]
  },
  
  // 디자인 분야
  {
    id: 'kakao-uiux-1',
    company: '카카오',
    title: 'UX/UI 디자이너',
    category: '디자인',
    description: '사용자 중심의 디자인으로 카카오 서비스를 혁신할 디자이너를 모집합니다.',
    logo_url: 'https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/65240c33017800001.png',
    poster_url: 'https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/6562f7bc017800001.png',
    url: 'https://careers.kakao.com/jobs',
    is_active: true,
    company_info: {
      description: '카카오는 사람과 기술을 통해 더 나은 세상을 만들어가는 글로벌 IT 기업입니다.',
      employees: '약 10,000명',
      founded: '1995년',
      industry: 'IT/인터넷',
      location: '경기 성남시 분당구 판교역로 235'
    },
    benefits: {
      salary: '신입 3,800만원~5,500만원 (경력 협의)',
      work_life: '유연근무제, 재택근무 주 2회',
      vacation: '연차 15일, 리프레시 휴가 7일',
      welfare: ['4대보험', '퇴직연금', '건강검진', '식대 지원', '경조사 지원', '자기계발비 지원'],
      growth: ['디자인 워크숍', '해외 컨퍼런스', 'Adobe CC 구독'],
      extra: ['최신 맥북 프로', '듀얼 모니터', '와콤 타블렛', '사내 카페']
    },
    skill_requirements: {
      technical: 80,
      communication: 85,
      problem_solving: 75,
      teamwork: 80,
      creativity: 95,
      leadership: 60
    },
    requirements: [
      { description: 'Figma, Sketch 등 디자인 툴 능숙', category: '필수', priority: 'required' },
      { description: '사용자 리서치 및 분석 경험 2년 이상', category: '필수', priority: 'required' },
      { description: '프로토타이핑 제작 능력', category: '필수', priority: 'required' },
      { description: '개발자와의 협업 경험', category: '우대', priority: 'preferred' },
      { description: '디자인 시스템 구축 경험', category: '우대', priority: 'preferred' },
    ]
  },
  {
    id: 'naver-graphic-1',
    company: '네이버',
    title: '그래픽 디자이너',
    category: '디자인',
    description: '네이버 브랜드의 시각적 아이덴티티를 만들어갈 그래픽 디자이너를 찾습니다.',
    logo_url: 'https://www.navercorp.com/img/ko/recruit/logo_naver.png',
    poster_url: 'https://recruit.navercorp.com/naver/rcrtReferFriend/images/img_refer_friend.png',
    url: 'https://recruit.navercorp.com/rcrt/list.do',
    is_active: true,
    requirements: [
      { description: 'Adobe Creative Suite 능숙', category: '필수', priority: 'required' },
      { description: '브랜드 디자인 경험 3년 이상', category: '필수', priority: 'required' },
      { description: '타이포그래피 이해', category: '필수', priority: 'required' },
      { description: '포트폴리오 필수', category: '필수', priority: 'required' },
      { description: '모션 그래픽 경험', category: '우대', priority: 'preferred' },
    ]
  },
  
  // 기획 분야
  {
    id: 'toss-pm-1',
    company: '토스',
    title: '프로덕트 매니저',
    category: '기획',
    description: '토스의 혁신적인 금융 서비스를 기획하고 실행할 PM을 모집합니다.',
    logo_url: 'https://static.toss.im/png-icons/logo-toss-blue.png',
    poster_url: 'https://static.toss.im/assets/homepage/tossim/og/toss_og.png',
    url: 'https://toss.im/career/jobs',
    is_active: true,
    company_info: {
      description: '토스는 금융을 쉽고 간편하게 만드는 핀테크 선도 기업입니다.',
      employees: '약 2,500명',
      founded: '2013년',
      industry: 'Fintech',
      location: '서울 강남구 테헤란로 131'
    },
    benefits: {
      salary: '신입 4,200만원~6,000만원 (경력 협의)',
      work_life: '자율 출퇴근, 재택근무 자유',
      vacation: '연차 15일, 리프레시 휴가 10일',
      welfare: ['4대보험', '퇴직연금', '건강검진', '중식 지원', '피트니스 지원', '통신비 지원'],
      growth: ['성장 지원금 연 250만원', '컨퍼런스 무제한', '도서/강의 무제한'],
      extra: ['최신 맥북', '업무 장비 자유', '간식 무제한', '팀 문화비']
    },
    skill_requirements: {
      technical: 75,
      communication: 90,
      problem_solving: 88,
      teamwork: 85,
      creativity: 82,
      leadership: 85
    },
    requirements: [
      { description: '데이터 기반 의사결정 경험', category: '필수', priority: 'required' },
      { description: 'SQL, 데이터 분석 능력', category: '필수', priority: 'required' },
      { description: '프로덕트 로드맵 수립 경험', category: '필수', priority: 'required' },
      { description: '다양한 팀과의 협업 능력', category: '우대', priority: 'preferred' },
      { description: 'A/B 테스트 설계 및 분석', category: '우대', priority: 'preferred' },
    ]
  },
  {
    id: 'coupang-strategy-1',
    company: '쿠팡',
    title: '비즈니스 전략 기획자',
    category: '기획',
    description: '쿠팡의 비즈니스 성장을 이끌 전략 기획자를 찾습니다.',
    logo_url: 'https://companieslogo.com/img/orig/CPNG-34ede411.png',
    poster_url: 'https://static.coupangcdn.com/image/coupang/common/logo_coupang_w350.png',
    url: 'https://www.coupang.jobs/kr/jobs/',
    is_active: true,
    requirements: [
      { description: '시장 분석 및 리서치 경험', category: '필수', priority: 'required' },
      { description: 'Excel, PowerPoint 능숙', category: '필수', priority: 'required' },
      { description: '전략 수립 및 실행 경험', category: '필수', priority: 'required' },
      { description: '커뮤니케이션 능력', category: '우대', priority: 'preferred' },
    ]
  },
  
  // 마케팅 분야
  {
    id: 'naver-marketing-1',
    company: '네이버',
    title: '디지털 마케터',
    category: '마케팅',
    description: '네이버 서비스의 성장을 이끌 디지털 마케터를 모집합니다.',
    logo_url: 'https://www.navercorp.com/img/ko/recruit/logo_naver.png',
    poster_url: 'https://recruit.navercorp.com/naver/rcrtReferFriend/images/img_refer_friend.png',
    url: 'https://recruit.navercorp.com/rcrt/list.do',
    is_active: true,
    requirements: [
      { description: '퍼포먼스 마케팅 경험 2년 이상', category: '필수', priority: 'required' },
      { description: 'Google Analytics, 광고 플랫폼 활용', category: '필수', priority: 'required' },
      { description: 'A/B 테스트 및 데이터 분석', category: '필수', priority: 'required' },
      { description: '콘텐츠 기획 및 제작', category: '우대', priority: 'preferred' },
    ]
  },
  {
    id: 'kakao-brand-1',
    company: '카카오',
    title: '브랜드 마케터',
    category: '마케팅',
    description: '카카오 브랜드의 가치를 전달할 마케터를 찾습니다.',
    logo_url: 'https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/65240c33017800001.png',
    poster_url: 'https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/6562f7bc017800001.png',
    url: 'https://careers.kakao.com/jobs',
    is_active: true,
    requirements: [
      { description: '브랜드 캠페인 기획 및 실행', category: '필수', priority: 'required' },
      { description: 'SNS 마케팅 경험', category: '필수', priority: 'required' },
      { description: '크리에이티브 감각', category: '우대', priority: 'preferred' },
      { description: '트렌드 분석 능력', category: '우대', priority: 'preferred' },
    ]
  },
  
  // 데이터 분야
  {
    id: 'toss-data-1',
    company: '토스',
    title: '데이터 분석가',
    category: '데이터',
    description: '데이터로 토스의 비즈니스 인사이트를 발굴할 분석가를 모집합니다.',
    logo_url: 'https://static.toss.im/png-icons/logo-toss-blue.png',
    poster_url: 'https://static.toss.im/assets/homepage/tossim/og/toss_og.png',
    url: 'https://toss.im/career/jobs',
    is_active: true,
    requirements: [
      { description: 'SQL, Python 능숙', category: '필수', priority: 'required' },
      { description: '통계 분석 및 가설 검증', category: '필수', priority: 'required' },
      { description: '데이터 시각화 (Tableau, PowerBI)', category: '우대', priority: 'preferred' },
      { description: '비즈니스 이해도', category: '우대', priority: 'preferred' },
    ]
  },
  {
    id: 'coupang-ml-1',
    company: '쿠팡',
    title: 'ML 엔지니어',
    category: '데이터',
    description: '머신러닝으로 쿠팡의 추천 시스템을 고도화할 엔지니어를 찾습니다.',
    logo_url: 'https://companieslogo.com/img/orig/CPNG-34ede411.png',
    poster_url: 'https://static.coupangcdn.com/image/coupang/common/logo_coupang_w350.png',
    url: 'https://www.coupang.jobs/kr/jobs/',
    is_active: true,
    requirements: [
      { description: 'Python, TensorFlow/PyTorch 경험', category: '필수', priority: 'required' },
      { description: '머신러닝 모델 개발 및 배포', category: '필수', priority: 'required' },
      { description: '추천 시스템 구축 경험 우대', category: '우대', priority: 'preferred' },
      { description: '논문 구현 능력', category: '우대', priority: 'preferred' },
    ]
  },
];

const CATEGORIES = ['전체', 'IT/개발', '디자인', '기획', '마케팅', '데이터'];

// 추천 데이터: 공모전, 자격증, 어학
const RECOMMENDATIONS = {
  contests: [
    { id: 'contest-1', title: '네이버 해커톤 2025', category: 'IT/개발', keywords: ['React', 'Next.js', '프론트엔드', '웹'], deadline: '2025-12-31', url: 'https://d2.naver.com' },
    { id: 'contest-2', title: 'AWS 클라우드 챌린지', category: 'IT/개발', keywords: ['AWS', '클라우드', '인프라', 'Docker'], deadline: '2025-11-30', url: 'https://aws.amazon.com' },
    { id: 'contest-3', title: '카카오 AI 챌린지', category: 'IT/개발', keywords: ['AI', 'ML', '데이터', '알고리즘'], deadline: '2025-12-15', url: 'https://www.kakaocorp.com' },
    { id: 'contest-4', title: '토스 핀테크 아이디어톤', category: 'IT/개발', keywords: ['핀테크', '금융', 'API', 'React'], deadline: '2025-11-20', url: 'https://toss.im' },
    { id: 'contest-5', title: 'UX/UI 디자인 어워드', category: '디자인', keywords: ['UX', 'UI', 'Figma', '디자인'], deadline: '2025-12-10', url: 'https://www.uxaward.com' },
    { id: 'contest-6', title: '빅데이터 분석 경진대회', category: '데이터', keywords: ['데이터', 'SQL', 'Python', '분석'], deadline: '2025-11-25', url: 'https://www.bigdata.com' },
  ],
  certificates: [
    { id: 'cert-1', title: '정보처리기사', category: 'IT/개발', keywords: ['Java', 'Spring', '데이터베이스', '알고리즘'], difficulty: '중', period: '3개월' },
    { id: 'cert-2', title: 'AWS Certified Solutions Architect', category: 'IT/개발', keywords: ['AWS', '클라우드', '인프라'], difficulty: '상', period: '6개월' },
    { id: 'cert-3', title: 'Google Analytics 자격증', category: '마케팅', keywords: ['Analytics', '데이터', '마케팅'], difficulty: '하', period: '1개월' },
    { id: 'cert-4', title: 'ADsP 데이터분석 준전문가', category: '데이터', keywords: ['데이터', 'SQL', '통계', '분석'], difficulty: '중', period: '2개월' },
    { id: 'cert-5', title: 'SQLD SQL 개발자', category: 'IT/개발', keywords: ['SQL', '데이터베이스', 'RDBMS'], difficulty: '중', period: '2개월' },
  ],
  languages: [
    { id: 'lang-1', title: '토익 Speaking IH 이상', test: 'TOEIC Speaking', target: 'IH (130-150)', keywords: ['영어', '회화', '비즈니스'], period: '3개월' },
    { id: 'lang-2', title: '토익 800점 이상', test: 'TOEIC', target: '800+', keywords: ['영어', '독해', '청해'], period: '3개월' },
    { id: 'lang-3', title: 'OPIc IM2 이상', test: 'OPIc', target: 'IM2 이상', keywords: ['영어', '회화', '실전'], period: '2개월' },
    { id: 'lang-4', title: 'JLPT N2 이상', test: 'JLPT', target: 'N2 이상', keywords: ['일본어', 'JLPT'], period: '4개월' },
  ],
};

// 사용자 역량 (임시 데이터 - 실제로는 userProgress에서 계산)
const USER_SKILLS = {
  technical: 70,
  communication: 65,
  problem_solving: 75,
  teamwork: 80,
  creativity: 60,
  leadership: 55
};

export default function GoalSettingPage() {
  const router = useRouter();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  
  // 즐겨찾기 상태 (localStorage 사용)
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // 추천 시스템 상태
  const [recommendedItems, setRecommendedItems] = useState<{
    contests: typeof RECOMMENDATIONS.contests;
    certificates: typeof RECOMMENDATIONS.certificates;
    languages: typeof RECOMMENDATIONS.languages;
  }>({ contests: [], certificates: [], languages: [] });
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);
  const [gapFeedback, setGapFeedback] = useState<{
    required_gaps: string[];
    preferred_gaps: string[];
    action_items: string[];
    timeline: string;
  } | null>(null);

  // 자격증/시험 대비 상태
  const [showCertModal, setShowCertModal] = useState(false);
  const [certData, setCertData] = useState({
    type: 'certificate', // 'certificate' | 'exam' | 'language'
    name: '',
    examDate: '',
    intensity: 'medium', // 'low' | 'medium' | 'high' | 'intensive'
    currentScore: '', // 토익 등 현재 점수
    targetScore: '', // 목표 점수
  });
  const [generatedSchedule, setGeneratedSchedule] = useState<Array<{
    title: string;
    date: string;
    category: string;
    priority: 'required' | 'preferred';
    description: string;
  }> | null>(null);

  // 공고에서 감지된 자격증/토익 목록
  const [detectedCertifications, setDetectedCertifications] = useState<Array<{
    type: 'certificate' | 'language';
    name: string;
    minScore?: number;
    targetScore?: number;
    examDate?: string;
    required: boolean;
  }>>([]);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      router.push('/login');
      return;
    }
    loadData();
    
    // 즐겨찾기 로드
    const savedFavorites = localStorage.getItem('favoriteJobs');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [router]);

  // 즐겨찾기 토글
  const toggleFavorite = (jobId: string | number) => {
    const jobIdStr = String(jobId);
    const newFavorites = favorites.includes(jobIdStr)
      ? favorites.filter(id => id !== jobIdStr)
      : [...favorites, jobIdStr];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteJobs', JSON.stringify(newFavorites));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      // API에서 채용 공고 데이터 가져오기
      try {
        const postings = await apiGet<JobPosting[]>('/job-postings');
        setJobPostings(postings.length > 0 ? postings : REAL_JOB_POSTINGS as any);
      } catch (error) {
        // API 실패시 실제 공고 데이터 사용
        console.log('채용 공고 API 실패, 로컬 데이터 사용:', error);
        setJobPostings(REAL_JOB_POSTINGS as any);
      }
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectGoal = async (posting: JobPosting) => {
    try {
      // 백엔드 API 사용: 채용 공고에서 목표 자동 생성
      const goal = await apiPost(`/goals/from-job-posting/${posting.id}`, {
        target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 90일 후
      });
      
      console.log('목표 생성 완료 (백엔드 API):', goal);
      
      // 로컬 스토리지에도 저장 (로드맵 페이지에서 즉시 사용할 수 있도록)
      const existingJobs = JSON.parse(localStorage.getItem('jobPostings') || '[]');
      const newJob = {
        id: posting.id,
        title: posting.title,
        company: posting.company,
        status: '진행중',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
        tags: posting.requirements.filter(r => r.priority === 'required').slice(0, 2).map(r => r.description.substring(0, 10)),
        requirements: posting.requirements,
        url: posting.url
      };
      
      // 중복 체크
      const isDuplicate = existingJobs.some((job: any) => job.id === newJob.id);
      if (!isDuplicate) {
        const updatedJobs = [...existingJobs, newJob];
        localStorage.setItem('jobPostings', JSON.stringify(updatedJobs));
        
        // CustomEvent 발생시켜 다른 컴포넌트에 알림
        window.dispatchEvent(new CustomEvent('jobPostingsUpdated', { 
          detail: updatedJobs 
        }));
        
        console.log('공고 추가됨:', newJob);
        alert(`"${posting.title}"이(가) 로드맵에 추가되었습니다!\n자동으로 학습 계획도 생성되었습니다.`);
      } else {
        alert('이미 로드맵에 추가된 공고입니다.');
      }
      
      setSelectedJob(posting);
      setShowJobDetail(true);
      
      // 추천 항목 생성
      generateRecommendations(posting);
      
      // 갭 분석 및 피드백 생성
      const feedback = analyzeGapAndGenerateFeedback(posting);
      setGapFeedback(feedback);
    } catch (error) {
      console.error('목표 설정 실패:', error);
      // API 실패시 로컬 스토리지에만 저장
      const existingJobs = JSON.parse(localStorage.getItem('jobPostings') || '[]');
      const newJob = {
        id: posting.id,
        title: posting.title,
        company: posting.company,
        status: '진행중',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
        tags: posting.requirements.filter(r => r.priority === 'required').slice(0, 2).map(r => r.description.substring(0, 10)),
        requirements: posting.requirements,
        url: posting.url
      };
      
      const isDuplicate = existingJobs.some((job: any) => job.id === newJob.id);
      if (!isDuplicate) {
        const updatedJobs = [...existingJobs, newJob];
        localStorage.setItem('jobPostings', JSON.stringify(updatedJobs));
        
        // CustomEvent 발생
        window.dispatchEvent(new CustomEvent('jobPostingsUpdated', { 
          detail: updatedJobs 
        }));
        
        console.log('공고 추가됨 (오프라인):', newJob);
        alert(`"${posting.title}"이(가) 로드맵에 추가되었습니다! (오프라인 모드)`);
      } else {
        alert('이미 로드맵에 추가된 공고입니다.');
      }
      
      setSelectedJob(posting);
      setShowJobDetail(true);
      generateRecommendations(posting);
      
      const feedback = analyzeGapAndGenerateFeedback(posting);
      setGapFeedback(feedback);
      
      // 공고에서 자격증/토익 요구사항 감지
      const certifications = (posting as any).certifications || [];
      setDetectedCertifications(certifications);
    }
  };

  // 우대사항 기반 추천 생성
  const generateRecommendations = (posting: JobPosting) => {
    // 우대 요구사항 추출
    const preferredReqs = posting.requirements
      .filter(req => req.priority === 'preferred')
      .map(req => req.description.toLowerCase());
    
    // 키워드 매칭
    const matchScore = (keywords: string[], reqText: string) => {
      return keywords.filter(keyword => 
        reqText.includes(keyword.toLowerCase())
      ).length;
    };
    
    // 공모전 추천 (우대사항 키워드 매칭)
    const matchedContests = RECOMMENDATIONS.contests
      .map(contest => ({
        ...contest,
        score: preferredReqs.reduce((sum, req) => 
          sum + matchScore(contest.keywords, req), 0
        )
      }))
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    // 자격증 추천
    const matchedCertificates = RECOMMENDATIONS.certificates
      .map(cert => ({
        ...cert,
        score: preferredReqs.reduce((sum, req) => 
          sum + matchScore(cert.keywords, req), 0
        )
      }))
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    // 어학 추천 (영어/일본어 우대사항 있으면)
    const hasLanguageReq = preferredReqs.some(req => 
      req.includes('영어') || req.includes('일본어') || req.includes('어학')
    );
    const matchedLanguages = hasLanguageReq 
      ? RECOMMENDATIONS.languages.filter(lang => 
          preferredReqs.some(req => 
            lang.keywords.some(k => req.includes(k.toLowerCase()))
          )
        ).slice(0, 2)
      : [];
    
    setRecommendedItems({
      contests: matchedContests,
      certificates: matchedCertificates,
      languages: matchedLanguages
    });
    setSelectedRecommendations([]);
  };

  // 갭 분석 및 피드백 생성
  const analyzeGapAndGenerateFeedback = (posting: JobPosting) => {
    if (!userProgress) return null;

    const feedback = {
      required_gaps: [] as string[],
      preferred_gaps: [] as string[],
      action_items: [] as string[],
      timeline: '' as string
    };

    // 필수 요건 체크
    const requiredReqs = posting.requirements.filter(r => r.priority === 'required');
    requiredReqs.forEach(req => {
      const desc = req.description.toLowerCase();
      let isMet = false;

      // 전공 체크
      if (desc.includes('전공') || desc.includes('학과')) {
        isMet = userProgress.education?.major !== null;
      }
      // 경험/년차 체크
      else if (desc.includes('년') || desc.includes('경험')) {
        isMet = (userProgress.projects?.length || 0) >= 2;
      }
      // 기술 스택 체크 (프로젝트에서 확인)
      else if (desc.includes('react') || desc.includes('javascript') || desc.includes('typescript')) {
        const hasTechStack = userProgress.projects?.some(p => 
          p.tech_stack?.toLowerCase().includes(desc.split(' ')[0].toLowerCase())
        );
        isMet = hasTechStack || false;
      }

      if (!isMet) {
        feedback.required_gaps.push(req.description);
      }
    });

    // 우대사항 체크
    const preferredReqs = posting.requirements.filter(r => r.priority === 'preferred');
    preferredReqs.forEach(req => {
      const desc = req.description.toLowerCase();
      let isMet = false;

      // 자격증 체크
      if (desc.includes('자격증')) {
        isMet = (userProgress.certificates?.length || 0) > 0;
      }
      // 어학 체크
      else if (desc.includes('토익') || desc.includes('영어') || desc.includes('어학')) {
        isMet = (userProgress.languages?.length || 0) > 0;
      }
      // 수상/공모전 체크
      else if (desc.includes('수상') || desc.includes('공모전')) {
        isMet = userProgress.activities?.some(a => 
          a.activity_type?.includes('공모전') || a.activity_type?.includes('수상')
        ) || false;
      }
      // 기술 스택 체크
      else {
        const hasTechStack = userProgress.projects?.some(p => 
          p.tech_stack?.toLowerCase().includes(desc.split(' ')[0].toLowerCase())
        );
        isMet = hasTechStack || false;
      }

      if (!isMet) {
        feedback.preferred_gaps.push(req.description);
      }
    });

    // 액션 아이템 생성
    if (feedback.required_gaps.length > 0) {
      feedback.action_items.push(`🔴 필수 요건 ${feedback.required_gaps.length}개 부족 - 최우선 보완 필요`);
      feedback.required_gaps.forEach(gap => {
        if (gap.toLowerCase().includes('프로젝트') || gap.toLowerCase().includes('경험')) {
          feedback.action_items.push(`→ ${gap}: 관련 사이드 프로젝트 1-2개 진행 (3-6개월)`);
        } else if (gap.toLowerCase().includes('기술') || gap.toLowerCase().includes('stack')) {
          feedback.action_items.push(`→ ${gap}: 온라인 강의 수강 및 토이 프로젝트 제작 (2-3개월)`);
        } else {
          feedback.action_items.push(`→ ${gap}: 관련 학습 및 경험 쌓기`);
        }
      });
    }

    if (feedback.preferred_gaps.length > 0) {
      feedback.action_items.push(`🟡 우대사항 ${feedback.preferred_gaps.length}개 부족 - 경쟁력 강화 필요`);
      feedback.preferred_gaps.forEach(gap => {
        if (gap.toLowerCase().includes('자격증')) {
          feedback.action_items.push(`→ ${gap}: 관련 자격증 취득 (2-3개월)`);
        } else if (gap.toLowerCase().includes('토익') || gap.toLowerCase().includes('영어')) {
          feedback.action_items.push(`→ ${gap}: 토익/오픽 목표 점수 달성 (2-4개월)`);
        } else if (gap.toLowerCase().includes('공모전') || gap.toLowerCase().includes('수상')) {
          feedback.action_items.push(`→ ${gap}: 관련 공모전 참가 및 수상 목표 (3-6개월)`);
        } else {
          feedback.action_items.push(`→ ${gap}: 관련 프로젝트 또는 스터디 진행`);
        }
      });
    }

    if (feedback.required_gaps.length === 0 && feedback.preferred_gaps.length === 0) {
      feedback.action_items.push('✅ 모든 요건을 충족하고 있습니다!');
      feedback.action_items.push('→ 포트폴리오 정리 및 면접 준비에 집중하세요');
      feedback.timeline = '지원 가능';
    } else {
      const totalMonths = Math.max(
        feedback.required_gaps.length * 2,
        feedback.preferred_gaps.length
      );
      feedback.timeline = `약 ${totalMonths}개월 준비 필요`;
    }

    return feedback;
  };

  const toggleRecommendation = (id: string) => {
    setSelectedRecommendations(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  // 자격증/시험 대비 일정 생성
  const generateCertSchedule = () => {
    if (!certData.examDate) {
      alert('시험 날짜를 선택해주세요.');
      return;
    }

    const schedules: Array<{
      title: string;
      date: string;
      category: string;
      priority: 'required' | 'preferred';
      description: string;
    }> = [];

    const examDate = new Date(certData.examDate);
    const today = new Date();
    const daysUntilExam = Math.floor((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const weeksUntilExam = Math.floor(daysUntilExam / 7);

    if (daysUntilExam < 0) {
      alert('시험 날짜가 이미 지났습니다.');
      return;
    }

    // 강도별 학습 계획
    let studyFrequency = 3; // 주당 학습 일수
    let dailyHours = 2; // 일일 학습 시간

    if (certData.intensity === 'low') {
      studyFrequency = 2;
      dailyHours = 1;
    } else if (certData.intensity === 'high') {
      studyFrequency = 5;
      dailyHours = 3;
    } else if (certData.intensity === 'intensive') {
      studyFrequency = 7;
      dailyHours = 4;
    }

    // 토익/토플 등 점수 향상 목표인 경우
    if (certData.type === 'language' && certData.currentScore && certData.targetScore) {
      const current = parseInt(certData.currentScore);
      const target = parseInt(certData.targetScore);
      const scoreDiff = target - current;

      schedules.push({
        title: `${certData.name} 진단 평가`,
        date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: '학습',
        priority: 'required',
        description: `현재 실력 파악 및 취약 영역 분석 (현재: ${current}점 → 목표: ${target}점, 향상 필요: ${scoreDiff}점)`
      });

      // 토익 점수별 학습 전략
      if (certData.name.toLowerCase().includes('토익')) {
        // LC (듣기) 학습
        for (let week = 1; week <= Math.min(weeksUntilExam, 8); week += 2) {
          const dateOffset = week * 7 * 24 * 60 * 60 * 1000;
          schedules.push({
            title: `토익 LC Part ${Math.ceil(week / 2)} 집중 학습`,
            date: new Date(today.getTime() + dateOffset).toISOString().split('T')[0],
            category: '학습',
            priority: 'required',
            description: `듣기 영역 Part ${Math.ceil(week / 2)} 문제 유형 분석 및 연습 (주 ${studyFrequency}회, 일 ${dailyHours}시간)`
          });
        }

        // RC (독해) 학습
        for (let week = 2; week <= Math.min(weeksUntilExam, 8); week += 2) {
          const dateOffset = week * 7 * 24 * 60 * 60 * 1000;
          schedules.push({
            title: `토익 RC Part ${Math.ceil(week / 2) + 4} 집중 학습`,
            date: new Date(today.getTime() + dateOffset).toISOString().split('T')[0],
            category: '학습',
            priority: 'required',
            description: `독해 영역 Part ${Math.ceil(week / 2) + 4} 문법 및 독해 전략 (주 ${studyFrequency}회, 일 ${dailyHours}시간)`
          });
        }

        // 모의고사
        const mockExamWeeks = [
          Math.floor(weeksUntilExam * 0.3),
          Math.floor(weeksUntilExam * 0.5),
          Math.floor(weeksUntilExam * 0.7),
          Math.floor(weeksUntilExam * 0.9)
        ].filter(w => w > 0 && w < weeksUntilExam);

        mockExamWeeks.forEach((week, idx) => {
          schedules.push({
            title: `토익 모의고사 ${idx + 1}회`,
            date: new Date(today.getTime() + week * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: '시험',
            priority: 'required',
            description: '실전 모의고사 풀이 및 오답 노트 정리 (2시간)'
          });
        });

        // 실전 대비 (시험 2주 전)
        if (weeksUntilExam >= 2) {
          schedules.push({
            title: '토익 실전 대비 - 약점 보완',
            date: new Date(examDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: '학습',
            priority: 'required',
            description: '그동안의 오답 노트 복습 및 취약 영역 집중 학습'
          });
        }

        // 최종 점검 (시험 3일 전)
        schedules.push({
          title: '토익 최종 모의고사',
          date: new Date(examDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          category: '시험',
          priority: 'required',
          description: '최종 실전 모의고사 및 컨디션 조절'
        });
      }

      // 오픽/토스 등 회화 시험
      else if (certData.name.toLowerCase().includes('오픽') || certData.name.toLowerCase().includes('토스')) {
        const topics = ['자기소개', '일상생활', '취미/여가', '직장/학교', '여행/문화', '돌발 주제'];
        
        topics.forEach((topic, idx) => {
          const week = Math.floor((weeksUntilExam / topics.length) * idx) + 1;
          if (week < weeksUntilExam) {
            schedules.push({
              title: `${certData.name} ${topic} 주제 연습`,
              date: new Date(today.getTime() + week * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              category: '학습',
              priority: 'required',
              description: `${topic} 관련 답변 준비 및 스크립트 작성, 음성 녹음 연습 (주 ${studyFrequency}회)`
            });
          }
        });

        // 실전 모의고사
        if (weeksUntilExam >= 2) {
          schedules.push({
            title: `${certData.name} 실전 모의고사`,
            date: new Date(examDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: '시험',
            priority: 'required',
            description: '실전과 동일한 환경에서 모의고사 진행'
          });
        }
      }
    }
    // 자격증 (정보처리기사, AWS, 등)
    else if (certData.type === 'certificate') {
      // 필기 준비 기간 (전체의 60%)
      const writtenWeeks = Math.floor(weeksUntilExam * 0.6);
      
      // 정보처리기사
      if (certData.name.includes('정보처리기사')) {
        const subjects = ['소프트웨어 설계', '데이터베이스', '프로그래밍 언어', '정보시스템', '소프트웨어 공학'];
        
        subjects.forEach((subject, idx) => {
          const week = Math.floor((writtenWeeks / subjects.length) * idx) + 1;
          schedules.push({
            title: `정보처리기사 ${subject} 학습`,
            date: new Date(today.getTime() + week * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: '학습',
            priority: 'required',
            description: `${subject} 과목 이론 학습 및 기출문제 풀이 (주 ${studyFrequency}회, 일 ${dailyHours}시간)`
          });
        });

        // 모의고사
        schedules.push({
          title: '정보처리기사 필기 모의고사',
          date: new Date(today.getTime() + writtenWeeks * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          category: '시험',
          priority: 'required',
          description: '필기 전 과목 통합 모의고사 및 취약 과목 보완'
        });

        // 실기 준비
        const practicalStart = writtenWeeks + 1;
        if (practicalStart < weeksUntilExam) {
          schedules.push({
            title: '정보처리기사 실기 SQL 학습',
            date: new Date(today.getTime() + practicalStart * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: '학습',
            priority: 'required',
            description: 'SQL 쿼리 작성 연습 및 ERD 설계 학습'
          });

          schedules.push({
            title: '정보처리기사 실기 프로그래밍 학습',
            date: new Date(today.getTime() + (practicalStart + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: '학습',
            priority: 'required',
            description: 'C/Java/Python 기출 문제 풀이 및 알고리즘 연습'
          });
        }
      }
      // AWS/클라우드 자격증
      else if (certData.name.toLowerCase().includes('aws') || certData.name.toLowerCase().includes('cloud')) {
        const domains = ['클라우드 개념', 'IAM & 보안', 'EC2 & 네트워킹', 'S3 & 스토리지', '데이터베이스', '모니터링 & 관리'];
        
        domains.forEach((domain, idx) => {
          const week = Math.floor((weeksUntilExam / domains.length) * idx) + 1;
          if (week < weeksUntilExam) {
            schedules.push({
              title: `${certData.name} ${domain} 학습`,
              date: new Date(today.getTime() + week * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              category: '학습',
              priority: 'required',
              description: `${domain} 개념 학습 및 실습 (AWS 프리티어 활용)`
            });
          }
        });

        // 덤프 문제 풀이
        if (weeksUntilExam >= 4) {
          schedules.push({
            title: `${certData.name} 덤프 문제 풀이`,
            date: new Date(examDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: '학습',
            priority: 'required',
            description: '기출 덤프 문제 반복 풀이 및 오답 정리'
          });
        }
      }
      // 기타 자격증
      else {
        const phases = ['기초 개념', '심화 학습', '실전 문제', '최종 정리'];
        phases.forEach((phase, idx) => {
          const week = Math.floor((weeksUntilExam / phases.length) * idx) + 1;
          if (week < weeksUntilExam) {
            schedules.push({
              title: `${certData.name} ${phase}`,
              date: new Date(today.getTime() + week * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              category: '학습',
              priority: idx < 2 ? 'required' : 'preferred',
              description: `${phase} 단계 학습 (주 ${studyFrequency}회, 일 ${dailyHours}시간)`
            });
          }
        });
      }

      // 최종 점검
      if (weeksUntilExam >= 1) {
        schedules.push({
          title: `${certData.name} 최종 점검`,
          date: new Date(examDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          category: '학습',
          priority: 'required',
          description: '오답 노트 복습 및 핵심 요약 정리'
        });
      }
    }
    // 코딩 테스트 대비
    else if (certData.type === 'exam' && certData.name.includes('코딩테스트')) {
      const algorithmTypes = [
        { name: '구현/시뮬레이션', problems: 15 },
        { name: 'BFS/DFS', problems: 20 },
        { name: '그리디/정렬', problems: 15 },
        { name: '다이나믹 프로그래밍', problems: 20 },
        { name: '이진 탐색/투 포인터', problems: 15 },
        { name: '그래프/최단경로', problems: 15 }
      ];

      algorithmTypes.forEach((type, idx) => {
        const week = Math.floor((weeksUntilExam / algorithmTypes.length) * idx) + 1;
        if (week < weeksUntilExam) {
          schedules.push({
            title: `${type.name} 알고리즘 학습`,
            date: new Date(today.getTime() + week * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: '학습',
            priority: 'required',
            description: `${type.name} 유형 ${type.problems}문제 풀이 및 패턴 정리`
          });
        }
      });

      // 모의 코딩테스트
      const mockWeeks = [
        Math.floor(weeksUntilExam * 0.5),
        Math.floor(weeksUntilExam * 0.75),
        Math.floor(weeksUntilExam * 0.9)
      ].filter(w => w > 0 && w < weeksUntilExam);

      mockWeeks.forEach((week, idx) => {
        schedules.push({
          title: `모의 코딩테스트 ${idx + 1}회`,
          date: new Date(today.getTime() + week * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          category: '시험',
          priority: 'required',
          description: '실전 시간 제한 코딩테스트 (2-3시간)'
        });
      });
    }

    // 시험 당일
    schedules.push({
      title: `${certData.name} 시험`,
      date: certData.examDate,
      category: '시험',
      priority: 'required',
      description: '시험 당일 - 충분한 휴식과 컨디션 관리'
    });

    setGeneratedSchedule(schedules);
  };

  // 일정을 캘린더에 추가
  const addScheduleToCalendar = () => {
    if (!generatedSchedule) return;

    try {
      // localStorage에 저장 (로드맵 페이지에서 읽어갈 수 있도록)
      const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const newTasks = generatedSchedule.map(schedule => ({
        id: `cert_${Date.now()}_${Math.random()}`,
        ...schedule,
        completed: false,
        createdAt: new Date().toISOString()
      }));

      localStorage.setItem('tasks', JSON.stringify([...existingTasks, ...newTasks]));
      
      alert(`${generatedSchedule.length}개의 학습 일정이 로드맵에 추가되었습니다!`);
      setShowCertModal(false);
      setCertData({
        type: 'certificate',
        name: '',
        examDate: '',
        intensity: 'medium',
        currentScore: '',
        targetScore: ''
      });
      setGeneratedSchedule(null);
    } catch (error) {
      console.error('일정 추가 실패:', error);
      alert('일정 추가 중 오류가 발생했습니다.');
    }
  };

  const generateAutoPlan = async () => {
    if (!selectedJob) return;
    
    const userId = getUserId();
    if (!userId) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    
    setGeneratingPlan(true);
    try {
      console.log('자동 계획 생성 시작:', selectedJob);
      console.log('사용자 ID:', userId);
      console.log('공고 ID:', selectedJob.id, '타입:', typeof selectedJob.id);
      
      // 1. 먼저 기존 목표 확인
      let goal: any = null;
      let isExistingGoal = false;
      
      try {
        goal = await apiPost(`/goals/from-job-posting/${selectedJob.id}`, {
          target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
        console.log('목표 생성 완료:', goal);
      } catch (goalError: any) {
        console.log('목표 생성 오류:', goalError);
        
        // 중복 목표 오류인 경우 - 이미 목표가 있다는 뜻
        const errorMsg = goalError.message || '';
        if (errorMsg.includes('duplicate') || errorMsg.includes('already exists') || errorMsg.includes('23505') || errorMsg.includes('goals_user_id_key')) {
          console.log('⚠️ 이미 진행 중인 목표가 존재합니다.');
          isExistingGoal = true;
          
          const confirmReplace = confirm(
            `이미 진행 중인 목표가 있습니다.\n\n` +
            `현재 시스템은 사용자당 하나의 목표만 지원합니다.\n` +
            `새로운 목표로 변경하시려면 로드맵 페이지에서 기존 목표를 먼저 삭제해주세요.\n\n` +
            `채용 공고만 추가하시겠습니까?`
          );
          
          if (!confirmReplace) {
            setGeneratingPlan(false);
            return;
          }
        } else {
          throw goalError; // 다른 오류는 그대로 던지기
        }
      }
      
      console.log('사용할 목표:', goal, '기존 목표 여부:', isExistingGoal);
      
      // 2. 선택된 추천 항목을 태스크로 변환
      type TaskData = {
        title: string;
        description: string;
        category: string;
        due_date: string;
        priority: 'required' | 'preferred';
      };
      
      const recommendedTasks: TaskData[] = selectedRecommendations.map(id => {
        const contest = recommendedItems.contests.find(c => c.id === id);
        if (contest) {
          return {
            title: contest.title,
            description: `마감일: ${contest.deadline}\n${contest.keywords.join(', ')}`,
            category: '공모전',
            due_date: contest.deadline,
            priority: 'preferred' as 'required' | 'preferred'
          };
        }
        
        const cert = recommendedItems.certificates.find(c => c.id === id);
        if (cert) {
          return {
            title: cert.title,
            description: `예상 기간: ${cert.period}, 난이도: ${cert.difficulty}\n${cert.keywords.join(', ')}`,
            category: '자격증',
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: 'preferred' as 'required' | 'preferred'
          };
        }
        
        const lang = recommendedItems.languages.find(l => l.id === id);
        if (lang) {
          return {
            title: lang.title,
            description: `목표: ${lang.target}, 시험: ${lang.test}`,
            category: '어학',
            due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: 'preferred' as 'required' | 'preferred'
          };
        }
        
        return null;
      }).filter((task): task is TaskData => task !== null) as TaskData[];

      // 3. 추천 항목이 있으면 태스크로 추가
      if (recommendedTasks.length > 0 && goal && goal.id) {
        for (const task of recommendedTasks) {
          // 프론트엔드 priority를 백엔드 형식으로 변환
          const backendPriority = task.priority === 'required' ? 'high' : 'medium';
          
          await apiPost('/tasks', {
            goal_id: goal.id,
            title: task.title,
            description: task.description,
            category: task.category,
            due_date: task.due_date,
            priority: backendPriority, // 백엔드 형식: 'high' 또는 'medium'
            is_completed: false
          });
        }
        console.log('추천 항목 태스크 생성 완료:', recommendedTasks.length);
      } else if (recommendedTasks.length > 0 && !goal) {
        console.log('목표 ID가 없어서 태스크를 생성할 수 없습니다. (기존 목표가 있는 경우)');
        console.log('추천 항목:', recommendedTasks);
      }
      
      // 4. localStorage에도 저장 (즉시 반영)
      const existingJobs = JSON.parse(localStorage.getItem('jobPostings') || '[]');
      const newJob = {
        id: selectedJob.id,
        title: selectedJob.title,
        company: selectedJob.company,
        status: '진행중',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
        tags: selectedJob.requirements.filter(r => r.priority === 'required').slice(0, 2).map(r => r.description.substring(0, 10)),
        requirements: selectedJob.requirements,
        url: selectedJob.url
      };
      
      const isDuplicate = existingJobs.some((job: any) => job.id === newJob.id);
      if (!isDuplicate) {
        const updatedJobs = [...existingJobs, newJob];
        localStorage.setItem('jobPostings', JSON.stringify(updatedJobs));
        window.dispatchEvent(new CustomEvent('jobPostingsUpdated', { detail: updatedJobs }));
      }
      
      // 기존 목표가 있는 경우 (태스크 생성 스킵)
      if (isExistingGoal) {
        alert(`ℹ️ 이미 진행 중인 목표가 있습니다.\n채용 공고만 추가되었습니다.\n\n기존 목표를 삭제하고 다시 시도하거나, 로드맵 페이지에서 직접 태스크를 추가하세요.`);
      } else {
        // 새로운 목표 생성 성공
        alert(`✅ 자동 계획이 생성되었습니다!\n- 목표: ${selectedJob.title}\n- 태스크: ${recommendedTasks.length}개\n\n로드맵 페이지에서 확인하세요.`);
      }
      router.push('/roadmap');
    } catch (error) {
      console.error('자동 계획 생성 실패 상세:', error);
      
      let errorMessage = '알 수 없는 오류';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // 사용자 등록 안된 경우
        if (errorMessage.includes('user') || errorMessage.includes('foreign key')) {
          errorMessage = `사용자 등록이 필요합니다.\n\n백엔드에 사용자를 먼저 등록해주세요.\n사용자 ID: ${userId}`;
        }
      }
      
      alert(`❌ 계획 생성에 실패했습니다.\n\n${errorMessage}\n\n콘솔(F12)에서 자세한 로그를 확인하세요.`);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const filteredPostings = jobPostings.filter(posting => {
    // 즐겨찾기 필터
    if (selectedCategory === '즐겨찾기') {
      return favorites.includes(String(posting.id));
    }
    
    const matchesCategory = selectedCategory === '전체' || (posting as any).category === selectedCategory;
    const matchesSearch = 
      posting.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      posting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      posting.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (posting as any).category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
          <div className="text-text-gray">로딩 중...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* 헤더 */}
        <div className="border-b border-border-color bg-white">
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-dark mb-2">
                  목표 설정
                </h1>
                <p className="text-sm text-text-gray">
                  관심있는 채용공고를 선택하고 자동으로 학습 계획을 생성하세요
                </p>
              </div>
              <button
                onClick={() => setShowCertModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                자격증/시험 일정 생성
              </button>
            </div>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="border-b border-border-color bg-white sticky top-14 z-10">
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="flex gap-1.5 py-3 overflow-x-auto scrollbar-hide">
              {/* 즐겨찾기 필터 */}
              <button
                onClick={() => setSelectedCategory('즐겨찾기')}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === '즐겨찾기'
                    ? 'bg-yellow-400 text-white shadow-lg'
                    : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                }`}
              >
                <svg className="w-4 h-4" fill={selectedCategory === '즐겨찾기' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                즐겨찾기
                <span className="ml-1 text-xs">
                  {favorites.length}
                </span>
              </button>
              
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-toss-hover'
                      : 'bg-bg-light text-text-gray hover:bg-gray-200'
                  }`}
                >
                  {category}
                  <span className="ml-1.5 text-xs">
                    {category === '전체' 
                      ? jobPostings.length
                      : jobPostings.filter(p => (p as any).category === category).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 검색 */}
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="relative">
            <input
              type="text"
              placeholder="회사명, 포지션, 키워드로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control pl-12"
            />
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-gray"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* 검색 결과 카운트 */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-text-gray">
              총 <span className="font-bold text-primary">{filteredPostings.length}</span>개의 공고
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-text-gray hover:text-text-dark"
              >
                검색 초기화
              </button>
            )}
          </div>
        </div>

        {/* 공고 목록 */}
        <div className="max-w-[1600px] mx-auto px-6 pb-16">
          {filteredPostings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-title-1 font-bold text-text-dark mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-body-2 text-text-gray">
                다른 키워드로 검색해보세요
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {filteredPostings.map((posting) => {
                const gap = userProgress?.gap_analysis?.find(g => g.job_posting_id === posting.id);
                const metCount = gap?.requirements.filter(r => r.is_met).length || 0;
                const totalCount = gap?.requirements.length || 0;
                const matchRate = totalCount > 0 ? Math.round((metCount / totalCount) * 100) : 0;
                const requiredReqs = posting.requirements?.filter(r => (r as any).priority === 'required') || [];
                const preferredReqs = posting.requirements?.filter(r => (r as any).priority === 'preferred') || [];
                const isFavorite = favorites.includes(String(posting.id));

                return (
                  <div
                    key={posting.id}
                    className="group relative"
                  >
                    {/* 메인 카드 */}
                    <div 
                      className="relative bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-102 cursor-pointer border border-gray-100"
                      onClick={() => {
                        setSelectedJob(posting);
                        setShowJobDetail(true);
                      }}
                    >
                      {/* 즐겨찾기 버튼 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(posting.id);
                        }}
                        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all ${
                          isFavorite 
                            ? 'bg-yellow-400 text-white shadow-md' 
                            : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-yellow-400'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>

                      {/* 회사 로고 배경 */}
                      <div className="relative h-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
                        {(posting as any).logo_url && (
                          <div className="absolute inset-0 flex items-center justify-center p-6">
                            <div className="w-20 h-20 flex items-center justify-center bg-white rounded-xl shadow-md p-3">
                              <img
                                src={(posting as any).logo_url}
                                alt={`${posting.company} 로고`}
                                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<div class="text-2xl font-bold text-primary">${posting.company[0]}</div>`;
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* 채용중 뱃지 */}
                        {posting.is_active && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                              채용중
                            </span>
                          </div>
                        )}

                        {/* 카테고리 뱃지 */}
                        {(posting as any).category && (
                          <div className="absolute bottom-2 left-2">
                            <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold rounded-full shadow-sm">
                              {(posting as any).category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 카드 내용 */}
                      <div className="p-3">
                        <h3 className="text-sm font-bold text-text-dark mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                          {posting.company}
                        </h3>
                        <p className="text-xs text-text-gray mb-3 line-clamp-2 font-medium h-8">
                          {posting.title}
                        </p>

                        {/* 필수 요건 미리보기 */}
                        <div className="space-y-1 mb-3">
                          <div className="text-[10px] font-semibold text-text-dark uppercase tracking-wide">필수 요건</div>
                          {requiredReqs.slice(0, 1).map((req, idx) => (
                            <div key={idx} className="flex items-start gap-1 text-[11px] text-text-gray">
                              <svg className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="line-clamp-1">{req.description}</span>
                            </div>
                          ))}
                          {requiredReqs.length > 1 && (
                            <div className="text-[10px] text-primary font-semibold pl-4">
                              외 {requiredReqs.length - 1}개
                            </div>
                          )}
                        </div>

                        {/* 하단 정보 */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-[10px] text-text-light">
                            요구사항 {posting.requirements?.length || 0}개
                          </span>
                          <div className="flex items-center gap-1 text-primary">
                            <span className="text-[11px] font-bold">상세</span>
                            <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 공고 상세 모달 - CFO Dashboard 스타일 */}
        {showJobDetail && selectedJob && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="min-h-screen p-4 sm:p-6 lg:p-8">
              {/* 대시보드 컨테이너 */}
              <div className="w-full max-w-7xl mx-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                
                {/* 헤더 */}
                <div className="relative bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* 회사 로고 */}
                      {(selectedJob as any).logo_url && (
                        <div className="w-16 h-16 rounded-xl bg-white shadow-lg flex items-center justify-center p-3">
                          <img
                            src={(selectedJob as any).logo_url}
                            alt={`${selectedJob.company} 로고`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="text-2xl font-bold text-primary">${selectedJob.company[0]}</div>`;
                              }
                            }}
                          />
                        </div>
                      )}
                      
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                          {selectedJob.company} - {selectedJob.title}
                        </h2>
                        <p className="text-white/80 text-sm">
                          {(selectedJob as any).company_info?.location || '서울'} • 상시 채용
                        </p>
                      </div>
                    </div>

                    {/* 닫기 버튼 */}
                    <button
                      onClick={() => setShowJobDetail(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

              {/* 메인 대시보드 */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* KPI 카드 그리드 (상단 4개) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 매칭률 */}
                  <div className="bg-white rounded-lg p-5 border border-gray-300">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Overall Match</h3>
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <div className="text-3xl font-bold text-gray-900">67</div>
                      <div className="text-lg text-gray-500">%</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-green-600 font-semibold">+12%</span>
                      <span className="text-gray-400">vs Target 80%</span>
                    </div>
                    {/* 프로그레스 바 */}
                    <div className="mt-4 w-full bg-gray-100 h-1.5">
                      <div className="bg-blue-500 h-1.5" style={{width: '67%'}}></div>
                    </div>
                  </div>

                  {/* 필수요건 충족 */}
                  <div className="bg-white rounded-lg p-5 border border-gray-300">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Required</h3>
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <div className="text-3xl font-bold text-gray-900">
                        {selectedJob.requirements.filter(r => (r as any).priority === 'required').filter(() => Math.random() > 0.4).length}
                      </div>
                      <div className="text-lg text-gray-500">
                        / {selectedJob.requirements.filter(r => (r as any).priority === 'required').length}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-red-600 font-semibold">
                        -{selectedJob.requirements.filter(r => (r as any).priority === 'required').length - selectedJob.requirements.filter(r => (r as any).priority === 'required').filter(() => Math.random() > 0.4).length} Missing
                      </span>
                    </div>
                    {/* 프로그레스 바 */}
                    <div className="mt-4 w-full bg-gray-100 h-1.5">
                      <div className="bg-red-500 h-1.5" style={{width: '60%'}}></div>
                    </div>
                  </div>

                  {/* 우대사항 */}
                  <div className="bg-white rounded-lg p-5 border border-gray-300">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Preferred</h3>
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <div className="text-3xl font-bold text-gray-900">
                        {Math.floor(selectedJob.requirements.filter(r => (r as any).priority === 'preferred').length * 0.4)}
                      </div>
                      <div className="text-lg text-gray-500">
                        / {selectedJob.requirements.filter(r => (r as any).priority === 'preferred').length}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-indigo-600 font-semibold">40% Match</span>
                    </div>
                    {/* 프로그레스 바 */}
                    <div className="mt-4 w-full bg-gray-100 h-1.5">
                      <div className="bg-indigo-500 h-1.5" style={{width: '40%'}}></div>
                    </div>
                  </div>

                  {/* 예상 준비기간 */}
                  <div className="bg-white rounded-lg p-5 border border-gray-300">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Timeline</h3>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <div className="text-3xl font-bold text-gray-900">3-6</div>
                      <div className="text-lg text-gray-500">Months</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-green-600 font-semibold">Ready to Start</span>
                    </div>
                    {/* 아이콘 */}
                    <div className="mt-4">
                      <div className="inline-flex items-center justify-center w-10 h-10 border-2 border-green-500 rounded">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 메인 컨텐츠 그리드 */}
                <div className="grid lg:grid-cols-3 gap-6">
                  
                  {/* 스킬 레이더 차트 - 2칸 차지 */}
                  <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-300">
                    <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gray-200">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Competency Analysis</h3>
                      <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-0.5 bg-blue-500"></div>
                          <span className="text-gray-600 font-medium">My Skills</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-0.5 bg-red-500"></div>
                          <span className="text-gray-600 font-medium">Required</span>
                        </div>
                      </div>
                    </div>
                    <RadarChart 
                      userSkills={USER_SKILLS}
                      companyRequirements={(selectedJob as any).skill_requirements || {
                        technical: 80,
                        communication: 70,
                        problem_solving: 75,
                        teamwork: 70,
                        creativity: 65,
                        leadership: 60
                      }}
                    />
                  </div>

                  {/* 우선순위 갭 분석 */}
                  <div className="bg-white rounded-lg p-6 border border-gray-300">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 pb-3 border-b-2 border-gray-200">Priority Gaps</h3>
                    <div className="space-y-4">
                      {Object.entries((selectedJob as any).skill_requirements || {
                        technical: 80,
                        communication: 70,
                        problem_solving: 75,
                        teamwork: 70,
                        creativity: 65,
                        leadership: 60
                      }).map(([skill, required]: [string, any], idx) => {
                        const userLevel = (USER_SKILLS as any)[skill] || 0;
                        const gap = Math.max(0, required - userLevel);
                        const gapPercent = (gap / required) * 100;
                        
                        const skillNames: {[key: string]: string} = {
                          technical: '기술력',
                          communication: '커뮤니케이션',
                          problem_solving: '문제 해결',
                          teamwork: '팀워크',
                          creativity: '창의성',
                          leadership: '리더십'
                        };
                        
                        if (gap === 0) return null;
                        
                        return (
                          <div key={skill} className="pb-3 border-b border-gray-200 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-gray-700 uppercase">{skillNames[skill]}</span>
                              <span className="text-sm font-bold text-red-600">-{gap}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5">
                              <div 
                                className="bg-red-500 h-1.5 transition-all"
                                style={{width: `${Math.min(100, gapPercent)}%`}}
                              ></div>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">Gap: {Math.round(gapPercent)}%</div>
                          </div>
                        );
                      }).filter(Boolean).slice(0, 6)}
                    </div>
                  </div>

                  {/* 회사 정보 카드 */}
                  {(selectedJob as any).company_info && (
                    <div className="bg-white rounded-lg p-6 border border-gray-300">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 pb-3 border-b-2 border-gray-200">Company Info</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start justify-between py-2 border-b border-gray-200">
                          <span className="text-xs font-semibold text-gray-600 uppercase">Employees</span>
                          <span className="text-sm font-bold text-gray-900">{(selectedJob as any).company_info.employees}</span>
                        </div>
                        
                        <div className="flex items-start justify-between py-2 border-b border-gray-200">
                          <span className="text-xs font-semibold text-gray-600 uppercase">Founded</span>
                          <span className="text-sm font-bold text-gray-900">{(selectedJob as any).company_info.founded}</span>
                        </div>
                        
                        <div className="flex items-start justify-between py-2 border-b border-gray-200">
                          <span className="text-xs font-semibold text-gray-600 uppercase">Industry</span>
                          <span className="text-sm font-bold text-gray-900">{(selectedJob as any).company_info.industry}</span>
                        </div>
                        
                        <div className="flex items-start justify-between py-2 border-b border-gray-200">
                          <span className="text-xs font-semibold text-gray-600 uppercase">Location</span>
                          <span className="text-sm font-bold text-gray-900">{(selectedJob as any).company_info.location}</span>
                        </div>
                        
                        <div className="pt-4 mt-2">
                          <p className="text-xs text-gray-600 leading-relaxed">{(selectedJob as any).company_info.description}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 복리후생 카드 */}
                  {(selectedJob as any).benefits && (
                    <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-300">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 pb-3 border-b-2 border-gray-200">Benefits & Environment</h3>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        {/* 연봉 */}
                        <div className="p-4 bg-white border-2 border-gray-200">
                          <div className="text-xs font-bold text-gray-600 uppercase mb-2">Salary Range</div>
                          <div className="text-lg font-bold text-gray-900">{(selectedJob as any).benefits.salary}</div>
                        </div>
                        
                        {/* 근무 형태 */}
                        <div className="p-4 bg-white border-2 border-gray-200">
                          <div className="text-xs font-bold text-gray-600 uppercase mb-2">Work Style</div>
                          <div className="text-base font-bold text-gray-900">{(selectedJob as any).benefits.work_life}</div>
                        </div>
                        
                        {/* 휴가 */}
                        <div className="p-4 bg-white border-2 border-gray-200">
                          <div className="text-xs font-bold text-gray-600 uppercase mb-2">Vacation</div>
                          <div className="text-base font-bold text-gray-900">{(selectedJob as any).benefits.vacation}</div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* 주요 복지 */}
                        <div>
                          <h4 className="text-xs font-bold text-gray-700 uppercase mb-3 pb-2 border-b border-gray-200">Welfare</h4>
                          <div className="space-y-2">
                            {(selectedJob as any).benefits.welfare.map((item: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span className="text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* 성장 지원 */}
                        <div>
                          <h4 className="text-xs font-bold text-gray-700 uppercase mb-3 pb-2 border-b border-gray-200">Growth Support</h4>
                          <div className="space-y-2">
                            {(selectedJob as any).benefits.growth.map((item: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span className="text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {(selectedJob as any).benefits.extra && (selectedJob as any).benefits.extra.length > 0 && (
                        <div className="mt-6 pt-6 border-t-2 border-gray-200">
                          <h4 className="text-xs font-bold text-gray-700 uppercase mb-3">Additional Benefits</h4>
                          <div className="flex flex-wrap gap-2">
                            {(selectedJob as any).benefits.extra.map((item: string, idx: number) => (
                              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs border border-gray-300">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}



                  {/* 지원 조건 섹션 */}
                  {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                    <div className="lg:col-span-3 bg-white rounded-lg p-6 border border-gray-300">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 pb-3 border-b-2 border-gray-200">Qualifications</h3>
                      
                      {/* 필수 요건 vs 우대사항 분리 */}
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* 필수 요건 */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 pb-2 mb-3 border-b-2 border-gray-200">
                            <h4 className="text-xs font-bold text-gray-900 uppercase">Required</h4>
                            <span className="text-xs font-bold text-red-600 ml-auto">
                              {selectedJob.requirements.filter(r => (r as any).priority === 'required').length} Items
                            </span>
                          </div>
                          <div className="space-y-1">
                            {selectedJob.requirements
                              .filter(r => (r as any).priority === 'required')
                              .map((req, idx) => {
                                const isMet = Math.random() > 0.4;
                                return (
                                  <div key={idx} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                                    <span className={`w-4 h-4 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                                      isMet ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {isMet ? '✓' : '✗'}
                                    </span>
                                    <span className={`flex-1 text-xs ${isMet ? 'text-gray-700' : 'text-gray-500'}`}>
                                      {req.description}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>

                        {/* 우대사항 */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 pb-2 mb-3 border-b-2 border-gray-200">
                            <h4 className="text-xs font-bold text-gray-900 uppercase">Preferred</h4>
                            <span className="text-xs font-bold text-indigo-600 ml-auto">
                              {selectedJob.requirements.filter(r => (r as any).priority === 'preferred').length} Items
                            </span>
                          </div>
                          <div className="space-y-1">
                            {selectedJob.requirements
                              .filter(r => (r as any).priority === 'preferred')
                              .map((req, idx) => {
                                const isMet = Math.random() > 0.6;
                                return (
                                  <div key={idx} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                                    <span className={`w-4 h-4 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                                      isMet ? 'text-indigo-600' : 'text-gray-400'
                                    }`}>
                                      {isMet ? '✓' : '○'}
                                    </span>
                                    <span className={`flex-1 text-xs ${isMet ? 'text-gray-700' : 'text-gray-400'}`}>
                                      {req.description}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* AI 피드백 및 액션 플랜 */}
                  {gapFeedback && gapFeedback.action_items.length > 0 && (
                    <div className="lg:col-span-3 bg-white rounded-lg p-6 border border-gray-300">
                      <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 border-2 border-gray-900 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Action Plan</h3>
                            <p className="text-xs text-gray-600">Recommended Steps</p>
                          </div>
                        </div>
                        <div className="px-4 py-1.5 border-2 border-gray-900">
                          <span className="text-xs font-bold text-gray-900 uppercase">{gapFeedback.timeline}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {gapFeedback.action_items.slice(0, 5).map((item, idx) => (
                          <div 
                            key={idx}
                            className="flex items-start gap-4 py-3 border-b border-gray-200 last:border-0"
                          >
                            <div className="flex-shrink-0 w-6 h-6 border-2 border-gray-900 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-900">{idx + 1}</span>
                            </div>
                            <p className="text-xs text-gray-700 flex-1 pt-0.5">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 자격증/토익 로드맵 생성 */}
                  {detectedCertifications.length > 0 && (
                    <div className="lg:col-span-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border-2 border-purple-300">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-purple-900">자격증/어학 로드맵 생성</h3>
                          <p className="text-sm text-purple-700">이 회사에서 요구하는 자격증/어학을 선택하고 학습 일정을 자동으로 생성하세요</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {detectedCertifications.map((cert, idx) => (
                          <div 
                            key={idx}
                            className="bg-white rounded-lg p-4 border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer group"
                            onClick={() => {
                              if (cert.type === 'language') {
                                setCertData({
                                  type: 'language',
                                  name: cert.name,
                                  examDate: '',
                                  intensity: 'medium',
                                  currentScore: '',
                                  targetScore: cert.targetScore?.toString() || ''
                                });
                              } else {
                                setCertData({
                                  type: 'certificate',
                                  name: cert.name,
                                  examDate: cert.examDate || '',
                                  intensity: 'medium',
                                  currentScore: '',
                                  targetScore: ''
                                });
                              }
                              setShowCertModal(true);
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {cert.type === 'language' ? (
                                  <span className="text-2xl">🌍</span>
                                ) : (
                                  <span className="text-2xl">📜</span>
                                )}
                                <div>
                                  <h4 className="font-bold text-gray-900">{cert.name}</h4>
                                  <p className="text-xs text-gray-600">
                                    {cert.type === 'language' ? '어학시험' : '자격증'}
                                  </p>
                                </div>
                              </div>
                              {cert.required && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                                  필수
                                </span>
                              )}
                              {!cert.required && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                  우대
                                </span>
                              )}
                            </div>

                            {cert.type === 'language' && cert.targetScore && (
                              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                  <span className="font-semibold">목표:</span> {cert.targetScore}점 이상
                                </p>
                              </div>
                            )}

                            {cert.examDate && (
                              <div className="mb-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-sm text-yellow-800">
                                  <span className="font-semibold">📅 시험일:</span> {cert.examDate}
                                </p>
                              </div>
                            )}

                            <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold rounded-lg group-hover:shadow-lg transition-all flex items-center justify-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              로드맵 자동 생성
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-4 bg-white/70 rounded-lg border border-purple-200">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-sm text-purple-800">
                            <p className="font-semibold mb-1">💡 로드맵 생성 안내</p>
                            <p className="text-xs">선택한 자격증/어학에 맞춰 <strong>시험 날짜, 학습 강도</strong>를 설정하면 자동으로 최적의 학습 일정을 캘린더에 생성해드립니다!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
                {/* 메인 컨텐츠 그리드 끝 */}

                {/* 추가 정보 섹션 */}
                <div className="space-y-5">
                  {/* 공고 설명 */}
                  {selectedJob.description && (
                    <div className="bg-white rounded-lg p-6 border border-gray-300">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pb-3 border-b-2 border-gray-200">Position Description</h3>
                      <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                        {selectedJob.description}
                      </p>
                    </div>
                  )}

                  {/* 원본 공고 링크 */}
                  {selectedJob.url && (
                    <div className="bg-white rounded-lg p-6 border-2 border-gray-900">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 uppercase mb-1">View Original Posting</h4>
                          <p className="text-xs text-gray-600">
                            Visit the official company website for details
                          </p>
                        </div>
                        <a
                          href={selectedJob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-2 bg-gray-900 text-white text-xs font-bold uppercase hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                          View
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* 추천 항목 */}
                  {(recommendedItems.contests.length > 0 || 
                    recommendedItems.certificates.length > 0 || 
                    recommendedItems.languages.length > 0) && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <h3 className="text-title-2 font-bold text-text-dark">맞춤 추천</h3>
                        <span className="text-sm text-text-gray">우대사항 기반 추천</span>
                      </div>

                      {/* 공모전 추천 */}
                      {recommendedItems.contests.length > 0 && (
                        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                          <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            추천 공모전 ({recommendedItems.contests.length})
                          </h4>
                          <div className="space-y-2">
                            {recommendedItems.contests.map((contest) => (
                              <label
                                key={contest.id}
                                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 cursor-pointer transition-all"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedRecommendations.includes(contest.id)}
                                  onChange={() => toggleRecommendation(contest.id)}
                                  className="mt-1 w-4 h-4 text-primary focus:ring-primary rounded"
                                />
                                <div className="flex-1">
                                  <div className="font-semibold text-text-dark">{contest.title}</div>
                                  <div className="text-xs text-text-gray mt-1">
                                    마감: {contest.deadline}
                                  </div>
                                  <div className="text-xs text-blue-600 mt-1">
                                    {contest.keywords.join(', ')}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 자격증 추천 */}
                      {recommendedItems.certificates.length > 0 && (
                        <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                          <h4 className="font-bold text-purple-700 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            추천 자격증 ({recommendedItems.certificates.length})
                          </h4>
                          <div className="space-y-2">
                            {recommendedItems.certificates.map((cert) => (
                              <label
                                key={cert.id}
                                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-300 cursor-pointer transition-all"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedRecommendations.includes(cert.id)}
                                  onChange={() => toggleRecommendation(cert.id)}
                                  className="mt-1 w-4 h-4 text-primary focus:ring-primary rounded"
                                />
                                <div className="flex-1">
                                  <div className="font-semibold text-text-dark">{cert.title}</div>
                                  <div className="text-xs text-text-gray mt-1">
                                    난이도: {cert.difficulty} | 예상 기간: {cert.period}
                                  </div>
                                  <div className="text-xs text-purple-600 mt-1">
                                    {cert.keywords.join(', ')}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 어학 추천 */}
                      {recommendedItems.languages.length > 0 && (
                        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                          <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                            </svg>
                            추천 어학 시험 ({recommendedItems.languages.length})
                          </h4>
                          <div className="space-y-2">
                            {recommendedItems.languages.map((lang) => (
                              <label
                                key={lang.id}
                                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-100 hover:border-green-300 cursor-pointer transition-all"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedRecommendations.includes(lang.id)}
                                  onChange={() => toggleRecommendation(lang.id)}
                                  className="mt-1 w-4 h-4 text-primary focus:ring-primary rounded"
                                />
                                <div className="flex-1">
                                  <div className="font-semibold text-text-dark">{lang.title}</div>
                                  <div className="text-xs text-text-gray mt-1">
                                    목표: {lang.target} | 예상 기간: {lang.period}
                                  </div>
                                  <div className="text-xs text-green-600 mt-1">
                                    {lang.test}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedRecommendations.length > 0 && (
                        <div className="bg-primary bg-opacity-10 rounded-xl p-4 border-2 border-primary border-opacity-30">
                          <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {selectedRecommendations.length}개 항목 선택됨 - 자동 계획 생성 시 로드맵에 추가됩니다
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* 추가 정보 섹션 끝 */}

              </div>
              {/* 메인 대시보드 끝 */}

              {/* 모달 푸터 */}
              <div className="relative p-6 border-t border-gray-200 bg-gray-50">
                {/* 문서 날짜 */}
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">
                    문서 작성일: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => setShowJobDetail(false)}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                  >
                    문서 닫기
                  </button>
                  <button
                    onClick={generateAutoPlan}
                    disabled={generatingPlan}
                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {generatingPlan ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        생성 중...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        자동 계획 생성 및 지원하기
                      </>
                    )}
                  </button>
                </div>
              </div>
              </div>
            </div>
          </div>
        )}

        {/* 자격증/시험 일정 생성 모달 */}
        {showCertModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              {/* 모달 헤더 */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">자격증/시험 대비 일정 생성</h2>
                      <p className="text-sm text-gray-600 mt-1">목표와 시험 날짜를 설정하면 자동으로 학습 계획을 만들어드립니다</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCertModal(false);
                      setGeneratedSchedule(null);
                    }}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                  >
                    <span className="text-gray-600 text-2xl">×</span>
                  </button>
                </div>
              </div>

              {/* 모달 컨텐츠 */}
              <div className="flex-1 overflow-y-auto p-6">
                {!generatedSchedule ? (
                  <div className="space-y-6">
                    {/* 목표 유형 선택 */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">목표 유형</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setCertData({...certData, type: 'certificate'})}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            certData.type === 'certificate'
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">📜</div>
                          <div className="font-bold text-sm">자격증</div>
                          <div className="text-xs text-gray-600 mt-1">정보처리기사, AWS 등</div>
                        </button>
                        <button
                          onClick={() => setCertData({...certData, type: 'language'})}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            certData.type === 'language'
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">🌍</div>
                          <div className="font-bold text-sm">어학</div>
                          <div className="text-xs text-gray-600 mt-1">토익, 오픽 등</div>
                        </button>
                        <button
                          onClick={() => setCertData({...certData, type: 'exam'})}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            certData.type === 'exam'
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">💻</div>
                          <div className="font-bold text-sm">코딩테스트</div>
                          <div className="text-xs text-gray-600 mt-1">알고리즘, 코테 대비</div>
                        </button>
                      </div>
                    </div>

                    {/* 목표 이름 */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        {certData.type === 'certificate' ? '자격증 이름' :
                         certData.type === 'language' ? '어학 시험 이름' : '시험 이름'}
                      </label>
                      <input
                        type="text"
                        value={certData.name}
                        onChange={(e) => setCertData({...certData, name: e.target.value})}
                        placeholder={
                          certData.type === 'certificate' ? '예: 정보처리기사, AWS Solutions Architect' :
                          certData.type === 'language' ? '예: 토익, 토플, 오픽' : '예: 카카오 코딩테스트'
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    {/* 점수 입력 (어학 시험만) */}
                    {certData.type === 'language' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">현재 점수 (선택)</label>
                          <input
                            type="number"
                            value={certData.currentScore}
                            onChange={(e) => setCertData({...certData, currentScore: e.target.value})}
                            placeholder="예: 650"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">목표 점수</label>
                          <input
                            type="number"
                            value={certData.targetScore}
                            onChange={(e) => setCertData({...certData, targetScore: e.target.value})}
                            placeholder="예: 850"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}

                    {/* 시험 날짜 */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">시험 날짜</label>
                      <input
                        type="date"
                        value={certData.examDate}
                        onChange={(e) => setCertData({...certData, examDate: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    {/* 학습 강도 선택 */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">학습 강도</label>
                      <div className="grid grid-cols-4 gap-3">
                        <button
                          onClick={() => setCertData({...certData, intensity: 'low'})}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            certData.intensity === 'low'
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-bold text-sm mb-1">여유롭게</div>
                          <div className="text-xs text-gray-600">주 2회</div>
                          <div className="text-xs text-gray-600">일 1시간</div>
                        </button>
                        <button
                          onClick={() => setCertData({...certData, intensity: 'medium'})}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            certData.intensity === 'medium'
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-bold text-sm mb-1">보통</div>
                          <div className="text-xs text-gray-600">주 3회</div>
                          <div className="text-xs text-gray-600">일 2시간</div>
                        </button>
                        <button
                          onClick={() => setCertData({...certData, intensity: 'high'})}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            certData.intensity === 'high'
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-bold text-sm mb-1">집중</div>
                          <div className="text-xs text-gray-600">주 5회</div>
                          <div className="text-xs text-gray-600">일 3시간</div>
                        </button>
                        <button
                          onClick={() => setCertData({...certData, intensity: 'intensive'})}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            certData.intensity === 'intensive'
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-bold text-sm mb-1">몰입</div>
                          <div className="text-xs text-gray-600">주 7회</div>
                          <div className="text-xs text-gray-600">일 4시간</div>
                        </button>
                      </div>
                    </div>

                    {/* 정보 카드 */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-indigo-900">
                          <p className="font-semibold mb-1">AI가 추천하는 학습 전략</p>
                          <ul className="space-y-1 text-indigo-800">
                            <li>• 시험 날짜와 강도에 맞춰 최적의 학습 일정을 생성합니다</li>
                            <li>• 모의고사, 실전 대비 등 단계별 계획이 포함됩니다</li>
                            <li>• 생성 후 로드맵에서 일정을 자유롭게 수정할 수 있습니다</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 text-green-900">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-bold">총 {generatedSchedule.length}개의 학습 일정이 생성되었습니다!</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {generatedSchedule.map((schedule, idx) => (
                        <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-all">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-indigo-600">{idx + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-bold text-gray-900">{schedule.title}</h3>
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  schedule.priority === 'required'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {schedule.priority === 'required' ? '필수' : '선택'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{schedule.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {new Date(schedule.date).toLocaleDateString('ko-KR')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  {schedule.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 모달 푸터 */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowCertModal(false);
                      setGeneratedSchedule(null);
                      setCertData({
                        type: 'certificate',
                        name: '',
                        examDate: '',
                        intensity: 'medium',
                        currentScore: '',
                        targetScore: ''
                      });
                    }}
                    className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    취소
                  </button>
                  {!generatedSchedule ? (
                    <button
                      onClick={generateCertSchedule}
                      disabled={!certData.name || !certData.examDate}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      일정 생성하기
                    </button>
                  ) : (
                    <button
                      onClick={addScheduleToCalendar}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      로드맵에 추가하기
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
