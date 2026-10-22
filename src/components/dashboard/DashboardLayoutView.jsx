import React from 'react';
import { useLayout } from '../../context/LayoutContext';
import ClassicGridLayout from './layouts/ClassicGridLayout';
import AnalyticsFocusLayout from './layouts/AnalyticsFocusLayout';
import CompactWorkspaceLayout from './layouts/CompactWorkspaceLayout';
import ModernVisualLayout from './layouts/ModernVisualLayout';

export default function DashboardLayoutView(props) {
  const { layout } = useLayout();

  switch (layout) {
    case 'analytics':
      return <AnalyticsFocusLayout {...props} />;
    case 'compact':
      return <CompactWorkspaceLayout {...props} />;
    case 'visual':
      return <ModernVisualLayout {...props} />;
    case 'classic':
    default:
      return <ClassicGridLayout {...props} />;
  }
}
