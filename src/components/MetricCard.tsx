import type { ReactNode } from "react";

type MetricCardProps = {
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
  isLoading?: boolean;
};

function MetricCard({ title, value, icon, subtitle, isLoading = false }: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="metric-card skeleton-card">
        <div className="metric-card-top">
          <div className="skeleton skeleton-title" style={{ width: "50%" }}></div>
          <div className="skeleton" style={{ width: "42px", height: "42px", borderRadius: "10px" }}></div>
        </div>
        <div className="skeleton skeleton-value"></div>
        <div className="skeleton skeleton-text" style={{ width: "70%", marginTop: "8px", marginBottom: 0 }}></div>
      </div>
    );
  }

  return (
    <div className="metric-card">
      <div className="metric-card-top">
        <span className="metric-title">{title}</span>
        {icon && <div className="metric-icon-container">{icon}</div>}
      </div>
      <div className="metric-value">{value}</div>
      {subtitle && <div className="metric-subtitle">{subtitle}</div>}
    </div>
  );
}

export default MetricCard;