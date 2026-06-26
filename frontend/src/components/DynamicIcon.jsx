import * as Icons from 'lucide-react';

function toPascalCase(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export default function DynamicIcon({ name, className }) {
  const Icon = Icons[toPascalCase(name)];
  if (!Icon) return null;
  return <Icon className={className} />;
}
