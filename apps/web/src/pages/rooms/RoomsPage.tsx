import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Search } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

export function RoomsPage() {
  const { organizationId } = useParams();
  const [searchParams] = useSearchParams();
  const buildingId = searchParams.get('buildingId');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <Button asChild>
          <Link to={`/organizations/${organizationId}/rooms/new${buildingId ? `?buildingId=${buildingId}` : ''}`}>
            <Plus className="mr-2 h-4 w-4" />
            New Room
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Conference Room A</p>
                <p className="text-sm text-muted-foreground">CR-A • Capacity: 12 • Floor 3</p>
              </div>
              <Button asChild variant="ghost">
                <Link to={`/organizations/${organizationId}/bookings?roomId=1`}>Book</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Study Room 101</p>
                <p className="text-sm text-muted-foreground">SR-101 • Capacity: 4 • Floor 1</p>
              </div>
              <Button asChild variant="ghost">
                <Link to={`/organizations/${organizationId}/bookings?roomId=2`}>Book</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}