'use client';

import { useEffect, useRef } from 'react';

interface RadarChartProps {
  userSkills: {
    technical: number;
    communication: number;
    problem_solving: number;
    teamwork: number;
    creativity: number;
    leadership: number;
  };
  companyRequirements: {
    technical: number;
    communication: number;
    problem_solving: number;
    teamwork: number;
    creativity: number;
    leadership: number;
  };
}

const LABELS = {
  technical: '기술 역량',
  communication: '커뮤니케이션',
  problem_solving: '문제 해결',
  teamwork: '팀워크',
  creativity: '창의성',
  leadership: '리더십'
};

export default function RadarChart({ userSkills, companyRequirements }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // companyRequirements가 없으면 컴포넌트를 렌더링하지 않음
  if (!companyRequirements) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        회사 요구사항 데이터가 없습니다.
      </div>
    );
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;

    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);

    // 데이터 배열로 변환
    const categories = Object.keys(userSkills) as Array<keyof typeof userSkills>;
    const angleStep = (Math.PI * 2) / categories.length;

    // 배경 그리드 그리기
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;

    // 동심원 그리기 (20%, 40%, 60%, 80%, 100%)
    for (let level = 1; level <= 5; level++) {
      ctx.beginPath();
      const r = (radius * level) / 5;
      
      categories.forEach((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.closePath();
      ctx.stroke();

      // 레벨 표시 (20, 40, 60, 80, 100)
      if (level === 5) {
        ctx.fillStyle = '#6B7280';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${level * 20}`, centerX - 5, centerY - r + 4);
      }
    }

    // 축 그리기
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 2;

    categories.forEach((category, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // 라벨 그리기
      const labelRadius = radius + 30;
      const labelX = centerX + labelRadius * Math.cos(angle);
      const labelY = centerY + labelRadius * Math.sin(angle);

      ctx.fillStyle = '#374151';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(LABELS[category], labelX, labelY);
    });

    // 회사 요구사항 그리기 (빨간색, 더 선명하게)
    ctx.beginPath();
    ctx.fillStyle = 'rgba(220, 38, 38, 0.2)';
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;

    categories.forEach((category, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const value = companyRequirements[category];
      const r = (radius * value) / 100;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 사용자 스킬 그리기 (파란색, 더 선명하게)
    ctx.beginPath();
    ctx.fillStyle = 'rgba(37, 99, 235, 0.25)';
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 3;

    categories.forEach((category, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const value = userSkills[category];
      const r = (radius * value) / 100;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // 점 그리기 (더 크고 선명하게)
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#3B82F6';
    ctx.stroke();

  }, [userSkills, companyRequirements]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="max-w-full"
      />
      
      {/* 범례 */}
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm font-medium text-text-gray">나의 역량</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm font-medium text-text-gray">회사 요구사항</span>
        </div>
      </div>

      {/* 매칭률 표시 */}
      <div className="mt-6 grid grid-cols-3 gap-4 w-full">
        {(Object.keys(userSkills) as Array<keyof typeof userSkills>).map((key) => {
          const userValue = userSkills[key];
          const companyValue = companyRequirements?.[key] || 0;
          const gap = userValue - companyValue;
          const matchRate = Math.max(0, 100 + gap); // 차이를 퍼센트로

          return (
            <div key={key} className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-text-dark mb-1">
                {LABELS[key]}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="text-xs text-text-gray mb-1">
                    {userValue}점 / {companyValue}점
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${
                        gap >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.abs(gap)}%` }}
                    />
                  </div>
                </div>
                <div className={`text-xs font-bold ${
                  gap >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {gap >= 0 ? '+' : ''}{gap}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
