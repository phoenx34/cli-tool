import { Flags, Command } from "@oclif/core";
import { getAlbumById, getAllAlbums } from "../utils/api";
import TtyTable from "tty-table";
import { TABLE_HEADERS } from "../globals";
import { Album, Photo } from "../types/types";

export default class Albums extends Command {
  static description: string = "Get a photo by its ID";
  static aliases: string[] = ["albums"];
  static examples: string[] = [`$ lt-cli albums --sort=albumId`];
  static strict: boolean = true;

  static flags = {
    id: Flags.string({
      char: "i",
      description: "ID of the album",
      required: false,
    }),
  };

  async run() {
    const { flags } = await this.parse(Albums);

    // Render the table with the provided photos once they are fetched
    const renderTable = (photos: Photo[]) => this.log(TtyTable(TABLE_HEADERS, photos).render());

    if (flags.id) {
      // If ID is provided, grab photos in the album sorted by photoId
      const photos: Photo[] = await getAlbumById(flags.id);
      this.log(`\n--------------Album ${photos[0].albumId}-----------------`);
      renderTable(photos.sort((a, b) => a.photoId - b.photoId)); 
    } else {
      // Else grab all albums and photos and sort them by albumId
      const albums: Album[] = await getAllAlbums();
      albums
        .sort((a, b) => a.albumId - b.albumId) 
        .forEach((album) => {
          this.log(`\n--------------Album ${album.albumId}-----------------`);
          renderTable(album.photos.sort((a, b) => a.photoId - b.photoId)); 
        });
    }
  }
}