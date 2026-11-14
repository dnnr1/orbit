import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Calendar, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const stats = [
    { name: 'Organizations', value: '3', icon: Building2, href: '/organizations' },
    { name: 'Upcoming Bookings', value: '12', icon: Calendar, href: '/organizations/1/bookings' },
    { name: 'Active Rooms', value: '45', icon: Home, href: '/organizations/1/rooms' },
    { name: 'Team Members', value: '8', icon: Users, href: '/profile' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/organizations/1/bookings">
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <a href={stat.href} className="hover:underline">View details →</a>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No upcoming availability scheduled</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}