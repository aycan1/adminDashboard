import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  Tabs,
  Tab,
  InputBase
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { PaginatedTable, Column } from '../components/common/PaginatedTable';
import { UserModal } from '../components/common/UserModal';
import { UserService } from '../services/UserService';
import { User } from '../types';
import api from '../api/axios';

const UserList = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [tabValue, setTabValue] = useState(0);

  const userService = new UserService(api);

  const getRoleColor = (role: string) => {
    const colors = {
      'Admin': {
        bg: theme.palette.error.light,
        text: theme.palette.error.dark
      },
      'Editor': {
        bg: theme.palette.warning.light,
        text: theme.palette.warning.dark
      },
      'Viewer': {
        bg: theme.palette.success.light,
        text: theme.palette.success.dark
      }
    };
    return colors[role as keyof typeof colors] || { bg: theme.palette.grey[100], text: theme.palette.grey[800] };
  };

  const columns: Column<User>[] = [
    { 
      id: 'username',
      label: 'Name',
      render: (value: string | number | undefined) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      )
    },
    { 
      id: 'email',
      label: 'Email',
      render: (value: string | number | undefined) => (
        <Typography variant="body2" color="textSecondary">
          {value?.toString()}
        </Typography>
      )
    },
    { 
      id: 'role',
      label: 'Role(s)',
      render: (value: string | number | undefined) => {
        const roleColor = getRoleColor(value?.toString() || '');
        return (
          <Box
            sx={{
              backgroundColor: roleColor.bg,
              color: roleColor.text,
              py: 0.5,
              px: 1.5,
              borderRadius: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            {value}
          </Box>
        );
      }
    },
    {
      id: 'lastLogin' as keyof User,
      label: 'Last Login',
      render: () => (
        <Typography variant="body2" color="textSecondary">
          {new Date().toLocaleDateString()}
        </Typography>
      )
    }
  ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lowercasedSearch = value.toLowerCase();
    
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(lowercasedSearch) ||
      user.email?.toLowerCase().includes(lowercasedSearch) ||
      user.id?.toString().includes(lowercasedSearch)
    );
    
    setFilteredUsers(filtered);
    setTotal(filtered.length);
    setPage(0);
  };

  const loadUsers = async () => {
    try {
      const response = await userService.getUsers(page, selectedRole, rowsPerPage);
      setUsers(response.data);
      setFilteredUsers(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage, selectedRole]);

  const handleRoleChange = (event: any) => {
    setSelectedRole(event.target.value);
    setPage(0);
  };

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      await userService.createUser(userData);
      loadUsers();
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    try {
      if (selectedUser?.id) {
        await userService.updateUser(selectedUser.id, userData);
        loadUsers();
        setModalOpen(false);
        setSelectedUser(undefined);
      } else {
        console.error('Selected user has no ID');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const tabs = [
    { label: 'All Roles', value: '' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Editor', value: 'Editor' },
    { label: 'Viewer', value: 'Viewer' }
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedRole(tabs[newValue].value);
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Internal Users
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Paper
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 400,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Users by Name, Email or ID"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <IconButton type="button" sx={{ p: '10px' }}>
                <SearchIcon />
              </IconButton>
            </Paper>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
              sx={{ borderRadius: 1 }}
            >
              Add User
            </Button>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 120
              }
            }}
            TabIndicatorProps={{
              sx: {
                backgroundColor: theme.palette.primary.main,
                height: 3
              }
            }}
          >
            {tabs.map((tab) => (
              <Tab 
                key={tab.value} 
                label={tab.label}
                sx={{
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 600
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>

        <PaginatedTable
          columns={columns}
          data={searchTerm ? filteredUsers : users}
          total={searchTerm ? filteredUsers.length : total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onRowClick={handleRowClick}
        />
      </Paper>

      <UserModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(undefined);
        }}
        onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
        user={selectedUser}
      />
    </Container>
  );
};

export default UserList; 