# 백엔드 API 요구사항 문서

## 📋 목차
1. [인증 및 사용자 관리](#1-인증-및-사용자-관리)
2. [대시보드](#2-대시보드)
3. [로드맵 템플릿](#3-로드맵-템플릿)
4. [일정 관리 (Tasks)](#4-일정-관리-tasks)
5. [주간 루틴 (Routines)](#5-주간-루틴-routines)
6. [경험 및 회고 (Experiences)](#6-경험-및-회고-experiences)
7. [목표 설정 (Goal Setting)](#7-목표-설정-goal-setting)
8. [태그 시스템](#8-태그-시스템)
9. [데이터 내보내기](#9-데이터-내보내기)
10. [AI/LLM 통합](#10-aillm-통합)

---

## 1. 인증 및 사용자 관리

### 1.1 회원가입
```http
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "preferredJobRole": "백엔드 개발자"
}

Response: 200 OK
{
  "success": true,
  "userId": "user_123456",
  "token": "jwt_token_here",
  "user": {
    "id": "user_123456",
    "email": "user@example.com",
    "name": "홍길동",
    "preferredJobRole": "백엔드 개발자",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}

Error Response: 400 Bad Request
{
  "success": false,
  "error": "이미 존재하는 이메일입니다"
}
```

### 1.2 로그인
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_123456",
    "email": "user@example.com",
    "name": "홍길동",
    "preferredJobRole": "백엔드 개발자"
  }
}

Error Response: 401 Unauthorized
{
  "success": false,
  "error": "이메일 또는 비밀번호가 올바르지 않습니다"
}
```

### 1.3 사용자 프로필 조회
```http
GET /api/users/me
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "user_123456",
  "email": "user@example.com",
  "name": "홍길동",
  "preferredJobRole": "백엔드 개발자",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:20:00Z"
}
```

### 1.4 사용자 프로필 수정
```http
PATCH /api/users/me
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "김철수",
  "preferredJobRole": "풀스택 개발자"
}

Response: 200 OK
{
  "success": true,
  "user": {
    "id": "user_123456",
    "email": "user@example.com",
    "name": "김철수",
    "preferredJobRole": "풀스택 개발자",
    "updatedAt": "2024-01-21T09:15:00Z"
  }
}
```

---

## 2. 대시보드

### 2.1 대시보드 통계 조회
```http
GET /api/dashboard/stats
Authorization: Bearer {token}

Response: 200 OK
{
  "totalExperiences": 24,
  "completedTasks": 18,
  "activeRoadmaps": 3,
  "totalTags": 15,
  "recentActivities": [
    {
      "id": "activity_1",
      "type": "task_completed",
      "title": "React 프로젝트 완성",
      "date": "2024-01-20T15:30:00Z"
    },
    {
      "id": "activity_2",
      "type": "reflection_added",
      "title": "API 개발 회고",
      "date": "2024-01-19T10:20:00Z"
    }
  ],
  "upcomingDeadlines": [
    {
      "taskId": "task_456",
      "title": "포트폴리오 웹사이트 완성",
      "dueDate": "2024-01-25",
      "daysLeft": 5
    }
  ],
  "weeklyProgress": {
    "routinesCompleted": 8,
    "routinesTotal": 10,
    "completionRate": 0.8
  }
}
```

---

## 3. 로드맵 템플릿

### 3.1 템플릿 목록 조회
```http
GET /api/templates
Authorization: Bearer {token}

Response: 200 OK
{
  "templates": [
    {
      "id": "template_1",
      "title": "백엔드 개발자 로드맵",
      "category": "backend",
      "duration": "6개월",
      "difficulty": "intermediate",
      "description": "Node.js, Express, MongoDB를 활용한 백엔드 개발 학습 로드맵",
      "createdAt": "2024-01-10T00:00:00Z"
    }
  ]
}
```

### 3.2 템플릿 상세 조회
```http
GET /api/templates/{templateId}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "template_1",
  "title": "백엔드 개발자 로드맵",
  "category": "backend",
  "duration": "6개월",
  "difficulty": "intermediate",
  "description": "Node.js, Express, MongoDB를 활용한 백엔드 개발 학습 로드맵",
  "tasks": [
    {
      "title": "Node.js 기초 학습",
      "category": "학습",
      "duration": "2주",
      "priority": "required",
      "order": 1
    },
    {
      "title": "Express 프레임워크 학습",
      "category": "학습",
      "duration": "2주",
      "priority": "required",
      "order": 2
    }
  ],
  "routines": [
    {
      "title": "알고리즘 문제 풀이",
      "category": "학습",
      "frequency": 5,
      "color": "#3B82F6",
      "order": 1
    }
  ]
}
```

### 3.3 템플릿 기반 로드맵 생성
```http
POST /api/roadmaps/from-template
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "templateId": "template_1",
  "startDate": "2024-02-01",
  "customizations": {
    "title": "나의 백엔드 로드맵",
    "excludeTasks": ["task_3"],
    "additionalTasks": [
      {
        "title": "TypeScript 학습",
        "category": "학습",
        "date": "2024-02-15",
        "priority": "preferred"
      }
    ]
  }
}

Response: 201 Created
{
  "success": true,
  "roadmapId": "roadmap_789",
  "message": "로드맵이 생성되었습니다"
}
```

---

## 4. 일정 관리 (Tasks)

### 4.1 일정 목록 조회
```http
GET /api/tasks?startDate=2024-01-01&endDate=2024-01-31&status=all
Authorization: Bearer {token}

Query Parameters:
- startDate: string (optional) - 시작 날짜
- endDate: string (optional) - 종료 날짜
- status: 'all' | 'pending' | 'completed' (optional)
- priority: 'all' | 'required' | 'preferred' (optional)
- category: string (optional)

Response: 200 OK
{
  "tasks": [
    {
      "id": "task_123",
      "userId": "user_123456",
      "title": "React 컴포넌트 학습",
      "category": "학습",
      "date": "2024-01-15",
      "priority": "required",
      "completed": false,
      "createdAt": "2024-01-10T00:00:00Z",
      "updatedAt": "2024-01-10T00:00:00Z"
    }
  ]
}
```

### 4.2 일정 생성
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "React 프로젝트 시작",
  "category": "프로젝트",
  "date": "2024-01-20",
  "priority": "required"
}

Response: 201 Created
{
  "success": true,
  "task": {
    "id": "task_456",
    "userId": "user_123456",
    "title": "React 프로젝트 시작",
    "category": "프로젝트",
    "date": "2024-01-20",
    "priority": "required",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4.3 일정 수정
```http
PATCH /api/tasks/{taskId}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "React 프로젝트 완성",
  "date": "2024-01-25",
  "priority": "required"
}

Response: 200 OK
{
  "success": true,
  "task": {
    "id": "task_456",
    "title": "React 프로젝트 완성",
    "date": "2024-01-25",
    "priority": "required",
    "updatedAt": "2024-01-16T14:20:00Z"
  }
}
```

### 4.4 일정 삭제
```http
DELETE /api/tasks/{taskId}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "일정이 삭제되었습니다"
}
```

### 4.5 일정 완료 토글
```http
POST /api/tasks/{taskId}/toggle-completion
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "task": {
    "id": "task_456",
    "completed": true,
    "completedAt": "2024-01-20T16:45:00Z"
  }
}
```

### 4.6 일정 날짜 이동 (드래그 앤 드롭)
```http
PATCH /api/tasks/{taskId}/move
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "newDate": "2024-01-22"
}

