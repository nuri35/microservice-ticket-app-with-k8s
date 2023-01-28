const TicketShow = ({ ticket }) => {
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
    </div>
  );
};

export default TicketShow;
