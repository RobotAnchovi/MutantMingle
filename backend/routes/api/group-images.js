const express = require("express");
const { Group, Membership, GroupImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

//^ Delete an Image for a Group

router.delete("/:imageId", requireAuth, async (req, res, next) => {
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

    const group = groupImage.group;
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

    await groupImage.destroy();
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
