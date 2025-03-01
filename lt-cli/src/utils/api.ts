import { BASE_URL, HEADERS } from "../globals";
import { Album, Photo } from "../types/types";

// should add type-guarding

// Reusable fetchData method using generic types
const fetchData = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, { headers: HEADERS });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${BASE_URL}${endpoint}: ${response.statusText}`);
  }
  return await response.json() as T;
}

// API fetch functions
export const getPhotoById = async (photoId: string) => [await fetchData<Photo>(`/photos/${photoId}`)];
export const getAllAlbums = async () => await fetchData<Album[]>(`/albums`);
export const getAlbumById = async (albumId: string) => await fetchData<Photo[]>(`/albums/${albumId}`);

export const getPhotoByIdAWS = async (photoId: string, url: string) => {
  const response = await fetch(`${url}?photoId=${photoId}`, {headers: HEADERS });
   if (!response.ok) {
     throw new Error(
       `Failed to fetch ${url}?photoId=${photoId}: ${response.statusText}`
     );
   }
   return [(await response.json())] as Photo[];
}