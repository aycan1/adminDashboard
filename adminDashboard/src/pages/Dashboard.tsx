import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
  Divider
} from '@mui/material';
import {
  Person as UserIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditorIcon,
  Visibility as ViewerIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const StatCard = ({ title, value, icon, color }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        backgroundColor: color,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
          {value}
        </Typography>
        <Typography variant="subtitle1">
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          right: -10,
          bottom: -10,
          opacity: 0.2,
          transform: 'scale(2)'
        }}
      >
        {icon}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          right: 10,
          bottom: 10,
          color: 'white'
        }}
      >
        More info
      </Box>
    </Paper>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Users',
      value: '50',
      icon: <UserIcon sx={{ fontSize: 100 }} />,
      color: theme.palette.info.main
    },
    {
      title: 'Admins',
      value: '6',
      icon: <AdminIcon sx={{ fontSize: 100 }} />,
      color: theme.palette.error.main
    },
    {
      title: 'Editors',
      value: '20',
      icon: <EditorIcon sx={{ fontSize: 100 }} />,
      color: theme.palette.warning.main
    },
    {
      title: 'Viewers',
      value: '24',
      icon: <ViewerIcon sx={{ fontSize: 100 }} />,
      color: theme.palette.success.main
    }
  ];

  const recentActivities = [
    { message: 'New user "editor20" was added', time: '2 minutes ago' },
    { message: 'User "admin" updated their profile', time: '5 minutes ago' },
    { message: 'User "viewer24" logged in', time: '10 minutes ago' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome back, {user?.username}!
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              mt: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Recent Activity
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentActivities.map((activity, index) => (
                <Box key={index}>
                  <Typography variant="body1">
                    {activity.message}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {activity.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 