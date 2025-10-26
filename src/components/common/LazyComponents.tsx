import { lazy } from 'react';

// Lazy load heavy components to reduce initial bundle
export const LazyProjectsList = lazy(() => 
  import('../../pages/Dashboard/Projects/ProjectsList').then(m => ({ default: m.default }))
);

export const LazyProjectForm = lazy(() => 
  import('../../pages/Dashboard/Projects/ProjectForm').then(m => ({ default: m.default }))
);

export const LazyCharts = lazy(() => 
  import('react-apexcharts').then(m => ({ default: m.default }))
);

export const LazyCalendar = lazy(() => 
  import('@fullcalendar/react').then(m => ({ default: m.default }))
);

export const LazyDatePicker = lazy(() => 
  import('react-datepicker').then(m => ({ default: m.default }))
);