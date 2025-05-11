import { db } from "../lib/db.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.id;

  const existingPlaylist = await db.playlist.findUnique({
    where: {
      name,
      userId,
    },
  });

  if (existingPlaylist) {
    throw new ApiError(400, "Playlist already exists");
  }

  const playlist = await db.playlist.create({
    data: {
      name,
      description,
      userId,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { playlist }, "Playlist Created"));
});

export const getAllPlaylistDetails = asyncHandler(async (req, res) => {
  const playlists = await db.playlist.findMany({
    where: {
      userId: req.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlists) {
    throw new ApiError(404, `No playlist found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { playlists }, "Playlist Fetched Successfully"));
});

export const getPlaylistDetails = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;

  const playlist = await db.playlist.findUnique({
    where: {
      id: playlistId,
      userId: req.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlist) {
    throw new ApiError(404, `No playlist with id ${playlistId} found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "Playlist Fetched Successfully"));
});

export const addProblemToPlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;
  const { problemIds } = req.body;

  if (!Array.isArray(problemIds) || problemIds.length) {
    throw new ApiError(400, "Invalid problem ids");
  }

  const problemsInPlaylist = await db.problemInPlaylist.createMany({
    data: problemIds.map((problemId) => ({
      playlistId,
      problemId,
    })),
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, { problemsInPlaylist }, "Problem Added In Playlist"),
    );
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;

  const playlist = await db.playlist.delete({
    where: {
      id: playlistId,
      userId: req.id,
    },
  });

  if (!playlist) {
    throw new ApiError(404, `No playlist with id ${playlistId} found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "Playlist Deleted Successfully"));
});

export const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;
  const { problemIds } = req.body;

  if (!Array.isArray(problemIds) || problemIds.length) {
    throw new ApiError(400, "Invalid problem ids");
  }

  const problemsInPlaylist = await db.problemInPlaylist.deleteMany({
    where: {
      playlistId,
      problemId: {
        in: problemIds,
      },
    },
  });

  if (!problemsInPlaylist) {
    throw new ApiError(404, `No playlist with id ${playlistId} found`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { problemsInPlaylist },
        "Problem Removed From Playlist",
      ),
    );
});
