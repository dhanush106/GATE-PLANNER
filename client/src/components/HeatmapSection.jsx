import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays, format } from 'date-fns';
import { Flame } from 'lucide-react';

const HeatmapSection = ({ data }) => {
    // Transform data for heatmap (ensure it matches { date, count } format)
    // Data comes as { date: "YYYY-MM-DD", count: number }

    // Constants for heatmap range (last 365 days or year to date)
    const today = new Date();
    const startDate = subDays(today, 365);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-300 font-medium flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    Activity Heatmap (Last 365 Days)
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-[#161b22]"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#0e4429]"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#006d32]"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#26a641]"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#39d353]"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="heatmap-container overflow-x-auto pb-2">
                <style>{`
                    .react-calendar-heatmap text {
                        font-size: 10px;
                        fill: #64748b;
                    }
                    .react-calendar-heatmap .color-empty { fill: #161b22; }
                    .react-calendar-heatmap .color-scale-1 { fill: #0e4429; }
                    .react-calendar-heatmap .color-scale-2 { fill: #006d32; }
                    .react-calendar-heatmap .color-scale-3 { fill: #26a641; }
                    .react-calendar-heatmap .color-scale-4 { fill: #39d353; }
                `}</style>
                <CalendarHeatmap
                    startDate={startDate}
                    endDate={today}
                    values={data || []}
                    classForValue={(value) => {
                        if (!value) {
                            return 'color-empty';
                        }
                        return `color-scale-${Math.min(value.count, 4)}`;
                    }}
                    tooltipDataAttrs={value => {
                        return {
                            'data-tip': `${value.date ? value.date : ''} has count: ${value.count ? value.count : 0
                                }`,
                        };
                    }}
                    showWeekdayLabels={true}
                    onClick={value => {
                        if (value) alert(`${value.count} activities on ${value.date}`)
                    }}
                    titleForValue={(value) => value ? `${value.date}: ${value.count} activities` : 'No activities'}
                />
            </div>
        </div>
    );
};

export default HeatmapSection;
