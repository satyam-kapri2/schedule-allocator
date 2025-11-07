import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Package, Users } from 'lucide-react';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const Nav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  color: white;
  background-color: ${({ $active }) => ($active ? 'rgba(255,255,255,0.2)' : 'transparent')};
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  margin-top: auto;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
`;

const UserInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;
`;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <LayoutContainer>
      <Sidebar>
        <Logo>Admin Panel</Logo>
        <UserInfo>
          <div>{user?.name || 'Admin User'}</div>
          <div style={{ opacity: 0.8 }}>{user?.phone}</div>
        </UserInfo>
        <Nav>
          <NavItem to="/orders" $active={location.pathname.startsWith('/orders')}>
            <Package size={20} />
            Orders
          </NavItem>
          <NavItem to="/partners" $active={location.pathname.startsWith('/partners')}>
            <Users size={20} />
            Partners
          </NavItem>
        </Nav>
        <LogoutButton onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </LogoutButton>
      </Sidebar>
      <Main>{children}</Main>
    </LayoutContainer>
  );
};
