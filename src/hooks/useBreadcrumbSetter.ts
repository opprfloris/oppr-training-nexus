
import { useEffect } from 'react';
import { useBreadcrumb, BreadcrumbItem } from '@/contexts/BreadcrumbContext';

export const useBreadcrumbSetter = (breadcrumbs: BreadcrumbItem[]) => {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    
    // Clean up when component unmounts
    return () => {
      setBreadcrumbs([]);
    };
  }, [breadcrumbs, setBreadcrumbs]);
};
