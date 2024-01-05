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
