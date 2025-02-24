export interface Photo {
  photoId: number;
  title: string;
  albumId: number;
  url: string;
}

export interface Album {
  albumId: number, 
  photos: Photo[]
}
