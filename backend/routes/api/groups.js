//*====> backend/routes/api/groups.js <====

const express = require("express");
const { Group, GroupImage, User, Membership } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { Sequelize } = require("sequelize");

const router = express.Router();

//^ Get all groups
router.get("/", async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      include: [
        {
          model: GroupImage,
          as: "groupImages",
          attributes: ["id", "url", "preview"],
        },
        {
          model: User,
          as: "organizer",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Membership,
          as: "memberships",
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("memberships.id")),
            "numMembers",
          ],
        ],
        exclude: ["memberships"],
      },
      group: ["Group.id"],
    });
    return res.json(groups);
  } catch (err) {
    next(err);
  }
});

//^ Get groups created or joined by the current user
router.get("/user-groups", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const groups = await Group.findAll({
      include: [
        {
          model: GroupImage,
          as: "groupImages",
          attributes: ["id", "url", "preview"],
        },
        {
          model: User,
          as: "organizer",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Membership,
          where: { userId },
          as: "memberships",
          attributes: [],
        },
      ],
      where: {
        [Sequelize.Op.or]: [
          { organizerId: userId },
          { "$memberships.userId$": userId },
        ],
      },
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("memberships.id")),
            "numMembers",
          ],
        ],
        exclude: ["memberships"],
      },
      group: ["Group.id"],
    });
    return res.json(groups);
  } catch (err) {
    next(err);
  }
});

//^ Get group details by ID
router.get("/user-groups", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const groups = await Group.findAll({
      include: [
        {
          model: GroupImage,
          as: "groupImages",
          attributes: ["id", "url", "preview"],
        },
        {
          model: User,
          as: "organizer",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Membership,
          where: { userId },
          as: "memberships",
          attributes: [],
        },
      ],
      where: {
        [Sequelize.Op.or]: [
          { organizerId: userId },
          { "$memberships.userId$": userId },
        ],
      },
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("memberships.id")),
            "numMembers",
          ],
        ],
        exclude: ["memberships"],
      },
      group: ["Group.id"],
    });
    return res.json(groups);
  } catch (err) {
    next(err);
  }
});

//^ Get group details by ID
router.get("/:groupId", async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: GroupImage,
          as: "groupImages",
          attributes: ["id", "url", "preview"],
        },
        {
          model: User,
          as: "organizer",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Membership,
          as: "memberships",
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("memberships.id")),
            "numMembers",
          ],
        ],
        exclude: ["memberships"],
      },
      group: ["Group.id"],
    });
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res.json(group);
  } catch (err) {
    next(err);
  }
});
//^ Create a new group
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { name, about, type, isPrivate, city, state } = req.body;
    const organizerId = req.user.id;

    //^ Validate the request body here as per your requirements

    const newGroup = await Group.create({
      organizerId,
      name,
      about,
      type,
      private: isPrivate,
      city,
      state,
    });

    return res.status(201).json(newGroup);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      //^ Handle validation errors
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }
    next(err);
  }
});

module.exports = router;
