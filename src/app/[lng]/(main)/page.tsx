import Box from '@mui/material/Box';
import { ExchangePageContent } from '@/app/ui/widget/ExchangePageContent';

export default async function Page() {
  return (
    <Box sx={{ paddingBottom: { xs: 6, sm: 0 } }}>
      <ExchangePageContent />
    </Box>
  );
}
