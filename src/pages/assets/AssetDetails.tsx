import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { getAssetById } from '../../lib/supabase';
import { Asset } from '../../types';
import { format as formatDate, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';

const AssetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await getAssetById(id);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setAsset(data);
        }
      } catch (error) {
        console.error('Error fetching asset:', error);
        toast.error('Failed to load asset details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAsset();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" dot>Active</Badge>;
      case 'maintenance':
        return <Badge variant="warning" dot>Maintenance</Badge>;
      case 'retired':
        return <Badge variant="default" dot>Retired</Badge>;
      case 'disposed':
        return <Badge variant="danger" dot>Disposed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Asset Not Found</h2>
        <p className="text-gray-600 mb-6">The asset you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/assets')}>Back to Assets</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/assets')}
        >
          Back to Assets
        </Button>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            leftIcon={<Edit size={16} />}
            onClick={() => navigate(`/assets/${id}/edit`)}
          >
            Edit Asset
          </Button>
          <Button
            variant="danger"
            leftIcon={<Trash2 size={16} />}
            onClick={() => {
              // TODO: Implement delete functionality
              toast.error('Delete functionality not implemented yet');
            }}
          >
            Delete Asset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
                  <p className="text-gray-500">Serial Number: {asset.serialNumber}</p>
                </div>
                {getStatusBadge(asset.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Model</h3>
                  <p className="text-gray-900">{asset.model}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                  <p className="text-gray-900">{asset.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                  <p className="text-gray-900">{asset.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Department</h3>
                  <p className="text-gray-900">{asset.department || '—'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Assigned To</h3>
                  <p className="text-gray-900">{asset.assignedTo || '—'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Purchase Date</h3>
                  <p className="text-gray-900">{formatDate(parseISO(asset.purchaseDate), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Purchase Price</h3>
                  <p className="text-gray-900">${asset.purchasePrice.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Created At</h3>
                  <p className="text-gray-900">{formatDate(parseISO(asset.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>

              {asset.notes && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{asset.notes}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/warranties/new?assetId=${asset.id}`)}
                >
                  Add Warranty
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/maintenance/new?assetId=${asset.id}`)}
                >
                  Schedule Maintenance
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssetDetails; 