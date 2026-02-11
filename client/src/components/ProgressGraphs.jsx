import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Target } from 'lucide-react';

const ProgressGraphs = ({ problemsData, subjectData }) => {

    // Custom Tooltip for dark mode
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                    <p className="text-slate-300 font-medium text-xs mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PROBLEMS SOLVED GRAPH */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-slate-300 font-medium mb-6 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Problems Solved Consistency
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={problemsData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(str) => {
                                    const date = new Date(str);
                                    return `${date.getDate()}/${date.getMonth() + 1}`;
                                }}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155' }} />
                            <Line
                                type="monotone"
                                dataKey="count"
                                name="Problems"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ fill: '#10b981', r: 3 }}
                                activeDot={{ r: 6, fill: '#34d399' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* SUBJECT PROGRESS GRAPH */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-slate-300 font-medium mb-6 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    Subject Completion Status
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subjectData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                            <XAxis type="number" stroke="#64748b" fontSize={12} hide />
                            <YAxis
                                dataKey="subject"
                                type="category"
                                stroke="#94a3b8"
                                fontSize={11}
                                width={100}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.5 }} />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Bar dataKey="completed" name="Completed" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={20} />
                            <Bar dataKey="total" name="Total Planned" stackId="a" fill="#1e293b" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProgressGraphs;
