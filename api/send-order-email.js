import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      name,
      email,
      orderNumber,
      product,
      quantity,
    } = req.body;

    if (!name || !email || !orderNumber) {
      return res.status(400).json({
        error: "Missing required order information",
      });
    }

    const { data, error } = await resend.emails.send({
      from: "MBUHSA COCOA <onboarding@resend.dev>",
      to: [email],
      subject: `MBUHSA COCOA — Order ${orderNumber} Received`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2b170c;">
          <h1 style="color: #9a6d2d;">MBUHSA COCOA</h1>

          <h2>Order Received</h2>

          <p>Hello ${name},</p>

          <p>
            Thank you for your cocoa supply request.
            We have received your order successfully.
          </p>

          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Product:</strong> ${product || "Not specified"}</p>
          <p><strong>Quantity:</strong> ${quantity || "Not specified"}</p>

          <p>
            Please keep your order number. You can use it together with
            your email address to track your order status on the MBUHSA COCOA website.
          </p>

          <p>
            Thank you for choosing MBUHSA COCOA.
          </p>

          <p>
            <strong>MBUHSA COCOA</strong><br />
            Premium African Cocoa For Global Markets
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    console.error("Email server error:", error);

    return res.status(500).json({
      error: "Failed to send order confirmation email",
    });
  }
}