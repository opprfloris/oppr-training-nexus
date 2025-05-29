
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  className = '',
  trend
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h4 className="mt-2 text-xl font-semibold text-gray-900">{value}</h4>
            {description && (
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            )}
            {trend && (
              <div className="mt-2 flex items-center">
                <span className={`text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                <span className="ml-1 text-xs text-gray-500">vs. last month</span>
              </div>
            )}
          </div>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
