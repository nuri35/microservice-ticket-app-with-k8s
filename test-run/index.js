process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const axios = require("axios");

const loginUser = async () => {
  const response = await axios.post(`https://ticketing.dev/api/users/signin`, {
    email: "nuriexxa487as@gmail.com",
    password: "erredffders",
  });

  const val = response.headers["set-cookie"].pop().split(";")[0];

  (async () => {
    for (let i = 0; i < 600; i++) {
      doRequest(val);
    }
  })();
};

loginUser();

const doRequest = async (cookie) => {
  const { data } = await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: "ticket", price: 5 },
    {
      headers: { cookie },
    }
  );

  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: "ticket", price: 10 },
    {
      headers: { cookie },
    }
  );

  axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: "ticket", price: 15 },
    {
      headers: { cookie },
    }
  );
};
