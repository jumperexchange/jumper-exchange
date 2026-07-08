import Box from '@mui/material/Box';
import { AdvancedPageContent } from '@/app/ui/widget/AdvancedPageContent';

export default async function Page() {
  return (
    <Box sx={{ paddingBottom: { xs: 6, sm: 0 } }}>
      <AdvancedPageContent />
    </Box>
  );
}
