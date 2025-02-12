import { enableFetchMocks, MockResponseInit } from "jest-fetch-mock";
enableFetchMocks();
import fetchMock from "jest-fetch-mock";
import { getPhotoById, getAllAlbums, getAlbumById } from "./api"; 

describe("API Fetch Functions", () => {
  afterEach(() => {
    fetchMock.mockRestore();
    fetchMock.mockClear();
    jest.clearAllMocks();
  });

  it("getPhotoById fetches a photo by ID", async () => {
    const mockPhoto = {
      id: "1",
      title: "Test Photo",
      url: "http://example.com/photo.jpg",
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockPhoto));

    const result = await getPhotoById("1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual([mockPhoto]);
  });

  it("getAllAlbums fetches all albums", async () => {
    const mockAlbums = [
      { id: "1", title: "Album 1" },
      { id: "2", title: "Album 2" },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockAlbums));

    const result = await getAllAlbums();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockAlbums);
  });

  it("getAlbumById fetches an album by ID", async () => {
    const mockPhotos = [
      { id: "1", title: "Photo 1" },
      { id: "2", title: "Photo 2" },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockPhotos));

    const result = await getAlbumById("1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockPhotos);
  });

  it("fetch functions throw an error when response is not ok", async () => {
    fetchMock.mockResponseOnce("", { status: 404, statusText: "Not Found" });

    await expect(getPhotoById("999")).rejects.toThrow("Failed to fetch");
  });
});
