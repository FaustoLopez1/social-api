const router = require("express").Router();
const {
  getAllThoughts,
  getSinglethought,
  createThought,
  updateThought,
  addReaction,
  removeReaction,
  deleteThought,
} = require("../../controllers/thoughtController.js");

router.route("/").get(getAllThoughts).post(createThought);

router
  .route("/:id")
  .get(getSinglethought)
  .put(updateThought)
  .delete(deleteThought);

router.route("/:thoughtId/:reactionId").delete(removeReaction);
router.route("/:thoughtId/reactions").post(addReaction);

module.exports = router;
