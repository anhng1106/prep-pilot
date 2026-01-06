import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type StatsProps = {
  date: string;
  totalInterviews: number;
  completedQuestions: number;
  unansweredQuestions: number;
  completionRate: number;
};

const DashboardStatsChart = ({ stats }: { stats: StatsProps[] }) => {
  const sortedStats = [...stats].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={sortedStats}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          label={{ value: "Date", position: "insideBottom", offset: -5 }}
        />
        <YAxis width="auto" />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="totalInterviews"
          name="Total Interviews"
          fill="#a7abde"
          //   activeBar={{ fill: "red", stroke: "orange" }}
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="completedQuestions"
          name="Completed Questions"
          fill="#acc791"
          //   activeBar={{ fill: "pink", stroke: "blue" }}
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="unansweredQuestions"
          name="Unanswered Questions"
          fill="#f5cf9f"
          //   activeBar={{ fill: "gold", stroke: "purple" }}
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="completionRate"
          name="Completion Rate %"
          fill="#b6d8f7"
          //   activeBar={{ fill: "gold", stroke: "purple" }}
          radius={[10, 10, 0, 0]}
        />
        {/* <RechartsDevtools /> */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DashboardStatsChart;
