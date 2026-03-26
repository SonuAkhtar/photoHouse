import './Skeleton.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
  className?: string;
}

export function Skeleton({ width = '100%', height = '1rem', radius = '4px', className = '' }: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export function TripCardSkeleton() {
  return (
    <div className="trip-grid-card skeleton-card">
      <div className="skeleton-card_img" />
      <div className="skeleton-card_body">
        <Skeleton width="40%" height="10px" />
        <Skeleton width="65%" height="22px" radius="3px" />
        <Skeleton width="50%" height="10px" />
        <Skeleton width="90%" height="10px" />
        <Skeleton width="75%" height="10px" />
      </div>
    </div>
  );
}
