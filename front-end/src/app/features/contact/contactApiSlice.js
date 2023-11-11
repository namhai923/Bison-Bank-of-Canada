import { apiSlice } from 'app/api/apiSlice';

export const contactApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getContacts: builder.query({
            query: () => ({
                url: '/contact/getContacts'
            }),
            providesTags: [{ type: 'Contact', id: 'contacts' }]
        }),
        addContact: builder.mutation({
            query: (contactInfo) => ({
                url: '/contact/addContact',
                method: 'POST',
                body: contactInfo
            }),
            invalidatesTags: [{ type: 'Contact', id: 'contacts' }]
        }),
        removeContact: builder.mutation({
            query: (contactsInfo) => ({
                url: '/contact/removeContacts',
                method: 'POST',
                body: contactsInfo
            }),
            invalidatesTags: [{ type: 'Contact', id: 'contacts' }]
        })
    })
});

export const { useGetContactsQuery, useAddContactMutation, useRemoveContactMutation } = contactApiSlice;
