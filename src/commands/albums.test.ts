import { getAlbumById, getAllAlbums } from "../utils/api";
import Albums from "./albums";
import { TABLE_HEADERS } from "../globals";
import TtyTable from "tty-table";
import { Command } from "@oclif/core";

// Mock the API functions
jest.mock("../utils/api", () => ({
  getAlbumById: jest.fn(),
  getAllAlbums: jest.fn(),
}));

describe("Albums Command", () => {
  let consoleLogSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(Command.prototype, "log");
  });

  afterEach(() => {
    jest.resetAllMocks();
    logSpy.mockRestore();
  });

  test("should display all albums when no id is provided", async () => {
    (getAllAlbums as jest.Mock).mockResolvedValue([
      {
        albumId: 1,
        photos: [
          { photoId: 1, title: "Photo 1" },
          { photoId: 2, title: "Photo 2" },
        ],
      },
      { albumId: 2, photos: [{ photoId: 3, title: "Photo 3" }] },
    ]);
    
    await Albums.run([]);

    expect(getAllAlbums).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledTimes(4);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("--------------Album 1-----------------")
    );
  });

  test("should display photos for a specific album when id is provided", async () => {
    (getAlbumById as jest.Mock).mockResolvedValue([
      { albumId: 1, photoId: 1, title: "Photo 1" },
      { albumId: 1, photoId: 2, title: "Photo 2" },
    ]);

    // const logSpy = jest.spyOn(Command.prototype, "log");
    await Albums.run(["--id", "1"]);

    expect(getAlbumById).toHaveBeenCalledWith("1");
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("--------------Album 1-----------------")
    );
  });

  test("should display a table with photos", async () => {
    (getAlbumById as jest.Mock).mockResolvedValue([
      { albumId: 1, photoId: 1, title: "Photo 1" },
      { albumId: 1, photoId: 2, title: "Photo 2" },
    ]);

    // const logSpy = jest.spyOn(Command.prototype, "log");
    await Albums.run(["--id", "1"]);

    const expectedTable = TtyTable(TABLE_HEADERS, [
      { albumId: 1, photoId: 1, title: "Photo 1" },
      { albumId: 1, photoId: 2, title: "Photo 2" },
    ]).render();

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(expectedTable)
    );
  });
});
