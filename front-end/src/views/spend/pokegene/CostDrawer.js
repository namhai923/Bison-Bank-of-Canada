import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import { Box, Drawer } from '@mui/material';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';

import CostCard from './CostCard';
import { drawerWidth } from 'assets/data/constant';

const CostDrawer = (props) => {
    let { costOpened, costToggle } = props;
    const theme = useTheme();

    const drawer = (
        <>
            <BrowserView>
                <PerfectScrollbar
                    component="div"
                    style={{
                        paddingLeft: '16px',
                        paddingRight: '16px'
                    }}
                >
                    <CostCard />
                </PerfectScrollbar>
            </BrowserView>
            <MobileView>
                <Box sx={{ px: 2 }}>
                    <CostCard />
                </Box>
            </MobileView>
        </>
    );

    return (
        <Box component="nav" sx={{ flexShrink: { md: 0 }, width: 'auto' }}>
            <Drawer
                variant={'temporary'}
                anchor="left"
                open={costOpened}
                onClose={costToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderRight: 'none',
                        pt: 2
                    }
                }}
                ModalProps={{ keepMounted: true }}
                color="inherit"
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

CostDrawer.propTypes = {
    costOpened: PropTypes.bool,
    costToggle: PropTypes.func
};

export default CostDrawer;
