import { Flags, Command } from "@oclif/core";
import { getAllAlbums, getPhotoById } from "../utils/api";
import TtyTable from "tty-table";
import { TABLE_HEADERS } from "../globals";
import { Album, Photo } from "../types/types";

export default class GetPhoto extends Command {
  static description: string = 'Get a photo by its ID';
  static aliases: string[] = ['photo'];
  static examples: string[] = [`$ lt-cli photo --id 1` ];
  static strict: boolean = true;

  static flags = {
    id: Flags.string({
      description: 'ID of the photo',
      required: false,
    }),
    name: Flags.string({
      description: 'Name of photo or keyword in name of photo',
      required: false,
    })
  };

  async run() {
    const { flags } = await this.parse(GetPhoto);

    if (flags.id) { // Fetch the photo data by ID
      const photoData: Photo[] = await getPhotoById(flags.id);
      // Render the table with the provided photo data
      const table = TtyTable(TABLE_HEADERS, photoData);
      this.log(table.render());
    } else if (flags.name) { // Fetch the photo(s) data by name or keyword in name

      const albums: Album[] = await getAllAlbums();

      const photoData: Photo[] = albums.reduce((photoGroups: Photo[], album: Album) => {
        const photos = album.photos.filter((photo: Photo) => photo.title.toLowerCase().includes(flags.name!.toLowerCase()));
        return photoGroups.concat(photos);
      }, []);
      
      const table = TtyTable(TABLE_HEADERS, photoData);
      this.log(table.render());
      return;
    } else {
      this.error('Please provide a photo ID or name');
    }
  }
}