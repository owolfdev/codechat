"use client";
import { useEffect } from "react";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const payPalClientID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const PayPalButton = () => {
  const { modifyProfileSubscription } = useSupabaseChat();
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${payPalClientID}&currency=USD`;
    script.addEventListener("load", () => {
      // Initialize the PayPal button here
      window.paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            // Set up the transaction
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "10", // Can dynamically set the amount
                  },
                },
              ],
            });
          },
          onApprove: (data: any, actions: any) => {
            // Capture the funds from the transaction
            return actions.order.capture().then((details: any) => {
              // Show a success message to your buyer
              // alert(
              //   "Transaction completed by " + details.payer.name.given_name
              // );

              // Here you can call your backend API to update the subscription status
              fetch("/api/update-subscription", {
                method: "POST",
                body: JSON.stringify({ payer: details.payer.name.given_name }),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log(
                    "here is the response data from PayPal button (front end)",
                    data
                  );
                  console.log(
                    "here is the user from PayPal button (front end)",
                    user?.id
                  );
                  modifyProfileSubscription(user?.id as string, "paid");
                  router.push("/app");
                })
                .catch((error) => console.error(error));
            });
          },
        })
        .render("#paypal-button-container");
    });
    document.body.appendChild(script);
  }, []);

  return (
    <div id="paypal-button-container">
      {/* PayPal button will be rendered here by the SDK */}
    </div>
  );
};

export default PayPalButton;
