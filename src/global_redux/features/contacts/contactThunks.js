import API from "../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
         const adminToken = localStorage.getItem("adminToken");
      const res = await API.get("/contacts", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (res.data?.success) {
        return res.data.data || [];
      } else {
        return rejectWithValue(res.data?.message || "Failed to fetch contacts");
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch contacts"
      );
    }
  }
);

 export const updateContactStatus = createAsyncThunk(
  "contacts/updateContactStatus",
  async ({ contactId, newStatus }, { rejectWithValue, getState }) => {
    try {
      const adminToken = localStorage.getItem("adminToken");

      const res = await API.patch(
        `/contacts/${contactId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.data?.success) {
        return { contactId, newStatus };
      } else {
        return rejectWithValue(res.data?.message || "Failed to update status");
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update contact status"
      );
    }
  }
);