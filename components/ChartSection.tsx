import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { GeneratedContent } from '../types';

interface ChartSectionProps {
  data: GeneratedContent;
}

const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-lg text-sm">
        <p className="text-slate-300 font-bold mb-1">{label || payload[0].name}</p>
        <p className="text-cyan-400">
          값: {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const ChartSection: React.FC<ChartSectionProps> = ({ data }) => {
  if (!data.chartData || data.chartData.length === 0) return null;

  const { chartType, chartTitle, chartData, chartXLabel, chartYLabel } = data;

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" label={{ value: chartXLabel, position: 'insideBottomRight', offset: -5 }} />
            <YAxis stroke="#94a3b8" label={{ value: chartYLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'bar':
      default:
        return (
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div className="my-8 p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
      <h3 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
        {chartTitle || "데이터 시각화"}
      </h3>
      <div className="h-[350px] w-full text-slate-300 text-sm">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500 mt-4 text-right">* AI가 생성한 가상 예측 데이터입니다.</p>
    </div>
  );
};

export default ChartSection;