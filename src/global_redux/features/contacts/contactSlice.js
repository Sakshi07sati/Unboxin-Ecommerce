import { createSlice } from "@reduxjs/toolkit";
import { fetchContacts, updateContactStatus } from "./contactThunks";

const initialState = {
  contacts: [],
  loading: false,
  error: null,
};

const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      // Update Contact Status
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        const { contactId, newStatus } = action.payload;
        const index = state.contacts.findIndex((c) => c._id === contactId);
        if (index !== -1) {
          state.contacts[index].status = newStatus;
        }
      });
  },
});

export const selectContacts = (state) => state.contacts.contacts;
export const selectContactsLoading = (state) => state.contacts.loading;
export const selectContactsError = (state) => state.contacts.error;

export default contactSlice.reducer;
