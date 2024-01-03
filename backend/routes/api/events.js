//*====> backend/routes/api/events.js <====
const express = require("express");
const { Event, Group, Venue, EventImage, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { Sequelize } = require("sequelize");

const router = express.Router();

//^ Get all Events
router.get("/events", async (req, res, next) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: Group,
          attributes: ["id", "name", "city", "state"],
        },
        {
          model: Venue,
          attributes: ["id", "city", "state"],
        },
        {
          model: EventImage,
          as: "eventImages",
          attributes: ["id", "url", "preview"],
        },
      ],
      attributes: [
        "id",
        "groupId",
        "venueId",
        "name",
        "type",
        "startDate",
        "endDate",
      ],
    });
    return res.status(200).json({ Events: events });
  } catch (err) {
    next(err);
  }
});

//^ Get all Events of a Group by Group ID
router.get("/groups/:groupId/events", async (req, res, next) => {
  const groupId = parseInt(req.params.groupId, 10);
  try {
    const events = await Event.findAll({
      where: { groupId },
      include: [
        {
          model: Group,
          attributes: ["id", "name", "city", "state"],
        },
        {
          model: Venue,
          attributes: ["id", "city", "state"],
        },
        {
          model: EventImage,
          as: "eventImages",
          attributes: ["id", "url", "preview"],
        },
      ],
      attributes: [
        "id",
        "groupId",
        "venueId",
        "name",
        "type",
        "startDate",
        "endDate",
        [Sequelize.fn("COUNT", Sequelize.col("Event.id")), "numAttending"],
        "previewImage",
      ],
      group: ["Event.id"],
    });
    return res.status(200).json({ Events: events });
  } catch (err) {
    if (!groupId) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }
    next(err);
  }
});

//^ Get Event details by Event ID
router.get("/:eventId", async (req, res, next) => {
  const eventId = parseInt(req.params.eventId, 10);
  try {
    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: Group,
          attributes: ["id", "name", "private", "city", "state"],
        },
        {
          model: Venue,
          attributes: ["id", "address", "city", "state", "lat", "lng"],
        },
        {
          model: EventImage,
          as: "eventImages",
          attributes: ["id", "url", "preview"],
        },
      ],
      attributes: [
        "id",
        "groupId",
        "venueId",
        "name",
        "description",
        "type",
        "capacity",
        "price",
        "startDate",
        "endDate",
        [Sequelize.fn("COUNT", Sequelize.col("Event.id")), "numAttending"],
      ],
      group: ["Event.id"],
    });
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }
    return res.status(200).json(event);
  } catch (err) {
    next(err);
  }
});

//^ Create an Event for a Group by Group ID
router.post("/groups/:groupId/events", requireAuth, async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;
    const userId = req.user.id;

    //~ Authorization check logic here
    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: Membership,
          as: "memberships",
          where: { userId },
          required: false,
        },
      ],
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    //^ Check if the user is the organizer of the group or a co-host
    if (
      group.organizerId !== userId &&
      !group.memberships.some((membership) => membership.status === "co-host")
    ) {
      return res.status(403).json({
        message: "User is not authorized to create an event for this group",
      });
    }

    const newEvent = await Event.create({
      groupId,
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });

    return res.status(201).json(newEvent);
  } catch (err) {
    next(err);
  }
});
//^ Add an Image to an Event based on the Event's ID
router.post("/:eventId/images", requireAuth, async (req, res, next) => {
  const eventId = parseInt(req.params.eventId, 10);
  const { url, preview } = req.body;
  const userId = req.user.id;

  try {
    //^ Check if the event exists and if the user is authorized
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }
    //~ Authorization check logic here
    if (event.group.organizerId !== userId && !event.group.memberships.length) {
      return res.status(403).json({
        message: "User is not authorized to add images to this event",
      });
    }
    const newImage = await EventImage.create({
      eventId,
      url,
      preview,
    });

    return res.status(201).json(newImage);
  } catch (err) {
    next(err);
  }
});

//^ Edit an Event specified by its ID
router.put("/:eventId", requireAuth, async (req, res, next) => {
  const eventId = parseInt(req.params.eventId, 10);
  const {
    venueId,
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate,
  } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }
    //~ Authorization check logic here
    if (event.group.organizerId !== userId) {
      return res
        .status(403)
        .json({ message: "User is not authorized to edit this event" });
    }

    event.set({
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });
    await event.save();

    return res.status(200).json(event);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
    }
    next(err);
  }
});

//^ Delete an Event specified by its ID
router.delete("/:eventId", requireAuth, async (req, res, next) => {
  const eventId = parseInt(req.params.eventId, 10);
  const userId = req.user.id;

  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }
    //~ Authorization check logic here
    if (event.group.organizerId !== userId) {
      return res
        .status(403)
        .json({ message: "User is not authorized to delete this event" });
    }

    await event.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
