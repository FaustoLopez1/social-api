const mongoose = require("mongoose");
const { Thought, User } = require("../models");

// Aggregate function to get the number of thoughts overall
const thoughtCount = async () =>
  Thought.aggregate()
    .count("thoughtCount")
    .then((numberOfThoughts) => numberOfThoughts);

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .then(async (thoughts) => {
        const thoughtObj = {
          thoughts,
          thoughtCount: await thoughtCount(),
        };
        return res.json(thoughtObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single thought
  getSinglethought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then(async (Thoughts) =>
        !Thought
          ? res.status(404).json({ message: "No Thoughts with that ID" })
          : res.json({
              Thought,
              grade: await grade(req.params.thoughtId),
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((Thought) => res.json(Thought))
      .catch((err) => res.status(500).json(err));
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((updatedThought) => {
        if (!updatedThought) {
          return res.status(404).json({ message: "No thought with this ID!" });
        }
        res.json(updatedThought);
      })
      .catch((err) => res.json(err));
  },

  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((Thoughts) =>
        !Thought
          ? res.status(404).json({ message: "No such thought exists" })
          : User.findOneAndUpdate(
              { thought: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Thoughts deleted, but no user found",
            })
          : res.json({ message: "Thoughts successfully deleted" })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add an assignment to a thought
  addReaction(req, res) {
    console.log("You are adding an assignment");
    console.log(req.body);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((Thought) =>
        !Thought
          ? res
              .status(404)
              .json({ message: "No thoughts found with that ID :(" })
          : res.json(Thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove assignment from a thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reaction: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((Thought) =>
        !Thoughts
          ? res
              .status(404)
              .json({ message: "No thoughts found with that ID :(" })
          : res.json(Thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = thoughtController;
