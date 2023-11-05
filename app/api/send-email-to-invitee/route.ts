import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const request_body = await req.json();
  console.log(request_body);

  const mailOptions = {
    from: "chatcodeapp@gmail.com", // Replace with your Gmail email
    to: request_body.to,
    subject: request_body.subject,
    html: request_body.html,
  };

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "chatcodeapp@gmail.com", // Replace with your Gmail email
      pass: "hhdt bypb oqfa zseg", // Replace with your Gmail password or an app-specific password
    },
  });

  try {
    // Send the email
    await transporter.sendMail(mailOptions);

    const responseData = { message: "Email sent successfully" };
    return new Response(JSON.stringify(responseData), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    const responseData = { message: "Failed to send email" };
    return new Response(JSON.stringify(responseData), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }

  // const responseData = { message: `Hello, Next.js!` };
  // return new Response(JSON.stringify(responseData), {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
}