Response: 200 OK
{
  "success": true,
  "task": {
    "id": "task_456",
    "date": "2024-01-22",
    "updatedAt": "2024-01-20T10:15:00Z"
  }
}
```

---

## 5. 주간 루틴 (Routines)

### 5.1 루틴 목록 조회
```http
GET /api/routines
Authorization: Bearer {token}

Response: 200 OK
{
  "routines": [
    {
      "id": "routine_1",
      "userId": "user_123456",
      "title": "알고리즘 문제 풀이",
      "category": "학습",
      "frequency": 5,
      "color": "#3B82F6",
      "completions": [
        {
          "weekStart": "2024-01-15",
          "completed": 3
        }
      ],
      "createdAt": "2024-01-10T00:00:00Z"
    }
  ]
}
```

### 5.2 루틴 생성
```http
POST /api/routines
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "영어 공부",
  "category": "학습",
  "frequency": 3,
  "color": "#10B981"
}

Response: 201 Created
{
  "success": true,
  "routine": {
    "id": "routine_2",
    "userId": "user_123456",
    "title": "영어 공부",
    "category": "학습",
    "frequency": 3,
    "color": "#10B981",
    "completions": [],
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

### 5.3 루틴 완료 기록
```http
POST /api/routines/{routineId}/complete
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "weekStart": "2024-01-15",
  "date": "2024-01-16"
}

Response: 200 OK
{
  "success": true,
  "routine": {
    "id": "routine_1",
    "completions": [
      {
        "weekStart": "2024-01-15",
        "completed": 4,
        "dates": ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18"]
      }
    ]
  }
}
```

### 5.4 루틴 수정
```http
PATCH /api/routines/{routineId}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "영어 회화 연습",
  "frequency": 5
}

Response: 200 OK
{
  "success": true,
  "routine": {
    "id": "routine_2",
    "title": "영어 회화 연습",
    "frequency": 5,
    "updatedAt": "2024-01-16T09:30:00Z"
  }
}
```

### 5.5 루틴 삭제
```http
DELETE /api/routines/{routineId}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "루틴이 삭제되었습니다"
}
```

---

## 6. 경험 및 회고 (Experiences)

### 6.1 경험 목록 조회
```http
GET /api/experiences?page=1&limit=10&sortBy=date&order=desc
Authorization: Bearer {token}

Query Parameters:
- page: number (optional, default: 1)
- limit: number (optional, default: 10)
- sortBy: 'date' | 'title' | 'createdAt' (optional)
- order: 'asc' | 'desc' (optional)
- tags: string[] (optional) - 태그로 필터링
- category: string (optional)

Response: 200 OK
{
  "experiences": [
    {
      "id": "exp_123",
      "userId": "user_123456",
      "title": "React 프로젝트 완성",
      "category": "프로젝트",
      "dateRange": "2024-01-10 ~ 2024-01-20",
      "reflection": {
        "learned": "컴포넌트 설계의 중요성을 배웠습니다",
        "challenges": "상태 관리가 복잡했습니다",
        "solutions": "Redux Toolkit을 도입하여 해결했습니다",
        "improvements": "다음에는 초기 설계를 더 신중히 하겠습니다",
        "aiQuestion1": "컴포넌트를 재사용 가능하게 만들었을 때 가장 보람찼습니다",
        "aiQuestion2": "처음엔 단순할 줄 알았지만 확장성을 고려하니 복잡했습니다",
        "aiQuestion3": "React의 핵심 철학을 이해하고 실전에 적용한 경험이라고 설명하겠습니다"
      },
      "tags": ["React", "Redux", "TypeScript"],
      "relatedResources": [
        "https://react.dev",
        "https://redux-toolkit.js.org"
      ],
      "createdAt": "2024-01-20T16:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 24,
    "hasMore": true
  }
}
```

### 6.2 경험 생성 (회고 저장)
```http
POST /api/experiences
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "Node.js API 개발",
  "category": "프로젝트",
  "dateRange": "2024-01-15 ~ 2024-01-22",
  "reflection": {
    "learned": "RESTful API 설계 원칙을 이해했습니다",
    "challenges": "인증 시스템 구현이 어려웠습니다",
    "solutions": "JWT와 Passport.js를 활용했습니다",
    "improvements": "에러 핸들링을 더 체계적으로 하겠습니다",
    "aiQuestion1": "인증 미들웨어를 직접 구현하면서 보안의 중요성을 깨달았습니다",
    "aiQuestion2": "단순한 로그인 기능이 아니라 세션 관리와 보안을 고려해야 했습니다",
    "aiQuestion3": "백엔드 보안의 기초를 실전에서 배운 귀중한 경험이었습니다"
  },
  "tags": ["Node.js", "Express", "JWT"],
  "relatedResources": [
    "https://nodejs.org/docs",
    "https://expressjs.com"
  ]
}

Response: 201 Created
{
  "success": true,
  "experience": {
    "id": "exp_456",
    "userId": "user_123456",
    "title": "Node.js API 개발",
    "category": "프로젝트",
    "dateRange": "2024-01-15 ~ 2024-01-22",
    "reflection": { ... },
    "tags": ["Node.js", "Express", "JWT"],
    "relatedResources": [...],
    "createdAt": "2024-01-22T14:30:00Z"
  }
}
```

### 6.3 경험 상세 조회
```http
GET /api/experiences/{experienceId}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "exp_123",
  "userId": "user_123456",
  "title": "React 프로젝트 완성",
  "category": "프로젝트",
  "dateRange": "2024-01-10 ~ 2024-01-20",
  "reflection": {
    "learned": "...",
    "challenges": "...",
    "solutions": "...",
    "improvements": "...",
    "aiQuestion1": "...",
    "aiQuestion2": "...",
    "aiQuestion3": "..."
  },
  "tags": ["React", "Redux", "TypeScript"],
  "relatedResources": [...],
  "aiInsights": {
    "generatedAt": "2024-01-22T15:00:00Z",
    "summary": "React 프로젝트를 통해 컴포넌트 설계와 상태 관리를 학습",
    "growthAreas": ["컴포넌트 재사용성", "상태 관리"],
    "recommendations": [
      "다음 프로젝트에서는 테스트 코드 작성",
      "성능 최적화 기법 학습"
    ]
  },
  "createdAt": "2024-01-20T16:30:00Z",
  "updatedAt": "2024-01-20T16:30:00Z"
}
```

### 6.4 경험 수정
```http
PATCH /api/experiences/{experienceId}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "React 프로젝트 완성 및 배포",
  "reflection": {
    "improvements": "배포 자동화도 학습하겠습니다"
  },
  "tags": ["React", "Redux", "TypeScript", "Vercel"]
}

Response: 200 OK
{
  "success": true,
  "experience": { ... },
  "message": "경험이 수정되었습니다"
}
```

### 6.5 경험 삭제
```http
DELETE /api/experiences/{experienceId}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "경험이 삭제되었습니다"
}
```

---

## 7. 목표 설정 (Goal Setting)

### 7.1 채용 공고 분석
```http
POST /api/goal-setting/analyze
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "jobPostingUrl": "https://example.com/job/12345",
  "jobDescription": "React, TypeScript를 활용한 프론트엔드 개발...",
  "companyName": "테크 기업 A",
  "position": "프론트엔드 개발자"
}

Response: 200 OK
{
  "analysisId": "analysis_789",
  "companyInfo": {
    "name": "테크 기업 A",
    "position": "프론트엔드 개발자",
    "location": "서울",
    "employmentType": "정규직"
  },
  "requirements": {
    "required": [
      {
        "skill": "React",
        "level": 4,
        "description": "React 프로젝트 경험 3년 이상"
      },
      {
        "skill": "TypeScript",
        "level": 4,
        "description": "TypeScript 실무 경험"
      }
    ],
    "preferred": [
      {
        "skill": "Next.js",
        "level": 3,
        "description": "Next.js 프로젝트 경험"
      }
    ]
  },
  "userSkills": {
    "React": 3,
    "TypeScript": 3,
    "JavaScript": 4,
    "HTML/CSS": 4,
    "Next.js": 2,
    "Git": 3
  },
  "matchScore": {
    "overall": 67,
    "required": 75,
    "preferred": 40
  },
  "gaps": [
    {
      "skill": "React",
      "currentLevel": 3,
      "requiredLevel": 4,
      "gap": 1
    },
    {
      "skill": "TypeScript",
      "currentLevel": 3,
      "requiredLevel": 4,
      "gap": 1
    }
  ],
  "recommendations": [
    "React 심화 학습 - Hooks, Context API 마스터",
    "TypeScript 고급 기능 학습",
    "Next.js 프로젝트 경험 쌓기"
  ],
  "timeline": "3-4개월",
  "createdAt": "2024-01-22T10:00:00Z"
}
```

### 7.2 저장된 분석 목록 조회
```http
GET /api/goal-setting/analyses?page=1&limit=10
Authorization: Bearer {token}

Response: 200 OK
{
  "analyses": [
    {
      "id": "analysis_789",
      "companyName": "테크 기업 A",
      "position": "프론트엔드 개발자",
      "matchScore": 67,
      "createdAt": "2024-01-22T10:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15
  }
}
```

### 7.3 분석 상세 조회
```http
GET /api/goal-setting/analyses/{analysisId}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "analysis_789",
  "companyInfo": { ... },
  "requirements": { ... },
  "userSkills": { ... },
  "matchScore": { ... },
  "gaps": [ ... ],
  "recommendations": [ ... ],
  "timeline": "3-4개월",
  "createdAt": "2024-01-22T10:00:00Z"
}
```

---

## 8. 태그 시스템

### 8.1 모든 태그 조회 (사용 빈도 포함)
```http
GET /api/tags
Authorization: Bearer {token}

Response: 200 OK
{
  "tags": [
    {
      "name": "React",
      "count": 15,
      "category": "frontend"
    },
    {
      "name": "Node.js",
      "count": 12,
      "category": "backend"
    },
    {
      "name": "TypeScript",
      "count": 18,
      "category": "language"
    }
  ]
}
```

### 8.2 태그별 경험 조회
```http
GET /api/tags/{tagName}/experiences
Authorization: Bearer {token}

Response: 200 OK
{
  "tag": "React",
  "experiences": [
    {
      "id": "exp_123",
      "title": "React 프로젝트 완성",
      "dateRange": "2024-01-10 ~ 2024-01-20",
      "category": "프로젝트"
    }
  ]
}
```

---

## 9. 데이터 내보내기

### 9.1 전체 데이터 내보내기 (JSON)
```http
GET /api/export/json
Authorization: Bearer {token}

Response: 200 OK
{
  "exportedAt": "2024-01-22T16:00:00Z",
  "user": {
    "id": "user_123456",
    "email": "user@example.com",
    "name": "홍길동"
  },
  "data": {
    "tasks": [ ... ],
    "routines": [ ... ],
    "experiences": [ ... ],
    "templates": [ ... ]
  }
}
```

### 9.2 PDF 리포트 생성
```http
POST /api/export/pdf
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "includeExperiences": true,
  "includeTasks": true,
  "includeRoutines": true,
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  }
}

Response: 200 OK (PDF file)
Content-Type: application/pdf
Content-Disposition: attachment; filename="roadmap-report-2024-01.pdf"
```

---

## 10. AI/LLM 통합

### 10.1 회고 분석 및 인사이트 생성
```http
POST /api/ai/analyze-reflection
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "experienceId": "exp_123",
  "reflection": {
    "learned": "컴포넌트 설계의 중요성을 배웠습니다",
    "challenges": "상태 관리가 복잡했습니다",
    "solutions": "Redux Toolkit을 도입하여 해결했습니다",
    "improvements": "다음에는 초기 설계를 더 신중히 하겠습니다",
    "aiQuestion1": "컴포넌트를 재사용 가능하게 만들었을 때 가장 보람찼습니다",
    "aiQuestion2": "처음엔 단순할 줄 알았지만 확장성을 고려하니 복잡했습니다",
    "aiQuestion3": "React의 핵심 철학을 이해하고 실전에 적용한 경험이라고 설명하겠습니다"
  }
}

Response: 200 OK
{
  "success": true,
  "insights": {
    "summary": "React 프로젝트를 통해 컴포넌트 설계와 상태 관리의 중요성을 체득했습니다. 특히 재사용성과 확장성을 고려한 설계의 가치를 깨달았습니다.",
    "growthAreas": [
      {
        "area": "컴포넌트 설계",
        "progress": "재사용 가능한 컴포넌트 설계 능력 향상",
        "evidence": "컴포넌트를 재사용 가능하게 만들었을 때 보람을 느낌"
      },
      {
        "area": "상태 관리",
        "progress": "복잡한 상태 관리 문제를 Redux로 해결",
        "evidence": "Redux Toolkit 도입으로 문제 해결"
      },
      {
        "area": "시스템 설계",
        "progress": "확장성을 고려한 설계의 중요성 인식",
        "evidence": "초기 설계의 중요성 깨달음"
      }
    ],
    "patterns": [
      "문제 해결 과정: 복잡성 인식 → 도구 탐색 → 적용 → 학습",
      "학습 방향: 단순 구현 → 설계 원칙 이해"
    ],
    "recommendations": [
      {
        "priority": "high",
        "action": "다음 프로젝트에서 초기 설계 단계에 더 많은 시간 투자",
        "reason": "확장성 고려의 중요성을 경험으로 체득함"
      },
      {
        "priority": "medium",
        "action": "상태 관리 패턴 심화 학습 (Context API, Recoil 등)",
        "reason": "Redux 외에 다양한 상태 관리 방법 탐색 필요"
      },
      {
        "priority": "medium",
        "action": "컴포넌트 라이브러리 구축 프로젝트 시도",
        "reason": "재사용 가능한 컴포넌트 설계 능력을 더 발전시킬 기회"
      }
    ],
    "reflectionQuality": {
      "score": 85,
      "strengths": [
        "구체적인 문제와 해결책 제시",
        "성장 순간을 명확히 인식",
        "미래 관점에서의 통찰"
      ],
      "improvements": [
        "정량적 지표 추가 (예: 컴포넌트 재사용률, 개발 시간 단축 등)"
      ]
    },
    "nextSteps": {
      "immediate": "Redux 공식 문서의 고급 패턴 섹션 학습",
      "shortTerm": "컴포넌트 설계 원칙 관련 서적 읽기",
      "longTerm": "오픈소스 컴포넌트 라이브러리에 기여"
    }
  },
  "generatedAt": "2024-01-22T17:00:00Z"
}
```

### 10.2 학습 경로 추천
```http
POST /api/ai/recommend-path
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "currentSkills": {
    "React": 3,
    "JavaScript": 4,
    "TypeScript": 3
  },
  "targetRole": "시니어 프론트엔드 개발자",
  "timeline": "6개월",
  "focusAreas": ["성능 최적화", "아키텍처 설계"]
}

Response: 200 OK
{
  "success": true,
  "learningPath": {
    "phases": [
      {
        "phase": 1,
        "title": "React 심화 및 성능 최적화",
        "duration": "2개월",
        "topics": [
          "React 고급 패턴 (Render Props, HOC, Compound Components)",
          "React 성능 최적화 (useMemo, useCallback, React.memo)",
          "Virtual DOM 이해",
          "Code Splitting과 Lazy Loading"
        ],
        "projects": [
          "대규모 React 애플리케이션 리팩토링",
          "성능 모니터링 대시보드 구축"
        ]
      },
      {
        "phase": 2,
        "title": "TypeScript 마스터 및 아키텍처",
        "duration": "2개월",
        "topics": [
          "TypeScript 고급 타입 시스템",
          "제네릭과 유틸리티 타입",
          "프론트엔드 아키텍처 패턴",
          "모듈 시스템 및 의존성 관리"
        ],
        "projects": [
          "타입 안전한 API 클라이언트 라이브러리",
          "재사용 가능한 UI 컴포넌트 시스템"
        ]
      },
      {
        "phase": 3,
        "title": "시스템 설계 및 리더십",
        "duration": "2개월",
        "topics": [
          "마이크로 프론트엔드 아키텍처",
          "테스트 전략 (Unit, Integration, E2E)",
          "CI/CD 파이프라인",
          "팀 코드 리뷰 및 멘토링"
        ],
        "projects": [
          "마이크로 프론트엔드 PoC 프로젝트",
          "테스트 커버리지 90% 이상 달성"
        ]
      }
    ],
    "weeklyRoutines": [
      {
        "activity": "알고리즘 문제 풀이",
        "frequency": 3,
        "reason": "문제 해결 능력 유지"
      },
      {
        "activity": "기술 블로그 작성",
        "frequency": 1,
        "reason": "학습 내용 정리 및 커뮤니케이션 능력 향상"
      }
    ],
    "milestones": [
      {
        "month": 2,
        "goal": "성능 최적화된 대규모 프로젝트 완성",
        "metrics": ["LCP < 2.5s", "FID < 100ms", "CLS < 0.1"]
      },
      {
        "month": 4,
        "goal": "타입 안전한 프레임워크 설계 및 문서화",
        "metrics": ["TypeScript strict mode 100%", "API 문서 완성"]
      },
      {
        "month": 6,
        "goal": "마이크로 프론트엔드 아키텍처 구현",
        "metrics": ["3개 이상의 독립 앱 통합", "빌드 시간 50% 단축"]
      }
    ]
  },
  "generatedAt": "2024-01-22T17:15:00Z"
}
```

### 10.3 회고 질문 개인화
```http
POST /api/ai/generate-reflection-questions
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "taskTitle": "React 프로젝트 완성",
  "category": "프로젝트",
  "userHistory": {
    "recentExperiences": [
      {
        "title": "JavaScript 학습",
        "tags": ["JavaScript", "기초"]
      }
    ],
    "skillLevel": "intermediate",
    "focusAreas": ["프론트엔드 개발", "React"]
  }
}

Response: 200 OK
{
  "success": true,
  "questions": {
    "aiQuestion1": {
      "question": "React의 어떤 개념이 가장 인상 깊었고, 그것이 JavaScript 기초 학습과 어떻게 연결되었나요?",
      "purpose": "이전 학습과의 연결고리 발견",
      "tags": ["연결성", "개념 이해"]
    },
    "aiQuestion2": {
      "question": "프로젝트 초반에 세운 가설 중 실제로는 틀렸던 것이 있나요? 그 경험이 개발자로서의 사고방식을 어떻게 바꿨나요?",
      "purpose": "가설-검증 사이클 인식",
      "tags": ["비판적 사고", "성장"]
    },
    "aiQuestion3": {
      "question": "이 프로젝트가 1년 후 당신의 커리어에 어떤 영향을 미칠 것 같나요? 구체적으로 상상해보세요.",
      "purpose": "장기적 관점 형성",
      "tags": ["커리어 계획", "비전"]
    }
  },
  "defaultQuestions": {
    "aiQuestion1": "이 경험을 통해 가장 큰 성장을 느낀 순간은 언제였나요?",
    "aiQuestion2": "이 과정에서 예상과 달랐던 점은 무엇이고, 그것이 주는 교훈은?",
    "aiQuestion3": "6개월 후의 나에게 이 경험을 어떻게 설명하시겠습니까?"
  },
  "generatedAt": "2024-01-22T17:20:00Z"
}
```

---

## 📊 데이터 모델

### User
```typescript
{
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  preferredJobRole: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Task
```typescript
{
  id: string;
  userId: string;
  title: string;
  category: string;
  date: string; // YYYY-MM-DD
  priority: 'required' | 'preferred';
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Routine
```typescript
{
  id: string;
  userId: string;
  title: string;
  category: string;
  frequency: number; // 주 N회
  color: string; // hex color
  completions: Array<{
    weekStart: string; // YYYY-MM-DD (월요일)
    completed: number;
    dates: string[]; // 완료한 날짜들
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

### Experience
```typescript
{
  id: string;
  userId: string;
  title: string;
  category: string;
  dateRange: string;
  reflection: {
    learned: string;
    challenges: string;
    solutions: string;
    improvements: string;
    aiQuestion1: string; // AI 회고 질문 1
    aiQuestion2: string; // AI 회고 질문 2
    aiQuestion3: string; // AI 회고 질문 3
  };
  tags: string[];
  relatedResources: string[];
  aiInsights?: {
    summary: string;
    growthAreas: string[];
    recommendations: string[];
    generatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Template
```typescript
{
  id: string;
  title: string;
  category: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  tasks: Array<{
    title: string;
    category: string;
    duration: string;
    priority: 'required' | 'preferred';
    order: number;
  }>;
  routines: Array<{
    title: string;
    category: string;
    frequency: number;
    color: string;
    order: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

### GoalAnalysis
```typescript
{
  id: string;
  userId: string;
  companyInfo: {
    name: string;
    position: string;
    location: string;
    employmentType: string;
  };
  requirements: {
    required: Array<{
      skill: string;
      level: number;
      description: string;
    }>;
    preferred: Array<{
      skill: string;
      level: number;
      description: string;
    }>;
  };
  userSkills: Record<string, number>;
  matchScore: {
    overall: number;
    required: number;
    preferred: number;
  };
  gaps: Array<{
    skill: string;
    currentLevel: number;
    requiredLevel: number;
    gap: number;
  }>;
  recommendations: string[];
  timeline: string;
  createdAt: Date;
}
```

---

## 🔐 인증 방식

모든 API 요청은 JWT 토큰을 통한 인증이 필요합니다.

```http
Authorization: Bearer {jwt_token}
```

### JWT 토큰 구조
```json
{
  "userId": "user_123456",
  "email": "user@example.com",
  "iat": 1705910400,
  "exp": 1706515200
}
```

---

## ⚠️ 에러 응답 형식

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "success": false,
  "error": "에러 메시지",
  "code": "ERROR_CODE",
  "details": {
    // 추가 에러 정보
  }
}
```

### 주요 에러 코드
- `AUTH_REQUIRED`: 인증이 필요함 (401)
- `INVALID_TOKEN`: 유효하지 않은 토큰 (401)
- `FORBIDDEN`: 권한 없음 (403)
- `NOT_FOUND`: 리소스를 찾을 수 없음 (404)
- `VALIDATION_ERROR`: 입력값 검증 실패 (400)
- `DUPLICATE_ENTRY`: 중복 데이터 (409)
- `INTERNAL_ERROR`: 서버 내부 오류 (500)

---

## 🚀 추가 기능 제안

1. **실시간 협업**
   - WebSocket을 통한 실시간 로드맵 공유
   - 멘토-멘티 매칭 시스템

2. **소셜 기능**
   - 경험 공유 피드
   - 다른 사용자의 로드맵 참고

3. **게이미피케이션**
   - 완료 스트릭 (연속 달성일)
   - 뱃지 시스템
   - 레벨 시스템

4. **고급 분석**
   - 학습 패턴 분석
   - 생산성 트렌드
   - 스킬 성장 그래프

5. **통합 기능**
   - GitHub 커밋 자동 연동
   - LinkedIn 프로필 연동
   - Notion/Obsidian 내보내기

---

## 📝 API 버전 관리

현재 버전: `v1`

모든 엔드포인트는 `/api/v1/` prefix를 사용합니다.

예: `https://api.example.com/api/v1/tasks`

---

## 🔄 Rate Limiting

- **일반 API**: 100 requests / 15분
- **AI API**: 20 requests / 15분
- **내보내기 API**: 10 requests / 시간

Rate limit 초과 시:
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 900
}
```

---

## 📅 변경 이력

### v1.0.0 (2024-01-22)
- 초기 API 설계
- 인증, 일정, 루틴, 경험 관리 기능
- AI 회고 분석 기능 (3가지 핵심 질문 포함)
- 목표 설정 및 채용 공고 분석

---

## 📞 문의

백엔드 API 구현 관련 문의사항이 있으시면 개발팀에 연락해주세요.
