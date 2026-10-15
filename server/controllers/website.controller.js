import mongoose from "mongoose";
import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import generateResponse from "../config/openRouter.js";
import extractJson from "../utils/extractJson.js";

export const generateWebsite = async (req, res) => {
  const masterPrompt = `
You are a senior frontend developer.

Build a premium, modern, fully responsive website using ONLY HTML, CSS and JavaScript.

User Request:
{USER_PROMPT}

Requirements:
- Single HTML file
- One <style> tag
- One <script> tag
- No React, Bootstrap, Tailwind or external libraries
- Mobile-first responsive design
- Responsive navbar with mobile menu
- Home, About, Services, Contact sections
- Smooth navigation using JavaScript (SPA style)
- Working buttons and forms with validation
- Professional UI (2026 style)
- Use Flexbox/Grid
- No horizontal scrolling
- System fonts only
- Images from https://images.unsplash.com with:
  ?auto=format&fit=crop&w=1200&q=80

Return your response in EXACTLY this format, with no extra text before or after:

###MESSAGE_START###
Website generated successfully.
###MESSAGE_END###
###CODE_START###
FULL HTML HERE — raw, unescaped, exactly as it should appear
###CODE_END###

Do NOT use JSON. Do NOT use markdown code blocks. Do NOT escape quotes.
`;
  try {
    const { prompt } = req.body;

    // Validate Prompt
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    // Find User
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check Credits
    if (user.credits < 50) {
      return res.status(400).json({
        success: false,
        message: "You do not have enough credits to generate a website.",
      });
    }

    // Final AI Prompt
    const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt);

    let rawResponse = "";
    let parsedResponse = null;

    // Retry AI Response
    for (let i = 0; i < 2 && !parsedResponse; i++) {
      rawResponse = await generateResponse(finalPrompt);

      parsedResponse = extractJson(rawResponse);

      if (!parsedResponse) {
        rawResponse = await generateResponse(
          finalPrompt +
            "\n\nIMPORTANT: Return ONLY valid raw JSON. No markdown. No explanations.",
        );

        parsedResponse = extractJson(rawResponse);
      }
    }

    // Validate AI Response
    if (!parsedResponse || !parsedResponse.code || !parsedResponse.message) {
      // Kept server-side only — never send raw model output to the client.
      console.error(
        "AI returned invalid response for generateWebsite:",
        rawResponse,
      );

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid response.",
      });
    }

    // Generate Unique Slug (timestamp + random suffix avoids same-millisecond collisions)
    const randomSuffix = Math.random().toString(36).slice(2, 8);

    const slug =
      prompt
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Date.now() +
      "-" +
      randomSuffix;

    // Save Website
    const website = await Website.create({
      user: user._id,

      title: prompt.length > 60 ? prompt.substring(0, 60) + "..." : prompt,

      slug,

      latestCode: parsedResponse.code,

      conversation: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "ai",
          content: parsedResponse.message,
        },
      ],
    });

    // Deduct Credits
    user.credits -= 50;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Website generated successfully.",
      websiteId: website._id,
      remainingCredits: user.credits,
    });
  } catch (error) {
    // Full error stays in server logs only.
    console.error("generateWebsite error:", error);

    return res.status(500).json({
      success: false,
      message: "Website generation failed.",
    });
  }
};

export const getWebsiteById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid website ID.",
      });
    }

    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found",
      });
    }

    return res.status(200).json({
      success: true,
      website,
    });
  } catch (err) {
    console.error("getWebsiteById error:", err);

    return res.status(500).json({
      success: false,
      message: "Website error",
    });
  }
};

export const changes = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid website ID.",
      });
    }

    const { prompt } = req.body;

    // Validate Prompt
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    // Find User
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Find Website
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    // Check Credits
    if (user.credits < 25) {
      return res.status(400).json({
        success: false,
        message: "You do not have enough credits.",
      });
    }

    // AI Prompt
const updatePrompt = `
You are a senior frontend developer.

Update the following HTML website according to the user's request.

CURRENT HTML:
${website.latestCode}

USER REQUEST:
${prompt}

Rules:
- Return the COMPLETE updated HTML.
- Do not remove existing functionality unless requested.
- Keep the website responsive.

Return your response in EXACTLY this format, with no extra text before or after:

###MESSAGE_START###
<a short one-line summary of what changed>
###MESSAGE_END###
###CODE_START###
<FULL UPDATED HTML HERE — raw, unescaped>
###CODE_END###
`;
    let rawResponse = "";
    let parsedResponse = null;

    // Retry AI
    for (let i = 0; i < 2 && !parsedResponse; i++) {
      rawResponse = await generateResponse(updatePrompt);

      parsedResponse = extractJson(rawResponse);

   if (!parsedResponse) {
  rawResponse = await generateResponse(
    updatePrompt +
      "\n\nIMPORTANT: Follow the exact ###MESSAGE_START###/###CODE_START### format. No JSON. No markdown. No extra text.",
  );
  parsedResponse = extractJson(rawResponse);
}
    }

    if (!parsedResponse || !parsedResponse.code) {
      console.error("AI returned invalid response for changes:", rawResponse);

      return res.status(500).json({
        success: false,
        message: "AI returned invalid response.",
      });
    }

    // Update Website
    website.latestCode = parsedResponse.code;

    website.conversation.push(
      {
        role: "user",
        content: prompt,
      },
      {
        role: "ai",
        content: parsedResponse.message,
      },
    );

    await website.save();

    // Deduct Credits
    user.credits -= 25;
    await user.save();

    return res.status(200).json({
      success: true,
      message: parsedResponse.message,
      remainingCredits: user.credits,
      website,
    });
  } catch (err) {
    console.error("changes error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const websites = await Website.find({ user: req.user._id });
    return res.status(200).json({
      success: true,
      websites,
    });
  } catch (err) {
    console.error("getAll error:", err);

    return res.status(500).json({
      success: false,
      message: "Get website error",
    });
  }
};
