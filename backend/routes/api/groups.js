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
const { Sequelize, Op } = require("sequelize");

const { check, validationResult } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// Define validation checks
const validateGroup = [
  check("name")
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check("about")
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("private").isBoolean().withMessage("Private must be a boolean"),
  check("city").notEmpty().withMessage("City is required"),
  check("state").notEmpty().withMessage("State is required"),
  handleValidationErrors,
];

// Validation middleware for creating an event
const validateEvent = [
  check("name")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .isIn(["Online", "In person"])
    .withMessage("Type must be Online or In person"),
  check("capacity").isInt().withMessage("Capacity must be an integer"),
  check("price").isFloat().withMessage("Price is invalid"),
  check("description").notEmpty().withMessage("Description is required"),
  check("startDate")
    .toDate()
    .isAfter(new Date().toString())
    .withMessage("Start date must be set in the future"),
  check("endDate")
    .toDate()
    .custom((value, { req }) => new Date(value) > new Date(req.body.startDate))
    .withMessage("End date must be after start date"),
  handleValidationErrors,
];

// validation checks for venue stuff
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

router.post("/", requireAuth, validateGroup, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
        .array()
        .reduce((acc, error) => ({ ...acc, [error.param]: error.msg }), {}),
    });
  }

  try {
    const { name, about, type, private, city, state } = req.body;
    const organizerId = req.user.id;

    const group = await Group.create({
      organizerId,
      name,
      about,
      type,
      private,
      city,
      state,
    });

    res.status(201);

    return res.json(group);
  } catch (err) {
    if (
      err.name === "SequelizeValidationError" ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      res.status(400);
      return res.json({
        message: "Validation error",
        errors: err.errors.map((e) => e.message),
      });
    }
    next(err);
  }
});

//^ Get all groups
router.get("/", async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      include: [
        {
          model: GroupImage,
          as: "groupImages",
        },
        {
          model: Membership,
          as: "memberships",
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
      group: ["Group.id", "memberships.id", "groupImages.id"],
    });

    let groupList = [];

    groups.forEach((group) => {
      groupList.push(group.toJSON());
    });

    groupList.forEach((group) => {
      group.groupImages.forEach((image) => {
        if (image.preview === true) {
          group.previewImage = image.url;
        }
      });

      if (!group.previewImage) {
        group.previewImage = "No preview image found.";
      }

      delete group.groupImages;
      delete group.memberships;
    });

    return res.json({ Groups: groupList });
  } catch (err) {
    next(err);
  }
});

// Route to get all groups joined or organized by the current user
router.get("/current", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const groups = await Group.findAll({
      where: {
        [Sequelize.Op.or]: [
          { organizerId: userId }, // the user is the organizer of the group
          // OR
          { "$memberships.userId$": userId }, // the user is a member of the group
        ],
      },
      include: [
        {
          model: GroupImage,
          as: "groupImages",
          attributes: ["url"],
          where: { preview: true },
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
      group: ["Group.id", "groupImages.id"],
    });

    const groupList = groups.map((group) => {
      const groupJSON = group.toJSON();
      groupJSON.previewImage = groupJSON.groupImages.length
        ? groupJSON.groupImages[0].url
        : "No preview image found.";
      delete groupJSON.groupImages;
      return groupJSON;
    });

    return res.json({ Groups: groupList });
  } catch (err) {
    next(err);
  }
});

// Route to get details of a group by ID using lazy loading
router.get("/:groupId", async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(groupId)) {
      res.status(400);
      return res.json({ message: "Invalid group ID" });
    }

    // Initially load only the Group model
    const group = await Group.findByPk(groupId);
    if (!group) {
      res.status(404);
      return res.json({ message: "Group couldn't be found" });
    }

    // Lazy load aggregates
    const groupImages = await group.getGroupImages({
      attributes: ["id", "url", "preview"],
    });
    const organizer = await group.getOrganizer({
      attributes: ["id", "firstName", "lastName"],
    });
    const venues = await group.getVenues({
      attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"],
    });
    const memberships = await group.getMemberships();

    // Construct and send response
    const groupJSON = {
      ...group.toJSON(),
      numMembers: memberships.length,
      GroupImages: groupImages.map((gi) => gi.toJSON()),
      Organizer: organizer ? organizer.toJSON() : {},
      Venues: venues.map((v) => v.toJSON()),
    };

    res.status(200);
    return res.json(groupJSON);
  } catch (err) {
    next(err);
  }
});

// Add an Image to a Group based on the Group's id

router.post("/:groupId/images", requireAuth, async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    const { url, preview } = req.body;
    const organizerId = req.user.id;

    // Validate groupId
    if (isNaN(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    // Find the group and verify the current user is the organizer
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    if (group.organizerId !== organizerId) {
      return res.status(403).json({
        message: "You must be the organizer of the group to add images.",
      });
    }

    // Create the new image for the group
    const image = await GroupImage.create({
      groupId,
      url,
      preview,
    });

    // Construct the response object
    const responseImage = {
      id: image.id,
      url: image.url,
      preview: image.preview,
    };

    res.status(201).json(responseImage);
  } catch (err) {
    next(err);
  }
});

