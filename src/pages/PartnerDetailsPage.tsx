import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { partnerService } from '@/services/partnerService';
import { Layout } from '@/components/Layout';
import toast from 'react-hot-toast';

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Section = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const DetailItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Label = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Value = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const StatusBadge = styled.span<{ $verified: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.875rem;
  background-color: ${({ $verified, theme }) => ($verified ? theme.colors.success : theme.colors.warning)};
  color: white;
`;

export const PartnerDetailsPage = () => {
  const { partnerId } = useParams();
  const [activeTab, setActiveTab] = useState('basic');
  const [partner, setPartner] = useState<any>(null);
  const [publicProfile, setPublicProfile] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (partnerId) {
      fetchPartnerData();
    }
  }, [partnerId]);

  const fetchPartnerData = async () => {
    try {
      const [partnerData, profileData, schedulesData, documentsData] = await Promise.all([
        partnerService.getPartnerById(partnerId!),
        partnerService.getPartnerPublicProfile(partnerId!).catch(() => null),
        partnerService.getPartnerSchedules(partnerId!).catch(() => ({ schedules: [] })),
        partnerService.getPartnerDocuments(partnerId!).catch(() => ({ documents: [] })),
      ]);

      setPartner(partnerData);
      setPublicProfile(profileData);
      setSchedules(schedulesData.schedules || []);
      setDocuments(documentsData.documents || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch partner details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <TabContainer>
        <Tab $active={activeTab === 'basic'} onClick={() => setActiveTab('basic')}>
          Basic Details
        </Tab>
        <Tab $active={activeTab === 'visits'} onClick={() => setActiveTab('visits')}>
          Visits
        </Tab>
        <Tab $active={activeTab === 'availability'} onClick={() => setActiveTab('availability')}>
          Availability
        </Tab>
        <Tab $active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
          Public Profile
        </Tab>
        <Tab $active={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
          Documents
        </Tab>
      </TabContainer>

      {activeTab === 'basic' && (
        <Section>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>Basic Details</h2>
          <DetailGrid>
            <DetailItem>
              <Label>Partner ID</Label>
              <Value>{partner?.id || 'N/A'}</Value>
            </DetailItem>
            <DetailItem>
              <Label>Name</Label>
              <Value>{partner?.user?.name || 'N/A'}</Value>
            </DetailItem>
            <DetailItem>
              <Label>Email</Label>
              <Value>{partner?.user?.email || 'N/A'}</Value>
            </DetailItem>
            <DetailItem>
              <Label>Phone</Label>
              <Value>{partner?.user?.phoneNumber || 'N/A'}</Value>
            </DetailItem>
            <DetailItem>
              <Label>Status</Label>
              <Value>{partner?.status || 'active'}</Value>
            </DetailItem>
            <DetailItem>
              <Label>Joined Date</Label>
              <Value>{partner?.createdAt ? new Date(partner.createdAt).toLocaleDateString() : 'N/A'}</Value>
            </DetailItem>
          </DetailGrid>
        </Section>
      )}

      {activeTab === 'visits' && (
        <Section>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>Partner Visits</h2>
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Customer</Th>
                <Th>Service</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <Td>{new Date(schedule.scheduledOn).toLocaleDateString()}</Td>
                  <Td>{schedule.orderItem?.order?.user?.name || 'N/A'}</Td>
                  <Td>{schedule.orderItem?.Package?.service?.name || 'N/A'}</Td>
                  <Td>{schedule.startTime ? 'Completed' : 'Scheduled'}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      )}

      {activeTab === 'availability' && (
        <Section>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>Availability</h2>
          <p style={{ marginBottom: '1rem', color: '#64748b' }}>Manage partner availability slots</p>
          <Button onClick={() => toast('Availability management coming soon')}>
            Add Availability
          </Button>
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Start Time</Th>
                <Th>End Time</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <Td>{new Date(schedule.scheduledOn).toLocaleDateString()}</Td>
                  <Td>{schedule.startTime || '09:00'}</Td>
                  <Td>{schedule.endTime || '18:00'}</Td>
                  <Td>
                    <Button onClick={() => toast('Delete functionality coming soon')}>
                      Delete
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      )}

      {activeTab === 'profile' && (
        <Section>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>Public Profile</h2>
          {publicProfile ? (
            <DetailGrid>
              <DetailItem>
                <Label>Bio</Label>
                <Value>{publicProfile.bio || 'No bio available'}</Value>
              </DetailItem>
              <DetailItem>
                <Label>Experience</Label>
                <Value>{publicProfile.experience || 'N/A'}</Value>
              </DetailItem>
              <DetailItem>
                <Label>Rating</Label>
                <Value>{publicProfile.rating || 'No rating'}</Value>
              </DetailItem>
            </DetailGrid>
          ) : (
            <div>
              <p style={{ marginBottom: '1rem', color: '#64748b' }}>No public profile created yet</p>
              <Button onClick={() => toast('Profile creation coming soon')}>
                Create Profile
              </Button>
            </div>
          )}
        </Section>
      )}

      {activeTab === 'documents' && (
        <Section>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>Documents</h2>
          <Table>
            <thead>
              <tr>
                <Th>Document Type</Th>
                <Th>Status</Th>
                <Th>Uploaded On</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <Td>{doc.type || 'Document'}</Td>
                  <Td>
                    <StatusBadge $verified={doc.status === 'VERIFIED'}>
                      {doc.status || 'PENDING'}
                    </StatusBadge>
                  </Td>
                  <Td>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}</Td>
                  <Td>
                    <Button onClick={() => toast('View document functionality coming soon')}>
                      View
                    </Button>
                    {doc.status !== 'VERIFIED' && (
                      <Button 
                        onClick={() => toast('Verify functionality coming soon')}
                        style={{ marginLeft: '0.5rem', backgroundColor: '#10b981' }}
                      >
                        Verify
                      </Button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      )}
    </Layout>
  );
};
