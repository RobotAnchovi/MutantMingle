//*====> backend/routes/api/attendees.js <====
const express = require("express");
const {
  Attendance,
  User,
  Event,
  Group,
  Membership,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

//* Get all Attendees of an Event
router.get("/events/:eventId/attendees", async (req, res, next) => {
  const eventId = parseInt(req.params.eventId, 10);

  try {
    //^ Check if the event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    //^ Fetch attendees
    const attendees = await Attendance.findAll({
      where: { eventId },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    });

    return res.json({ Attendees: attendees });
  } catch (err) {
    next(err);
  }
});

//^ Request to Attend an Event
router.post(
  "/events/:eventId/attendance",
  requireAuth,
  async (req, res, next) => {
    const eventId = parseInt(req.params.eventId, 10);
    const userId = req.user.id;

    try {
      //^ Check if the event exists
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }
      //^ Check if the user is already an attendee or has a pending request
      const existingAttendance = await Attendance.findOne({
        where: { eventId, userId },
      });
      if (existingAttendance) {
        return res
          .status(400)
          .json({ message: "Attendance has already been requested or exists" });
      }
      //^ Create attendance request
      const newAttendance = await Attendance.create({
        eventId,
        userId,
        status: "pending",
      });

      return res.status(201).json({
        userId: newAttendance.userId,
        status: newAttendance.status,
      });
    } catch (err) {
      next(err);
    }
  }
);

//^ Change the status of an attendance
router.put(
  "/events/:eventId/attendance",
  requireAuth,
  async (req, res, next) => {
    const eventId = parseInt(req.params.eventId, 10);
    const { userId, status } = req.body;
    const currentUserId = req.user.id;

    try {
      //^ Check if the event exists
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }

      //^ Check if the current user is the organizer or a co-host of the group
      const group = await Group.findByPk(event.groupId);
      if (group.organizerId !== currentUserId) {
        //^ Check if the current user is a co-host
        const isCoHost = await Membership.findOne({
          where: {
            groupId: group.id,
            userId: currentUserId,
            status: "co-host",
          },
        });
        if (!isCoHost) {
          return res
            .status(403)
            .json({ message: "Not authorized to change attendance status" });
        }
      }

      //^ Check if the attendance exists
      const attendance = await Attendance.findOne({
        where: { eventId, userId },
      });
      if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" });
      }

      //^ Update attendance status
      attendance.status = status;
      await attendance.save();

      return res.json({
        id: attendance.id,
        eventId: attendance.eventId,
        userId: attendance.userId,
        status: attendance.status,
      });
    } catch (err) {
      next(err);
    }
  }
);

//^ Delete attendance to an event
router.delete(
  "/events/:eventId/attendance/:userId",
  requireAuth,
  async (req, res, next) => {
    const eventId = parseInt(req.params.eventId, 10);
    const userId = parseInt(req.params.userId, 10);
    const currentUserId = req.user.id;

    try {
      //^ Check if the event exists
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }

      //^ Check if the current user has authorization (either organizer or the user itself)
      const group = await Group.findByPk(event.groupId);
      if (group.organizerId !== currentUserId && userId !== currentUserId) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this attendance" });
      }

      //^ Check and delete the attendance record
      const attendance = await Attendance.findOne({
        where: { eventId, userId },
      });
      if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" });
      }
      await attendance.destroy();

      return res.json({
        message: "Successfully deleted attendance from event",
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
