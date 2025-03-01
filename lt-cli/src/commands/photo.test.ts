import { Command } from "@oclif/core";
import { getAllAlbums, getPhotoById, getPhotoByIdAWS } from "../utils/api";
import Photo from "./photo";

jest.mock("../utils/api", () => ({
  getPhotoById: jest.fn(),
  getPhotoByIdAWS: jest.fn(),
  getAllAlbums: jest.fn(),
}));

describe("Photo Command", () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(Command.prototype, "log");
  });

  afterEach(() => {
    jest.resetAllMocks();
    logSpy.mockRestore();
  });

  test("should display a photo by ID", async () => {
    (getPhotoByIdAWS as jest.Mock).mockResolvedValue([
      { id: 1, title: "Photo 1" },
    ]);

    await Photo.run(["--id", "1"]);

    expect(getPhotoByIdAWS).toHaveBeenCalledWith(
      "1",
      "https://47te1d90p7.execute-api.us-east-2.amazonaws.com/prod"
    );
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Photo 1")
    );
  });

  it("should display an error message if no ID is provided", async () => {
    await expect(Photo.run([])).rejects.toThrow("Please provide a photo ID or name");
  });

  it("should display a photo by Name", async () => {
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

    await Photo.run(["--name", "Photo 1"]);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Photo 1")
    );
  });
});