import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Target } from 'lucide-react';

const ProgressGraphs = ({ problemsData, subjectData }) => {

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-elevated-bg border border-accent-emerald/20 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                    <p className="text-text-muted font-black text-[10px] mb-2 uppercase tracking-widest">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            <p className="text-sm font-black text-text-main">
                                {entry.name}: <span className="text-accent-emerald">{entry.value}</span>
                            </p>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* PROBLEMS SOLVED GRAPH */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-8 group hover:border-accent-emerald/20 transition-all">
                <h3 className="text-text-secondary font-black text-[10px] uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                    <div className="p-1.5 bg-accent-emerald/10 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-accent-emerald" />
                    </div>
                    Execution Velocity
                </h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={problemsData} margin={{ top: 5, right: 10, bottom: 5, left: -30 }}>
                            <CartesianGrid strokeDasharray="5 5" stroke="#182320" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#64748B"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontWeight: 700 }}
                                tickFormatter={(str) => {
                                    const date = new Date(str);
                                    return `${date.getDate()}/${date.getMonth() + 1}`;
                                }}
                            />
                            <YAxis
                                stroke="#64748B"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontWeight: 700 }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#00FF9C', strokeWidth: 1 }} />
                            <Line
                                type="monotone"
                                dataKey="count"
                                name="Problems"
                                stroke="#00FF9C"
                                strokeWidth={3}
                                dot={{ fill: '#00FF9C', r: 3, strokeWidth: 0 }}
                                activeDot={{ r: 6, fill: '#00FF9C', stroke: '#0B0F0E', strokeWidth: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* SUBJECT PROGRESS GRAPH */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-8 group hover:border-accent-emerald/20 transition-all">
                <h3 className="text-text-secondary font-black text-[10px] uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                    <div className="p-1.5 bg-accent-emerald/10 rounded-lg">
                        <Target className="w-4 h-4 text-accent-emerald" />
                    </div>
                    Coverage Matrix
                </h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subjectData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="5 5" stroke="#182320" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="subject"
                                type="category"
                                stroke="#E6F1EC"
                                fontSize={10}
                                width={80}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontWeight: 800 }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#182320', opacity: 0.4 }} />
                            <Bar dataKey="completed" name="Mastered" stackId="a" fill="#00FF9C" radius={[4, 0, 0, 4]} barSize={12} />
                            <Bar dataKey="total" name="Horizon" stackId="a" fill="#182320" radius={[0, 4, 4, 0]} barSize={12} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProgressGraphs;
