import { FaBolt } from 'react-icons/fa';

export function Logo() {
  return (
    <div className="flex items-center text-2xl font-semibold text-primary-400">
      <FaBolt className="mr-1 text-primary-400" />
      <span className="block leading-none">
        <span className="text-primary-600">awesome</span>.saas
      </span>
    </div>
  );
}
