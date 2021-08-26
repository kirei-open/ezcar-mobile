import React from 'react';

export const typeColor = [
  '#ffc715',
  '#7ac70c',
  '#d33131',
  '#8549ba',
  '#5cc3e8',
  '#cfcfcf',
  '#f7c8c9',
  '#faa918',
  '#4c4c4c',
  '#e53838',
  '#8ee000',
  '#14d4f4'
];

export const RADIAN = Math.PI / 180;
export const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
