const express = require("express");
const { Group, Membership, EventImage, Event } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

//^ Delete an existing image for an Event
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const imageId = parseInt(req.params.imageId, 10);
  const userId = req.user.id;

  try {
    const eventImage = await EventImage.findByPk(imageId, {
      include: {
        model: Event,
        as: "event",
        include: {
          model: Group,
          as: "group",
        },
      },
    });

    if (!eventImage) {
      return res.status(404).json({ message: "Event Image couldn't be found" });
    }

    const group = eventImage.event.group;
    if (group.organizerId !== userId) {
      const isCoHost = await Membership.findOne({
        where: {
          groupId: group.id,
          userId: userId,
          status: "co-host",
        },
      });

      if (!isCoHost) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this image" });
      }
    }

    await eventImage.destroy();
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
