//*====> backend/routes/api/venues.js <====
const express = require("express");
const { Venue, Group, Membership } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

//^ Get all venues for a specific group by group ID
router.get("/groups/:groupId/venues", requireAuth, async (req, res, next) => {
  const { groupId } = req.params;

  try {
    //^ Check if the user is part of the group
    const userMembership = await Membership.findOne({
      where: { groupId, userId: req.user.id },
    });
    if (!userMembership) {
      return res.status(403).json({ message: "User is not authorized" });
    }

    const venues = await Venue.findAll({
      where: { groupId },
    });
    return res.json({ Venues: venues });
  } catch (err) {
    next(err);
  }
});

//^ Create a new venue for a specific group
router.post("/groups/:groupId/venues", requireAuth, async (req, res, next) => {
  const { groupId } = req.params;
  const { address, city, state, lat, lng } = req.body;

  try {
    //^ Check if the user is part of the group
    const userMembership = await Membership.findOne({
      where: { groupId, userId: req.user.id },
    });
    if (!userMembership) {
      return res.status(403).json({ message: "User is not authorized" });
    }

    const newVenue = await Venue.create({
      groupId,
      address,
      city,
      state,
      lat,
      lng,
    });

    return res.status(201).json(newVenue);
  } catch (err) {
    next(err);
  }
});

//^ Edit a venue by venue ID
router.put("/venues/:venueId", requireAuth, async (req, res, next) => {
  const { venueId } = req.params;
  const { address, city, state, lat, lng } = req.body;

  try {
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue couldn't be found" });
    }

    //^ Check if the user is part of the group
    const userMembership = await Membership.findOne({
      where: { groupId: venue.groupId, userId: req.user.id },
    });
    if (!userMembership) {
      return res.status(403).json({ message: "User is not authorized" });
    }

    venue.update({
      address,
      city,
      state,
      lat,
      lng,
    });

    return res.json(venue);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
