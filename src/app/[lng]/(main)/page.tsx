import Box from '@mui/material/Box';
import { MainWidgetPageContent } from '@/app/ui/widget/MainWidgetPageContent';

export default async function Page() {
  return (
    <Box sx={{ paddingBottom: { xs: 6, sm: 0 } }}>
      <MainWidgetPageContent variant="default" />
    </Box>
  );
}
