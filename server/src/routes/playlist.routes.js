import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylistDetails,
  getPlaylistDetails,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.get("/", authMiddleware, getAllPlaylistDetails);
playlistRouter.get("/:id", authMiddleware, getPlaylistDetails);
playlistRouter.post("/create-playlist", authMiddleware, createPlaylist);
playlistRouter.post("/:id/add-problem", authMiddleware, addProblemToPlaylist);
playlistRouter.delete("/:id", authMiddleware, deletePlaylist);
playlistRouter.delete(
  "/:id/remove-problem",
  authMiddleware,
  removeProblemFromPlaylist,
);

export default playlistRouter;
