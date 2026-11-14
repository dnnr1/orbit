import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';

const mockBookings = [
  { id: '1', title: 'Team Meeting', room: 'Conference Room A', start: new Date('2024-01-15T10:00:00'), end: new Date('2024-01-15T11:00:00'), status: 'approved' },
  { id: '2', title: 'Client Presentation', room: 'Conference Room A', start: new Date('2024-01-15T14:00:00'), end: new Date('2024-01-15T15:30:00'), status: 'pending' },
  { id: '3', title: 'Study Session', room: 'Study Room 101', start: new Date('2024-01-16T09:00:00'), end: new Date('2024-01-16T11:00:00'), status: 'approved' },
];

export function BookingsPage() {
  const { organizationId } = useParams();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <Button asChild>
          <Link to={`/organizations/${organizationId}/bookings/new${roomId ? `?roomId=${roomId}` : ''}`}>
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{booking.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.room} • {format(booking.start, 'MMM d, yyyy')} •{' '}
                      {format(booking.start, 'HH:mm')} - {format(booking.end, 'HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
            {mockBookings.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No bookings yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}