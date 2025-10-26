import { Link } from 'react-router';
interface DropdownItemProps {
  onItemClick?: () => void;
  tag?: 'a' | 'button';
  to?: string;
  className?: string;
  children: React.ReactNode;
}
export function DropdownItem({ onItemClick, tag = 'button', to, className = '', children }: DropdownItemProps) {
  if (tag === 'a' && to) {
    return (
      <Link to={to} className={className} onClick={onItemClick}>
        {children}
      </Link>
    );
  }
  return (
    <button className={className} onClick={onItemClick}>
      {children}
    </button>
  );
}