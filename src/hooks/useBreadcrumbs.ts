import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import { useRouteMatch } from 'react-router-dom';
import _isEmpty from 'lodash.isempty';

interface IBreadcrumb {
  name: string;
  link: string;
  depth: number;
}

export const breadcrumbsState = atom<IBreadcrumb[]>({
  key: 'crude-breadcrumbs',
  default: [{ name: 'Banks', link: '/', depth: 0 }],
});

export default function useBreadcrumbs(name: string = '') {
  const [breadcrumbs, setBreadcrumbs] = useRecoilState(breadcrumbsState);
  const currentPath = useRouteMatch().url;

  useEffect(() => {
    if (!_isEmpty(name.trim())) {
      const depth = currentPath.split('/').filter(s => s !== '').length;
      setBreadcrumbs(current => {
        return [
          ...current,
          { name, link: currentPath, depth } as IBreadcrumb,
        ].sort((a, b) => a.depth - b.depth);
      });
    }
    return () => {
      setBreadcrumbs(current => current.filter(b => b.name !== name));
    };
  }, [name, currentPath, setBreadcrumbs]);

  return { breadcrumbs };
}
