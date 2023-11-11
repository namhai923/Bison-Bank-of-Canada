import { apiSlice } from 'app/api/apiSlice';

export const pokeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPokeCollection: builder.query({
            query: () => ({
                url: '/pokegene/getCollection'
            }),
            providesTags: [{ type: 'Pokegene', id: 'pokeCollection' }]
        }),
        generatePokemon: builder.mutation({
            query: (types) => ({
                url: '/pokegene/generatePokemon',
                method: 'POST',
                body: types
            }),
            invalidatesTags: [
                { type: 'Pokegene', id: 'pokeCollection' },
                { type: 'User', id: 'userInfo' }
            ]
        }),
        removePokemon: builder.mutation({
            query: (removeId) => ({
                url: '/pokegene/removePokemon',
                method: 'POST',
                body: removeId
            }),
            invalidatesTags: [{ type: 'Pokegene', id: 'pokeCollection' }]
        }),
        sendPokemon: builder.mutation({
            query: (sendInfo) => ({
                url: '/pokegene/sendPokemon',
                method: 'POST',
                body: sendInfo
            }),
            invalidatesTags: [{ type: 'Pokegene', id: 'pokeCollection' }]
        })
    })
});

export const { useGetPokeCollectionQuery, useGeneratePokemonMutation, useRemovePokemonMutation, useSendPokemonMutation } = pokeApiSlice;
