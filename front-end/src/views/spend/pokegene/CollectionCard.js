import PropTypes from 'prop-types';
import { useState } from 'react';

import { useTheme, styled } from '@mui/material/styles';
import { Box, Button, Card, Chip, Typography, Modal, Grid, Stack, useMediaQuery } from '@mui/material';
import { toast } from 'react-toastify';

import SendPokeForm from './SendPokeForm';
import { useRemovePokemonMutation, useSendPokemonMutation } from 'app/features/pokegene/pokeApiSlice';
import TYPES from 'assets/data/pokegene/TYPES';

const ImageBackdrop = styled('div')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: '#000',
    opacity: 0.15,
    transition: theme.transitions.create('opacity')
}));

const CollectionItem = styled(Card)(({ theme }) => ({
    position: 'relative',
    display: 'block',
    padding: 0,
    borderRadius: 0,
    height: '30vh',
    [theme.breakpoints.down('md')]: {
        width: '100% !important',
        height: 100
    },
    '&:hover': {
        zIndex: 1
    },
    '&:hover .itemBackdrop': {
        opacity: 0.7
    },
    '&:hover .itemTitle': {
        opacity: 1
    },
    '&:hover .itemImage': {
        transform: 'scale(1.35)'
    },
    '&:hover .itemActions': {
        opacity: 1,
        transform: 'translateY(0)'
    },
    '& .itemImage': {
        transition: theme.transitions.create()
    },
    '& .itemTitle': {
        opacity: 0,
        transition: theme.transitions.create('opacity')
    },
    '& .itemActions': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '1rem',
        opacity: 0,
        transition: theme.transitions.create('transform'),
        transform: 'translateY(1rem)'
    }
}));

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '27px',
    boxShadow: 24,
    p: 4
};

const CollectionCard = (props) => {
    let theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const { itemId, pokemon } = props;
    const [open, setOpen] = useState(false);

    let [removePokemon] = useRemovePokemonMutation();
    let handleRemove = async () => {
        toast.promise(removePokemon({ removeId: itemId }).unwrap(), {
            pending: 'Hold on a sec ⌛',
            success: 'Pokemon removed 🎉🎉🎉',
            error: {
                render({ data }) {
                    return data.data.message;
                }
            }
        });
    };

    let handleOpen = () => {
        setOpen(true);
    };

    let handleClose = () => {
        setOpen(false);
    };

    let [sendPokemon] = useSendPokemonMutation();
    let handleSubmit = async (values) => {
        setOpen(false);
        toast.promise(sendPokemon({ userName: values['receiver'][0], sendId: itemId }).unwrap(), {
            pending: 'Hold on a sec ⌛',
            success: 'Pokemon sent 🎉🎉🎉',
            error: {
                render({ data }) {
                    return data.data.message;
                }
            }
        });
    };

    return (
        <>
            <CollectionItem key={pokemon.name} sx={{ width: '100%' }}>
                <Box
                    className="itemImage"
                    sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 40%',
                        backgroundImage: `url(${pokemon.image})`
                    }}
                />
                <ImageBackdrop className="itemBackdrop" />
                <Box
                    className="itemTitle"
                    sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.palette.background.paper
                    }}
                >
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography component="h3" variant="h6" color="inherit" align="center">
                                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" justifyContent="center" spacing={1}>
                                {pokemon.types.map((type) => {
                                    let { label, color } = TYPES.find((typeProps) => typeProps.value === type);
                                    return (
                                        <Chip
                                            size="small"
                                            label={label}
                                            sx={{ backgroundColor: `${color}`, color: `${theme.palette.background.paper}`, p: 0 }}
                                        />
                                    );
                                })}
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" justifyContent="center" spacing={1} className="itemActions">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleOpen}
                                    sx={{
                                        color: theme.palette.background.paper,
                                        borderColor: theme.palette.background.paper,
                                        '&:hover': {
                                            border: 0,
                                            background: theme.palette.background.paper,
                                            color: theme.palette.text.primary
                                        }
                                    }}
                                >
                                    Give
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleRemove}
                                    color="error"
                                    sx={{
                                        '&:hover': {
                                            border: 0,
                                            background: theme.palette.error.main,
                                            color: theme.palette.primary.light
                                        }
                                    }}
                                >
                                    Remove
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </CollectionItem>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ ...style, width: matchesXs ? '80%' : 600 }}>
                    <Stack spacing={1}>
                        <Stack>
                            <Typography variant="subtitle2">Given pokemon:</Typography>
                            <Typography variant="h4">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Typography>
                        </Stack>
                        <Typography variant="h4"></Typography>
                        <SendPokeForm handleSubmit={handleSubmit}></SendPokeForm>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
};

CollectionCard.propTypes = {
    itemId: PropTypes.string.isRequired,
    pokemon: PropTypes.object.isRequired
};

export default CollectionCard;
