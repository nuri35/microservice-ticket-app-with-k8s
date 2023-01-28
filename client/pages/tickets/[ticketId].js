import useRequest from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ ticket }) => {
  const { doRequest, contextHolder } = useRequest({
    // bu ıstekde browserda calısacak cunku componenetdeyız
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`), // ödemesı ıcın yonlendırlıyor
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      {contextHolder}
      <h4>Price: {ticket.price}</h4>
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query; // ıd'yi alaabılmek adına query kullandık
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
