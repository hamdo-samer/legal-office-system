'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scale,
  LayoutDashboard,
  FileText,
  Users,
  Calendar,
  FileCheck,
  Receipt,
  FolderOpen,
  BarChart3,
  Settings,

  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/utils';

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: 'لوحة التحكم',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'القضايا',
    href: '/dashboard/cases',
    icon: FileText,
  },
  {
    name: 'العملاء',
    href: '/dashboard/clients',
    icon: Users,
  },
  {
    name: 'المواعيد',
    href: '/dashboard/appointments',
    icon: Calendar,
  },
  {
    name: 'العقود',
    href: '/dashboard/contracts',
    icon: FileCheck,
  },
  {
    name: 'الفواتير',
    href: '/dashboard/invoices',
    icon: Receipt,
  },
  {
    name: 'المستندات',
    href: '/dashboard/documents',
    icon: FolderOpen,
  },

  {
    name: 'التقارير',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
  {
    name: 'الإعدادات',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export default function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={cn(
      'flex flex-col bg-white border-l border-gray-200 transition-all duration-300',
      collapsed ? 'w-16' : 'w-64',
      className
    )} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <Scale className="h-8 w-8 text-blue-600 ml-3" />
            <h1 className="text-xl font-bold text-gray-900">المكتب القانوني</h1>
          </div>
        )}
        {collapsed && (
          <Scale className="h-8 w-8 text-blue-600 mx-auto" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn('h-5 w-5', collapsed ? 'mx-auto' : 'ml-3')} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        {!collapsed ? (
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mr-3 flex-1">
              <p className="text-sm font-medium text-gray-900">المحامي أحمد</p>
              <p className="text-xs text-gray-500">ahmed@example.com</p>
            </div>
            <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
              <LogOut className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
              <LogOut className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
