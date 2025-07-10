import type { SVGProps } from 'react';
import { Music } from 'lucide-react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <Music {...props} />
  );
}
