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
    .isISO8601()
    .withMessage("Start date must be in the future"),
  check("endDate").isISO8601().withMessage("End date is less than start date"),
  handleValidationErrors,
];

async function isAuthorizedUser(userId, groupId) {
  const group = await Group.findByPk(groupId);
  if (!group) return false; // Group doesn't exist

  if (group.organizerId === userId) return true; // User is the organizer

  // Check if user is a co-host
  const membership = await Membership.findOne({
    where: {
      groupId: groupId,
      userId: userId,
      status: "co-host",
    },
  });

  return !!membership; // true if membership exists and user is a co-host, false otherwise
}

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

// Route to get details of a group by ID
router.get("/:groupId", async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(groupId)) {
      res.status(400);
      return res.json({ message: "Invalid group ID" });
    }

    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: GroupImage,
          as: "groupImages",
          attributes: ["id", "url", "preview"],
        },
        {
          model: User,
          as: "organizer",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Venue,
          as: "venues",
          attributes: ["id", "address", "city", "state", "lat", "lng"],
        },
      ],
    });

    if (!group) {
      res.status(404);
      return res.json({ message: "Group couldn't be found" });
    }

    res.status(200);
    return res.json(group);
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
      return res
        .status(403)
        .json({
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
      return res
        .status(403)
        .json({
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
      return res
        .status(403)
        .json({
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

    if (!(await isAuthorizedUser(req.user.id, groupId))) {
      return res
        .status(403)
        .json({
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
router.post("/:groupId/venues", requireAuth, async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    if (!(await isAuthorizedUser(req.user.id, groupId))) {
      return res
        .status(403)
        .json({
          message:
            "You must be the organizer or a co-host of the group to add venues.",
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

    res.status(200).json(newVenue);
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
});

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
    const userId = req.user.id; // Assuming you're storing the user's ID on the request object

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
          return res
            .status(403)
            .json({
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

      // Construct the response object
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

module.exports = router;
