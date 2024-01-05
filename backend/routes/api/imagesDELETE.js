//*====> backend/routes/api/images.js <====
const express = require("express");
const { GroupImage, EventImage, Group, Event } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

router.delete("/group-images/:imageId", requireAuth, async (req, res, next) => {
  const imageId = parseInt(req.params.imageId, 10);
  const userId = req.user.id;

  try {
    const groupImage = await GroupImage.findByPk(imageId, {
      include: {
        model: Group,
        as: "group",
      },
    });

    if (!groupImage) {
      return res.status(404).json({ message: "Group Image couldn't be found" });
    }

    //^ Authorization check: Ensure user is organizer or co-host
    const group = groupImage.group;
    if (group.organizerId !== userId) {
      //^ Check if the user is a co-host
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

    await groupImage.destroy();
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

//^ Delete an existing image for an Event
router.delete("/event-images/:imageId", requireAuth, async (req, res, next) => {
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

    //^ Authorization check: Ensure user is organizer or co-host of the Group that the Event belongs to
    const group = eventImage.event.group;
    if (group.organizerId !== userId) {
      //^ Check if the user is a co-host
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

//^ Return events filtered by query parameters
router.get("/events", async (req, res, next) => {
  const { page = 1, size = 20, name, type, startDate } = req.query;

  //^ Validate query parameters
  if (page < 1 || page > 10 || size < 1 || size > 20) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        page: "Page must be greater than or equal to 1 and less than or equal to 10",
        size: "Size must be greater than or equal to 1 and less than or equal to 20",
      },
    });
  }
  if (name && typeof name !== "string") {
    return res.status(400).json({
      message: "Bad Request",
      errors: { name: "Name must be a string" },
    });
  }
  if (type && !["Online", "In Person"].includes(type)) {
    return res.status(400).json({
      message: "Bad Request",
      errors: { type: "Type must be 'Online' or 'In Person'" },
    });
  }
  if (startDate && isNaN(Date.parse(startDate))) {
    return res.status(400).json({
      message: "Bad Request",
      errors: { startDate: "Start date must be a valid datetime" },
    });
  }

  try {
    const where = {};
    if (name) where.name = { [Sequelize.Op.like]: `%${name}%` };
    if (type) where.type = type;
    if (startDate)
      where.startDate = { [Sequelize.Op.gte]: new Date(startDate) };

    //^ Pagination logic
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    const events = await Event.findAll({
      where,
      limit,
      offset,
      include: [
        {
          model: Group,
          as: "group",
          attributes: ["id", "name", "city", "state"],
        },
        { model: Venue, as: "venue", attributes: ["id", "city", "state"] },
      ],
    });

    return res.status(200).json({ Events: events });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
