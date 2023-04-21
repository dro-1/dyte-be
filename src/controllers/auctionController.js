const Auction = require("../models/auction");
const axios = require("axios");
const { getAuthToken } = require("./../utils/utils");
const { v4 } = require("uuid");
const auction = require("../models/auction");

const createAuction = async (req, res) => {
  const { auctionImageUrl, auctionTitle, auctionDescription, password } =
    req.body;

  if (!auctionImageUrl || !auctionTitle || !auctionDescription || !password)
    return res.status(400).send({
      status: "Failed",
      message: "All necessary details must be provided",
    });

  let resp;
  try {
    resp = await axios.post(
      "https://api.cluster.dyte.in/v2/meetings",
      {
        title: "get me lit",
        preferred_region: "ap-south-1",
      },
      {
        headers: {
          Authorization: `Basic ${getAuthToken()}`,
        },
      }
    );
    console.log(resp.data.data.id);
  } catch (e) {
    console.log(e);
  }

  const auction = new Auction({
    title: auctionTitle,
    description: auctionDescription,
    imageUrl: auctionImageUrl,
    meetingId: resp.data.data.id,
    password,
  });

  try {
    await auction.save();
    return res.status(201).send({
      status: "Successful",
      message: "Auction created successfully",
      meetingId: auction.meetingId,
    });
  } catch (e) {
    console.log(e);
  }
};

const addParticipant = async (req, res) => {
  const { name, meetingId, imageUrl, password } = req.body;

  if (!name || !meetingId)
    return res.status(400).send({
      status: "Failed",
      message: "All necessary details must be provided",
    });

  let preset_name = "webinar_viewer";

  let auction;
  try {
    auction = await Auction.findOne({ meetingId });
  } catch (e) {
    console.log(e);
  }

  if (!auction)
    return res.status(404).send({
      status: "Failed",
      message: "Auction not found",
    });

  if (auction && auction.password === password) {
    preset_name = "webinar_presenter";
  }

  const body = {
    name,
    preset_name,
    custom_participant_id: v4(),
  };

  if (imageUrl) {
    body["picture"] = imageUrl;
  }

  let resp;
  try {
    resp = await axios.post(
      `https://api.cluster.dyte.in/v2/meetings/${meetingId}/participants`,
      body,
      {
        headers: {
          Authorization: `Basic ${getAuthToken()}`,
        },
      }
    );

    return res.status(201).send({
      status: "Successful",
      message: "Participant added successfully",
      participantId: resp.data.data.id,
      token: resp.data.data.token,
      auctionTitle: auction.title,
      auctionDescription: auction.description,
      auctionImageUrl: auction.imageUrl,
    });
  } catch (e) {
    console.log(e.response);
  }
};

module.exports = {
  createAuction,
  addParticipant,
};
