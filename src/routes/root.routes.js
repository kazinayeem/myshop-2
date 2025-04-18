import express from "express";
import SSLCommerzPayment from "sslcommerz-lts";
import dotenv from "dotenv";
import Order from "../model/order.model.js";
import { envData } from "../config/envdata.js";
import { sendOrderConfirmationMail } from "../lib/createOrderMail.js";
dotenv.config();

const store_id = envData.storeid;
const store_passwd = envData.storepassword;
const is_live = envData.islive;
const frontendUrl = envData.frontendUrl;

const router = express.Router();
router.get("/transaction-query-by-transaction-id", (req, res) => {
  const data = {
    tran_id: req.query.tran_id,
  };
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.transactionQueryByTransactionId(data).then((data) => {
    res.json(data);
  });
});
router.post("/success", async (req, res) => {
  try {
    const paymentData = req.query;
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const data = {
      tran_id: paymentData.tran_id,
    };

    const paymentinfo = await sslcz.transactionQueryByTransactionId(data);

    if (paymentinfo.no_of_trans_found > 0 && paymentinfo.element.length > 0) {
      await Order.findOneAndUpdate(
        { _id: paymentData.tran_id },
        {
          transactionId: paymentData.tran_id,
          transactionStatus: "success",
          paymentStatus: "paid",
          paymentMethod: paymentinfo.element[0].card_type,
          bankTransactionId: paymentinfo.element[0].bank_tran_id,
          transactionDate: paymentinfo.element[0].tran_date,
          paidAmount: paymentinfo.element[0].amount,
          dueAmount: 0,
        }
      );
      // send confirmation email
      const order = await Order.findById(paymentData.tran_id)
        .populate("userId", "email username")
        .populate("products.productId", "name");

      await sendOrderConfirmationMail({
        email: order.userId.email,
        name: order.userId.username,
        orderId: order._id,
        items: order.products.map((p) => ({
          name: p.productId.name,
          quantity: p.quantity,
          price: p.price,
        })),
        totalAmount: order.totalPrice,
      });

      res.redirect(`${frontendUrl}/success?tran_id=${paymentData.tran_id}`);
    } else {
      res.redirect(`${frontendUrl}/fail?tran_id=${paymentData.tran_id}`);
    }
  } catch (error) {
    console.error("Error in success route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/fail", async (req, res) => {
  try {
    const paymentData = req.query;
    await Order.findOneAndUpdate(
      { _id: paymentData.tran_id },
      {
        transactionId: paymentData.tran_id,
        transactionStatus: "failed",
        paymentStatus: "failed",
        status: "failed",
      }
    );

    res.redirect(`${frontendUrl}/fail`);
  } catch (error) {
    console.error("Error in fail route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/cancel", async (req, res) => {
  try {
    const paymentData = req.query;
    await Order.findOneAndUpdate(
      { _id: paymentData.tran_id },
      {
        transactionId: paymentData.tran_id,
        transactionStatus: "failed",
        paymentStatus: "failed",
        status: "failed",
      }
    );
    res.redirect(`${frontendUrl}/cancel`);
  } catch (error) {
    console.error("Error in cancel route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/ipn", async (req, res) => {
  res.status(200).json({ message: "IPN received successfully" });
});

export default router;
