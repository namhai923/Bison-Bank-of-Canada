import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { ButtonBase } from '@mui/material';
import { IconStarFilled } from '@tabler/icons-react';

import MainCard from 'components/cards/MainCard';
import GenerateForm from './GenerateForm';
import { AvatarStyle } from 'components/styled-input';

const GeneratorCard = (props) => {
    let { costOpened, costToggle } = props;
    let { pokemonTypes, pokemon } = useSelector((state) => state.value);
    let theme = useTheme();

    let initialValues = {
        pokemonTypes,
        pokemon
    };

    return (
        <MainCard
            title="Generator"
            secondary={
                <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <AvatarStyle
                        variant="rounded"
                        color={theme.palette.warning}
                        onClick={costToggle}
                        sx={{
                            background: costOpened ? theme.palette.warning.dark : theme.palette.warning.light,
                            color: costOpened ? theme.palette.warning.light : theme.palette.warning.dark
                        }}
                    >
                        <IconStarFilled stroke={1.5} size="1.3rem" />
                    </AvatarStyle>
                </ButtonBase>
            }
        >
            <GenerateForm initialValues={initialValues} />
        </MainCard>
    );
};

GeneratorCard.propTypes = {
    costOpened: PropTypes.bool,
    costToggle: PropTypes.func
};

export default GeneratorCard;
