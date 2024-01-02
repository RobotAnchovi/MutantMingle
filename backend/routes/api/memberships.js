//*====> backend/routes/api/memberships.js <====
const express = require("express");
const { Group, User, Membership } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

//^ Get all members of a group
router.get("/groups/:groupId/members", async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    //^ Determine if the current user is the organizer or a co-host
    const currentUserId = req.user?.id;
    const isOrganizerOrCoHost = await Membership.findOne({
      where: {
        groupId,
        userId: currentUserId,
        status: ["organizer", "co-host"],
      },
    });

    //^ Fetch members based on the role of the current user
    const members = await User.findAll({
      include: {
        model: Membership,
        where: isOrganizerOrCoHost
          ? {}
          : { status: { [Sequelize.Op.ne]: "pending" } },
        attributes: ["status"],
        as: "Membership",
        required: true,
      },
      where: { "$Membership.groupId$": groupId },
      attributes: ["id", "firstName", "lastName"],
    });

    return res.json({ Members: members });
  } catch (err) {
    next(err);
  }
});

//^ Request a membership for a group
router.post(
  "/groups/:groupId/membership",
  requireAuth,
  async (req, res, next) => {
    try {
      const groupId = parseInt(req.params.groupId, 10);
      const userId = req.user.id;

      //^ Check if the group exists
      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }

      //^ Check if the user already has a membership (pending or accepted)
      const existingMembership = await Membership.findOne({
        where: {
          groupId,
          userId,
        },
      });

      if (existingMembership) {
        if (existingMembership.status === "pending") {
          return res
            .status(400)
            .json({ message: "Membership has already been requested" });
        }
        return res
          .status(400)
          .json({ message: "User is already a member of the group" });
      }

      //^ Create new membership request
      const newMembership = await Membership.create({
        userId,
        groupId,
        status: "pending",
      });

      return res.status(200).json({
        memberId: newMembership.userId,
        status: newMembership.status,
      });
    } catch (err) {
      next(err);
    }
  }
);
//^ Change the status of a membership
router.put(
  "/groups/:groupId/membership",
  requireAuth,
  async (req, res, next) => {
    try {
      const groupId = parseInt(req.params.groupId, 10);
      const { memberId, status } = req.body;
      const userId = req.user.id;

      //^ Check if the status is pending
      if (status === "pending") {
        return res.status(400).json({
          message: "Bad Request",
          errors: { status: "Cannot change a membership status to pending" },
        });
      }

      //^ Check if the group exists
      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }

      //^ Check if the user to change membership for exists
      const user = await User.findByPk(memberId);
      if (!user) {
        return res.status(404).json({ message: "User couldn't be found" });
      }

      //^ Check if the membership exists
      const membership = await Membership.findOne({
        where: {
          groupId,
          userId: memberId,
        },
      });
      if (!membership) {
        return res.status(404).json({
          message: "Membership between the user and the group does not exist",
        });
      }

      //~ Authorization checks
      const isOrganizer = userId === group.organizerId;
      if (status === "member" && !isOrganizer) {
        //^ Check if current user is a co-host if they are not the organizer
        const coHostMembership = await Membership.findOne({
          where: {
            groupId,
            userId,
            status: "co-host",
          },
        });
        if (!coHostMembership) {
          return res.status(403).json({ message: "Forbidden" });
        }
      } else if (status === "co-host" && !isOrganizer) {
        return res.status(403).json({
          message: "Only the organizer can change a member to a co-host",
        });
      }

      //^ Update the membership status
      membership.status = status;
      await membership.save();

      return res.status(200).json(membership);
    } catch (err) {
      next(err);
    }
  }
);
//^ Delete membership to a group
router.delete(
  "/groups/:groupId/membership/:memberId",
  requireAuth,
  async (req, res, next) => {
    try {
      const groupId = parseInt(req.params.groupId, 10);
      const memberId = parseInt(req.params.memberId, 10);
      const userId = req.user.id;

      //^ Check if the group exists
      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }

      //^ Check if the user to delete membership for exists
      const user = await User.findByPk(memberId);
      if (!user) {
        return res.status(404).json({ message: "User couldn't be found" });
      }

      //^ Authorization check: user must be the organizer or the user themselves
      if (userId !== group.organizerId && userId !== memberId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      //^ Check if the membership exists
      const membership = await Membership.findOne({
        where: { groupId, userId: memberId },
      });
      if (!membership) {
        return res
          .status(404)
          .json({ message: "Membership does not exist for this User" });
      }

      //^ Delete the membership
      await membership.destroy();

      return res
        .status(200)
        .json({ message: "Successfully deleted membership from group" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
