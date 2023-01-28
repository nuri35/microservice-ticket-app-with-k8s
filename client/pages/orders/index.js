// https://ticketing.dev/orders dedıgımzde ındex.js baz alanır unutma burda genel olarak kişiye özel siparişlerı gosterıyoruz bazileri completed olmus bazılerı odeme yapmadan cıkılmıs yanı cancelled olmus

const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrderIndex;
