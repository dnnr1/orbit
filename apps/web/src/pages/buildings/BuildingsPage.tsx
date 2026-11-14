import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Home } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export function BuildingsPage() {
  const { organizationId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Buildings</h1>
        <Button asChild>
          <Link to={`/organizations/${organizationId}/buildings/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Building
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buildings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Main Campus Building</p>
                <p className="text-sm text-muted-foreground">123 University Ave</p>
              </div>
              <Button asChild variant="ghost">
                <Link to={`/organizations/${organizationId}/rooms?buildingId=1`}>View Rooms</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}