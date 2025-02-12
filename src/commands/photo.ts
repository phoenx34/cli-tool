import { Flags, Command } from "@oclif/core";
import { getPhotoById } from "../utils/api";
import TtyTable from "tty-table";
import { TABLE_HEADERS } from "../globals";
import { Photo } from "../types/types";

export default class GetPhoto extends Command {
  static description: string = 'Get a photo by its ID';
  static aliases: string[] = ['photo'];
  static examples: string[] = [`$ lt-cli photo --id 1` ];
  static strict: boolean = true;

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'ID of the photo',
      required: true,
    }),
  };

  async run() {
    const { flags } = await this.parse(GetPhoto);

    const photoData: Photo[] = await getPhotoById(flags.id);

    const table = TtyTable(TABLE_HEADERS, photoData);
    this.log(table.render());
  }
}