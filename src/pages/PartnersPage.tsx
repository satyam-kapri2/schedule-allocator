import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { partnerService } from '@/services/partnerService';
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const PartnersPage = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const data = await partnerService.getAllPartners();
      setPartners(data.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerClick = (partnerId: string) => {
    navigate(`/partners/${partnerId}`);
  };

  return (
    <Layout>
      <PageHeader>
        <Title>All Partners</Title>
      </PageHeader>

      <TableContainer>
        {loading ? (
          <LoadingMessage>Loading partners...</LoadingMessage>
        ) : partners.length === 0 ? (
          <LoadingMessage>No partners found</LoadingMessage>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Partner ID</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <Tr key={partner.id} onClick={() => handlePartnerClick(partner.id)}>
                  <Td>{partner.id}</Td>
                  <Td>{partner.name || 'N/A'}</Td>
                  <Td>{partner.email || 'N/A'}</Td>
                  <Td>{partner.phone || 'N/A'}</Td>
                  <Td>{partner.status || 'active'}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableContainer>
    </Layout>
  );
};
