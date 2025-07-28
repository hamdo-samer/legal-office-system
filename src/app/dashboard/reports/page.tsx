'use client';

import { useState, useEffect } from 'react';
import { useEffect as useClientEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Clock
} from 'lucide-react';
import FormattedNumber from '@/components/FormattedNumber';
import SafeHydration from '@/components/SafeHydration';
import Card from '@/components/Card';
import Button from '@/components/Button';
import StatsCard from '@/components/StatsCard';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data
  const stats = {
    totalCases: { value: 45, trend: { value: 12, isPositive: true } },
    activeCases: { value: 23, trend: { value: 5, isPositive: true } },
    totalClients: { value: 67, trend: { value: 8, isPositive: true } },
    revenue: { value: 125000, trend: { value: 15, isPositive: true } },
    avgCaseTime: { value: 45, trend: { value: 3, isPositive: false } },
    successRate: { value: 85, trend: { value: 2, isPositive: true } }
  };

  const casesByType = [
    { type: 'مدنية', count: 18, percentage: 40 },
    { type: 'تجارية', count: 12, percentage: 27 },
    { type: 'جنائية', count: 8, percentage: 18 },
    { type: 'أحوال شخصية', count: 4, percentage: 9 },
    { type: 'إدارية', count: 3, percentage: 6 }
  ];

  const monthlyRevenue = [
    { month: 'يناير', revenue: 125000, cases: 12 },
    { month: 'ديسمبر', revenue: 110000, cases: 10 },
    { month: 'نوفمبر', revenue: 95000, cases: 8 },
    { month: 'أكتوبر', revenue: 105000, cases: 9 },
    { month: 'سبتمبر', revenue: 88000, cases: 7 },
    { month: 'أغسطس', revenue: 92000, cases: 8 }
  ];

  const topClients = [
    { name: 'أحمد محمد علي', cases: 5, revenue: 25000 },
    { name: 'شركة الأمل للتجارة', cases: 3, revenue: 35000 },
    { name: 'فاطمة علي حسن', cases: 4, revenue: 18000 },
    { name: 'محمد حسن محمود', cases: 2, revenue: 15000 },
    { name: 'سارة أحمد محمد', cases: 3, revenue: 12000 }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 ml-3" />
              <h1 className="text-2xl font-bold text-gray-900">التقارير والإحصائيات</h1>
            </div>
            
            <div className="flex space-x-2 space-x-reverse">
              <Button variant="outline" icon={Download} iconPosition="right">
                تصدير التقرير
              </Button>
              <Button icon={Calendar} iconPosition="right">
                تخصيص الفترة
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="quarter">هذا الربع</option>
                <option value="year">هذا العام</option>
                <option value="custom">فترة مخصصة</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="overview">نظرة عامة</option>
                <option value="cases">تقرير القضايا</option>
                <option value="clients">تقرير العملاء</option>
                <option value="financial">التقرير المالي</option>
                <option value="performance">تقرير الأداء</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <SafeHydration>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="إجمالي القضايا"
            value={<FormattedNumber value={stats.totalCases.value} />}
            icon={FileText}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
            trend={stats.totalCases.trend}
          />
          
          <StatsCard
            title="القضايا النشطة"
            value={stats.activeCases.value}
            icon={TrendingUp}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
            trend={stats.activeCases.trend}
          />
          
          <StatsCard
            title="إجمالي العملاء"
            value={<FormattedNumber value={stats.totalClients.value} />}
            icon={Users}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
            trend={stats.totalClients.trend}
          />
          
          <StatsCard
            title="الإيرادات (جنيه)"
            value={<FormattedNumber value={stats.revenue.value} />}
            icon={DollarSign}
            iconColor="text-indigo-600"
            iconBgColor="bg-indigo-100"
            trend={stats.revenue.trend}
          />
          
          <StatsCard
            title="متوسط مدة القضية (يوم)"
            value={stats.avgCaseTime.value}
            icon={Clock}
            iconColor="text-orange-600"
            iconBgColor="bg-orange-100"
            trend={stats.avgCaseTime.trend}
          />
          
          <StatsCard
            title="معدل النجاح (%)"
            value={`${stats.successRate.value}%`}
            icon={TrendingUp}
            iconColor="text-emerald-600"
            iconBgColor="bg-emerald-100"
            trend={stats.successRate.trend}
          />
          </div>
        </SafeHydration>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cases by Type */}
          <Card title="القضايا حسب النوع">
            <div className="space-y-4">
              {casesByType.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-600 ml-3" style={{ 
                      backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                    }}></div>
                    <span className="text-sm font-medium text-gray-900">{item.type}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-sm text-gray-600">{item.count} قضية</span>
                    <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Clients */}
          <Card title="أهم العملاء">
            <div className="space-y-4">
              {topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{client.name}</h4>
                    <p className="text-sm text-gray-600">{client.cases} قضايا</p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">
                      <FormattedNumber value={client.revenue} suffix=" جنيه" />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Monthly Revenue Chart */}
        <Card title="الإيرادات الشهرية" className="mb-8">
          <div className="space-y-4">
            {monthlyRevenue.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 w-16">{month.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(month.revenue / 125000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">
                    <FormattedNumber value={month.revenue} suffix=" جنيه" />
                  </p>
                  <p className="text-sm text-gray-600">{month.cases} قضايا</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">92%</div>
              <div className="text-sm text-gray-600">معدل رضا العملاء</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
              <div className="text-sm text-gray-600">متوسط القضايا الشهرية</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">8.5</div>
              <div className="text-sm text-gray-600">تقييم الخدمة (من 10)</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">72%</div>
              <div className="text-sm text-gray-600">معدل الاحتفاظ بالعملاء</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
