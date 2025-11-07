import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { partnerService } from '@/services/partnerService';
import { Layout } from '@/components/Layout';
import toast from 'react-hot-toast';

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
`;

const RightPanel = styled.div`
  flex: 1;
`;

const Section = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  margin-top: ${({ theme }) => theme.spacing.md};

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Slider = styled.input`
  width: 100%;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Draft schedule inputs
  const [startDate, setStartDate] = useState('');
  const [sessionDuration, setSessionDuration] = useState('60');
  const [numVisits, setNumVisits] = useState('1');
  const [pattern, setPattern] = useState('daily');
  const [specificDays, setSpecificDays] = useState('');
  const [specificDates, setSpecificDates] = useState('');
  const [draftSchedules, setDraftSchedules] = useState<any[]>([]);
  
  // Partner search
  const [tolerance, setTolerance] = useState(0);
  const [availablePartners, setAvailablePartners] = useState<any[]>([]);
  const [searchingPartners, setSearchingPartners] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const data = await orderService.getOrderById(orderId!);
      setOrder(data.order || data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const generateDraftSchedules = () => {
    if (!startDate || !numVisits) {
      toast.error('Please fill in required fields');
      return;
    }

    const schedules = [];
    const start = new Date(startDate);
    const visits = parseInt(numVisits);

    if (pattern === 'daily') {
      for (let i = 0; i < visits; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        schedules.push({
          date: date.toISOString().split('T')[0],
          startTime: '09:00',
          endTime: calculateEndTime('09:00', parseInt(sessionDuration)),
        });
      }
    } else if (pattern === 'alternate') {
      for (let i = 0; i < visits; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i * 2);
        schedules.push({
          date: date.toISOString().split('T')[0],
          startTime: '09:00',
          endTime: calculateEndTime('09:00', parseInt(sessionDuration)),
        });
      }
    } else if (pattern === 'specific_days' && specificDays) {
      const days = specificDays.split(',').map((d) => parseInt(d.trim()));
      let currentDate = new Date(start);
      let count = 0;
      
      while (count < visits) {
        if (days.includes(currentDate.getDay())) {
          schedules.push({
            date: currentDate.toISOString().split('T')[0],
            startTime: '09:00',
            endTime: calculateEndTime('09:00', parseInt(sessionDuration)),
          });
          count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else if (pattern === 'specific_dates' && specificDates) {
      const dates = specificDates.split(',').map((d) => d.trim());
      dates.slice(0, visits).forEach((date) => {
        schedules.push({
          date: date,
          startTime: '09:00',
          endTime: calculateEndTime('09:00', parseInt(sessionDuration)),
        });
      });
    }

    setDraftSchedules(schedules);
    toast.success('Draft schedules generated');
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const searchAvailablePartners = async () => {
    if (draftSchedules.length === 0) {
      toast.error('Please generate draft schedules first');
      return;
    }

    setSearchingPartners(true);
    try {
      const slotsData = draftSchedules.map((schedule) => ({
        date: schedule.date,
        timeRanges: [
          {
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          },
        ],
      }));

      const data = await partnerService.findAvailablePartners({
        slotsData,
        minAvailabilityPercentage: 100 - tolerance,
      });

      setAvailablePartners(data.availablePartners || []);
      toast.success(`Found ${data.availablePartners?.length || 0} available partners`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to search partners');
    } finally {
      setSearchingPartners(false);
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
      <Container>
        <LeftPanel>
          <Section>
            <SectionTitle>Order Details</SectionTitle>
            {order && (
              <>
                <DetailRow>
                  <strong>Order ID:</strong>
                  <span>{order.id}</span>
                </DetailRow>
                <DetailRow>
                  <strong>Status:</strong>
                  <span>{order.status}</span>
                </DetailRow>
                <DetailRow>
                  <strong>Total Price:</strong>
                  <span>₹{order.totalPrice}</span>
                </DetailRow>
                <DetailRow>
                  <strong>Payment Method:</strong>
                  <span>{order.paymentMethod}</span>
                </DetailRow>
                <DetailRow>
                  <strong>Created:</strong>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </DetailRow>
              </>
            )}
          </Section>
        </LeftPanel>

        <RightPanel>
          <Section>
            <SectionTitle>Schedules</SectionTitle>
            <Table>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Time</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {order?.orderItems?.[0]?.schedules?.map((schedule: any) => (
                  <tr key={schedule.id}>
                    <Td>{new Date(schedule.scheduledOn).toLocaleDateString()}</Td>
                    <Td>{new Date(schedule.scheduledOn).toLocaleTimeString()}</Td>
                    <Td>{schedule.startTime ? 'Completed' : 'Pending'}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Section>

          <Section>
            <SectionTitle>Existing Visits</SectionTitle>
            <Table>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Check-in</Th>
                  <Th>Check-out</Th>
                </tr>
              </thead>
              <tbody>
                {order?.orderItems?.[0]?.schedules
                  ?.filter((s: any) => s.startTime)
                  .map((schedule: any) => (
                    <tr key={schedule.id}>
                      <Td>{new Date(schedule.scheduledOn).toLocaleDateString()}</Td>
                      <Td>{schedule.startTime || 'N/A'}</Td>
                      <Td>{schedule.endTime || 'N/A'}</Td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Section>

          <Section>
            <SectionTitle>Generate Draft Schedules</SectionTitle>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            
            <Label>Session Duration (minutes)</Label>
            <Input
              type="number"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(e.target.value)}
            />
            
            <Label>Number of Visits</Label>
            <Input
              type="number"
              value={numVisits}
              onChange={(e) => setNumVisits(e.target.value)}
            />
            
            <Label>Pattern</Label>
            <Select value={pattern} onChange={(e) => setPattern(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="alternate">Alternate Days</option>
              <option value="specific_days">Specific Days (0-6, 0=Sunday)</option>
              <option value="specific_dates">Specific Dates (YYYY-MM-DD)</option>
            </Select>
            
            {pattern === 'specific_days' && (
              <>
                <Label>Days (comma-separated: 0-6)</Label>
                <Input
                  type="text"
                  value={specificDays}
                  onChange={(e) => setSpecificDays(e.target.value)}
                  placeholder="e.g., 1,3,5"
                />
              </>
            )}
            
            {pattern === 'specific_dates' && (
              <>
                <Label>Dates (comma-separated)</Label>
                <Input
                  type="text"
                  value={specificDates}
                  onChange={(e) => setSpecificDates(e.target.value)}
                  placeholder="e.g., 2025-01-10,2025-01-15"
                />
              </>
            )}
            
            <Button onClick={generateDraftSchedules}>Generate Schedules</Button>
            
            {draftSchedules.length > 0 && (
              <>
                <SectionTitle style={{ marginTop: '2rem' }}>Draft Schedules</SectionTitle>
                <Table>
                  <thead>
                    <tr>
                      <Th>Date</Th>
                      <Th>Start Time</Th>
                      <Th>End Time</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {draftSchedules.map((schedule, index) => (
                      <tr key={index}>
                        <Td>{schedule.date}</Td>
                        <Td>{schedule.startTime}</Td>
                        <Td>{schedule.endTime}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </Section>

          <Section>
            <SectionTitle>Search Available Partners</SectionTitle>
            <Label>Tolerance: {tolerance}%</Label>
            <Slider
              type="range"
              min="0"
              max="100"
              value={tolerance}
              onChange={(e) => setTolerance(parseInt(e.target.value))}
            />
            
            <Button onClick={searchAvailablePartners} disabled={searchingPartners}>
              {searchingPartners ? 'Searching...' : 'Search Partners'}
            </Button>
            
            {availablePartners.length > 0 && (
              <>
                <SectionTitle style={{ marginTop: '2rem' }}>Available Partners</SectionTitle>
                <Table>
                  <thead>
                    <tr>
                      <Th>Name</Th>
                      <Th>Availability</Th>
                      <Th>Action</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {availablePartners.map((partner) => (
                      <tr key={partner.partnerId}>
                        <Td>{partner.partnerName || 'N/A'}</Td>
                        <Td>{partner.availabilityPercentage}%</Td>
                        <Td>
                          <Button onClick={() => toast.success('Allocation feature coming soon')}>
                            Allocate
                          </Button>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </Section>
        </RightPanel>
      </Container>
    </Layout>
  );
};
