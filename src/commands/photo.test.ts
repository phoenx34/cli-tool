import { Command } from "@oclif/core";
import { getPhotoById } from "../utils/api";
import Photo from "./photo";

jest.mock("../utils/api", () => ({
  getPhotoById: jest.fn(),
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
    (getPhotoById as jest.Mock).mockResolvedValue([
      { id: 1, title: "Photo 1" },
    ]);

    await Photo.run(["--id", "1"]);

    expect(getPhotoById).toHaveBeenCalledWith("1");
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Photo 1")
    );
  });
});