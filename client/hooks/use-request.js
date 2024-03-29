import axios from "axios";
import { useState } from "react";
import { Button, message, Space } from "antd";

export default ({ url, method, body, onSuccess }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const msgFn = (typeMsg, msg) => {
    messageApi.open({
      type: typeMsg,
      content: msg,
    });
  };

  const doRequest = async (props = {}) => {
    try {
      //  axios[method] burası axios.post gıbı dusunebılrsın
      const response = await axios[method](url, { ...body, ...props }); // orderId.js dekı  token={({ id }) => doRequest({ token: id })}  ıcın
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        msgFn("error", error.response.data.errors[0].message);
      }
    }
  };

  return {
    doRequest,
    contextHolder, // request'ten oluşan errorlar.
  };
};
