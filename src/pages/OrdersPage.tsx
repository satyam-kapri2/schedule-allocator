import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { Layout } from '@/components/Layout';
import toast from 'react-hot-toast';

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const TableContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ $status, theme }) => {
    switch ($status) {
      case 'completed':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'cancelled':
        return theme.colors.danger;
      default:
        return theme.colors.secondary;
    }
  }};
  color: white;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response.orders || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <Layout>
      <PageHeader>
        <Title>All Orders</Title>
      </PageHeader>

      <TableContainer>
        {loading ? (
          <LoadingMessage>Loading orders...</LoadingMessage>
        ) : orders.length === 0 ? (
          <LoadingMessage>No orders found</LoadingMessage>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Order ID</Th>
                <Th>Customer</Th>
                <Th>Service</Th>
                <Th>Status</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <Tr key={order.id} onClick={() => handleOrderClick(order.id)}>
                  <Td>{order.number || order.id}</Td>
                  <Td>{order.user?.name || 'N/A'}</Td>
                  <Td>{order.orderItems?.[0]?.Package?.service?.name || 'N/A'}</Td>
                  <Td>
                    <StatusBadge $status={order.status?.toLowerCase() || 'pending'}>
                      {order.status || 'PENDING'}
                    </StatusBadge>
                  </Td>
                  <Td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableContainer>
    </Layout>
  );
};
