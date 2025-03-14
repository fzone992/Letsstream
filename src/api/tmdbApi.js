// src/api/tmdbApi.js

// API credentials and base URL for The Movie Database (TMDB) API
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;  // Your TMDB API key from environment
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3'; // TMDB API base URL from environment

/**
 * Advanced search for movies and TV shows using the TMDB discover API
 * @param {Object} filters - Search filters
 * @param {string} filters.query - Search query
 * @param {string} filters.genre - Genre ID
 * @param {string} filters.year - Release year
 * @param {string} filters.rating - Minimum rating
 * @param {string} filters.sortBy - Sort criteria
 * @param {number} page - Page number
 * @returns {Promise<Array>} - Array of movies and TV shows matching the criteria
 */
export const advancedSearch = async (filters, page = 1) => {
  try {
    validateConfig();
    
    const { query, genre, yearFrom, yearTo, rating, language, mediaType, runtime, sortBy } = filters;
    let results = [];

    // If there's a query, use the search endpoint
    if (query) {
      const searchResponse = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
      );
      
      if (!searchResponse.ok) {
        throw new Error('Failed to fetch search results');
      }
      
      const searchData = await searchResponse.json();
      results = searchData.results;
    }

    // Common parameters for both movie and TV show requests
    const commonParams = {
      api_key: API_KEY,
      page: page.toString(),
      sort_by: sortBy || 'popularity.desc',
      ...(genre && { with_genres: genre }),
      ...(rating && { 'vote_average.gte': rating }),
      ...(language && { with_original_language: language }),
      include_adult: false,
    };

    let apiResults = [];

    // Fetch movies if mediaType is 'all' or 'movie'
    if (mediaType === 'all' || mediaType === 'movie') {
      const movieParams = new URLSearchParams({
        ...commonParams,
        ...(yearFrom && { 'primary_release_date.gte': `${yearFrom}-01-01` }),
        ...(yearTo && { 'primary_release_date.lte': `${yearTo}-12-31` }),
        ...(runtime && {
          'with_runtime.gte': runtime.split(',')[0] || '0',
          'with_runtime.lte': runtime.split(',')[1] || '999'
        }),
      });

      const movieResponse = await fetch(`${BASE_URL}/discover/movie?${movieParams}`);
      if (!movieResponse.ok) {
        throw new Error('Failed to fetch movie results');
      }
      const movieData = await movieResponse.json();
      apiResults.push(...movieData.results.map(item => ({ ...item, media_type: 'movie' })));
    }

    // Fetch TV shows if mediaType is 'all' or 'tv'
    if (mediaType === 'all' || mediaType === 'tv') {
      const tvParams = new URLSearchParams({
        ...commonParams,
        ...(yearFrom && { 'first_air_date.gte': `${yearFrom}-01-01` }),
        ...(yearTo && { 'first_air_date.lte': `${yearTo}-12-31` }),
      });

      const tvResponse = await fetch(`${BASE_URL}/discover/tv?${tvParams}`);
      if (!tvResponse.ok) {
        throw new Error('Failed to fetch TV show results');
      }
      const tvData = await tvResponse.json();
      apiResults.push(...tvData.results.map(item => ({ ...item, media_type: 'tv' })));
    }

    // If there was a query, filter the search results with all criteria
    if (query) {
      results = results.filter(item => {
        if (genre && !item.genre_ids.includes(Number(genre))) return false;
        if (rating && item.vote_average < Number(rating)) return false;
        if (language && item.original_language !== language) return false;
        if (mediaType !== 'all' && item.media_type !== mediaType) return false;
        
        const itemYear = item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4);
        if (yearFrom && itemYear < yearFrom) return false;
        if (yearTo && itemYear > yearTo) return false;
        
        // Runtime filter only applies to movies
        if (runtime && item.media_type === 'movie') {
          const [minRuntime, maxRuntime] = runtime.split(',');
          if (minRuntime && item.runtime < Number(minRuntime)) return false;
          if (maxRuntime && item.runtime > Number(maxRuntime)) return false;
        }
        
        return true;
      });
    } else {
      results = apiResults;
    }

    // Sort combined results
    const sortOrder = sortBy.split('.');
    const [sortField, sortDirection] = sortOrder;
    
    results.sort((a, b) => {
      let valueA = a[sortField === 'release_date' ? (a.release_date ? 'release_date' : 'first_air_date') : sortField];
      let valueB = b[sortField === 'release_date' ? (b.release_date ? 'release_date' : 'first_air_date') : sortField];
      
      if (sortDirection === 'desc') {
        return valueB > valueA ? 1 : -1;
      }
      return valueA > valueB ? 1 : -1;
    });

    return results;
  } catch (error) {
    console.error('Error in advanced search:', error);
    throw new Error('Failed to perform advanced search. Please try again later.');
  }
};

