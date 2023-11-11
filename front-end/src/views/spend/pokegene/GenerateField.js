import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { ErrorMessage, useField } from 'formik';
import {
    Button,
    Box,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    FormHelperText,
    FormGroup,
    Typography,
    Grid,
    Skeleton,
    Stack
} from '@mui/material';
import { IconStarFilled } from '@tabler/icons-react';

import pokeball from 'assets/images/pokeball.png';
import { setValue } from 'app/features/value/valueSlice';
import { useGeneratePokemonMutation } from 'app/features/pokegene/pokeApiSlice';
import TYPES from 'assets/data/pokegene/TYPES';

const GenerateField = (props) => {
    let theme = useTheme();
    let { field, form } = props;
    let { name } = field;
    let { errors, touched } = form;
    let showError = errors[name] && touched[name];

    let [{ value: pokemonTypes }] = useField('pokemonTypes');
    let [{ value: pokemon }] = useField('pokemon');

    let [generateMessage, setGenerateMessage] = useState('');

    let dispatch = useDispatch();
    let [generatePokemon, { isLoading }] = useGeneratePokemonMutation();
    let handleGenerate = async () => {
        if (pokemonTypes.length === 0) {
            setGenerateMessage('Please add types for your pokemon');
        } else {
            setGenerateMessage('');
            let result = await generatePokemon({ types: pokemonTypes });
            let generateResult = null;
            let { types, name, image, description } = result.data;
            if (!types || !name || !image || !description) {
                setGenerateMessage(result.data);
            } else {
                generateResult = { types, name, image, description };
            }
            dispatch(setValue({ type: 'pokemon', value: generateResult }));
            form.setFieldValue('pokemon', generateResult);
        }
    };

    let totalCost = pokemonTypes.reduce((totalCost, currentType) => totalCost + TYPES.find((type) => type.value === currentType).cost, 0);
    return (
        <FormGroup>
            <Card>
                <Grid container>
                    <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                        {isLoading ? (
                            <Skeleton variant="rectangular" width="50%">
                                <CardMedia component="img" image={pokeball} alt="Skeleton" />
                            </Skeleton>
                        ) : (
                            <CardMedia
                                component="img"
                                sx={{ maxWidth: '50%' }}
                                image={pokemon ? pokemon.image : pokeball}
                                alt="Pokemon image"
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} display="flex">
                        <CardContent sx={{ pl: 0 }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {pokemon ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) : "Pokemon's name"}
                            </Typography>

                            <Typography variant="body1">{pokemon ? pokemon.description : "Pokemon's description"}</Typography>
                        </CardContent>
                    </Grid>
                </Grid>
                <CardActions sx={{ p: 0 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Button type="button" onClick={handleGenerate}>
                                Generate
                            </Button>
                            <div className={generateMessage !== '' ? 'is-invalid' : ''}></div>
                            {generateMessage && <FormHelperText error>{generateMessage}</FormHelperText>}
                        </Grid>
                        <Grid item>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography>Cost</Typography>
                                <>
                                    <Typography variant="subtitle1"> {totalCost} </Typography>
                                    <Box sx={{ display: 'flex', color: `${theme.palette.warning.dark}` }}>
                                        <IconStarFilled stroke={1.5} size="1.3rem" />
                                    </Box>
                                </>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>

            <div className={showError ? 'is-invalid' : ''}></div>
            <ErrorMessage name={name} component={FormHelperText} />
        </FormGroup>
    );
};

GenerateField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
};

export default GenerateField;
