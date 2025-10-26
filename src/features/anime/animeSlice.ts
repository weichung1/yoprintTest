/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: { image_url: string };
  };
  score?: number;
}

interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items?: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface AnimeState {
  list: Anime[];
  query: string;
  loading: boolean;
  pagination: Pagination | null;
}

const initialState: AnimeState = {
  list: [],
  query: '',
  loading: false,
  pagination: null,
};

export const fetchAnimeList = createAsyncThunk(
  'anime/fetchList',
  async ({ query, page }: { query: string; page: number }) => {
    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}`
      );

      if (!res.ok) {
        if (res.status === 429) throw new Error("Too many requests. Please wait a moment.");
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      if (!data?.data) throw new Error("Invalid API response format");

      return data;
    } catch (error: any) {
      throw new Error(error.message || "Something went wrong");
    }
  }
);

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnimeList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchAnimeList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setQuery } = animeSlice.actions;
export default animeSlice.reducer;
