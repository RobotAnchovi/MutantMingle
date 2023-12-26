//*====> backend/routes/api/groups.js <====

const express = require("express");
const { Group, GroupImage, User, Membership } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

//^ Get all groups
router.get("/", async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      include: [
        { model: GroupImage, attributes: ["id", "url", "preview"] },
        {
          model: User,
          as: "Organizer",
          attributes: ["id", "firstName", "lastName"],
        },
        //^ Include logic for numMembers if needed
      ],
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
      //^ Add logic to filter groups based on the user's membership or ownership
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
        { model: GroupImage },
        {
          model: User,
          as: "Organizer",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res.json(group);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
