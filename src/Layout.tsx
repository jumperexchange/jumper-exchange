import {
  BackgroundGradient,
  Menus,
  Navbar,
  PoweredBy,
  Snackbar,
} from './components';

interface LayoutProps {
  hideNavbarTabs?: boolean;
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, hideNavbarTabs }) => {
  // const { initTracking } = useInitUserTracking();
  // const cookie3 = useCookie3();

  // useEffect(() => {
  //   initTracking({});
  //   cookie3?.trackPageView();
  // }, [cookie3, initTracking]);

  return (
    <>
      <BackgroundGradient />
      <Navbar hideNavbarTabs={hideNavbarTabs} />
      <Menus />
      {children}
      <PoweredBy />
      <Snackbar />
    </>
  );
};