/**
 * Fetches featured content (trending movies and TV shows) from the TMDB API.
 * @returns {Promise<Array>} An array of featured content.
 */
export const fetchFeaturedContent = async () => {
  try {
    validateConfig();
    const response = await fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured content');
    }
    const data = await response.json();
    return data.results.slice(0, 5); 
  } catch (error) {
    console.error('Error fetching featured content:', error);
    throw error; 
  }
};

/**
 * Fetches the latest movies from the TMDB API.
 * @returns {Promise<Array>} An array of latest movies.
 */
export const fetchLatestMovies = async () => {
  try {
    validateConfig();
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Failed to fetch latest movies');
    }
    const data = await response.json();
    return data.results.slice(0, 10);
  } catch (error) {
    console.error('Error fetching latest movies:', error);
    throw error;
  }
};

/**
 * Fetches trending movies from the TMDB API.
 * @returns {Promise<Array>} An array of trending movies.
 */
export const fetchTrendingMovies = async () => {
  try {
    validateConfig();
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Failed to fetch trending movies');
    }
    const data = await response.json();
    return data.results.slice(0, 10);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

/**
 * Fetches the latest TV shows from the TMDB API.
 * @returns {Promise<Array>} An array of latest TV shows.
 */
export const fetchLatestTVShows = async () => {
  try {
    validateConfig();
    const response = await fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Failed to fetch latest TV shows');
    }
    const data = await response.json();
    return data.results.slice(0, 10);
  } catch (error) {
    console.error('Error fetching latest TV shows:', error);
    throw error;
  }
};

/**
 * Fetches trending TV shows from the TMDB API.
 * @returns {Promise<Array>} An array of trending TV shows.
 */
export const fetchTrendingTVShows = async () => {
  try {
    validateConfig();
    const response = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Failed to fetch trending TV shows');
    }
    const data = await response.json();
    return data.results.slice(0, 10);
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
    throw error;
  }
};

/**
 * Fetches movies or TV shows filtered by streaming service provider from the TMDB API.
 * @param {number} serviceId - The ID of the streaming service provider.
 * @returns {Promise<Object>} An object containing arrays of movies and TV shows.
 */
export const filterByStreamingService = async (serviceId) => {
  try {
    validateConfig();
    const moviesEndpoint = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_watch_providers=${serviceId}&watch_region=US`;
    const tvShowsEndpoint = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_watch_providers=${serviceId}&watch_region=US`;

    const [moviesResponse, tvShowsResponse] = await Promise.all([
      fetch(moviesEndpoint),
      fetch(tvShowsEndpoint)
    ]);

    if (!moviesResponse.ok) {
      throw new Error('Failed to fetch movies for streaming service');
    }
    if (!tvShowsResponse.ok) {
      throw new Error('Failed to fetch TV shows for streaming service');
    }

    const [moviesData, tvShowsData] = await Promise.all([
      moviesResponse.json(),
      tvShowsResponse.json()
    ]);

    return {
      latestMovies: moviesData.results.slice(0, 10),
      latestTVShows: tvShowsData.results.slice(0, 10),
    };
  } catch (error) {
    console.error('Error fetching streaming service data:', error);
    throw error;
  }
};



// Validate API configuration
const validateConfig = () => {
  if (!API_KEY) {
    throw new Error('TMDB API key is not configured. Please check your environment variables.');
  }
};