// Edit a group
router.put("/:groupId", requireAuth, validateGroup, async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const { name, about, type, private, city, state } = req.body;
    const organizerId = req.user.id;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    if (group.organizerId !== organizerId) {
      return res.status(403).json({
        message: "You must be the organizer of the group to edit it.",
      });
    }

    const updatedGroup = await group.update({
      name,
      about,
      type,
      private,
      city,
      state,
    });

    res.status(200).json({
      id: updatedGroup.id,
      organizerId: updatedGroup.organizerId,
      name: updatedGroup.name,
      about: updatedGroup.about,
      type: updatedGroup.type,
      private: updatedGroup.private,
      city: updatedGroup.city,
      state: updatedGroup.state,
      createdAt: updatedGroup.createdAt,
      updatedAt: updatedGroup.updatedAt,
    });
  } catch (err) {
    next(err);
  }
});

// Delete a group
router.delete("/:groupId", requireAuth, async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const organizerId = req.user.id;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    if (group.organizerId !== organizerId) {
      return res.status(403).json({
        message: "You must be the organizer of the group to delete it.",
      });
    }

    await group.destroy();
    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

// Get All Venues for a Group specified by its id
router.get("/:groupId/venues", requireAuth, async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    let isPrivilegedUser = false;
    if (req.user) {
      const userId = req.user.id;
      isPrivilegedUser =
        group.organizerId === userId ||
        (await Membership.findOne({
          where: { groupId, userId, status: "co-host" },
        })) != null;
    }

    if (!isPrivilegedUser) {
      return res.status(403).json({
        message:
          "You must be the organizer or a co-host of the group to view venues.",
      });
    }

    const venues = await Venue.findAll({ where: { groupId } });
    res.status(200).json({ Venues: venues });
  } catch (err) {
    next(err);
  }
});

// Create a new Venue for a Group specified by its id
router.post(
  "/:groupId/venues",
  requireAuth,
  validateVenue,
  async (req, res, next) => {
    const groupId = parseInt(req.params.groupId, 10);
    try {
      if (isNaN(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
      }

      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }

      let isPrivilegedUser = false;
      if (req.user) {
        const userId = req.user.id;
        isPrivilegedUser =
          group.organizerId === userId || // Check if user is the organizer
          (await Membership.findOne({
            // Check if user is a co-host
            where: { groupId, userId, status: "co-host" },
          })) != null;
      }

      if (!isPrivilegedUser) {
        return res.status(403).json({
          message:
            "You do not have permission to create a venue for this group",
        });
      }

      const { address, city, state, lat, lng } = req.body;

      const newVenue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat,
        lng,
      });

      const responseVenue = {
        id: newVenue.id,
        groupId: newVenue.groupId,
        address: newVenue.address,
        city: newVenue.city,
        state: newVenue.state,
        lat: newVenue.lat,
        lng: newVenue.lng,
      };

      res.status(200).json({ Venues: [responseVenue] });
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        const errors = err.errors.reduce(
          (acc, cur) => ({ ...acc, [cur.path]: cur.message }),
          {}
        );
        return res.status(400).json({ message: "Bad Request", errors });
      }
      next(err);
    }
  }
);

// Get all Events of a Group specified by its id

router.get("/:groupId/events", async (req, res, next) => {
  const groupId = parseInt(req.params.groupId, 10); // Parse groupId from URL params

  // Validate groupId is a number
  if (isNaN(groupId)) {
    return res.status(400).json({ message: "Invalid group ID" });
  }

  try {
    // Check if the group exists
    const groupExists = await Group.findByPk(groupId);
    if (!groupExists) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    // Find all events for the given groupId
    const events = await Event.findAll({
      where: { groupId }, // Filter events by groupId
      include: [
        // Include other models as needed
        {
          model: Group,
          as: "group",
          attributes: ["id", "name", "city", "state"],
        },
        { model: Venue, as: "venue", attributes: ["id", "city", "state"] },
        { model: Attendance, as: "attendances", attributes: [] },
        { model: EventImage, as: "eventImages", attributes: [] },
      ],
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("attendances.id")),
            "numAttending",
          ],
        ],
        exclude: ["attendances"],
      },
      group: ["Event.id", "group.id", "venue.id"],
    });

    // Process each event to add previewImage
    const formattedEvents = events.map((event) => {
      let previewImage = "No preview image found.";
      if (Array.isArray(event.eventImages)) {
        event.eventImages.forEach((image) => {
          if (image.preview === true) {
            previewImage = image.url;
          }
        });
      }

      return {
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        startDate: event.startDate,
        endDate: event.endDate,
        numAttending: event.dataValues.numAttending,
        previewImage,
        Group: event.group,
        Venue: event.venue,
      };
    });

    res.status(200).json({ Events: formattedEvents });
  } catch (err) {
    next(err);
  }
});

