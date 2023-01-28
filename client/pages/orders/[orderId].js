import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, contextHolder } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expireAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired !!!!</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      {contextHolder}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })} // odeme bılgılerını token olarak donduruyor onuda ıd olarak yolluyoruz
        stripeKey="pk_test_51MVBz1Hrmd8GZpcHJAd6sveBMrqMH2umvXAYHVweisWCSDbfWANzmeeIZH4bSItylNMoGzKlj9jL06y7K9pfTYeB0002Xzi9L6"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
