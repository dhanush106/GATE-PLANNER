import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays, format } from 'date-fns';
import { Flame } from 'lucide-react';

const HeatmapSection = ({ data }) => {
    const today = new Date();
    const startDate = subDays(today, 365);

    return (
        <div className="glass-card p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-emerald/10 rounded-xl flex items-center justify-center border border-accent-emerald/20">
                        <Flame className="w-6 h-6 text-accent-emerald animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-text-main tracking-tight uppercase italic">Activity Matrix</h3>
                        <p className="text-text-muted text-[10px] uppercase tracking-widest font-bold">Consistency is your weapon</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-text-muted font-bold uppercase tracking-widest bg-black/20 px-4 py-2 rounded-full border border-white/5">
                    <span>Less</span>
                    <div className="flex gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-sm bg-[#1A211F]"></div>
                        <div className="w-3.5 h-3.5 rounded-sm bg-[#064E3B]"></div>
                        <div className="w-3.5 h-3.5 rounded-sm bg-[#059669]"></div>
                        <div className="w-3.5 h-3.5 rounded-sm bg-[#10B981]"></div>
                        <div className="w-3.5 h-3.5 rounded-sm bg-[#00FF9C] shadow-[0_0_8px_rgba(0,255,156,0.5)]"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="heatmap-container overflow-hidden custom-scrollbar">
                <style>{`
                    .react-calendar-heatmap text {
                        font-size: 8px;
                        fill: #64748B;
                        font-family: 'Inter', sans-serif;
                        font-weight: 700;
                    }
                    .react-calendar-heatmap .color-empty { fill: #1A211F; }
                    .react-calendar-heatmap .color-scale-1 { fill: #064E3B; }
                    .react-calendar-heatmap .color-scale-2 { fill: #059669; }
                    .react-calendar-heatmap .color-scale-3 { fill: #10B981; }
                    .react-calendar-heatmap .color-scale-4 { fill: #00FF9C; }
                    
                    .react-calendar-heatmap rect {
                        rx: 2;
                        ry: 2;
                        transition: all 0.2s ease;
                    }
                    .react-calendar-heatmap rect:hover {
                        stroke: #00FF9C;
                        stroke-width: 1px;
                        transform: scale(1.1);
                        transform-origin: center;
                    }
                `}</style>
                <CalendarHeatmap
                    startDate={startDate}
                    endDate={today}
                    values={data || []}
                    classForValue={(value) => {
                        if (!value || value.count === 0) return 'color-empty';
                        return `color-scale-${Math.min(Math.ceil(value.count / 2), 4)}`;
                    }}
                    showWeekdayLabels={true}
                    titleForValue={(value) => value ? `${format(new Date(value.date), 'MMM do, yyyy')}: ${value.count} focus units` : 'Zero focus today'}
                />
            </div>
        </div>
    );
};

export default HeatmapSection;