// Create an event for a group
router.post(
  "/:groupId/events",
  requireAuth,
  validateEvent,
  async (req, res, next) => {
    const groupId = parseInt(req.params.groupId, 10);
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
      // Check if the group exists and user is authorized (organizer or co-host)
      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }

      // Check if the user is the organizer or a co-host of the group
      if (group.organizerId !== userId) {
        const isCoHost = await Membership.findOne({
          where: { groupId, userId, status: "co-host" },
        });

        if (!isCoHost) {
          return res.status(403).json({
            message:
              "You must be the organizer or a co-host to create an event.",
          });
        }
      }

      // Check if the venue exists
      if (venueId) {
        const venue = await Venue.findByPk(venueId);
        if (!venue) {
          return res.status(404).json({ message: "Venue couldn't be found" });
        }
      }

      // Create the event
      const event = await Event.create({
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

      const responseEvent = {
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
      };

      res.status(200).json(responseEvent);
    } catch (err) {
      next(err);
    }
  }
);

// Get all members of a group
router.get("/:groupId/members", async (req, res, next) => {
  const groupId = parseInt(req.params.groupId, 10);

  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    // Determine if the current user (if authenticated) is the organizer or a co-host
    let isPrivilegedUser = false;
    if (req.user) {
      const userId = req.user.id;
      isPrivilegedUser =
        group.organizerId === userId || // Check if user is the organizer
        (await Membership.findOne({
          // Check if user is a co-host
          where: { groupId, userId, status: "co-host" },
        })) != null;
    }

    // Fetch members
    const memberships = await Membership.findAll({
      where: { groupId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    // Filter members for non-privileged users
    const filteredMemberships = memberships
      .map((membership) => ({
        id: membership.user.id,
        firstName: membership.user.firstName,
        lastName: membership.user.lastName,
        Membership: {
          status: membership.status,
        },
      }))
      .filter(
        (membership) =>
          isPrivilegedUser || membership.Membership.status !== "pending"
      );

    res.status(200).json({ Members: filteredMemberships });
  } catch (err) {
    next(err);
  }
});

// Request a Membership for a Group based on the Group's id

router.post("/:groupId/membership", requireAuth, async (req, res, next) => {
  const groupId = parseInt(req.params.groupId, 10);
  const userId = req.user.id;

  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    // Check if user already has a membership (pending or accepted) in the group
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
      } else if (existingMembership.status === "member") {
        return res
          .status(400)
          .json({ message: "User is already a member of the group" });
      }
    }

    // Create new membership with 'pending' status
    const newMembership = await Membership.create({
      groupId,
      userId,
      status: "pending",
    });

    res.status(200).json({
      memberId: newMembership.userId,
      status: newMembership.status,
    });
  } catch (err) {
    next(err);
  }
});

// Change the status of a membership for a group specified by id

router.put("/:groupId/membership", requireAuth, async (req, res, next) => {
  const groupId = parseInt(req.params.groupId, 10);
  const { memberId, status } = req.body;
  const userId = req.user.id;

  try {
    // Check if group exists
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    // Check if user with memberId exists
    const user = await User.findByPk(memberId);
    if (!user) {
      return res.status(404).json({ message: "User couldn't be found" });
    }

    // Check if membership exists
    const membership = await Membership.findOne({
      where: {
        groupId,
        userId: memberId, // memberId is the user whose membership status I'll change
      },
    });

    if (!membership) {
      return res.status(404).json({
        message: "Membership between the user and the group does not exist",
      });
    }

    const currentUserMembership = await Membership.findOne({
      where: {
        groupId,
        userId, // userId is the id of the current user
      },
    });

    if (
      status === "member" &&
      !(
        group.organizerId === userId ||
        (currentUserMembership && currentUserMembership.status === "co-host")
      )
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to change membership status" });
    }

    if (status === "co-host" && group.organizerId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to change membership status" });
    }

    if (status === "pending") {
      return res.status(400).json({
        message: "Bad Request",
        errors: { status: "Cannot change a membership status to pending" },
      });
    }

    membership.status = status;
    await membership.save();

    res.status(200).json({
      id: membership.id,
      groupId: membership.groupId,
      memberId: membership.userId,
      status: membership.status,
    });
  } catch (err) {
    next(err);
  }
});

// Delete membership to a group specified by id

router.delete(
  "/:groupId/membership/:memberId",
  requireAuth,
  async (req, res, next) => {
    const groupId = parseInt(req.params.groupId, 10);
    const memberId = parseInt(req.params.memberId, 10);
    const userId = req.user.id;

    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }

      const user = await User.findByPk(memberId);
      if (!user) {
        return res.status(404).json({ message: "User couldn't be found" });
      }

      const membership = await Membership.findOne({
        where: {
          groupId,
          userId: memberId,
        },
      });

      if (!membership) {
        return res
          .status(404)
          .json({ message: "Membership does not exist for this User" });
      }

      // Check for proper authorization to delete membership
      if (group.organizerId !== userId && memberId !== userId) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete membership" });
      }

      await membership.destroy();

      res.status(200).json({
        message: "Successfully deleted membership from group",
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