/**
 * Search for movies and TV shows using the TMDB API
 * @param {string} query - What the user is searching for (e.g., "Batman", "Friends")
 * @param {number} page - Which page of results to fetch (default: 1)
 * @returns {Promise<Array>} - Array of movies and TV shows matching the search
 */
export const searchMedia = async (query, page = 1) => {
  try {
    validateConfig();
    
    // Make API request to search for both movies and TV shows
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.status_message || 'Failed to fetch search results');
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // Filter results to only include movies and TV shows (exclude other media types)
    return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
  } catch (error) {
    // Log and re-throw any errors that occur
    console.error('Error searching media:', error);
    throw new Error('Failed to search media. Please check your API configuration and try again.');
  }
};

/**
 * Get detailed information about a specific movie or TV show
 * @param {string} mediaType - Whether it's a 'movie' or 'tv' show
 * @param {number} id - The unique identifier for the media item
 * @returns {Promise<Object>} - Detailed information about the movie or TV show
 */
export const getMediaDetails = async (mediaType, id) => {
  try {
    validateConfig();
    
    // Make API request to get detailed information about the specific media item
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.status_message || 'Failed to fetch media details');
    }
    
    // Return the parsed JSON response
    return await response.json();
  } catch (error) {
    console.error('Error fetching media details:', error);
    throw new Error('Failed to fetch media details. Please try again later.');
  }
};

/**
 * Get a list of currently popular movies
 * @param {number} page - Which page of results to fetch (default: 1)
 * @returns {Promise<Array>} - Array of popular movies
 */
export const getPopularMovies = async (page = 1) => {
  try {
    validateConfig();
    
    // Make API request to get popular movies
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.status_message || 'Failed to fetch popular movies');
    }
    
    const data = await response.json();
    return data.results;  // Return just the array of movies
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw new Error('Failed to fetch popular movies. Please try again later.');
  }
};

/**
 * Get a list of currently popular TV shows
 * @param {number} page - Which page of results to fetch (default: 1)
 * @returns {Promise<Array>} - Array of popular TV shows
 */
export const getPopularTVShows = async (page = 1) => {
  try {
    validateConfig();
    
    // Make API request to get popular TV shows
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.status_message || 'Failed to fetch popular TV shows');
    }
    
    const data = await response.json();
    return data.results;  // Return just the array of TV shows
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    throw new Error('Failed to fetch popular TV shows. Please try again later.');
  }
};

/**
 * Get videos (trailers, teasers, etc.) for a specific movie or TV show
 * @param {string} mediaType - Whether it's a 'movie' or 'tv' show
 * @param {number} id - The unique identifier for the media item
 * @returns {Promise<Array>} - Array of video objects including trailers
 */
export const getVideos = async (mediaType, id) => {
  try {
    validateConfig();
    
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${id}/videos?api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.status_message || 'Failed to fetch videos');
    }
    
    const data = await response.json();
    // Filter to get only trailers and teasers
    return data.results.filter(video => 
      video.site === 'YouTube' && 
      (video.type === 'Trailer' || video.type === 'Teaser')
    );
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw new Error('Failed to fetch videos. Please try again later.');
  }
};

/**
 * Get recommendations for a specific movie or TV show
 * @param {string} mediaType - Whether it's a 'movie' or 'tv' show
 * @param {number} id - The unique identifier for the media item
 * @param {number} page - Which page of results to fetch (default: 1)
 * @returns {Promise<Array>} - Array of recommended media items
 */
export const getRecommendations = async (mediaType, id, page = 1) => {
  try {
    validateConfig();
    
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${id}/recommendations?api_key=${API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.status_message || 'Failed to fetch recommendations');
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw new Error('Failed to fetch recommendations. Please try again later.');
  }
};

export const getIframeSrc = (mediaData) => {
  const baseUrl = 'https://www.youtube.com/embed/';
  const urlPath = mediaData.key;
  const embedUrl = `${baseUrl}${urlPath}`;
  
  // Remove PiP parameter and keep other essential parameters
  const enhancedUrl = `${embedUrl}?autoplay=1&controls=1&enablejsapi=1&widgetid=1&allowfullscreen=true`;
  
  return enhancedUrl;
};
