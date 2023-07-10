import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import { useUser } from 'src/hooks/use-mocked-user';
import { UserList } from 'src/sections/account/user-list';

const Page = () => {
  const user = useUser();
  return (
  <>
    <Head>
      <title>
        Account | DegreeMap
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              Account
            </Typography>
          </div>
          <div>
          <AccountProfileDetails />
          </div>
          {user?.is_admin == 1 && 
            <>
              <div>
                <Typography variant="h4">
                  User List
                </Typography>
              </div>
              <div>
                <UserList />
              </div>
            </>
          }
        </Stack>
      </Container>
    </Box>
  </>
)};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
