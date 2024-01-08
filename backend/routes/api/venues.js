const express = require("express");
const {
  Group,
  GroupImage,
  User,
  Membership,
  Venue,
  Attendance,
  Event,
  EventImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { Sequelize } = require("sequelize");

const { check, validationResult } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

//? Define validation checks
const validateVenue = [
  check("address").notEmpty().withMessage("Street address is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("state").notEmpty().withMessage("State is required"),
  check("lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  handleValidationErrors,
];

//~ Edit a Venue specified by its id
router.put("/:venueId", requireAuth, validateVenue, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().reduce((acc, error) => {
      acc[error.param] = error.msg;
      return acc;
    }, {});

    return res
      .status(400)
      .json({ message: "Bad Request", errors: formattedErrors });
  }

  try {
    const venueId = parseInt(req.params.venueId, 10);
    if (isNaN(venueId)) {
      return res.status(400).json({ message: "Invalid venue ID" });
    }

    const { address, city, state, lat, lng } = req.body;
    const userId = req.user.id;

    const venue = await Venue.findByPk(venueId, {
      include: [{ model: Group, as: "group" }],
    });
    if (!venue) {
      return res.status(404).json({ message: "Venue couldn't be found" });
    }

    const group = await Group.findByPk(venue.groupId);
    if (!group) {
      return res
        .status(404)
        .json({ message: "Associated group couldn't be found" });
    }

    //^ Check if the user is the organizer or a co-host
    const isOrganizer = group.organizerId === userId;
    const isCoHost = await Membership.findOne({
      where: { groupId: group.id, userId, status: "co-host" },
    });

    if (!isOrganizer && !isCoHost) {
      return res
        .status(403)
        .json({ message: "You don't have permission to edit this venue." });
    }

    // const updatedVenue = await venue.update({ address, city, state, lat, lng });

    // //^ response object
    // const responseVenue = {
    //   id: updatedVenue.id,
    //   groupId: updatedVenue.groupId,
    //   address: updatedVenue.address,
    //   city: updatedVenue.city,
    //   state: updatedVenue.state,
    //   lat: updatedVenue.lat,
    //   lng: updatedVenue.lng,
    // };
    //^ Convert lat and lng to floating point numbers
    const latitude = parseFloat(req.body.lat);
    const longitude = parseFloat(req.body.lng);

    const updatedVenue = await venue.update({
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      lat: latitude,
      lng: longitude,
    });

    //^ Ensure lat and lng in response are numbers
    const responseVenue = {
      id: updatedVenue.id,
      groupId: updatedVenue.groupId,
      address: updatedVenue.address,
      city: updatedVenue.city,
      state: updatedVenue.state,
      lat: parseFloat(updatedVenue.lat),
      lng: parseFloat(updatedVenue.lng),
    };
    res.status(200).json(responseVenue);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
