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

//^ PUT route to update an existing venue
router.put("/venues/:venueId", requireAuth, async (req, res, next) => {
  const { venueId } = req.params;
  const { address, city, state, lat, lng } = req.body;
  const userId = req.user.id;

  try {
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue couldn't be found" });
    }

    //^ Check if the user is part of the group and has the correct role
    const group = await Group.findByPk(venue.groupId);
    if (group.organizerId !== userId) {
      const membership = await Membership.findOne({
        where: { groupId: venue.groupId, userId, status: "co-host" },
      });
      if (!membership) {
        return res
          .status(403)
          .json({ message: "User is not authorized to edit this venue" });
      }
    }

    //^ Validation for the input fields
    if (!address || !city || !state || isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          address: "Street address is required",
          city: "City is required",
          state: "State is required",
          lat: "Latitude must be within -90 and 90",
          lng: "Longitude must be within -180 and 180",
        },
      });
    }

    //^ Update venue details
    venue.address = address;
    venue.city = city;
    venue.state = state;
    venue.lat = lat;
    venue.lng = lng;
    await venue.save();

    return res.json(venue);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
